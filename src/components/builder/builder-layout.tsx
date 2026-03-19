'use client'

import * as React from 'react'
import { useIsMobile } from '@/hooks/use-media-query'
import { useAutoSave } from '@/hooks/use-auto-save'
import { BuilderToolbar } from '@/components/builder/builder-toolbar'
import { FormPanel } from '@/components/builder/form-panel'
import { PreviewPanel } from '@/components/builder/preview-panel'
import { MobilePreviewSheet } from '@/components/builder/mobile-preview-sheet'
import { AffiliateBanner } from '@/components/shared/affiliate-banner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export function BuilderLayout() {
  const isMobile = useIsMobile()
  const { lastSaved } = useAutoSave(1000)
  const [mobilePreviewOpen, setMobilePreviewOpen] = React.useState(false)

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top toolbar */}
      <BuilderToolbar />

      {/* Auto-save status bar */}
      {lastSaved && (
        <div className="shrink-0 bg-green-50 dark:bg-green-950 px-4 py-0.5 text-xs text-green-700 dark:text-green-300 text-right">
          Saved locally at {lastSaved.toLocaleTimeString()} — your data never
          leaves your browser
        </div>
      )}

      {!isMobile ? (
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
            {/* Affiliate banner in sidebar below form */}
            <div className="shrink-0 p-3 border-t border-border">
              <AffiliateBanner />
            </div>
          </div>

          {/* Right: preview panel */}
          <div className="flex-1 overflow-hidden">
            <PreviewPanel />
          </div>
        </div>
      ) : (
        /* Mobile (<768px): tabbed layout with MobilePreviewSheet */
        <div className="flex flex-1 flex-col overflow-hidden">
          <Tabs
            defaultValue="edit"
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="border-b border-border">
              <TabsList className="w-full rounded-none bg-transparent h-10 gap-0 p-0">
                <TabsTrigger
                  value="edit"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Edit
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  onClick={() => setMobilePreviewOpen(true)}
                >
                  Preview
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              data-form-panel=""
              value="edit"
              className="m-0 flex-1 overflow-hidden"
            >
              <FormPanel />
            </TabsContent>
            <TabsContent value="preview" className="m-0 flex-1 overflow-hidden">
              {/* Fallback inline preview if sheet is closed */}
              <PreviewPanel />
            </TabsContent>
          </Tabs>

          <MobilePreviewSheet
            isOpen={mobilePreviewOpen}
            onClose={() => setMobilePreviewOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
