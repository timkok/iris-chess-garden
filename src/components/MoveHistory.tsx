import type { Move } from 'chess.js'

export function MoveHistory({ moves }: { moves: Move[] }) {
  return (
    <section className="panel compact-panel">
      <div className="section-title">Move history</div>
      <div className="history-rows">
        {moves.length === 0 ? (
          <span>Start the game when you are ready.</span>
        ) : (
          moves.map((move, index) => (
            <span key={`${move.lan}-${index}`}>
              {index + 1}. {move.san}
            </span>
          ))
        )}
      </div>
    </section>
  )
}
