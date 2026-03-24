'use client'

import * as React from 'react'
import { useIsMobile, useIsTablet } from '@/hooks/use-media-query'
import { useAutoSave } from '@/hooks/use-auto-save'
import { BuilderToolbar } from '@/components/builder/builder-toolbar'
import { FormPanel } from '@/components/builder/form-panel'
import { PreviewPanel } from '@/components/builder/preview-panel'
import { MobilePreviewSheet } from '@/components/builder/mobile-preview-sheet'

export function BuilderLayout() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const useStackedLayout = isMobile || isTablet
  const { lastSaved } = useAutoSave(1000)
  const [mobilePreviewOpen, setMobilePreviewOpen] = React.useState(false)

  return (
    <div id="main-content" className="flex h-screen flex-col overflow-hidden">
      {/* Top toolbar */}
      <BuilderToolbar />

      {/* Auto-save status bar */}
      {lastSaved && (
        <div className="shrink-0 bg-green-50 dark:bg-green-950 px-4 py-0.5 text-xs text-green-700 dark:text-green-300 text-right">
          Saved at {lastSaved.toLocaleTimeString()} — stays in your browser,
          never sent anywhere
        </div>
      )}

      {!useStackedLayout ? (
        /* Desktop (≥1024px via useIsMobile cutoff): split-pane layout */
        <div className="flex flex-1 overflow-hidden">
          {/* Left: form panel */}
          <div
            data-form-panel=""
            className="w-full max-w-[480px] shrink-0 border-r border-border overflow-hidden flex flex-col"
          >
            <div className="flex-1 overflow-hidden">
              <FormPanel />
            </div>
          </div>

          {/* Right: preview panel */}
          <div className="flex-1 overflow-hidden">
            <PreviewPanel />
          </div>
        </div>
      ) : (
        /* Mobile/Tablet (<1024px): simple layout with MobilePreviewSheet */
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="border-b border-border flex h-10">
              <button
                type="button"
                className="flex-1 flex items-center justify-center text-sm font-medium border-b-2 border-primary"
              >
                Edit
              </button>
              <button
                type="button"
                aria-label="Preview"
                className="flex-1 flex items-center justify-center text-sm font-medium border-l border-border"
                onClick={() => setMobilePreviewOpen(true)}
              >
                Preview
              </button>
            </div>
            <div data-form-panel="" className="flex-1 overflow-hidden">
              <FormPanel />
            </div>
          </div>

          <MobilePreviewSheet
            isOpen={mobilePreviewOpen}
            onClose={() => setMobilePreviewOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
