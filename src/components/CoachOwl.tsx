import { Sparkles } from 'lucide-react'

export function CoachOwl({ message }: { message: string }) {
  return (
    <section className="coach-card" aria-label="Coach Owl tip">
      <div className="owl-avatar" aria-hidden="true">
        <div className="ears" />
        <div className="eyes">
          <span />
          <span />
        </div>
        <div className="beak" />
      </div>
      <div>
        <div className="section-title">
          <Sparkles size={16} />
          Coach Owl
        </div>
        <p>{message}</p>
      </div>
    </section>
  )
}
