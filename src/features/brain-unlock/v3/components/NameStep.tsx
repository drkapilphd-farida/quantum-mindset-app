'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { V3Copy } from '../copyV3'
import { PLAYERS, type Player } from '../progressV3'
import { bigBtn } from './v3ui'

const NameSchema = z.object({
  firstName: z.string().trim().max(30),
  player: z.enum(PLAYERS),
})
type NameForm = z.infer<typeof NameSchema>

type NameStepProps = {
  c: V3Copy
  defaultName: string | null
  onDone: (v: { firstName: string | null; player: Player }) => void
}

/** After round 1: an optional first name and one tap for who is playing. */
export function NameStep({ c, defaultName, onDone }: NameStepProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NameForm>({
    resolver: zodResolver(NameSchema),
    defaultValues: { firstName: defaultName ?? '' },
  })
  const player = watch('player')

  function submit(v: NameForm): void {
    onDone({ firstName: v.firstName === '' ? null : v.firstName, player: v.player })
  }

  const label: Record<Player, string> = { child: c.name.child, student: c.name.student, adult: c.name.adult }
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5" data-v3-name noValidate>
      <h1 className="text-center font-heading text-2xl font-bold text-foreground">{c.name.title}</h1>
      <label className="flex flex-col gap-2 text-base font-semibold text-foreground">
        {c.name.label}
        <input
          {...register('firstName')}
          type="text"
          autoComplete="given-name"
          maxLength={30}
          placeholder={c.name.placeholder}
          className="min-h-14 rounded-2xl border-2 border-border bg-card px-4 text-lg font-normal text-foreground outline-none focus:border-primary"
          data-v3-first-name
        />
        {errors.firstName !== undefined && <span className="text-sm font-normal text-red-600">{c.name.tooLong}</span>}
      </label>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-base font-semibold text-foreground">{c.name.who}</legend>
        <div className="grid grid-cols-3 gap-2">
          {PLAYERS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setValue('player', p, { shouldValidate: true })}
              aria-pressed={player === p}
              className={`min-h-16 rounded-2xl border-2 text-lg font-bold transition-colors ${player === p ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground'}`}
              data-v3-player={p}
            >
              {label[p]}
            </button>
          ))}
        </div>
        {errors.player !== undefined && <span className="text-sm text-red-600">{c.name.pickWho}</span>}
      </fieldset>
      <button type="submit" className={bigBtn} data-v3-name-continue>
        {c.name.continue} →
      </button>
    </form>
  )
}
