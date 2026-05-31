import { Lightbulb, RotateCcw } from 'lucide-react'
import type { Puzzle } from '../data/puzzles'

export function PracticePuzzle({
  puzzle,
  solved,
  hintMessage,
  onHint,
  onReset,
}: {
  puzzle: Puzzle
  solved: boolean
  hintMessage: string
  onHint: () => void
  onReset: () => void
}) {
  return (
    <section className="panel puzzle-panel">
      <div className="section-title">Practice puzzle</div>
      <h2>{puzzle.title}</h2>
      <p>{puzzle.goal}</p>
      {solved && <div className="success-banner">Beautiful work! Puzzle solved.</div>}
      {hintMessage && <p className="hint-text">{hintMessage}</p>}
      <div className="button-row">
        <button className="soft-button" onClick={onHint}>
          <Lightbulb size={16} />
          Hint
        </button>
        <button className="soft-button" onClick={onReset}>
          <RotateCcw size={16} />
          Try again
        </button>
      </div>
    </section>
  )
}
