import { Chessboard } from 'react-chessboard'
import type { Square } from 'chess.js'
import { findKingSquare, legalMovesFor, makeGame } from '../utils/chessHelpers'

type Props = {
  fen: string
  selectedSquare: Square | null
  onSquareClick: (square: Square) => void
  onPieceDrop: (from: Square, to: Square) => boolean
  orientation: 'white' | 'black'
  showCoordinates: boolean
  beginnerHelp: boolean
  locked?: boolean
}

export function ChessBoard({
  fen,
  selectedSquare,
  onSquareClick,
  onPieceDrop,
  orientation,
  showCoordinates,
  beginnerHelp,
  locked = false,
}: Props) {
  const game = makeGame(fen)
  const legalMoves = selectedSquare && beginnerHelp ? legalMovesFor(fen, selectedSquare) : []
  const checkSquare = game.isCheck() ? findKingSquare(fen, game.turn()) : null
  const customSquareStyles = Object.fromEntries([
    ...(selectedSquare
      ? [[selectedSquare, { background: 'radial-gradient(circle, rgba(255, 204, 102, 0.78), rgba(255, 204, 102, 0.42))' }]]
      : []),
    ...legalMoves.map((move) => [
      move.to,
      {
        background: move.captured
          ? 'radial-gradient(circle, transparent 52%, rgba(238, 111, 87, 0.76) 54%, rgba(238, 111, 87, 0.76) 70%, transparent 72%)'
          : 'radial-gradient(circle, rgba(57, 181, 154, 0.74) 18%, transparent 20%)',
      },
    ]),
    ...(checkSquare ? [[checkSquare, { boxShadow: 'inset 0 0 0 5px #ef5d60', background: 'rgba(239, 93, 96, 0.36)' }]] : []),
  ])

  return (
    <div className="board-frame">
      <Chessboard
        options={{
          position: game.fen(),
          boardOrientation: orientation,
          showNotation: showCoordinates,
          squareStyles: customSquareStyles,
          allowDragging: !locked,
          onSquareClick: ({ square }) => {
            if (!locked) onSquareClick(square as Square)
          },
          onPieceDrop: ({ sourceSquare, targetSquare }) =>
            Boolean(!locked && targetSquare && onPieceDrop(sourceSquare as Square, targetSquare as Square)),
          darkSquareStyle: { backgroundColor: '#75a8c7' },
          lightSquareStyle: { backgroundColor: '#f8efd2' },
          animationDurationInMs: 180,
        }}
      />
    </div>
  )
}
