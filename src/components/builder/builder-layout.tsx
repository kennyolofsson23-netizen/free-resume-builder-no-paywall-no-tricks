'use client'

import * as React from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { BuilderToolbar } from '@/components/builder/builder-toolbar'
import { FormPanel } from '@/components/builder/form-panel'
import { PreviewPanel } from '@/components/builder/preview-panel'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export function BuilderLayout() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top toolbar */}
      <BuilderToolbar />

      {isDesktop ? (
        /* Desktop: split-pane layout */
        <div className="flex flex-1 overflow-hidden">
          {/* Left: form panel */}
          <div className="w-full max-w-[480px] shrink-0 border-r border-border overflow-hidden">
            <FormPanel />
          </div>

          {/* Right: preview panel */}
          <div className="flex-1 overflow-hidden">
            <PreviewPanel />
          </div>
        </div>
      ) : (
        /* Mobile: tabbed layout */
        <div className="flex flex-1 flex-col overflow-hidden">
          <Tabs defaultValue="edit" className="flex flex-1 flex-col overflow-hidden">
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
                >
                  Preview
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="edit" className="m-0 flex-1 overflow-hidden">
              <FormPanel />
            </TabsContent>
            <TabsContent value="preview" className="m-0 flex-1 overflow-hidden">
              <PreviewPanel />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
