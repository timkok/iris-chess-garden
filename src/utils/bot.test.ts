import { Chess } from 'chess.js'
import { describe, expect, it } from 'vitest'
import { chooseBotMove } from './bot'

describe('chooseBotMove', () => {
  it('returns null when there are no legal moves', () => {
    expect(chooseBotMove('7k/6Q1/6K1/8/8/8/8/8 b - - 0 1')).toBeNull()
  })

  it('returns a legal move when moves are available', () => {
    const fen = 'start'
    const move = chooseBotMove(fen)
    const game = new Chess()
    const legalMoves = new Set(game.moves({ verbose: true }).map((legalMove) => `${legalMove.from}${legalMove.to}${legalMove.promotion ?? ''}`))

    expect(move).not.toBeNull()
    expect(legalMoves.has(`${move?.from}${move?.to}${move?.promotion ?? ''}`)).toBe(true)
  })

  it('chooses queen promotion when a bot promotion is available', () => {
    const fen = '7k/8/8/8/8/8/6p1/K7 b - - 0 1'
    const move = chooseBotMove(fen)

    expect(move).toMatchObject({ from: 'g2', to: 'g1', promotion: 'q' })
  })
})
