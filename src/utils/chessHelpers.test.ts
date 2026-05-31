import { describe, expect, it } from 'vitest'
import { gameResultText, isPromotionMove } from './chessHelpers'

describe('isPromotionMove', () => {
  it('detects a white pawn promotion', () => {
    expect(isPromotionMove('8/P6k/8/8/8/8/8/7K w - - 0 1', 'a7', 'a8')).toBe(true)
  })

  it('detects a black pawn promotion', () => {
    expect(isPromotionMove('7k/8/8/8/8/8/6p1/K7 b - - 0 1', 'g2', 'g1')).toBe(true)
  })
})

describe('gameResultText', () => {
  it('reports checkmate', () => {
    expect(gameResultText('7k/6Q1/6K1/8/8/8/8/8 b - - 0 1', 'Iris', 'Friend')).toBe('Checkmate! Iris wins.')
  })

  it('reports stalemate', () => {
    expect(gameResultText('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1')).toBe('Stalemate! It’s a draw.')
  })
})
