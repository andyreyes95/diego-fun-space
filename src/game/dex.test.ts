import { describe, expect, it } from 'vitest'
import type { GameSave } from '../types'
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
})
