'use client'
import { useState } from 'react'
import { useResumeStore } from '@/store/resume-store'
import { useResumeList } from '@/hooks/use-resume-list'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { TEMPLATE_LIST } from '@/lib/constants'

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function getTemplateName(templateId: string): string {
  return TEMPLATE_LIST.find((t) => t.id === templateId)?.name ?? templateId
}

export function ResumeListPanel() {
  const currentResume = useResumeStore((state) => state.resume)
  const { resumeList, switchToResume, deleteResume, createAndSwitch } =
    useResumeList()

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [showNewConfirm, setShowNewConfirm] = useState(false)

  const hasCurrentName = Boolean(currentResume?.personalInfo.fullName)

  function handleNewResume() {
    if (hasCurrentName) {
      setShowNewConfirm(true)
    } else {
      createAndSwitch()
    }
  }

  function confirmNew() {
    setShowNewConfirm(false)
    createAndSwitch()
  }

  function handleDeleteClick(id: string) {
    setDeleteTargetId(id)
  }

  function confirmDelete() {
    if (deleteTargetId) {
      deleteResume(deleteTargetId)
    }
    setDeleteTargetId(null)
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">My Resumes</h2>
        <Button size="sm" onClick={handleNewResume}>
          New Resume
        </Button>
      </div>

      {/* Resume list */}
      {resumeList.length === 0 ? (
        <p className="text-xs text-muted-foreground">No other resumes saved yet. Each resume you create is stored locally in your browser — nothing leaves your device.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {resumeList.map((item) => {
            const isActive = currentResume?.id === item.id
            return (
              <li
                key={item.id}
                className={[
                  'border rounded-lg p-3 bg-card hover:bg-accent/50 transition-colors',
                  isActive
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-card-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getTemplateName(item.template)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.updatedAt)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {!isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => switchToResume(item.id)}
                      >
                        Switch
                      </Button>
                    )}
                    {isActive && (
                      <span className="text-xs font-medium text-primary px-2 py-1">
                        Active
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this resume?</DialogTitle>
            <DialogDescription>
              This permanently removes the resume from your browser. There&apos;s no undo — export it as JSON first if you want a backup.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New resume confirmation dialog */}
      <Dialog
        open={showNewConfirm}
        onOpenChange={(open) => {
          if (!open) setShowNewConfirm(false)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a new resume?</DialogTitle>
            <DialogDescription>
              Your current resume stays saved in the list below — you can switch back to it anytime. A fresh blank resume will open.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={confirmNew}>Create New</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
