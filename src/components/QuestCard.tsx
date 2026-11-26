import type { GameSave } from '../types'
import { getQuestObjective } from '../game/quests'

export function QuestCard({ save }: { save: GameSave }) {
  const objective = getQuestObjective(save)
  const progress = (objective.completed / objective.total) * 100

  return (
    <aside className="quest-card">
      <p>{objective.finished ? 'Quest complete' : `Next objective · ${objective.completed + 1}/${objective.total}`}</p>
      <strong>{objective.finished ? 'Earned both gym badges!' : objective.title}</strong>
      <div className="quest-progress" aria-label={`${objective.completed} of ${objective.total} objectives complete`}>
        <i style={{ width: `${progress}%` }} />
      </div>
    </aside>
  )
}
