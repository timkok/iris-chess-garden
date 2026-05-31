import { useState } from 'react'
import type { Lesson } from '../data/lessons'

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export function PieceLesson({ lesson }: { lesson: Lesson }) {
  const [clicked, setClicked] = useState<string[]>([])
  const [message, setMessage] = useState('Click every glowing square.')
  const learned = clicked.length === lesson.legalSquares.length

  const toggle = (square: string) => {
    if (!lesson.legalSquares.includes(square)) {
      setMessage('Good try! This piece moves a different way.')
      return
    }
    setClicked((old) => (old.includes(square) ? old.filter((item) => item !== square) : [...old, square]))
    setMessage('Great square! You found a legal move.')
  }

  return (
    <article className="lesson-card">
      <div className="lesson-heading">
        <span className="lesson-icon">{lesson.icon}</span>
        <div>
          <h3>{lesson.name} {learned ? '✓' : ''}</h3>
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
                {isStart ? lesson.icon : clicked.includes(square) ? '★' : ''}
              </button>
            )
          }),
        )}
      </div>
      <p className="tiny-copy">{learned ? `You learned the ${lesson.name.toLowerCase()}!` : message}</p>
    </article>
  )
}
