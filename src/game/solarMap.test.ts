import { describe, expect, it } from 'vitest'
import type { GameSave } from '../types'
import { getNextSolarNode, isSolarNodeUnlocked, solarNodes } from './solarMap'

const save = (overrides: Partial<GameSave> = {}): GameSave => ({
  saveVersion: 3,
  playerName: 'Nova',
  starterId: 'embbite',
  party: [],
  reserve: [],
  seen: [],
  caught: [],
  captureCounts: {},
  badges: [],
  gymProgress: { fire: 0, grass: 0, electric: 0, cloud: 0, water: 0, ice: 0, dark: 0, light: 0 },
  storyStep: 0,
  darkGangDefeated: false,
  currentPlanet: 0,
  mossgroveCaptureBaseline: 0,
  ...overrides,
})

describe('Solar Map state', () => {
  it('keeps Willowvale and Emberfall available from the start', () => {
    expect(isSolarNodeUnlocked(solarNodes.find((node) => node.id === 'willowvale')!, save())).toBe(true)
    expect(isSolarNodeUnlocked(solarNodes.find((node) => node.id === 'emberfall')!, save())).toBe(true)
  })

  it('requires the relevant badge for later planets', () => {
    const mossgrove = solarNodes.find((node) => node.id === 'mossgrove')!
    expect(isSolarNodeUnlocked(mossgrove, save())).toBe(false)
    expect(isSolarNodeUnlocked(mossgrove, save({ badges: ['Ember'] }))).toBe(true)
  })

  it('keeps Luminara sealed until Eclipse and Jake are both complete', () => {
    const luminara = solarNodes.find((node) => node.id === 'luminara')!
    expect(isSolarNodeUnlocked(luminara, save({ badges: ['Eclipse'] }))).toBe(false)
    expect(isSolarNodeUnlocked(luminara, save({ badges: ['Eclipse'], darkGangDefeated: true }))).toBe(true)
  })

  it('finds the next unlocked destination even after visiting an earlier planet', () => {
    const currentSave = save({ currentPlanet: 1, badges: ['Ember', 'Bloom', 'Spark'] })
    expect(getNextSolarNode(currentSave)?.id).toBe('mossgrove')
  })
})
