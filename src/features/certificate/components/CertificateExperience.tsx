'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import { LANGUAGES, type AppLang } from '@/lib/app-i18n/languages'
import { shareOrDownload } from '@/features/reading-speed-test/shareCard'
import { issueCertificate, getCertificateSignature, type CertificateState, type IssuedCertificate } from '../actions'
import { cleanLearnerName, PROGRAM_NAME, verifyPath } from '../certificate'
import { CERT_SIZE, drawCertificate, drawShareImage, type CertDrawInput } from '../draw'
import { certFontsFor, loadCertFonts } from '../fonts'
import { fill, type CertLabels } from '../labels'
import { jpegToPdf } from '../pdf'

type CertificateExperienceProps = {
  initialState: CertificateState
  lang: AppLang
  labels: { own: CertLabels; en: CertLabels }
  siteUrl: string
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('image failed to load'))
    img.src = src
  })
}

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('canvas export failed'))), type, quality))
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

// The Sharp Brain 30-day certificate (Phase 3, item 2): locked until Day 30,
// then a one-time name check, then the certificate with PDF and share-image
// downloads, in the learner's language or English.
export function CertificateExperience({ initialState, lang, labels, siteUrl }: CertificateExperienceProps): React.JSX.Element {
  const t = useAppT()
  const [state, setState] = useState(initialState)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8" data-certificate-state={state.status}>
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">Sharp Brain™</p>
        <h1 className="mt-1 font-heading text-2xl font-bold text-foreground sm:text-3xl">{t('training.certificate.pageTitle')}</h1>
      </div>
      {state.status === 'locked' && (
        <div className="rounded-2xl border border-border/60 bg-card p-6 text-center">
          <p className="font-semibold text-foreground">{t('training.certificate.lockedTitle')}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t('training.certificate.lockedBody')}</p>
        </div>
      )}
      {state.status === 'ready' && <NameStep suggestedName={state.suggestedName} onIssued={(certificate) => setState({ status: 'issued', certificate })} />}
      {state.status === 'issued' && <IssuedView certificate={state.certificate} lang={lang} labels={labels} siteUrl={siteUrl} />}
    </div>
  )
}

function NameStep({ suggestedName, onIssued }: { suggestedName: string; onIssued: (c: IssuedCertificate) => void }): React.JSX.Element {
  const t = useAppT()
  const [name, setName] = useState(suggestedName)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(event: React.FormEvent): Promise<void> {
    event.preventDefault()
    if (cleanLearnerName(name) === null) return setError(t('training.certificate.nameInvalid'))
    setBusy(true)
    const res = await issueCertificate({ name })
    setBusy(false)
    if (res.ok) return onIssued(res.certificate)
    setError(res.error === 'invalid-name' ? t('training.certificate.nameInvalid') : t('training.certificate.error'))
  }

  return (
    <form className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6" onSubmit={(e) => void submit(e)} noValidate>
      <div>
        <p className="font-semibold text-foreground">{t('training.certificate.nameTitle')}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t('training.certificate.nameBody')}</p>
      </div>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground" htmlFor="certificate-name">
        {t('training.certificate.nameLabel')}
        <input
          id="certificate-name"
          name="certificate-name"
          value={name}
          maxLength={60}
          autoComplete="name"
          onChange={(e) => {
            setName(e.target.value)
            setError(null)
          }}
          className="min-h-12 rounded-xl border border-border bg-background px-4 text-lg text-foreground"
          aria-invalid={error !== null}
          aria-describedby={error !== null ? 'certificate-name-error' : undefined}
        />
      </label>
      {error !== null && (
        <p id="certificate-name-error" className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="min-h-12 rounded-full" disabled={busy} data-certificate-issue="true">
        {t('training.certificate.issue')}
      </Button>
    </form>
  )
}

function IssuedView({ certificate, lang, labels, siteUrl }: { certificate: IssuedCertificate; lang: AppLang; labels: { own: CertLabels; en: CertLabels }; siteUrl: string }): React.JSX.Element {
  const t = useAppT()
  const rootRef = useRef<HTMLDivElement>(null)
  const [certLang, setCertLang] = useState<AppLang>(lang)
  const [preview, setPreview] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [assets, setAssets] = useState<{ logo: HTMLImageElement; signature: HTMLImageElement | null } | null>(null)
  const verifyUrl = `${siteUrl}${verifyPath(certificate.code)}`
  const domain = siteUrl.replace(/^https?:\/\/(www\.)?/, '')

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const [logo, signatureUrl] = await Promise.all([loadImage('/brand/mind-ur-mind-logo.svg'), getCertificateSignature()])
        const signature = signatureUrl === null ? null : await loadImage(signatureUrl)
        if (!cancelled) setAssets({ logo, signature })
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function drawInput(): Promise<CertDrawInput | null> {
    if (assets === null || rootRef.current === null) return null
    const fonts = certFontsFor(certLang, rootRef.current)
    const own = certLang === 'en' ? labels.en : labels.own
    await loadCertFonts(fonts, `${certificate.learnerName} ${Object.values(own).join(' ')} ${PROGRAM_NAME} 0123456789%→`)
    return { lang: certLang, labels: own, learnerName: certificate.learnerName, completedOn: certificate.completedOn, code: certificate.code, snapshot: certificate.snapshot, verifyUrl, domain, fonts, logo: assets.logo, signature: assets.signature }
  }

  useEffect(() => {
    let cancelled = false
    setPreview(null)
    void (async () => {
      const input = await drawInput()
      if (input === null || cancelled) return
      const canvas = document.createElement('canvas')
      drawCertificate(canvas, input)
      const blob = await canvasBlob(canvas, 'image/jpeg', 0.85)
      if (!cancelled) setPreview(URL.createObjectURL(blob))
    })().catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
    // drawInput reads only these.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets, certLang])

  async function downloadPdf(): Promise<void> {
    const input = await drawInput()
    if (input === null) return
    const canvas = document.createElement('canvas')
    drawCertificate(canvas, input)
    const jpeg = new Uint8Array(await (await canvasBlob(canvas, 'image/jpeg', 0.92)).arrayBuffer())
    const pdf = jpegToPdf(jpeg, CERT_SIZE.width, CERT_SIZE.height, `Sharp Brain certificate ${certificate.code}`)
    download(new Blob([pdf], { type: 'application/pdf' }), `sharp-brain-certificate-${certificate.code}.pdf`)
  }

  async function shareImage(): Promise<void> {
    const input = await drawInput()
    if (input === null) return
    const canvas = document.createElement('canvas')
    drawShareImage(canvas, input)
    const blob = await canvasBlob(canvas, 'image/png')
    await shareOrDownload(blob, fill(t('training.certificate.shareText'), { url: verifyUrl })).catch(() => undefined)
  }

  async function copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(verifyUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard refused: the link stays visible to select by hand.
    }
  }

  return (
    <div ref={rootRef} className="flex flex-col gap-5" data-certificate-code={certificate.code}>
      {lang !== 'en' && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-foreground">{t('training.certificate.languageLabel')}</p>
          <div className="grid grid-cols-2 gap-2" role="radiogroup">
            {([lang, 'en'] as const).map((l) => (
              <button
                key={l}
                type="button"
                role="radio"
                aria-checked={certLang === l}
                onClick={() => setCertLang(l)}
                className={`min-h-12 rounded-2xl border-2 text-base font-semibold ${certLang === l ? 'border-primary bg-primary/10 text-foreground' : 'border-border/60 text-muted-foreground'}`}
                data-certificate-lang={l}
              >
                {LANGUAGES[l].nativeName}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm" style={{ aspectRatio: `${CERT_SIZE.width} / ${CERT_SIZE.height}` }}>
        {preview !== null ? (
          // eslint-disable-next-line @next/next/no-img-element -- a locally drawn blob, not a remote image
          <img src={preview} alt={`${t('training.certificate.pageTitle')}: ${certificate.learnerName}`} className="h-full w-full object-contain" data-certificate-preview="true" />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">{failed ? t('training.certificate.error') : t('training.certificate.preparing')}</div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button size="lg" className="min-h-12 rounded-full" disabled={preview === null} onClick={() => void downloadPdf()} data-certificate-pdf="true">
          {t('training.certificate.downloadPdf')}
        </Button>
        <Button size="lg" variant="outline" className="min-h-12 rounded-full" disabled={preview === null} onClick={() => void shareImage()} data-certificate-share="true">
          {t('training.certificate.downloadImage')}
        </Button>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-4">
        <p className="text-sm font-semibold text-foreground">{t('training.certificate.verifyLink')}</p>
        <p className="text-sm break-all text-muted-foreground select-all" data-certificate-verify-url="true">
          {verifyUrl}
        </p>
        <Button variant="ghost" size="sm" className="self-start" onClick={() => void copyLink()}>
          {copied ? t('training.certificate.copied') : t('training.certificate.copy')}
        </Button>
      </div>
    </div>
  )
}
