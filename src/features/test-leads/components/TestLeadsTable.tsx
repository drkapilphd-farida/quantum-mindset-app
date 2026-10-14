'use client'

import { useState, useTransition } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { updateTestLeadStatus } from '../actions/updateTestLeadStatus'
import type { TestLeadRow, TestLeadStatus } from '../queries/getTestLeads'
import { leadMagnetCopy } from '@/features/reading-speed-test/leadMagnetCopy'
import type { ReadingProfileType } from '@/features/reading-speed-test/scoring'

const STATUS: { value: TestLeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'enrolled', label: 'Enrolled' },
]

const ist = (iso: string): string => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })

function followUp(lead: TestLeadRow): string {
  const name = lead.firstName?.trim() ?? ''
  return lead.lang === 'hi'
    ? `नमस्ते ${name}, मैं Mind Ur Mind से डॉ. कपिल की टीम से हूँ। मुफ़्त टेस्ट देने के लिए धन्यवाद — आपकी पूरी रिपोर्ट और टिप्स भेज रहे हैं।`
    : `Hi ${name}, this is Dr. Kapil's team at Mind Ur Mind. Thank you for taking the free test — here are your full report and tips.`
}

// The founder's follow-up list: every free-test lead with their own results,
// the ₹1,000 offer window, where they came from, and a one-tap WhatsApp message.
export function TestLeadsTable({ rows }: { rows: TestLeadRow[] }): React.JSX.Element {
  const [leads, setLeads] = useState(rows)
  const [, startTransition] = useTransition()

  function setStatus(id: string, status: TestLeadStatus): void {
    const previous = leads
    setLeads((current) => current.map((l) => (l.id === id ? { ...l, status } : l)))
    startTransition(async () => {
      const res = await updateTestLeadStatus({ id, status })
      if (!res.success) setLeads(previous)
    })
  }

  if (leads.length === 0) return <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">No test leads yet.</div>

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>When</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Results</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead>Offer</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => {
            const offerLive = lead.offerExpiresAt !== null && Date.parse(lead.offerExpiresAt) > Date.now()
            return (
              <TableRow key={lead.id} data-test-lead={lead.id}>
                <TableCell className="whitespace-nowrap">{ist(lead.createdAt)}</TableCell>
                <TableCell>{lead.firstName ?? '—'}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <div>+{lead.whatsappNumber}</div>
                  <a href={`https://wa.me/${lead.whatsappNumber}?text=${encodeURIComponent(followUp(lead))}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary underline">
                    Message on WhatsApp
                  </a>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {lead.valid ? `${lead.effectiveWpm} eff. WPM` : 'Not valid'}
                  <div className="text-xs text-muted-foreground">
                    {lead.wpm} WPM · {lead.comprehensionPercent}%{lead.retentionCorrect !== null ? ` · retention ${lead.retentionCorrect}/4` : ''}
                    {lead.memoryCorrect !== null ? ` · memory ${lead.memoryCorrect}/8` : ''} · {lead.lang.toUpperCase()}
                  </div>
                </TableCell>
                <TableCell>{lead.profileType === null ? '—' : (leadMagnetCopy.en.profiles[lead.profileType as ReadingProfileType]?.name ?? lead.profileType)}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {lead.offerExpiresAt === null ? '—' : lead.offerUsed ? 'Used' : offerLive ? `Until ${ist(lead.offerExpiresAt)}` : `Expired ${ist(lead.offerExpiresAt)}`}
                </TableCell>
                <TableCell>{lead.utmSource ?? 'direct'}{lead.utmCampaign ? ` · ${lead.utmCampaign}` : ''}</TableCell>
                <TableCell>
                  <Select value={lead.status} onValueChange={(v) => setStatus(lead.id, v as TestLeadStatus)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
