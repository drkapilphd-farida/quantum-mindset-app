'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { addLearnerToSession, copyLastCycle, createSession, markAllRegisteredPresent, publishDrafts, setPresent, setRecording, updateSession } from '../actions'
import { CLASS_NUMBERS, CLASS_TOPICS_EN, DEFAULT_END_IST, DEFAULT_START_IST, type ClassNumber } from '../../liveClasses'

// The trainer's live-class controls (admin, English). Every change goes
// through a server action that re-checks the admin email, then the page reloads.

type ActionResult = { ok: true; message?: string } | { ok: false; error: string }

const NOTE_KEY = 'admin-live-classes-note'

/**
 * Runs an admin save, then reloads the page so every number on it is fresh.
 * (A soft router refresh was sometimes cancelled and left the page stale.)
 * A success message is carried across the reload for the control that saved.
 */
function useAction(scope: string): { run: (fn: () => Promise<ActionResult>) => void; pending: boolean; note: string | null; isError: boolean } {
  const [pending, setPending] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(window.sessionStorage.getItem(NOTE_KEY) ?? 'null') as { scope: string; note: string } | null
      if (saved?.scope === scope) {
        window.sessionStorage.removeItem(NOTE_KEY)
        setNote(saved.note)
      }
    } catch {
      // Storage unavailable: the message is simply not shown.
    }
  }, [scope])

  return {
    pending,
    note,
    isError,
    run: (fn) => {
      setPending(true)
      setNote(null)
      void fn()
        .then((res) => {
          if (!res.ok) {
            setIsError(true)
            setNote(res.error)
            setPending(false)
            return
          }
          try {
            if (res.message) window.sessionStorage.setItem(NOTE_KEY, JSON.stringify({ scope, note: res.message }))
          } catch {
            // Storage unavailable: reload without the message.
          }
          window.location.reload()
        })
        .catch(() => {
          setIsError(true)
          setNote('Something went wrong. Please reload the page and try again.')
          setPending(false)
        })
    },
  }
}

const field = 'min-h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground'

function Note({ note, isError }: { note: string | null; isError: boolean }): React.JSX.Element | null {
  if (note === null) return null
  return (
    <p className={`text-sm ${isError ? 'text-destructive' : 'text-emerald-700'}`} role={isError ? 'alert' : 'status'}>
      {note}
    </p>
  )
}

type SessionFields = { classNumber: number; topicOverride: string; date: string; start: string; end: string; status: 'draft' | 'published' | 'cancelled' }

function SessionFieldsForm({ initial, idPrefix, allowCancel, submitLabel, onSubmit, pending }: { initial: SessionFields; idPrefix: string; allowCancel: boolean; submitLabel: string; onSubmit: (v: SessionFields) => void; pending: boolean }): React.JSX.Element {
  const [v, setV] = useState(initial)
  return (
    <form
      className="grid gap-3 sm:grid-cols-6"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(v)
      }}
    >
      <label className="flex flex-col gap-1 text-xs font-medium sm:col-span-2" htmlFor={`${idPrefix}-class`}>
        Class
        <select id={`${idPrefix}-class`} className={field} value={v.classNumber} onChange={(e) => setV({ ...v, classNumber: Number(e.target.value) })}>
          {CLASS_NUMBERS.map((n) => (
            <option key={n} value={n}>
              Class {n} – {CLASS_TOPICS_EN[n]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium sm:col-span-2" htmlFor={`${idPrefix}-topic`}>
        Topic (optional — leave empty for the standard name)
        <input id={`${idPrefix}-topic`} className={field} value={v.topicOverride} maxLength={120} onChange={(e) => setV({ ...v, topicOverride: e.target.value })} />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium sm:col-span-2" htmlFor={`${idPrefix}-date`}>
        Date
        <input id={`${idPrefix}-date`} type="date" required className={field} value={v.date} onChange={(e) => setV({ ...v, date: e.target.value })} />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium" htmlFor={`${idPrefix}-start`}>
        Start (IST)
        <input id={`${idPrefix}-start`} type="time" required className={field} value={v.start} onChange={(e) => setV({ ...v, start: e.target.value })} />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium" htmlFor={`${idPrefix}-end`}>
        End (IST)
        <input id={`${idPrefix}-end`} type="time" required className={field} value={v.end} onChange={(e) => setV({ ...v, end: e.target.value })} />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium sm:col-span-2" htmlFor={`${idPrefix}-status`}>
        Status
        <select id={`${idPrefix}-status`} className={field} value={v.status} onChange={(e) => setV({ ...v, status: e.target.value as SessionFields['status'] })}>
          <option value="published">Published (learners can register)</option>
          <option value="draft">Draft (hidden from learners)</option>
          {allowCancel && <option value="cancelled">Cancelled</option>}
        </select>
      </label>
      <div className="flex items-end sm:col-span-2">
        <Button type="submit" disabled={pending} className="w-full">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export function NewSessionForm(): React.JSX.Element {
  const { run, pending, note, isError } = useAction('new-session')
  return (
    <div className="flex flex-col gap-2">
      <SessionFieldsForm
        idPrefix="new"
        allowCancel={false}
        submitLabel="Add session"
        pending={pending}
        initial={{ classNumber: 1, topicOverride: '', date: '', start: DEFAULT_START_IST, end: DEFAULT_END_IST, status: 'published' }}
        onSubmit={(v) => run(() => createSession({ classNumber: v.classNumber, topicOverride: v.topicOverride, date: v.date, start: v.start, end: v.end, status: v.status === 'cancelled' ? 'published' : v.status }))}
      />
      <Note note={note} isError={isError} />
    </div>
  )
}

export function EditSession({ id, initial }: { id: string; initial: SessionFields }): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const { run, pending, note, isError } = useAction(`edit-${id}`)
  if (!open)
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Edit
      </Button>
    )
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border p-3">
      <SessionFieldsForm idPrefix={`edit-${id}`} allowCancel submitLabel="Save" pending={pending} initial={initial} onSubmit={(v) => run(() => updateSession({ id, ...v }))} />
      <Note note={note} isError={isError} />
      <Button variant="ghost" size="sm" className="self-start" onClick={() => setOpen(false)}>
        Close
      </Button>
    </div>
  )
}

export function CycleButtons({ drafts }: { drafts: number }): React.JSX.Element {
  const { run, pending, note, isError } = useAction('cycle')
  const [confirmPublish, setConfirmPublish] = useState(false)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={pending} onClick={() => run(copyLastCycle)}>
          Copy last cycle (as drafts, +4 weeks)
        </Button>
        {drafts > 0 &&
          (confirmPublish ? (
            <>
              <Button disabled={pending} onClick={() => run(publishDrafts)}>
                Yes, publish {drafts} drafts
              </Button>
              <Button variant="ghost" onClick={() => setConfirmPublish(false)}>
                Not yet
              </Button>
            </>
          ) : (
            <Button onClick={() => setConfirmPublish(true)}>Publish {drafts} drafts…</Button>
          ))}
      </div>
      <Note note={note} isError={isError} />
    </div>
  )
}

export function SessionAttendance({ sessionId, attendees }: { sessionId: string; attendees: { userId: string; name: string; email: string; phone: string | null; registered: boolean; cancelled: boolean; present: boolean }[] }): React.JSX.Element {
  const { run, pending, note, isError } = useAction(`session-${sessionId}`)
  const [email, setEmail] = useState('')
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button disabled={pending} onClick={() => run(() => markAllRegisteredPresent({ sessionId }))} data-mark-all="true">
          Mark all registered as present
        </Button>
      </div>
      <Note note={note} isError={isError} />
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
            <tr>
              <th className="p-2">Present</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Registration</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length === 0 && (
              <tr>
                <td colSpan={5} className="p-3 text-muted-foreground">
                  Nobody has registered yet.
                </td>
              </tr>
            )}
            {attendees.map((a) => (
              <tr key={a.userId} className="border-t border-border" data-attendee={a.email}>
                <td className="p-2">
                  <input
                    type="checkbox"
                    aria-label={`Present: ${a.name || a.email}`}
                    className="size-5"
                    checked={a.present}
                    disabled={pending}
                    onChange={(e) => run(() => setPresent({ sessionId, userId: a.userId, present: e.target.checked }))}
                  />
                </td>
                <td className="p-2 font-medium">{a.name || '—'}</td>
                <td className="p-2">{a.email}</td>
                <td className="p-2">{a.phone ?? '—'}</td>
                <td className="p-2 text-muted-foreground">{a.registered ? 'Registered' : a.cancelled ? 'Cancelled' : 'Added by you'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          run(() => addLearnerToSession({ sessionId, email }))
          setEmail('')
        }}
      >
        <label className="flex flex-col gap-1 text-xs font-medium" htmlFor="add-learner-email">
          Add a learner by email (marked present)
          <input id="add-learner-email" type="email" required className={`${field} w-72 max-w-full`} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <Button type="submit" variant="outline" disabled={pending}>
          Add learner
        </Button>
      </form>
    </div>
  )
}

export function RecordingControl({ userId, recordings }: { userId: string; recordings: { classNumber: number; counts: boolean }[] }): React.JSX.Element {
  const { run, pending, note, isError } = useAction(`recording-${userId}`)
  const [classNumber, setClassNumber] = useState<ClassNumber>(1)
  const [counts, setCounts] = useState(true)
  return (
    <div className="flex flex-col gap-1.5">
      {recordings.map((r) => (
        <span key={r.classNumber} className="flex items-center gap-2 whitespace-nowrap text-xs">
          Class {r.classNumber} recording · {r.counts ? 'counts' : 'not counted'}
          <button type="button" className="text-primary underline" disabled={pending} onClick={() => run(() => setRecording({ userId, classNumber: r.classNumber, watched: true, counts: !r.counts }))}>
            {r.counts ? 'Untick' : 'Tick: counts'}
          </button>
          <button type="button" className="text-muted-foreground underline" disabled={pending} onClick={() => run(() => setRecording({ userId, classNumber: r.classNumber, watched: false, counts: false }))}>
            Remove
          </button>
        </span>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        <select aria-label="Class number" className={`${field} min-h-8 px-2 text-xs`} value={classNumber} onChange={(e) => setClassNumber(Number(e.target.value) as ClassNumber)}>
          {CLASS_NUMBERS.map((n) => (
            <option key={n} value={n}>
              Class {n}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" checked={counts} onChange={(e) => setCounts(e.target.checked)} /> counts
        </label>
        <Button size="sm" variant="outline" disabled={pending} onClick={() => run(() => setRecording({ userId, classNumber, watched: true, counts }))}>
          Watched recording
        </Button>
      </div>
      <Note note={note} isError={isError} />
    </div>
  )
}
