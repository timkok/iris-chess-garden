import type { PieceSymbol } from 'chess.js'

export type Lesson = {
  piece: PieceSymbol
  name: string
  icon: string
  explanation: string
  start: string
  legalSquares: string[]
}

export const pieceTips: Record<PieceSymbol, string> = {
  p: 'Pawns move forward. They capture diagonally.',
  r: 'Rooks move in straight lines.',
  n: 'Knights move in an L shape and can jump over pieces.',
  b: 'Bishops move diagonally.',
  q: 'Queens move in straight lines and diagonally.',
  k: 'Kings move one square. Keep your king safe.',
}

export const pieceNames: Record<PieceSymbol, string> = {
  p: 'pawn',
  r: 'rook',
  n: 'knight',
  b: 'bishop',
  q: 'queen',
  k: 'king',
}

export const lessons: Lesson[] = [
  {
    piece: 'p',
    name: 'Pawn',
    icon: '♙',
    explanation: pieceTips.p,
    start: 'e2',
    legalSquares: ['e3', 'e4'],
  },
  {
    piece: 'r',
    name: 'Rook',
    icon: '♖',
    explanation: pieceTips.r,
    start: 'd4',
    legalSquares: ['d1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4'],
  },
  {
    piece: 'n',
    name: 'Knight',
    icon: '♘',
    explanation: pieceTips.n,
    start: 'd4',
    legalSquares: ['b3', 'b5', 'c2', 'c6', 'e2', 'e6', 'f3', 'f5'],
  },
  {
    piece: 'b',
    name: 'Bishop',
    icon: '♗',
    explanation: pieceTips.b,
    start: 'd4',
    legalSquares: ['a1', 'b2', 'c3', 'e5', 'f6', 'g7', 'h8', 'a7', 'b6', 'c5', 'e3', 'f2', 'g1'],
  },
  {
    piece: 'q',
    name: 'Queen',
    icon: '♕',
    explanation: pieceTips.q,
    start: 'd4',
    legalSquares: ['d1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4', 'a1', 'b2', 'c3', 'e5', 'f6', 'g7', 'h8', 'a7', 'b6', 'c5', 'e3', 'f2', 'g1'],
  },
  {
    piece: 'k',
    name: 'King',
    icon: '♔',
    explanation: pieceTips.k,
    start: 'd4',
    legalSquares: ['c3', 'd3', 'e3', 'c4', 'e4', 'c5', 'd5', 'e5'],
  },
]
