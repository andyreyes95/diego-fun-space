import { describe, expect, it } from 'vitest'
import type { GameSave } from '../types'
import { AMBUSH_ESCAPE_COST, captureOrbProgression, captureOrbs, consumeOrb, getBattleReward, getGymEntryCost, getHealingCost, getSelectedHealingCost, HEALING_COST_PER_DRAGON, normalizeCoins, PORTAL_COST, purchaseOrb } from './economy'

const save = (coins = 100): GameSave => ({
  saveVersion: 4,
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
  coins,
  inventory: { sparkOrb: 0, moonOrb: 0, novaOrb: 0 },
})

describe('currency and orb economy', () => {
  it('scales rewards by battle importance', () => {
    expect(getBattleReward('wild')).toBe(0)
    expect(getBattleReward('lightEncounter')).toBe(0)
    expect(getBattleReward('fireGym')).toBe(30)
    expect(getBattleReward('fireGym', true)).toBe(60)
    expect(getBattleReward('gang')).toBe(30)
    expect(getBattleReward('jakeBoss')).toBe(100)
  })

  it('uses the planned doubling-price progression', () => {
    expect(captureOrbs.map((orb) => orb.price)).toEqual([10, 30, 50])
  })

  it('charges healing and gym entry without charging other battles', () => {
    expect(HEALING_COST_PER_DRAGON).toBe(10)
    expect(getHealingCost({ party: new Array(3).fill({}) as GameSave['party'] })).toBe(30)
    expect(getSelectedHealingCost(['a', 'c'])).toBe(20)
    expect(getGymEntryCost('fireGym')).toBe(20)
    expect(getGymEntryCost('gang')).toBe(0)
    expect(getGymEntryCost('jakeBoss')).toBe(0)
    expect(PORTAL_COST).toBe(20)
    expect(AMBUSH_ESCAPE_COST).toBe(10)
  })

  it('provides standard, intermediate, and advanced orb bonuses', () => {
    expect(captureOrbs.map((orb) => Math.round((orb.multiplier - 1) * 100))).toEqual([0, 10, 20])
  })

  it('stores the full orb progression while offering only its first three tiers', () => {
    expect(captureOrbProgression).toHaveLength(17)
    expect(captureOrbs.map((orb) => orb.name)).toEqual(['Dust Orb', 'Spark Orb', 'Ember Orb'])
  })

  it('normalizes malformed currency balances', () => {
    expect(normalizeCoins(undefined, 25)).toBe(25)
    expect(normalizeCoins(Number.NaN, 10)).toBe(10)
    expect(normalizeCoins(-25)).toBe(-25)
  })

  it('spends coins and adds an orb without mutating the save', () => {
    const result = purchaseOrb(save(50), 'moonOrb')
    expect(result.purchased).toBe(true)
    expect(result.save.coins).toBe(20)
    expect(result.save.inventory.moonOrb).toBe(1)
  })

  it('rejects unaffordable purchases', () => {
    const original = save(9)
    const result = purchaseOrb(original, 'sparkOrb')
    expect(result.purchased).toBe(false)
    expect(result.save).toBe(original)
    expect(purchaseOrb(save(-10), 'sparkOrb').purchased).toBe(false)
  })

  it('consumes exactly one owned orb per attempt', () => {
    const withOrb = { ...save(), inventory: { sparkOrb: 2, moonOrb: 0, novaOrb: 0 } }
    const consumed = consumeOrb(withOrb, 'sparkOrb')
    expect(consumed?.inventory.sparkOrb).toBe(1)
    expect(withOrb.inventory.sparkOrb).toBe(2)
    expect(consumeOrb({ ...withOrb, inventory: { ...withOrb.inventory, sparkOrb: 0 } }, 'sparkOrb')).toBeNull()
  })
})
