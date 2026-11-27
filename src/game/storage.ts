import type { DragonInstance, GameSave } from '../types'
import { createInstanceId } from './registration'

export const SAVE_KEY = 'starcrest-dragons-save-v1'
export const SAVE_VERSION = 3

function ensureInstanceIds(instances: DragonInstance[]): DragonInstance[] {
  return instances.map((dragon) => ({
    ...dragon,
    instanceId: dragon.instanceId ?? createInstanceId(),
  }))
}

export function migrateSave(parsed: Partial<GameSave> & { bench?: DragonInstance[] }): GameSave {
  const party = ensureInstanceIds(parsed.party ?? [])
  const reserve = ensureInstanceIds(parsed.reserve ?? parsed.bench ?? [])
  const caught = parsed.caught ?? []
  const captureCounts = parsed.captureCounts
    ? { ...parsed.captureCounts }
    : Object.fromEntries(caught.map((speciesId) => [speciesId, 1]))

  return {
    saveVersion: SAVE_VERSION,
    playerName: parsed.playerName ?? 'Nova',
    starterId: parsed.starterId ?? 'embbite',
    party,
    reserve,
    seen: parsed.seen ?? [],
    caught,
    captureCounts,
    badges: parsed.badges ?? [],
    gymProgress: {
      fire: parsed.gymProgress?.fire ?? (parsed.badges?.includes('Ember') ? 2 : 0),
      grass: parsed.gymProgress?.grass ?? (parsed.badges?.includes('Bloom') ? 2 : 0),
      electric: parsed.gymProgress?.electric ?? (parsed.badges?.includes('Spark') ? 2 : 0),
      cloud: parsed.gymProgress?.cloud ?? (parsed.badges?.includes('Breeze') ? 2 : 0),
      water: parsed.gymProgress?.water ?? (parsed.badges?.includes('Tide') ? 2 : 0),
      ice: parsed.gymProgress?.ice ?? (parsed.badges?.includes('Frost') ? 2 : 0),
      dark: parsed.gymProgress?.dark ?? (parsed.badges?.includes('Eclipse') ? 2 : 0),
      light: parsed.gymProgress?.light ?? (parsed.badges?.includes('Radiant') ? 2 : 0),
    },
    storyStep: parsed.storyStep ?? 0,
    darkGangDefeated: parsed.darkGangDefeated ?? false,
    currentPlanet: parsed.currentPlanet ?? 1,
    mossgroveCaptureBaseline: parsed.mossgroveCaptureBaseline
      ?? (parsed.currentPlanet === 2 ? getCapturedTotal(parsed.captureCounts, parsed.starterId) : 0),
  }
}

function getCapturedTotal(captureCounts: Partial<Record<string, number>> | undefined, starterId = 'embbite'): number {
  const total = Object.values(captureCounts ?? {}).reduce<number>((sum, count) => sum + (count ?? 0), 0)
  return Math.max(0, total - (captureCounts?.[starterId] ? 1 : 0))
}

export function loadSave(): GameSave | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY)
    if (!saved) return null
    const parsed = JSON.parse(saved) as Partial<GameSave> & { bench?: DragonInstance[] }
    if (!parsed.party || !parsed.caught) return null
    return migrateSave(parsed)
  } catch {
    console.error('Unable to load the Starcrest Dragons save.')
    return null
  }
}

export function persistSave(save: GameSave): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save))
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY)
}
