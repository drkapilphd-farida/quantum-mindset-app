'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import LanguageToggle from '@/components/LanguageToggle'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'
import { saveOnboarding } from '../actions/saveOnboarding'
import { GUARDIAN_CONSENT_TEXT } from '../guardianConsent'
import {
  FOCUS_LABELS,
  LEARNER_ROLES,
  LEARNING_FOCUSES,
  ROLE_LABELS,
  type LearnerRole,
  type LearningFocus,
} from '../onboardingOptions'

// "About you" — role + goal (Phase 8, Item 10). `welcome` mode is the
// one-time screen after first login (with Skip); `settings` mode edits the
// same answers later. A parent must tick the guardian consent checkbox.

const COPY = {
  en: {
    title: 'Tell us about you',
    sub: 'Two quick questions so we can put the right practice first. You can change this later in Settings.',
    roleQ: 'Who is setting up this account?',
    focusQ: 'What is the main goal?',
    continue: 'Continue',
    save: 'Save',
    saved: 'Saved.',
    skip: 'Skip for now',
    chooseBoth: 'Please choose one option in each question.',
    consentRequired: 'Please tick the consent box to continue.',
    error: 'Could not save. Please try again.',
  },
  hi: {
    title: 'अपने बारे में बताएं',
    sub: 'दो छोटे सवाल, ताकि हम सही अभ्यास सबसे पहले दिखा सकें। आप इसे बाद में Settings में बदल सकते हैं।',
    roleQ: 'यह अकाउंट कौन सेट कर रहा है?',
    focusQ: 'मुख्य लक्ष्य क्या है?',
    continue: 'आगे बढ़ें',
    save: 'सेव करें',
    saved: 'सेव हो गया।',
    skip: 'अभी छोड़ें',
    chooseBoth: 'कृपया हर सवाल में एक विकल्प चुनें।',
    consentRequired: 'आगे बढ़ने के लिए कृपया सहमति वाले बॉक्स पर टिक करें।',
    error: 'सेव नहीं हो सका। कृपया फिर से कोशिश करें।',
  },
} as const

type AboutYouFormProps = {
  mode: 'welcome' | 'settings'
  initialRole: LearnerRole | null
  initialFocus: LearningFocus | null
  /** Where to go after saving or skipping (welcome mode). */
  next?: string
}

function OptionButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'min-h-12 rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        selected ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-background/60 text-foreground hover:border-foreground/30',
      )}
    >
      {children}
    </button>
  )
}

export function AboutYouForm({ mode, initialRole, initialFocus, next = '/dashboard' }: AboutYouFormProps): React.JSX.Element {
  const { lang } = useLanguage()
  const c = COPY[lang]
  const router = useRouter()
  const [role, setRole] = useState<LearnerRole | null>(initialRole)
  const [focus, setFocus] = useState<LearningFocus | null>(initialFocus)
  const [consent, setConsent] = useState(false)
  const [message, setMessage] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null)
  const [pending, startTransition] = useTransition()

  function submit(): void {
    if (role === null || focus === null) {
      setMessage({ kind: 'error', text: c.chooseBoth })
      return
    }
    if (role === 'parent' && !consent) {
      setMessage({ kind: 'error', text: c.consentRequired })
      return
    }
    startTransition(async () => {
      const result = await saveOnboarding({ mode: 'save', role, focus, guardianConsent: consent, lang })
      if (!result.success) {
        setMessage({ kind: 'error', text: result.error === 'consent_required' ? c.consentRequired : c.error })
        return
      }
      if (mode === 'welcome') {
        router.push(next)
        return
      }
      setMessage({ kind: 'ok', text: c.saved })
      router.refresh()
    })
  }

  function skip(): void {
    startTransition(async () => {
      await saveOnboarding({ mode: 'skip' })
      router.push(next)
    })
  }

  return (
    <div className="w-full space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          {mode === 'welcome' ? (
            <h1 className="text-[26px] font-semibold tracking-tight sm:text-[32px]">{c.title}</h1>
          ) : (
            <h2 className="text-base font-medium">{c.title}</h2>
          )}
          <p className="mt-2 text-sm text-muted-foreground sm:text-[15px]">{c.sub}</p>
        </div>
        <div className="flex-none">
          <LanguageToggle />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-3 text-[15px] font-semibold">{c.roleQ}</legend>
        <div className={cn('grid grid-cols-1 gap-2.5', mode === 'welcome' && 'sm:grid-cols-3')}>
          {LEARNER_ROLES.map((id) => (
            <OptionButton key={id} selected={role === id} onClick={() => setRole(id)}>
              {ROLE_LABELS[id][lang]}
            </OptionButton>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="mb-3 text-[15px] font-semibold">{c.focusQ}</legend>
        <div className={cn('grid grid-cols-2 gap-2.5', mode === 'welcome' && 'sm:grid-cols-4')}>
          {LEARNING_FOCUSES.map((id) => (
            <OptionButton key={id} selected={focus === id} onClick={() => setFocus(id)}>
              {FOCUS_LABELS[id][lang]}
            </OptionButton>
          ))}
        </div>
      </fieldset>

      {role === 'parent' && (
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-background/60 p-4 text-sm leading-relaxed">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 size-4 flex-none accent-current" />
          <span>{GUARDIAN_CONSENT_TEXT[lang]}</span>
        </label>
      )}

      {message !== null && (
        <p role={message.kind === 'error' ? 'alert' : 'status'} className={cn('text-sm', message.kind === 'error' ? 'text-destructive' : 'text-muted-foreground')}>
          {message.text}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 text-[15px] font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {mode === 'welcome' ? c.continue : c.save}
        </button>
        {mode === 'welcome' && (
          <button
            type="button"
            onClick={skip}
            disabled={pending}
            className="inline-flex min-h-12 items-center justify-center rounded-full px-5 text-[15px] font-medium text-muted-foreground underline-offset-4 hover:underline disabled:opacity-60"
          >
            {c.skip}
          </button>
        )}
      </div>
    </div>
  )
}
