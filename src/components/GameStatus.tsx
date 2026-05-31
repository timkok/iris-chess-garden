import type { Move, PieceSymbol } from 'chess.js'
import { AlertTriangle, CircleDot, Crown } from 'lucide-react'
import { capturedPieces, gameResultText, makeGame } from '../utils/chessHelpers'
import { pieceNames } from '../data/lessons'

const glyphs: Record<PieceSymbol, string> = { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' }

export function GameStatus({
  modeLabel,
  fen,
  moves,
  whiteName,
  blackName,
  lastMove,
}: {
  modeLabel: string
  fen: string
  moves: Move[]
  whiteName: string
  blackName: string
  lastMove: Move | null
}) {
  const game = makeGame(fen)
  const result = gameResultText(fen, whiteName, blackName)
  const captured = capturedPieces(moves)
  const turnName = game.turn() === 'w' ? whiteName : blackName

  return (
    <section className="panel status-panel">
      <div className="section-title">
        <CircleDot size={16} />
        Game status
      </div>
      <div className="status-grid">
        <span>Mode</span>
        <strong>{modeLabel}</strong>
        <span>Turn</span>
        <strong>{result || `${turnName} to move`}</strong>
        <span>Check</span>
        <strong className={game.isCheck() ? 'danger-text' : ''}>{game.isCheck() ? 'Careful, king in check' : 'No check'}</strong>
        <span>Last move</span>
        <strong>{lastMove ? lastMove.san : 'Ready'}</strong>
      </div>
      {result && (
        <div className="result-banner">
          <Crown size={18} />
          {result}
        </div>
      )}
      {game.isCheck() && !result && (
        <div className="check-note">
          <AlertTriangle size={16} />
          A king is being attacked. The checked side needs to move out of check.
        </div>
      )}
      <div className="captured">
        <div>
          <span>{whiteName} captured</span>
          <p>{captured.white.length ? captured.white.map((piece) => glyphs[piece]).join(' ') : 'No pieces yet'}</p>
        </div>
        <div>
          <span>{blackName} captured</span>
          <p>{captured.black.length ? captured.black.map((piece) => glyphs[piece]).join(' ') : 'No pieces yet'}</p>
        </div>
      </div>
      <div className="move-list">
        {moves.length ? (
          moves.map((move, index) => (
            <span key={`${move.san}-${index}`}>
              {index + 1}. {move.san}
            </span>
          ))
        ) : (
          <span>Moves will appear here.</span>
        )}
      </div>
      <p className="tiny-copy">
        {lastMove ? `The ${pieceNames[lastMove.piece]} moved from ${lastMove.from} to ${lastMove.to}.` : 'Choose a piece to see legal moves.'}
      </p>
    </section>
  )
}
