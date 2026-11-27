import { describe, expect, it } from 'vitest'
import { createDragon } from '../data'
import type { GameSave } from '../types'
import {
  addCapturedInstance,
  isCaught,
  isInReserve,
  isInParty,
  isSeen,
  moveInstance,
  renameInstance,
  registerEvolution,
  registerSeen,
} from './registration'
import { migrateSave } from './storage'

function makeSave(overrides: Partial<GameSave> = {}): GameSave {
  const embbite = createDragon('embbite', 5)
  return {
    saveVersion: 3,
    playerName: 'Nova',
    starterId: 'embbite',
    party: [embbite],
    reserve: [],
    seen: ['embbite'],
    caught: ['embbite'],
    captureCounts: { embbite: 1 },
    badges: [],
    gymProgress: { fire: 0, grass: 0 },
    storyStep: 0,
    darkGangDefeated: false,
    currentPlanet: 1,
    mossgroveCaptureBaseline: 0,
    ...overrides,
  }
}

describe('Pokédex registration', () => {
  it('keeps Seen and Caught as separate species flags', () => {
    const save = registerSeen(makeSave({ seen: [], caught: [] }), 'shadee')
    expect(isSeen(save, 'shadee')).toBe(true)
    expect(isCaught(save, 'shadee')).toBe(false)
  })

  it('preserves pre-evolution registration and registers the evolved species', () => {
    const save = registerEvolution(makeSave(), 'embbite', 'flamico')
    expect(isCaught(save, 'embbite')).toBe(true)
    expect(isCaught(save, 'flamico')).toBe(true)
  })

  it('adds a successful full-party capture to Reserve', () => {
    const party = [
      createDragon('embbite', 5),
      createDragon('puddlefin', 5),
      createDragon('spriglet', 5),
      createDragon('zappup', 5),
    ]
    const save = makeSave({ party })
    const captured = createDragon('shadee', 5)
    const nextSave = addCapturedInstance(save, captured)
    expect(nextSave.party).toHaveLength(4)
    expect(nextSave.reserve).toContainEqual(captured)
    expect(isCaught(nextSave, 'shadee')).toBe(true)
    expect(nextSave.captureCounts.shadee).toBe(1)
  })

  it('moves an instance between Party and Reserve without changing its ID', () => {
    const ember = createDragon('embbite', 5)
    const save = makeSave({ party: [ember], reserve: [] })
    const reserved = moveInstance(save, ember.instanceId, 'reserve')
    expect(isInParty(reserved, 'embbite')).toBe(false)
    expect(isInReserve(reserved, 'embbite')).toBe(true)
    expect(reserved.reserve[0].instanceId).toBe(ember.instanceId)

    const returned = moveInstance(reserved, ember.instanceId, 'party')
    expect(isInParty(returned, 'embbite')).toBe(true)
    expect(returned.party[0].instanceId).toBe(ember.instanceId)
  })

  it('renames one individual without affecting other copies', () => {
    const first = createDragon('embbite', 5)
    const second = createDragon('embbite', 6)
    const save = makeSave({ party: [first, second] })
    const renamed = renameInstance(save, second.instanceId, 'Sparky')
    expect(renamed.party[0].nickname).toBeUndefined()
    expect(renamed.party[1].nickname).toBe('Sparky')
  })
})

describe('save migration', () => {
  it('adds saveVersion, capture counts, reserve, and instance IDs', () => {
    const legacyReserveDragon = createDragon('puddlefin', 5)
    const migrated = migrateSave({
      playerName: 'Nova',
      party: [{ ...createDragon('embbite', 5), instanceId: undefined as unknown as string }],
      bench: [legacyReserveDragon],
      seen: ['embbite'],
      caught: ['embbite'],
    } as Partial<GameSave> & { bench: ReturnType<typeof createDragon>[] })

    expect(migrated.saveVersion).toBe(3)
    expect(migrated.reserve).toEqual([legacyReserveDragon])
    expect(migrated.captureCounts.embbite).toBe(1)
    expect(migrated.gymProgress).toEqual({ fire: 0, grass: 0 })
    expect(migrated.party[0].instanceId).toBeTruthy()
  })
})

