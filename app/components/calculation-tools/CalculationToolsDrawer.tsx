'use client'

import { useState, useEffect, useCallback } from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import { Rnd } from 'react-rnd'
import Calculator from './Calculator'
import Scratchpad from './Scratchpad'
import ConversionTables from './ConversionTables'
import FormulaReference from './FormulaReference'

type ToolTab = 'calculator' | 'notes' | 'tables' | 'formulas'

interface CalculationToolsDrawerProps {
  isVisible?: boolean
}

const tabs: { key: ToolTab; label: string; icon: React.ReactNode }[] = [
  {
    key: 'calculator',
    label: 'Calc',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    key: 'notes',
    label: 'Notes',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  {
    key: 'tables',
    label: 'Tables',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    key: 'formulas',
    label: 'Formulas',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  }
]

function ToolContent({ tab }: { tab: ToolTab }) {
  switch (tab) {
    case 'calculator':
      return <Calculator />
    case 'notes':
      return <Scratchpad />
    case 'tables':
      return <ConversionTables />
    case 'formulas':
      return <FormulaReference />
  }
}

// Floating window component for expanded tools
interface FloatingWindowProps {
  tab: ToolTab
  onClose: () => void
  initialPosition: { x: number; y: number }
}

function FloatingWindow({ tab, onClose, initialPosition }: FloatingWindowProps) {
  const [size, setSize] = useState({ width: 400, height: 500 })
  const [position, setPosition] = useState(initialPosition)

  const tabInfo = tabs.find(t => t.key === tab)

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Rnd
        size={size}
        position={position}
        onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
        onResizeStop={(e, direction, ref, delta, pos) => {
          setSize({
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height)
          })
          setPosition(pos)
        }}
        minWidth={300}
        minHeight={250}
        maxWidth={800}
        maxHeight={700}
        bounds="window"
        dragHandleClassName="drag-handle"
        className="pointer-events-auto"
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true
        }}
      >
        <div className="flex flex-col h-full bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header - Drag Handle */}
          <div className="drag-handle flex items-center justify-between px-3 py-2 bg-gray-100 border-b border-gray-200 cursor-move select-none">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{tabInfo?.icon}</span>
              <span className="font-medium text-sm text-gray-900">{tabInfo?.label}</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Drag indicator */}
              <div className="flex gap-0.5 mr-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <ToolContent tab={tab} />
          </div>

          {/* Resize indicator */}
          <div className="absolute bottom-1 right-1 text-gray-300 pointer-events-none">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22Z" />
            </svg>
          </div>
        </div>
      </Rnd>
    </div>
  )
}

export default function CalculationToolsDrawer({ isVisible = true }: CalculationToolsDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<ToolTab>('calculator')
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false)
  const [floatingWindows, setFloatingWindows] = useState<ToolTab[]>([])

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Persist drawer state
  useEffect(() => {
    const saved = sessionStorage.getItem('calc_tools_state')
    if (saved) {
      try {
        const state = JSON.parse(saved)
        setIsExpanded(state.isExpanded ?? false)
        setActiveTab(state.activeTab ?? 'calculator')
      } catch {
        // Ignore
      }
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('calc_tools_state', JSON.stringify({
      isExpanded,
      activeTab
    }))
  }, [isExpanded, activeTab])

  const openFloatingWindow = useCallback((tab: ToolTab) => {
    if (!floatingWindows.includes(tab)) {
      setFloatingWindows(prev => [...prev, tab])
    }
  }, [floatingWindows])

  const closeFloatingWindow = useCallback((tab: ToolTab) => {
    setFloatingWindows(prev => prev.filter(t => t !== tab))
  }, [])

  const getInitialPosition = useCallback((index: number) => {
    // Stagger positions for multiple windows
    const baseX = 100 + (index * 30)
    const baseY = 100 + (index * 30)
    return { x: baseX, y: baseY }
  }, [])

  if (!isVisible) return null

  const handleTabClick = (tab: ToolTab) => {
    if (isMobile) {
      setActiveTab(tab)
      setIsMobileModalOpen(true)
    } else {
      if (activeTab === tab && isExpanded) {
        setIsExpanded(false)
      } else {
        setActiveTab(tab)
        setIsExpanded(true)
      }
    }
  }

  // Mobile/Tablet: Full-screen modal using Radix Dialog
  if (isMobile) {
    return (
      <>
        {/* Toggle bar in sidebar */}
        <div className="pt-4 mt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-2">Tools</p>
          <div className="grid grid-cols-2 gap-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Full-screen modal */}
        <Dialog.Root open={isMobileModalOpen} onOpenChange={setIsMobileModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed inset-0 z-50 bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <Dialog.Title className="flex items-center gap-2 font-medium text-gray-900">
                  {tabs.find(t => t.key === activeTab)?.icon}
                  <span>{tabs.find(t => t.key === activeTab)?.label}</span>
                </Dialog.Title>
                <Dialog.Close className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Dialog.Close>
              </div>

              {/* Tab Switcher using Radix Tabs */}
              <Tabs.Root value={activeTab} onValueChange={(v) => setActiveTab(v as ToolTab)}>
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
                  <Tabs.List className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    {tabs.map(tab => (
                      <Tabs.Trigger
                        key={tab.key}
                        value={tab.key}
                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-colors data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </Tabs.Trigger>
                    ))}
                  </Tabs.List>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
                  {tabs.map(tab => (
                    <Tabs.Content key={tab.key} value={tab.key} className="outline-none">
                      <ToolContent tab={tab.key} />
                    </Tabs.Content>
                  ))}
                </div>
              </Tabs.Root>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    )
  }

  // Desktop: Collapsible drawer in sidebar using Radix Collapsible
  return (
    <>
      {/* Floating windows */}
      {floatingWindows.map((tab, index) => (
        <FloatingWindow
          key={tab}
          tab={tab}
          onClose={() => closeFloatingWindow(tab)}
          initialPosition={getInitialPosition(index)}
        />
      ))}

      <Collapsible.Root open={isExpanded} onOpenChange={setIsExpanded} className="pt-4 mt-4 border-t border-gray-200">
        {/* Header with toggle */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-900">Tools</p>
          <Collapsible.Trigger asChild>
            <button
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </Collapsible.Trigger>
        </div>

        {/* Tab buttons - always visible */}
        <div className="grid grid-cols-2 gap-1">
          {tabs.map(tab => (
            <div key={tab.key} className="relative group">
              <button
                onClick={() => handleTabClick(tab.key)}
                className={`w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === tab.key && isExpanded
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
              {/* Expand to floating window button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  openFloatingWindow(tab.key)
                }}
                className={`absolute -top-1 -right-1 p-0.5 rounded bg-white border border-gray-300 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 ${
                  floatingWindows.includes(tab.key) ? 'hidden' : ''
                }`}
                title={`Open ${tab.label} in floating window`}
              >
                <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Expanded Content Panel */}
        <Collapsible.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg max-h-[400px] overflow-y-auto relative">
            {/* Pop-out button in expanded view */}
            <button
              onClick={() => openFloatingWindow(activeTab)}
              className={`absolute top-2 right-2 p-1.5 rounded bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors ${
                floatingWindows.includes(activeTab) ? 'hidden' : ''
              }`}
              title="Open in floating window"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <ToolContent tab={activeTab} />
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  )
}
