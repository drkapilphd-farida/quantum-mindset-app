type EegWaveformProps = {
  className?: string
}

const JAGGED_PATH =
  'M0,100 L15,60 L30,140 L45,50 L60,150 L75,70 L90,130 L105,40 L120,160 L135,80 L150,120 L165,55 L180,145 L195,65 L210,135 L225,45 L240,155 L255,75 L270,125 L285,50 L300,150 L315,90 L330,110 L345,60 L360,140 L375,70 L390,130 L405,40 L420,160 L435,80 L450,120 L465,55 L480,145 L495,65 L510,135 L525,45 L540,155 L555,75 L570,125 L585,50 L600,150 L615,90 L630,110 L645,60 L660,140 L675,70 L690,130 L705,40 L720,160 L735,80 L750,120 L765,60 L780,140 L800,100'

const SMOOTH_PATH =
  'M0,100 C50,70 100,130 150,100 C200,70 250,130 300,100 C350,70 400,130 450,100 C500,70 550,130 600,100 C650,70 700,130 750,100 C775,85 790,95 800,100'

// Ambient Brainwave Motif™ — decorative only (aria-hidden), shared by the
// hero background and the signature "see your brain change live"
// section. See globals.css's own doc comment for the crossfade/reduced-
// motion mechanics — this component only supplies the two static paths.
export function EegWaveform({ className = '' }: EegWaveformProps): React.JSX.Element {
  return (
    <svg viewBox="0 0 800 200" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      <path d={JAGGED_PATH} className="eeg-waveform-jagged eeg-waveform-animate" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d={SMOOTH_PATH} className="eeg-waveform-smooth eeg-waveform-animate" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
