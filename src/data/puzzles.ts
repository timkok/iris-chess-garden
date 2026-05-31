export type Puzzle = {
  id: string
  title: string
  goal: string
  fen: string
  solutions: string[]
  hint: string
}

export const puzzles: Puzzle[] = [
  {
    id: 'rook-capture',
    title: 'Rook capture',
    goal: 'Move the rook to capture the free bishop.',
    fen: '4k3/8/8/4b3/8/8/4R3/4K3 w - - 0 1',
    solutions: ['e2e5'],
    hint: 'Rooks travel in straight lines. Look along the rook’s row or file.',
  },
  {
    id: 'bishop-diagonal',
    title: 'Bishop diagonal',
    goal: 'Move the bishop diagonally to a bright square.',
    fen: '4k3/8/8/8/3B4/8/8/4K3 w - - 0 1',
    solutions: ['d4g7', 'd4a7', 'd4g1', 'd4a1'],
    hint: 'Bishops slide on diagonal paths.',
  },
  {
    id: 'knight-l',
    title: 'Knight L shape',
    goal: 'Jump the knight to a legal L-shape square.',
    fen: '4k3/8/8/8/3N4/8/8/4K3 w - - 0 1',
    solutions: ['d4b3', 'd4b5', 'd4c2', 'd4c6', 'd4e2', 'd4e6', 'd4f3', 'd4f5'],
    hint: 'Knights go two squares one way and one square to the side.',
  },
  {
    id: 'escape-check',
    title: 'Get out of check',
    goal: 'Move the king to safety.',
    fen: '4k3/8/8/8/8/8/4r3/4K3 w - - 0 1',
    solutions: ['e1d1', 'e1f1'],
    hint: 'The rook attacks the e-file. Step the king sideways.',
  },
  {
    id: 'mate-one',
    title: 'Checkmate in one',
    goal: 'Give checkmate with the queen.',
    fen: '6k1/5ppp/8/8/8/8/5PPP/5QK1 w - - 0 1',
    solutions: ['f1a6'],
    hint: 'The queen can slide diagonally to a6.',
  },
  {
    id: 'promote-pawn',
    title: 'Promote a pawn',
    goal: 'Move the pawn to the last rank and choose a queen.',
    fen: '4k3/6P1/8/8/8/8/8/4K3 w - - 0 1',
    solutions: ['g7g8q'],
    hint: 'Pawns become stronger pieces when they reach the far side.',
  },
]
