import { BookOpen, Bot, Puzzle, Users } from 'lucide-react'
import type { Mode } from '../App'

const modes = [
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'practice', label: 'Practice', icon: Puzzle },
  { id: 'bot', label: 'Play Bot', icon: Bot },
  { id: 'two', label: 'Two Player', icon: Users },
] as const

export function ModeSelector({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  return (
    <nav className="mode-selector" aria-label="Game modes">
      {modes.map(({ id, label, icon: Icon }) => (
        <button key={id} className={mode === id ? 'active' : ''} onClick={() => onChange(id)}>
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
