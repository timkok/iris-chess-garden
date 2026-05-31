import { Chess, type Color, type Move, type PieceSymbol, type Square } from 'chess.js'
import { pieceNames, pieceTips } from '../data/lessons'

export type PromotionChoice = 'q' | 'r' | 'b' | 'n'

export function makeGame(fen: string) {
  return fen === 'start' ? new Chess() : new Chess(fen)
}

export function legalMovesFor(fen: string, square: Square) {
  return makeGame(fen).moves({ square, verbose: true })
}

export function findKingSquare(fen: string, color: Color): Square | null {
  const board = makeGame(fen).board()
  for (let rankIndex = 0; rankIndex < board.length; rankIndex += 1) {
    for (let fileIndex = 0; fileIndex < board[rankIndex].length; fileIndex += 1) {
      const piece = board[rankIndex][fileIndex]
      if (piece?.type === 'k' && piece.color === color) {
        return `${'abcdefgh'[fileIndex]}${8 - rankIndex}` as Square
      }
    }
  }
  return null
}

export function isPromotionMove(fen: string, from: Square, to: Square) {
  const game = makeGame(fen)
  const piece = game.get(from)
  if (piece?.type !== 'p') return false
  const lastRank = piece.color === 'w' ? '8' : '1'
  return to.endsWith(lastRank) && game.moves({ square: from, verbose: true }).some((move) => move.to === to)
}

export function explainMove(move: Move, fenAfter: string) {
  const game = makeGame(fenAfter)
  const name = pieceNames[move.piece as PieceSymbol]
  if (game.isCheckmate()) return 'Checkmate! The king cannot escape.'
  if (game.isCheck()) return `Nice! The ${name} moved and gives check.`
  if (move.flags.includes('p')) return `Wonderful! Your pawn became a ${pieceNames[move.promotion as PieceSymbol]}.`
  if (move.captured) return `Nice capture! The ${name} found a good square.`
  if (move.piece === 'n') return 'The knight jumped in an L shape.'
  if (move.piece === 'b') return 'Nice! The bishop moved diagonally.'
  if (move.piece === 'r') return 'The rook moved in a straight line.'
  if (move.piece === 'k') return 'Your king is safe now.'
  return `Nice move! ${pieceTips[move.piece as PieceSymbol]}`
}

export function gameResultText(fen: string, whiteName = 'White', blackName = 'Black') {
  const game = makeGame(fen)
  if (game.isCheckmate()) {
    const winner = game.turn() === 'w' ? blackName : whiteName
    return `Checkmate! ${winner} wins.`
  }
  if (game.isStalemate()) return 'Stalemate! It’s a draw.'
  if (game.isDraw()) return 'It’s a draw.'
  return ''
}

export function capturedPieces(moves: Move[]) {
  return moves.reduce(
    (acc, move) => {
      if (move.captured) acc[move.color === 'w' ? 'white' : 'black'].push(move.captured)
      return acc
    },
    { white: [] as PieceSymbol[], black: [] as PieceSymbol[] },
  )
}
