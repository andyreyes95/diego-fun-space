import { describe, expect, it } from 'vitest'
import type { DragonInstance, GameSave } from '../types'
import { dragonSpecies } from '../data'
import { filterDexSpecies, getEvolutionChain } from './dex'
import { sortDexSpecies, sortTeamCopies } from './sorting'

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
    gymProgress: { fire: 0, grass: 0, electric: 0, cloud: 0, water: 0, ice: 0, dark: 0 },
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

  it('contains 120 species and complete three-stage batch lines', () => {
    expect(dragonSpecies).toHaveLength(120)
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

  it('orders all 72 new species as 24 complete type lines', () => {
    const batch = dragonSpecies.filter((species) => species.dexNo >= 49)
    const typeCycle = [
      'fire', 'fire', 'fire',
      'water', 'water', 'water',
      'grass', 'grass', 'grass',
      'ice', 'ice', 'ice',
      'electric', 'electric', 'electric',
      'light', 'light', 'light',
      'cloud', 'cloud', 'cloud',
      'dark', 'dark', 'dark',
    ]
    expect(batch.map((species) => species.dexNo)).toEqual(
      Array.from({ length: 72 }, (_, index) => index + 49),
    )
    expect(batch.map((species) => species.stage)).toEqual(
      Array.from({ length: 24 }, () => [1, 2, 3]).flat(),
    )
    expect(batch.map((species) => species.type)).toEqual(
      Array.from({ length: 3 }, () => typeCycle).flat(),
    )
    expect(new Set(dragonSpecies.map((species) => species.id)).size).toBe(120)
    expect(batch.every((species) => !species.evolvesTo || dragonSpecies.some((next) => next.id === species.evolvesTo))).toBe(true)
  })
})

describe('Tile sorting', () => {
  it('sorts Dex species by name in either direction', () => {
    const species = [
      dragonSpecies.find((entry) => entry.id === 'pyravolt')!,
      dragonSpecies.find((entry) => entry.id === 'embbite')!,
      dragonSpecies.find((entry) => entry.id === 'puddlefin')!,
    ]

    expect(sortDexSpecies(species, 'name').map((entry) => entry.id)).toEqual([
      'embbite',
      'puddlefin',
      'pyravolt',
    ])
    expect(sortDexSpecies(species, 'name', 'desc').map((entry) => entry.id)).toEqual([
      'pyravolt',
      'puddlefin',
      'embbite',
    ])
  })

  it('sorts team copies by level and falls back to Dex number', () => {
    const makeDragon = (instanceId: string, speciesId: string, level: number): DragonInstance => ({
      instanceId,
      speciesId,
      level,
      xp: 0,
      hp: 10,
      maxHp: 10,
      attack: 5,
      defense: 5,
      moves: [],
    })
    const copies = [
      { dragon: makeDragon('a', 'pyravolt', 18), location: 'Reserve' as const },
      { dragon: makeDragon('b', 'embbite', 5), location: 'Party' as const },
      { dragon: makeDragon('c', 'flamico', 12), location: 'Reserve' as const },
    ]

    expect(sortTeamCopies(copies, 'level').map((copy) => copy.dragon.instanceId)).toEqual(['b', 'c', 'a'])
    expect(sortTeamCopies(copies, 'level', 'desc').map((copy) => copy.dragon.instanceId)).toEqual(['a', 'c', 'b'])
  })
})
