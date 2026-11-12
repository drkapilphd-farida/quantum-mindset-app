import type { CalmRegistration } from './registrations'

// CSV of the Calm Mind batch registrations (admin export). Cells are quoted;
// a leading = + - @ is escaped so a spreadsheet never runs it as a formula.
const cell = (value: string): string => {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

export function calmRegistrationsCsv(rows: CalmRegistration[]): string {
  const header = ['Name', 'Phone', 'Email', 'Payment ID', 'Date (IST)', 'Batch', 'UTM']
  const lines = rows.map((r) => [r.name, r.phone, r.email, r.paymentId, new Date(r.paidAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), r.batch, r.utm ?? ''].map(cell).join(','))
  return [header.map(cell).join(','), ...lines].join('\n') + '\n'
}
