import type { GameSave } from '../types'
import { getQuestObjective } from '../game/quests'

export function QuestCard({ save }: { save: GameSave }) {
  const objective = getQuestObjective(save)
  const progress = (objective.completed / objective.total) * 100
  const chapterTitle = objective.finished
    ? 'Journey complete'
    : save.badges.includes('Eclipse') && !save.darkGangDefeated
      ? 'Umbralis · Dark Gang'
      : save.darkGangDefeated && save.currentPlanet === 7
        ? 'Umbralis cleared'
        : `Next objective · ${objective.completed + 1}/${objective.total}`

  return (
    <aside className="quest-card">
      <p>{chapterTitle}</p>
      <strong>{objective.finished ? 'Your current journey is complete!' : objective.title}</strong>
      <div className="quest-progress" aria-label={`${objective.completed} of ${objective.total} objectives complete`}>
        <i style={{ width: `${progress}%` }} />
      </div>
    </aside>
  )
}
