import { useState } from 'react'
import type { Lesson } from '../data/lessons'

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export function PieceLesson({ lesson }: { lesson: Lesson }) {
  const [clicked, setClicked] = useState<string[]>([])
  const toggle = (square: string) => {
    if (!lesson.legalSquares.includes(square)) return
    setClicked((old) => (old.includes(square) ? old.filter((item) => item !== square) : [...old, square]))
  }

  return (
    <article className="lesson-card">
      <div className="lesson-heading">
        <span className="lesson-icon">{lesson.icon}</span>
        <div>
          <h3>{lesson.name}</h3>
          <p>{lesson.explanation}</p>
        </div>
      </div>
      <div className="mini-board" aria-label={`${lesson.name} movement mini board`}>
        {Array.from({ length: 8 }).flatMap((_, rankIndex) =>
          files.map((file, fileIndex) => {
            const square = `${file}${8 - rankIndex}`
            const isStart = square === lesson.start
            const isLegal = lesson.legalSquares.includes(square)
            return (
              <button
                key={square}
                className={`${(rankIndex + fileIndex) % 2 ? 'dark' : 'light'} ${isStart ? 'piece-square' : ''} ${isLegal ? 'legal-square' : ''} ${clicked.includes(square) ? 'found-square' : ''}`}
                onClick={() => toggle(square)}
                aria-label={square}
              >
                {isStart ? lesson.icon : ''}
              </button>
            )
          }),
        )}
      </div>
      <p className="tiny-copy">{clicked.length ? 'Nice exploring!' : 'Click the glowing legal squares.'}</p>
    </article>
  )
}
