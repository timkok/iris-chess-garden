import { Chess, type Move } from 'chess.js'

const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

export function chooseBotMove(fen: string): Move | null {
  const game = new Chess(fen)
  const legalMoves = game.moves({ verbose: true })
  if (legalMoves.length === 0) return null

  const mate = legalMoves.find((move) => {
    const copy = new Chess(fen)
    copy.move(move)
    return copy.isCheckmate()
  })
  if (mate) return mate

  if (game.isCheck()) {
    return legalMoves[Math.floor(Math.random() * legalMoves.length)]
  }

  const captures = legalMoves
    .filter((move) => move.captured)
    .sort((a, b) => pieceValues[b.captured ?? 'p'] - pieceValues[a.captured ?? 'p'])
  if (captures.length > 0 && Math.random() < 0.65) {
    return captures[Math.floor(Math.random() * Math.min(captures.length, 2))]
  }

  const softMoves = legalMoves.filter((move) => !move.san.includes('#'))
  return (softMoves.length ? softMoves : legalMoves)[Math.floor(Math.random() * (softMoves.length || legalMoves.length))]
}

export function hintMoves(fen: string) {
  const game = new Chess(fen)
  return game
    .moves({ verbose: true })
    .map((move) => ({
      move,
      score: (move.captured ? pieceValues[move.captured] + 3 : 0) + (move.san.includes('+') ? 2 : 0),
      reason: move.captured
        ? `captures a ${move.captured.toUpperCase()}`
        : move.san.includes('+')
          ? 'gives a gentle check'
          : 'moves to a safe legal square',
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}
