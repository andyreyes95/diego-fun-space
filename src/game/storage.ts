import type { DragonInstance, GameSave } from '../types'
import { createDragon, dragonSpecies } from '../data'
import { createInstanceId } from './registration'

export const SAVE_KEY = 'starcrest-dragons-save-v1'
export const SAVE_VERSION = 3

const validPlanetIds = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const

function ensureInstanceIds(instances: DragonInstance[]): DragonInstance[] {
  return instances.map((dragon) => ({
    ...dragon,
    instanceId: dragon.instanceId ?? createInstanceId(),
  }))
}

export function migrateSave(parsed: Partial<GameSave> & { bench?: DragonInstance[] }): GameSave {
  const validSpeciesIds = new Set(dragonSpecies.map((species) => species.id))
  const party = ensureInstanceIds(parsed.party ?? []).filter((dragon) => validSpeciesIds.has(dragon.speciesId))
  const reserve = ensureInstanceIds(parsed.reserve ?? parsed.bench ?? []).filter((dragon) => validSpeciesIds.has(dragon.speciesId))
  const starterId = validSpeciesIds.has(parsed.starterId ?? '') ? parsed.starterId! : 'embbite'
  if (party.length === 0) {
    party.push(reserve.shift() ?? createDragon(starterId, 5))
  }
  const caught = (parsed.caught ?? []).filter((speciesId) => validSpeciesIds.has(speciesId))
  const captureCounts = parsed.captureCounts
    ? Object.fromEntries(
      Object.entries(parsed.captureCounts).filter(([speciesId]) => validSpeciesIds.has(speciesId)),
    )
    : Object.fromEntries(caught.map((speciesId) => [speciesId, 1]))

  return {
    saveVersion: SAVE_VERSION,
    playerName: parsed.playerName ?? 'Nova',
    starterId,
    party,
    reserve,
    seen: (parsed.seen ?? []).filter((speciesId) => validSpeciesIds.has(speciesId)),
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
    currentPlanet: validPlanetIds.includes(parsed.currentPlanet as typeof validPlanetIds[number])
      ? parsed.currentPlanet!
      : 1,
    mossgroveCaptureBaseline: parsed.mossgroveCaptureBaseline
      ?? (parsed.currentPlanet === 2 ? getCapturedTotal(parsed.captureCounts, parsed.starterId) : 0),
    lightEncountersCaught: parsed.lightEncountersCaught?.filter((planet) =>
      planet === 1 || planet === 3 || planet === 5 || planet === 7,
    ) ?? caught
      .filter((speciesId) => ['lumopod', 'gleamlet', 'prismglow', 'haloflare'].includes(speciesId))
      .map((speciesId) => ({ lumopod: 1, gleamlet: 3, prismglow: 5, haloflare: 7 })[speciesId]!),
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
