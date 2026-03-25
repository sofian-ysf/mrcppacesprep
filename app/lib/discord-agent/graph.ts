import { ChatAnthropic } from '@langchain/anthropic';
import { StateGraph, Annotation, END } from '@langchain/langgraph';
import { BaseMessage, HumanMessage, AIMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { StructuredToolInterface } from '@langchain/core/tools';
import { allTools } from './tools';
import { getSystemPrompt } from './prompts/system';

/**
 * Define the state schema for the agent
 */
const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (curr, update) => [...curr, ...update],
    default: () => [],
  }),
  discordUserId: Annotation<string>(),
  threadId: Annotation<string>(),
});

type AgentStateType = typeof AgentState.State;

/**
 * Create the Claude Sonnet model
 */
function createModel() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY environment variable');
  }

  return new ChatAnthropic({
    apiKey,
    model: 'claude-sonnet-4-20250514',
    temperature: 0.7,
    maxTokens: 4096,
  });
}

/**
 * Create the agent graph
 */
export function createAgentGraph() {
  const model = createModel();
  const modelWithTools = model.bindTools(allTools);

  // Create the tool node
  const toolNode = new ToolNode(allTools);

  // Define the agent node that calls the model
  async function agentNode(state: AgentStateType) {
    const systemMessage = new SystemMessage(getSystemPrompt());
    const messagesWithSystem = [systemMessage, ...state.messages];

    const response = await modelWithTools.invoke(messagesWithSystem);

    return {
      messages: [response],
    };
  }

  // Define the routing function
  function shouldContinue(state: AgentStateType): 'tools' | typeof END {
    const lastMessage = state.messages[state.messages.length - 1];

    // If the last message has tool calls, route to tools
    if (
      lastMessage instanceof AIMessage &&
      lastMessage.tool_calls &&
      lastMessage.tool_calls.length > 0
    ) {
      return 'tools';
    }

    // Otherwise, end the graph
    return END;
  }

  // Build the graph
  const graph = new StateGraph(AgentState)
    .addNode('agent', agentNode)
    .addNode('tools', toolNode)
    .addEdge('__start__', 'agent')
    .addConditionalEdges('agent', shouldContinue, {
      tools: 'tools',
      [END]: END,
    })
    .addEdge('tools', 'agent');

  return graph.compile();
}

/**
 * Run the agent with a message
 */
export async function runAgent(
  userMessage: string,
  discordUserId: string,
  threadId: string,
  previousMessages: BaseMessage[] = []
): Promise<string> {
  const graph = createAgentGraph();

  // Add the new user message
  const messages = [...previousMessages, new HumanMessage(userMessage)];

  // Run the graph
  const result = await graph.invoke({
    messages,
    discordUserId,
    threadId,
  });

  // Get the last AI message
  const lastMessage = result.messages[result.messages.length - 1];

  if (lastMessage instanceof AIMessage) {
    return typeof lastMessage.content === 'string'
      ? lastMessage.content
      : JSON.stringify(lastMessage.content);
  }

  return 'I encountered an issue processing your request.';
}

/**
 * Simple single-turn agent call (no memory)
 * Used for slash commands that don't need conversation context
 */
export async function runAgentSingleTurn(userMessage: string): Promise<string> {
  const model = createModel();
  const modelWithTools = model.bindTools(allTools);

  const systemMessage = new SystemMessage(getSystemPrompt());
  const humanMessage = new HumanMessage(userMessage);

  // First call
  let response = await modelWithTools.invoke([systemMessage, humanMessage]);
  const messages: BaseMessage[] = [systemMessage, humanMessage, response];

  // Handle tool calls in a loop
  while (
    response instanceof AIMessage &&
    response.tool_calls &&
    response.tool_calls.length > 0
  ) {
    // Execute tools
    const toolResults = await Promise.all(
      response.tool_calls.map(async (toolCall) => {
        const tool = allTools.find((t) => t.name === toolCall.name) as StructuredToolInterface | undefined;
        if (!tool) {
          return new ToolMessage({
            tool_call_id: toolCall.id || '',
            content: `Tool ${toolCall.name} not found`,
          });
        }

        try {
          const result = await tool.invoke(toolCall.args as Record<string, unknown>);
          return new ToolMessage({
            tool_call_id: toolCall.id || '',
            content: typeof result === 'string' ? result : JSON.stringify(result),
          });
        } catch (error) {
          return new ToolMessage({
            tool_call_id: toolCall.id || '',
            content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        }
      })
    );

    // Add tool results as messages
    for (const result of toolResults) {
      messages.push(result);
    }

    // Call the model again with tool results
    response = await modelWithTools.invoke(messages);
    messages.push(response);
  }

  // Return the final response
  if (response instanceof AIMessage) {
    return typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);
  }

  return 'I encountered an issue processing your request.';
}
