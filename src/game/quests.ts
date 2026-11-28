import type { GameSave } from '../types'

export const questSteps = [
  'Begin on Emberfall by catching your first wild dragon',
  'Challenge Sol for the Ember Badge',
  'Travel to Mossgrove',
  'Catch more dragons on your journey',
  'Challenge Moss for the Bloom Badge',
  'Travel to Voltspire',
  'Explore Voltspire and prepare your team',
  'Challenge Volt for the Spark Badge',
  'Travel to Cloudrest',
  'Explore Cloudrest and prepare your team',
  'Challenge Cirrus for the Breeze Badge',
  'Travel to Tidehaven',
  'Explore Tidehaven and prepare your team',
  'Challenge Marina for the Tide Badge',
  'Travel to Frostveil',
  'Explore Frostveil and prepare your team',
  'Challenge Glacia for the Frost Badge',
  'Travel to Umbralis',
  'Explore Umbralis and prepare your team',
  'Challenge Nyx for the Eclipse Badge',
  'Defeat Jake at the Dark Gang Fortress',
  'Travel to Luminara',
  'Explore Luminara and prepare your team',
  'Challenge Auriel for the Radiant Badge',
  'Capture the four legendary Dragons',
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
  if (completed >= 5 && (save.storyStep >= 6 || save.currentPlanet === 3)) completed = 6
  if (completed >= 6 && save.gymProgress.electric >= 2) completed = 7
  if (completed >= 7 && save.badges.includes('Spark')) completed = 8
  if (completed >= 8 && (save.storyStep >= 9 || save.currentPlanet === 4)) completed = 9
  if (completed >= 9 && save.gymProgress.cloud >= 2) completed = 10
  if (completed >= 10 && save.badges.includes('Breeze')) completed = 11
  if (completed >= 11 && (save.storyStep >= 12 || save.currentPlanet === 5)) completed = 12
  if (completed >= 12 && save.gymProgress.water >= 2) completed = 13
  if (completed >= 13 && save.badges.includes('Tide')) completed = 14
  if (completed >= 14 && (save.storyStep >= 15 || save.currentPlanet === 6)) completed = 15
  if (completed >= 15 && save.gymProgress.ice >= 2) completed = 16
  if (completed >= 16 && save.badges.includes('Frost')) completed = 17
  if (completed >= 17 && (save.storyStep >= 18 || save.currentPlanet === 7)) completed = 18
  if (completed >= 18 && save.gymProgress.dark >= 2) completed = 19
  if (completed >= 19 && save.badges.includes('Eclipse')) completed = 20
  if (completed >= 20 && save.darkGangDefeated) completed = 21
  if (completed >= 21 && (save.storyStep >= 21 || save.currentPlanet === 8)) completed = 22
  if (completed >= 22 && save.gymProgress.light >= 2) completed = 23
  if (completed >= 23 && save.badges.includes('Radiant')) completed = 24
  if (completed >= 24 && ['vihaarion', 'hudsorion', 'phurion', 'diegorion'].every((id) => save.caught.includes(id))) completed = 25

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
