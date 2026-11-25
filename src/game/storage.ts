import type { GameSave } from '../types'

export const SAVE_KEY = 'starcrest-dragons-save-v1'

export function loadSave(): GameSave | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY)
    if (!saved) return null
    const parsed = JSON.parse(saved) as Partial<GameSave>
    if (!parsed.party || !parsed.caught) return null
    return {
      playerName: parsed.playerName ?? 'Nova',
      starterId: parsed.starterId ?? 'embbite',
      party: parsed.party,
      bench: parsed.bench ?? [],
      seen: parsed.seen ?? [],
      caught: parsed.caught,
      badges: parsed.badges ?? [],
      storyStep: parsed.storyStep ?? 0,
      darkGangDefeated: parsed.darkGangDefeated ?? false,
      currentPlanet: parsed.currentPlanet ?? 1,
    }
  } catch {
    return null
  }
}
