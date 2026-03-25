-- Discord Bot Schema Migration
-- Tables for conversation memory, message history, tool logs, and user authorization

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Discord Threads (Conversation Memory)
-- ============================================
-- Stores conversation context with 24-hour TTL
CREATE TABLE IF NOT EXISTS discord_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discord_user_id TEXT NOT NULL,
    discord_channel_id TEXT,
    is_dm BOOLEAN NOT NULL DEFAULT true,
    context JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient lookups
CREATE INDEX idx_discord_threads_user_id ON discord_threads(discord_user_id);
CREATE INDEX idx_discord_threads_channel_id ON discord_threads(discord_channel_id);
CREATE INDEX idx_discord_threads_expires_at ON discord_threads(expires_at);

-- ============================================
-- 2. Discord Messages (Message History)
-- ============================================
-- Stores message history for each thread
CREATE TABLE IF NOT EXISTS discord_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID NOT NULL REFERENCES discord_threads(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
    content TEXT NOT NULL,
    tool_calls JSONB,
    tool_call_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient lookups
CREATE INDEX idx_discord_messages_thread_id ON discord_messages(thread_id);
CREATE INDEX idx_discord_messages_created_at ON discord_messages(created_at);

-- ============================================
-- 3. Discord Tool Logs (Audit Trail)
-- ============================================
-- Logs all tool executions for auditing
CREATE TABLE IF NOT EXISTS discord_tool_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES discord_threads(id) ON DELETE SET NULL,
    discord_user_id TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    tool_input JSONB NOT NULL DEFAULT '{}',
    tool_output JSONB,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'error')),
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient lookups and analytics
CREATE INDEX idx_discord_tool_logs_thread_id ON discord_tool_logs(thread_id);
CREATE INDEX idx_discord_tool_logs_user_id ON discord_tool_logs(discord_user_id);
CREATE INDEX idx_discord_tool_logs_tool_name ON discord_tool_logs(tool_name);
CREATE INDEX idx_discord_tool_logs_status ON discord_tool_logs(status);
CREATE INDEX idx_discord_tool_logs_created_at ON discord_tool_logs(created_at);

-- ============================================
-- 4. Discord Users (Authorization)
-- ============================================
-- Stores authorized Discord users who can use the bot
CREATE TABLE IF NOT EXISTS discord_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discord_user_id TEXT NOT NULL UNIQUE,
    discord_username TEXT,
    is_authorized BOOLEAN NOT NULL DEFAULT false,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}',
    last_active_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient lookups
CREATE INDEX idx_discord_users_discord_user_id ON discord_users(discord_user_id);
CREATE INDEX idx_discord_users_is_authorized ON discord_users(is_authorized);

-- ============================================
-- Enable Row Level Security
-- ============================================
ALTER TABLE discord_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_tool_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies (Service Role Access Only)
-- ============================================
-- These tables are accessed only by the service role (bot backend)
-- Users don't directly access these tables

CREATE POLICY "Service role has full access to discord_threads"
    ON discord_threads FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role has full access to discord_messages"
    ON discord_messages FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role has full access to discord_tool_logs"
    ON discord_tool_logs FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role has full access to discord_users"
    ON discord_users FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Helper Functions
-- ============================================

-- Function to update timestamp on row update
CREATE OR REPLACE FUNCTION update_discord_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER discord_threads_updated_at
    BEFORE UPDATE ON discord_threads
    FOR EACH ROW EXECUTE FUNCTION update_discord_updated_at();

CREATE TRIGGER discord_users_updated_at
    BEFORE UPDATE ON discord_users
    FOR EACH ROW EXECUTE FUNCTION update_discord_updated_at();

-- Function to get or create a thread for a Discord user
CREATE OR REPLACE FUNCTION get_or_create_discord_thread(
    p_discord_user_id TEXT,
    p_discord_channel_id TEXT DEFAULT NULL,
    p_is_dm BOOLEAN DEFAULT true
)
RETURNS UUID AS $$
DECLARE
    v_thread_id UUID;
BEGIN
    -- First, try to find an existing non-expired thread
    SELECT id INTO v_thread_id
    FROM discord_threads
    WHERE discord_user_id = p_discord_user_id
      AND (p_is_dm = true OR discord_channel_id = p_discord_channel_id)
      AND expires_at > NOW()
    ORDER BY updated_at DESC
    LIMIT 1;

    -- If found, extend expiry and return
    IF v_thread_id IS NOT NULL THEN
        UPDATE discord_threads
        SET expires_at = NOW() + INTERVAL '24 hours',
            updated_at = NOW()
        WHERE id = v_thread_id;
        RETURN v_thread_id;
    END IF;

    -- If not found, create a new thread
    INSERT INTO discord_threads (discord_user_id, discord_channel_id, is_dm)
    VALUES (p_discord_user_id, p_discord_channel_id, p_is_dm)
    RETURNING id INTO v_thread_id;

    RETURN v_thread_id;
END;
$$ LANGUAGE plpgsql;

-- Function to add a message to a thread
CREATE OR REPLACE FUNCTION add_discord_message(
    p_thread_id UUID,
    p_role TEXT,
    p_content TEXT,
    p_tool_calls JSONB DEFAULT NULL,
    p_tool_call_id TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_message_id UUID;
BEGIN
    INSERT INTO discord_messages (thread_id, role, content, tool_calls, tool_call_id, metadata)
    VALUES (p_thread_id, p_role, p_content, p_tool_calls, p_tool_call_id, p_metadata)
    RETURNING id INTO v_message_id;

    -- Update thread expiry
    UPDATE discord_threads
    SET expires_at = NOW() + INTERVAL '24 hours',
        updated_at = NOW()
    WHERE id = p_thread_id;

    RETURN v_message_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get thread messages (limited for context window)
CREATE OR REPLACE FUNCTION get_discord_thread_messages(
    p_thread_id UUID,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    role TEXT,
    content TEXT,
    tool_calls JSONB,
    tool_call_id TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.id,
        m.role,
        m.content,
        m.tool_calls,
        m.tool_call_id,
        m.created_at
    FROM discord_messages m
    WHERE m.thread_id = p_thread_id
    ORDER BY m.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to log tool execution
CREATE OR REPLACE FUNCTION log_discord_tool_execution(
    p_thread_id UUID,
    p_discord_user_id TEXT,
    p_tool_name TEXT,
    p_tool_input JSONB,
    p_tool_output JSONB DEFAULT NULL,
    p_status TEXT DEFAULT 'pending',
    p_error_message TEXT DEFAULT NULL,
    p_execution_time_ms INTEGER DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO discord_tool_logs (
        thread_id, discord_user_id, tool_name, tool_input,
        tool_output, status, error_message, execution_time_ms
    )
    VALUES (
        p_thread_id, p_discord_user_id, p_tool_name, p_tool_input,
        p_tool_output, p_status, p_error_message, p_execution_time_ms
    )
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a Discord user is authorized
CREATE OR REPLACE FUNCTION is_discord_user_authorized(p_discord_user_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_authorized BOOLEAN;
BEGIN
    SELECT is_authorized INTO v_authorized
    FROM discord_users
    WHERE discord_user_id = p_discord_user_id;

    RETURN COALESCE(v_authorized, false);
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired threads (run via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_discord_threads()
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM discord_threads
    WHERE expires_at < NOW();

    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Grant Permissions
-- ============================================
GRANT ALL ON discord_threads TO service_role;
GRANT ALL ON discord_messages TO service_role;
GRANT ALL ON discord_tool_logs TO service_role;
GRANT ALL ON discord_users TO service_role;

GRANT EXECUTE ON FUNCTION get_or_create_discord_thread TO service_role;
GRANT EXECUTE ON FUNCTION add_discord_message TO service_role;
GRANT EXECUTE ON FUNCTION get_discord_thread_messages TO service_role;
GRANT EXECUTE ON FUNCTION log_discord_tool_execution TO service_role;
GRANT EXECUTE ON FUNCTION is_discord_user_authorized TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_expired_discord_threads TO service_role;
