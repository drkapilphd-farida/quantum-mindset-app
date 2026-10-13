import { PlayScope } from '@/components/PlayScope'

// Welcome screens use the play design (Sunny Playground / Night Sky).
export default function WelcomeLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <PlayScope className="min-h-dvh">{children}</PlayScope>
}
