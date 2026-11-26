import { describe, expect, it } from 'vitest'
import type { GameSave } from '../types'
import { dragonSpecies } from '../data'
import { filterDexSpecies, getEvolutionChain } from './dex'

function saveWithStates(): GameSave {
  return {
    saveVersion: 3,
    playerName: 'Nova',
    starterId: 'embbite',
    party: [],
    reserve: [],
    seen: ['embbite', 'flamico', 'shadee'],
    caught: ['embbite'],
    captureCounts: { embbite: 1 },
    badges: [],
    storyStep: 0,
    darkGangDefeated: false,
    currentPlanet: 1,
    mossgroveCaptureBaseline: 0,
  }
}

describe('Dex filters', () => {
  it('does not return unknown species', () => {
    const results = filterDexSpecies(saveWithStates(), { type: 'all', status: 'all' })
    expect(results.map((species) => species.id)).toEqual(['embbite', 'flamico', 'shadee'])
  })

  it('filters Seen-only separately from Caught', () => {
    const seenOnly = filterDexSpecies(saveWithStates(), { type: 'all', status: 'seen' })
    const caught = filterDexSpecies(saveWithStates(), { type: 'all', status: 'caught' })
    expect(seenOnly.map((species) => species.id)).toEqual(['flamico', 'shadee'])
    expect(caught.map((species) => species.id)).toEqual(['embbite'])
  })

  it('builds a complete evolution line from any stage', () => {
    expect(getEvolutionChain('flamico').map((species) => species.id)).toEqual(['embbite', 'flamico', 'pyravolt'])
  })

  it('contains 48 species and eight complete three-stage batch lines', () => {
    expect(dragonSpecies).toHaveLength(48)
    const batch = dragonSpecies.filter((species) => species.dexNo >= 25 && species.dexNo <= 48)
    expect(batch.map((species) => species.dexNo)).toEqual(
      Array.from({ length: 24 }, (_, index) => index + 25),
    )
    expect(batch.map((species) => species.stage)).toEqual([
      1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3,
      1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3,
    ])
    expect(batch.map((species) => species.type)).toEqual([
      'fire', 'fire', 'fire',
      'water', 'water', 'water',
      'grass', 'grass', 'grass',
      'ice', 'ice', 'ice',
      'electric', 'electric', 'electric',
      'light', 'light', 'light',
      'cloud', 'cloud', 'cloud',
      'dark', 'dark', 'dark',
    ])
    expect(getEvolutionChain('cindrake').map((species) => species.id)).toEqual(['cindrake', 'pyrocub', 'ashrex'])
    expect(getEvolutionChain('voidscale').map((species) => species.id)).toEqual(['dusklit', 'nightfang', 'voidscale'])
  })
})
