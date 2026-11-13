'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { CLASS_TOPICS_EN, isClassNumber } from '@/features/live-classes/liveClasses'
import { deleteRecording, moveRecording, saveRecording, setRecordingHidden } from './recordingsActions'
import { youtubeIdFromUrl, type ClassRecording } from '../rules'

const field = 'min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground'
type Form = { id?: string; link: string; classNumber: string; title: string; classDate: string }

const fmt = (iso: string): string => new Date(`${iso}T12:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })

// Founder-only: add, edit, reorder, hide and delete class recordings.
export function RecordingsAdmin({ recordings, today }: { recordings: ClassRecording[]; today: string }): React.JSX.Element {
  const empty: Form = { link: '', classNumber: '1', title: CLASS_TOPICS_EN[1], classDate: today }
  const [form, setForm] = useState<Form>(empty)
  const [pending, start] = useTransition()
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)
  const linkOk = form.link.trim() === '' || youtubeIdFromUrl(form.link) !== null

  function run(action: () => Promise<{ ok: true; message: string } | { ok: false; error: string }>, after?: () => void): void {
    setResult(null)
    start(async () => {
      const res = await action()
      setResult(res.ok ? { ok: true, text: res.message } : { ok: false, text: res.error })
      if (res.ok) after?.()
    })
  }

  return (
    <div className="space-y-8">
      <form
        className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          run(
            () => saveRecording({ ...(form.id ? { id: form.id } : {}), link: form.link, classNumber: Number(form.classNumber), title: form.title, classDate: form.classDate }),
            () => setForm(empty),
          )
        }}
        data-recording-form={form.id ? 'edit' : 'add'}
      >
        <h2 className="text-lg font-semibold sm:col-span-2">{form.id ? 'Edit recording' : 'Add a recording'}</h2>
        <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
          YouTube link (unlisted) *
          <input value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} required maxLength={500} placeholder="https://youtu.be/…" className={field} data-recording-link="true" />
          {!linkOk && <span className="text-xs text-destructive">Not a YouTube video link.</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Class number *
          <select
            value={form.classNumber}
            onChange={(e) => {
              const n = Number(e.target.value)
              // Fill the class title while it is still a standard one.
              setForm((f) => ({ ...f, classNumber: e.target.value, title: Object.values(CLASS_TOPICS_EN).includes(f.title) || f.title === '' ? (isClassNumber(n) ? CLASS_TOPICS_EN[n] : f.title) : f.title }))
            }}
            className={field}
            data-recording-class="true"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>
                Class {n}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Class date *
          <input type="date" required value={form.classDate} onChange={(e) => setForm((f) => ({ ...f, classDate: e.target.value }))} className={field} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
          Title *
          <input required maxLength={160} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={field} data-recording-title="true" />
        </label>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <Button type="submit" disabled={pending || !linkOk} data-recording-save="true">
            {pending ? 'Saving…' : 'Save'}
          </Button>
          {form.id && (
            <Button type="button" variant="ghost" onClick={() => setForm(empty)}>
              Cancel edit
            </Button>
          )}
          {result && (
            <p role="status" className={`text-sm ${result.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-destructive'}`}>
              {result.text}
            </p>
          )}
        </div>
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          All recordings <span className="text-sm font-normal text-muted-foreground">· {recordings.filter((r) => !r.hidden).length} visible</span>
        </h2>
        {recordings.length === 0 ? (
          <p className="text-sm text-muted-foreground">None yet. Learners see “Recording coming soon” after each live class until you add its link.</p>
        ) : (
          <ul className="divide-y rounded-xl border" data-recording-list="true">
            {recordings.map((r, i) => (
              <li key={r.id} className={`flex flex-col gap-2 p-3 sm:flex-row sm:items-center ${r.hidden ? 'opacity-60' : ''}`} data-recording-row={r.id}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    Class {r.classNumber} · {r.title} {r.hidden && <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs font-medium">Hidden</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fmt(r.classDate)} · video {r.youtubeId}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Button size="sm" variant="outline" disabled={pending || i === 0} onClick={() => run(() => moveRecording({ id: r.id, direction: 'up' }))} aria-label="Move up">
                    ↑
                  </Button>
                  <Button size="sm" variant="outline" disabled={pending || i === recordings.length - 1} onClick={() => run(() => moveRecording({ id: r.id, direction: 'down' }))} aria-label="Move down">
                    ↓
                  </Button>
                  <Button size="sm" variant="outline" disabled={pending} onClick={() => setForm({ id: r.id, link: `https://youtu.be/${r.youtubeId}`, classNumber: String(r.classNumber), title: r.title, classDate: r.classDate })}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" disabled={pending} onClick={() => run(() => setRecordingHidden({ id: r.id, hidden: !r.hidden }))} data-recording-hide={r.id}>
                    {r.hidden ? 'Show' : 'Hide'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    disabled={pending}
                    onClick={() => {
                      if (window.confirm(`Delete “Class ${r.classNumber} · ${r.title}”? Learners will no longer see it.`)) run(() => deleteRecording({ id: r.id }))
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
