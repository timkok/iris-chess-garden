import type { PromotionChoice } from '../utils/chessHelpers'

const pieces: Array<{ id: PromotionChoice; label: string; icon: string }> = [
  { id: 'q', label: 'Queen', icon: '♕' },
  { id: 'r', label: 'Rook', icon: '♖' },
  { id: 'b', label: 'Bishop', icon: '♗' },
  { id: 'n', label: 'Knight', icon: '♘' },
]

export function PromotionDialog({ onChoose }: { onChoose: (piece: PromotionChoice) => void }) {
  return (
    <div className="promotion-backdrop" role="dialog" aria-modal="true" aria-label="Choose promotion piece">
      <div className="promotion-dialog">
        <h2>Choose your new piece</h2>
        <p>Wonderful pawn journey! What should it become?</p>
        <div className="promotion-options">
          {pieces.map((piece) => (
            <button key={piece.id} onClick={() => onChoose(piece.id)}>
              <span>{piece.icon}</span>
              {piece.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
