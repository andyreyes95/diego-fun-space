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
    gymProgress: { fire: 0, grass: 0, electric: 0, cloud: 0, water: 0, ice: 0, dark: 0, light: 0 },
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

  it('contains 117 species and complete three-stage batch lines', () => {
    expect(dragonSpecies).toHaveLength(117)
    expect(dragonSpecies.map((species) => species.stage)).toEqual(
      Array.from({ length: 39 }, () => [1, 2, 3]).flat(),
    )
    const storyTypeOrder = ['fire', 'grass', 'electric', 'cloud', 'water', 'ice', 'dark', 'light']
    const expectedFamilyTypes = [
      ...Array.from({ length: 4 }, () => storyTypeOrder).flat(),
      ...storyTypeOrder.slice(0, 7),
    ]
    expect(
      dragonSpecies.filter((species) => species.stage === 1).map((species) => species.type),
    ).toEqual(expectedFamilyTypes)
    expect(
      Array.from({ length: 39 }, (_, index) =>
        new Set(dragonSpecies.slice(index * 3, index * 3 + 3).map((species) => species.type)).size,
      ),
    ).toEqual(Array(39).fill(1))
    expect(getEvolutionChain('cindrake').map((species) => species.id)).toEqual(['cindrake', 'pyrocub', 'ashrex'])
    expect(getEvolutionChain('voidscale').map((species) => species.id)).toEqual(['dusklit', 'nightfang', 'voidscale'])
  })

  it('keeps the reindexed Dex contiguous and evolution references valid', () => {
    expect(new Set(dragonSpecies.map((species) => species.id)).size).toBe(117)
    expect(dragonSpecies.map((species) => species.dexNo)).toEqual(
      Array.from({ length: 117 }, (_, index) => index + 1),
    )
    expect(dragonSpecies.map((species) => species.id)).not.toEqual(
      expect.arrayContaining(['starwhisk', 'cosmowhisper', 'celestiglow']),
    )
    expect(dragonSpecies.every((species) =>
      !species.evolvesTo || dragonSpecies.some((next) => next.id === species.evolvesTo),
    )).toBe(true)
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
