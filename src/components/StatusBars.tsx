export function HealthBar({ current, max }: { current: number; max: number }) {
  const percent = Math.max(0, Math.min(100, (current / max) * 100))
  return (
    <div>
      <small className="battle-hp">{current} / {max} HP</small>
      <div className="health-track" aria-label={`${current} of ${max} health`}>
        <div className={percent > 50 ? 'health-fill' : percent > 25 ? 'health-fill warning' : 'health-fill danger'} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export function XpBar({ xp, level }: { xp: number; level: number }) {
  const xpNeeded = level * 10
  const percent = Math.max(0, Math.min(100, (xp / xpNeeded) * 100))
  return (
    <div className="xp-meter">
      <small className="battle-xp"> {xp} / {xpNeeded} XP</small>
      <div className="xp-track" aria-label={`${xp} of ${xpNeeded} XP to level ${level + 1}`}>
        <div className="xp-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
