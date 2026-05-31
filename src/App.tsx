import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Move, Square } from 'chess.js'
import { FlipHorizontal2, HelpCircle, Lightbulb, RotateCcw, Undo2 } from 'lucide-react'
import './App.css'
import { ChessBoard } from './components/ChessBoard'
import { CoachOwl } from './components/CoachOwl'
import { GameStatus } from './components/GameStatus'
import { ModeSelector } from './components/ModeSelector'
import { MoveHistory } from './components/MoveHistory'
import { PieceLesson } from './components/PieceLesson'
import { PracticePuzzle } from './components/PracticePuzzle'
import { PromotionDialog } from './components/PromotionDialog'
import { lessons, pieceTips } from './data/lessons'
import { puzzles } from './data/puzzles'
import { chooseBotMove, hintMoves } from './utils/bot'
import { explainMove, isPromotionMove, makeGame, type PromotionChoice } from './utils/chessHelpers'

export type Mode = 'learn' | 'practice' | 'bot' | 'two'

const startFen = 'start'

type PendingPromotion = {
  from: Square
  to: Square
}

function App() {
  const [mode, setMode] = useState<Mode>('learn')
  const [fen, setFen] = useState(startFen)
  const [pastFens, setPastFens] = useState<string[]>([])
  const [moves, setMoves] = useState<Move[]>([])
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [coachMessage, setCoachMessage] = useState('Welcome, Iris! Pick a piece and I will show you where it can go.')
  const [orientation, setOrientation] = useState<'white' | 'black'>('white')
  const [beginnerHelp, setBeginnerHelp] = useState(true)
  const [showCoordinates, setShowCoordinates] = useState(true)
  const [autoFlip, setAutoFlip] = useState(false)
  const [autoPromote, setAutoPromote] = useState(false)
  const [humanColor, setHumanColor] = useState<'w' | 'b'>('w')
  const [whiteName, setWhiteName] = useState('Iris')
  const [blackName, setBlackName] = useState('Friend')
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null)
  const [activePuzzle, setActivePuzzle] = useState(0)
  const [hintVisible, setHintVisible] = useState(false)
  const [puzzleSolved, setPuzzleSolved] = useState(false)

  const game = useMemo(() => makeGame(fen), [fen])
  const lastMove = moves.at(-1) ?? null
  const isBotGame = mode === 'bot'
  const botColor = humanColor === 'w' ? 'b' : 'w'
  const isBotTurn = isBotGame && game.turn() === botColor && !game.isGameOver()

  const resetGame = (nextFen = startFen) => {
    setFen(nextFen)
    setPastFens([])
    setMoves([])
    setSelectedSquare(null)
    setPendingPromotion(null)
    setPuzzleSolved(false)
    setHintVisible(false)
    setCoachMessage('Fresh board, fresh ideas. Have fun!')
  }

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode)
    if (nextMode === 'practice') {
      resetGame(puzzles[activePuzzle].fen)
      setCoachMessage('Practice puzzles are tiny chess adventures. Try the goal, then ask for a hint if you want one.')
    } else {
      resetGame(startFen)
      setCoachMessage(nextMode === 'learn' ? 'Choose a lesson card and click the glowing squares.' : 'I will keep the game gentle and cheerful.')
    }
  }

  const recordMove = useCallback((move: Move, fenBefore: string, fenAfter: string) => {
    setFen(fenAfter)
    setPastFens((old) => [...old, fenBefore])
    setMoves((old) => [...old, move])
    setSelectedSquare(null)
    setCoachMessage(explainMove(move, fenAfter))
    if (mode === 'two' && autoFlip) setOrientation((old) => (old === 'white' ? 'black' : 'white'))
  }, [autoFlip, mode])

  const applyMove = (from: Square, to: Square, promotion?: PromotionChoice) => {
    const copy = makeGame(fen)
    const move = copy.move({ from, to, promotion })
    if (!move) return false
    recordMove(move, fen, copy.fen())
    if (mode === 'practice') {
      const attempt = `${move.from}${move.to}${move.promotion ?? ''}`
      const solved = puzzles[activePuzzle].solutions.includes(attempt)
      setPuzzleSolved(solved)
      setCoachMessage(solved ? 'Beautiful work! You solved the puzzle.' : 'Great try! This puzzle has a special target, so try again or ask for a hint.')
    }
    return true
  }

  const tryMove = (from: Square, to: Square) => {
    if (isBotTurn) {
      setCoachMessage('Coach Owl is thinking for a moment.')
      return false
    }
    if (isPromotionMove(fen, from, to) && !autoPromote) {
      setPendingPromotion({ from, to })
      return false
    }
    const ok = applyMove(from, to, isPromotionMove(fen, from, to) ? 'q' : undefined)
    if (!ok) setCoachMessage('That piece moves a different way.')
    return ok
  }

  const onSquareClick = (square: Square) => {
    const piece = game.get(square)
    if (!selectedSquare) {
      if (!piece) return
      if (piece.color !== game.turn()) {
        setCoachMessage('It is not that side’s turn.')
        return
      }
      if (isBotTurn) return
      setSelectedSquare(square)
      setCoachMessage(pieceTips[piece.type])
      return
    }
    if (selectedSquare === square) {
      setSelectedSquare(null)
      return
    }
    const moved = tryMove(selectedSquare, square)
    if (!moved && piece?.color === game.turn()) {
      setSelectedSquare(square)
      setCoachMessage(pieceTips[piece.type])
    }
  }

  const undo = () => {
    if (pastFens.length === 0) return
    const steps = mode === 'bot' && pastFens.length >= 2 ? 2 : 1
    const nextPast = pastFens.slice(0, -steps)
    setFen(pastFens[pastFens.length - steps])
    setPastFens(nextPast)
    setMoves((old) => old.slice(0, -steps))
    setCoachMessage('No worries. Let’s try that moment again.')
  }

  const showHint = () => {
    if (mode === 'practice') {
      setHintVisible(true)
      setCoachMessage(puzzles[activePuzzle].hint)
      return
    }
    const hints = hintMoves(fen)
    setCoachMessage(
      hints.length
        ? `Try ${hints.map(({ move, reason }) => `${move.san} because it ${reason}`).join(', ')}.`
        : 'There are no legal moves right now.',
    )
  }

  const choosePuzzle = (index: number) => {
    setActivePuzzle(index)
    setMode('practice')
    resetGame(puzzles[index].fen)
  }

  useEffect(() => {
    if (!isBotTurn) return
    const timer = window.setTimeout(() => {
      const move = chooseBotMove(fen)
      if (!move) return
      const copy = makeGame(fen)
      const made = copy.move(move)
      if (made) {
        recordMove(made, fen, copy.fen())
        setCoachMessage(`I moved ${made.san}. ${explainMove(made, copy.fen())}`)
      }
    }, 650)
    return () => window.clearTimeout(timer)
  }, [fen, isBotTurn, recordMove])

  const modeLabel = mode === 'bot' ? 'Iris vs Coach Owl Bot' : mode === 'two' ? 'Iris vs Friend' : mode === 'practice' ? 'Practice Mode' : 'Learn Mode'
  const displayWhite = mode === 'two' ? whiteName : mode === 'bot' && humanColor === 'b' ? 'Coach Owl' : 'Iris'
  const displayBlack = mode === 'two' ? blackName : mode === 'bot' ? (humanColor === 'b' ? 'Iris' : 'Coach Owl') : 'Black'

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Iris Chess Garden</h1>
          <p>Gentle chess learning with Coach Owl</p>
        </div>
        <ModeSelector mode={mode} onChange={switchMode} />
      </header>

      {mode === 'learn' ? (
        <section className="learn-layout">
          <CoachOwl message={coachMessage} />
          <div className="lesson-grid">
            {lessons.map((lesson) => (
              <PieceLesson key={lesson.piece} lesson={lesson} />
            ))}
          </div>
        </section>
      ) : (
        <section className="play-layout">
          <div className="left-column">
            {mode === 'practice' && (
              <div className="puzzle-strip">
                {puzzles.map((puzzle, index) => (
                  <button key={puzzle.id} className={activePuzzle === index ? 'active' : ''} onClick={() => choosePuzzle(index)}>
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
            <ChessBoard
              fen={fen}
              selectedSquare={selectedSquare}
              onSquareClick={onSquareClick}
              onPieceDrop={tryMove}
              orientation={orientation}
              showCoordinates={showCoordinates}
              beginnerHelp={beginnerHelp}
            />
            <div className="controls-row">
              <button className="action-button" onClick={undo}>
                <Undo2 size={18} />
                Undo
              </button>
              <button className="action-button" onClick={() => resetGame(mode === 'practice' ? puzzles[activePuzzle].fen : startFen)}>
                <RotateCcw size={18} />
                Restart
              </button>
              <button className="action-button" onClick={() => setOrientation((old) => (old === 'white' ? 'black' : 'white'))}>
                <FlipHorizontal2 size={18} />
                Flip
              </button>
              <button className="action-button primary" onClick={showHint}>
                <Lightbulb size={18} />
                Hint
              </button>
            </div>
          </div>

          <aside className="right-column">
            <CoachOwl message={coachMessage} />
            {mode === 'practice' && (
              <PracticePuzzle
                puzzle={puzzles[activePuzzle]}
                solved={puzzleSolved}
                hintVisible={hintVisible}
                onHint={showHint}
                onReset={() => resetGame(puzzles[activePuzzle].fen)}
              />
            )}
            {mode === 'bot' && (
              <section className="panel settings-panel">
                <div className="section-title">Bot settings</div>
                <div className="segmented">
                  <button className={humanColor === 'w' ? 'active' : ''} onClick={() => { setHumanColor('w'); resetGame(startFen); setOrientation('white') }}>
                    Iris plays White
                  </button>
                  <button className={humanColor === 'b' ? 'active' : ''} onClick={() => { setHumanColor('b'); resetGame(startFen); setOrientation('black') }}>
                    Iris plays Black
                  </button>
                </div>
              </section>
            )}
            {mode === 'two' && (
              <section className="panel settings-panel">
                <div className="section-title">Players</div>
                <label>
                  White player
                  <input value={whiteName} onChange={(event) => setWhiteName(event.target.value)} />
                </label>
                <label>
                  Black player
                  <input value={blackName} onChange={(event) => setBlackName(event.target.value)} />
                </label>
                <label className="toggle-line">
                  <input type="checkbox" checked={autoFlip} onChange={(event) => setAutoFlip(event.target.checked)} />
                  Auto-flip after each move
                </label>
              </section>
            )}
            <section className="panel settings-panel">
              <div className="section-title">
                <HelpCircle size={16} />
                Helpers
              </div>
              <label className="toggle-line">
                <input type="checkbox" checked={beginnerHelp} onChange={(event) => setBeginnerHelp(event.target.checked)} />
                Beginner help
              </label>
              <label className="toggle-line">
                <input type="checkbox" checked={showCoordinates} onChange={(event) => setShowCoordinates(event.target.checked)} />
                Board coordinates
              </label>
              <label className="toggle-line">
                <input type="checkbox" checked={autoPromote} onChange={(event) => setAutoPromote(event.target.checked)} />
                Auto-promote to queen
              </label>
            </section>
            <GameStatus modeLabel={modeLabel} fen={fen} moves={moves} whiteName={displayWhite} blackName={displayBlack} lastMove={lastMove} />
            <MoveHistory moves={moves} />
          </aside>
        </section>
      )}

      {pendingPromotion && (
        <PromotionDialog
          onChoose={(piece) => {
            applyMove(pendingPromotion.from, pendingPromotion.to, piece)
            setPendingPromotion(null)
          }}
        />
      )}
    </main>
  )
}

export default App
