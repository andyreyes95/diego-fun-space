import type { GameSave } from '../types'

export const questSteps = [
  'Catch your first wild dragon',
  'Challenge Sol for the Ember Badge',
  'Travel to Mossgrove',
  'Catch more dragons on your journey',
  'Challenge Moss for the Bloom Badge',
] as const

export interface QuestObjective {
  title: string
  completed: number
  total: number
  finished: boolean
}

export function getWildCaptureCount(save: GameSave): number {
  const totalCaptures = Object.values(save.captureCounts).reduce<number>(
    (total, count) => total + (count ?? 0),
    0,
  )
  return Math.max(0, totalCaptures - (save.captureCounts[save.starterId] ? 1 : 0))
}

export function getQuestObjective(save: GameSave): QuestObjective {
  const wildCaptures = getWildCaptureCount(save)
  let completed = 0

  if (wildCaptures >= 1) completed = 1
  if (completed >= 1 && save.badges.includes('Ember')) completed = 2
  if (completed >= 2 && (save.storyStep >= 3 || save.currentPlanet === 2)) completed = 3
  if (completed >= 3 && wildCaptures > save.mossgroveCaptureBaseline) completed = 4
  if (completed >= 4 && save.badges.includes('Bloom')) completed = 5

  return {
    title: questSteps[Math.min(completed, questSteps.length - 1)],
    completed,
    total: questSteps.length,
    finished: completed === questSteps.length,
  }
}

export function advanceStoryStep(save: GameSave, step: number): GameSave {
  return save.storyStep >= step ? save : { ...save, storyStep: step }
}
