import { Chess } from 'chess.js'
import { describe, expect, it } from 'vitest'
import { puzzles } from './puzzles'

describe('practice puzzles', () => {
  it('has only legal solution moves', () => {
    for (const puzzle of puzzles) {
      const game = new Chess(puzzle.fen)
      const legalMoves = new Set(game.moves({ verbose: true }).map((move) => `${move.from}${move.to}${move.promotion ?? ''}`))

      for (const solution of puzzle.solutions) {
        expect(legalMoves.has(solution), `${puzzle.id} solution ${solution} should be legal`).toBe(true)
      }
    }
  })
})
