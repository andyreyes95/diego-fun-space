import { describe, expect, it } from 'vitest'
import { getQuestObjective } from './quests'
import type { GameSave } from '../types'

function save(overrides: Partial<GameSave> = {}): GameSave {
  return {
    saveVersion: 3,
    playerName: 'Nova',
    starterId: 'embbite',
    party: [],
    reserve: [],
    seen: ['embbite'],
    caught: ['embbite'],
    captureCounts: { embbite: 1 },
    badges: [],
    gymProgress: { fire: 0, grass: 0, electric: 0, cloud: 0, water: 0, ice: 0, dark: 0 },
    storyStep: 0,
    darkGangDefeated: false,
    currentPlanet: 1,
    mossgroveCaptureBaseline: 0,
    ...overrides,
  }
}

describe('quest progression', () => {
  it('starts by asking for the first wild capture', () => {
    expect(getQuestObjective(save())).toMatchObject({ completed: 0, title: 'Catch your first wild dragon' })
  })

  it('does not skip the Ember badge even if the player caught extras early', () => {
    const objective = getQuestObjective(save({ captureCounts: { embbite: 1, spriglet: 1, shadee: 1 } }))
    expect(objective).toMatchObject({ completed: 1, title: 'Challenge Sol for the Ember Badge' })
  })

  it('advances through travel and more catches in order', () => {
    const afterEmber = getQuestObjective(save({ badges: ['Ember'], captureCounts: { embbite: 1, spriglet: 1 } }))
    expect(afterEmber).toMatchObject({ completed: 2, title: 'Travel to Mossgrove' })

    const inMossgrove = getQuestObjective(save({ badges: ['Ember'], storyStep: 3, currentPlanet: 2, mossgroveCaptureBaseline: 1, captureCounts: { embbite: 1, spriglet: 1 } }))
    expect(inMossgrove).toMatchObject({ completed: 3, title: 'Catch more dragons on your journey' })

    const afterMore = getQuestObjective(save({ badges: ['Ember'], storyStep: 3, currentPlanet: 2, mossgroveCaptureBaseline: 1, captureCounts: { embbite: 1, spriglet: 1, shadee: 1 } }))
    expect(afterMore).toMatchObject({ completed: 4, title: 'Challenge Moss for the Bloom Badge' })
  })

  it('continues from Bloom into Voltspire and finishes after the Spark badge', () => {
    const readyForVoltspire = save({ badges: ['Ember', 'Bloom'], storyStep: 5, currentPlanet: 2, mossgroveCaptureBaseline: 1, captureCounts: { embbite: 1, spriglet: 1, shadee: 1 } })
    expect(getQuestObjective(readyForVoltspire)).toMatchObject({ completed: 5, title: 'Travel to Voltspire', finished: false })

    const inVoltspire = { ...readyForVoltspire, storyStep: 6, currentPlanet: 3 as const }
    expect(getQuestObjective(inVoltspire)).toMatchObject({ completed: 6, title: 'Explore Voltspire and prepare your team' })

    const readyForVolt = {
      ...inVoltspire,
      gymProgress: { fire: 0 as const, grass: 0 as const, electric: 2 as const, cloud: 0 as const, water: 0 as const, ice: 0 as const, dark: 0 as const },
    }
    expect(getQuestObjective(readyForVolt)).toMatchObject({ completed: 7, title: 'Challenge Volt for the Spark Badge' })

    const sparkComplete = getQuestObjective({ ...readyForVolt, badges: ['Ember', 'Bloom', 'Spark'], storyStep: 8 })
    expect(sparkComplete).toMatchObject({ completed: 8, title: 'Travel to Cloudrest', finished: false })

    const inCloudrest = { ...readyForVolt, badges: ['Ember', 'Bloom', 'Spark'], storyStep: 9, currentPlanet: 4 as const }
    expect(getQuestObjective(inCloudrest)).toMatchObject({ completed: 9, title: 'Explore Cloudrest and prepare your team' })

    const readyForCirrus = {
      ...inCloudrest,
      gymProgress: { fire: 0 as const, grass: 0 as const, electric: 2 as const, cloud: 2 as const, water: 0 as const, ice: 0 as const, dark: 0 as const },
    }
    expect(getQuestObjective(readyForCirrus)).toMatchObject({ completed: 10, title: 'Challenge Cirrus for the Breeze Badge' })

    const breezeComplete = getQuestObjective({ ...readyForCirrus, badges: ['Ember', 'Bloom', 'Spark', 'Breeze'], storyStep: 11 })
    expect(breezeComplete).toMatchObject({ completed: 11, title: 'Travel to Tidehaven', finished: false })

    const inTidehaven = { ...readyForCirrus, badges: ['Ember', 'Bloom', 'Spark', 'Breeze'], storyStep: 12, currentPlanet: 5 as const }
    expect(getQuestObjective(inTidehaven)).toMatchObject({ completed: 12, title: 'Explore Tidehaven and prepare your team' })

    const readyForMarina = {
      ...inTidehaven,
      gymProgress: { fire: 0 as const, grass: 0 as const, electric: 2 as const, cloud: 2 as const, water: 2 as const, ice: 0 as const, dark: 0 as const },
    }
    expect(getQuestObjective(readyForMarina)).toMatchObject({ completed: 13, title: 'Challenge Marina for the Tide Badge' })

    const tideComplete = getQuestObjective({ ...readyForMarina, badges: ['Ember', 'Bloom', 'Spark', 'Breeze', 'Tide'], storyStep: 14 })
    expect(tideComplete).toMatchObject({ completed: 14, title: 'Travel to Frostveil', finished: false })

    const inFrostveil = { ...readyForMarina, badges: ['Ember', 'Bloom', 'Spark', 'Breeze', 'Tide'], storyStep: 15, currentPlanet: 6 as const }
    expect(getQuestObjective(inFrostveil)).toMatchObject({ completed: 15, title: 'Explore Frostveil and prepare your team' })

    const readyForGlacia = {
      ...inFrostveil,
      gymProgress: { fire: 0 as const, grass: 0 as const, electric: 2 as const, cloud: 2 as const, water: 2 as const, ice: 2 as const, dark: 0 as const },
    }
    expect(getQuestObjective(readyForGlacia)).toMatchObject({ completed: 16, title: 'Challenge Glacia for the Frost Badge' })

    const frostComplete = getQuestObjective({ ...readyForGlacia, badges: ['Ember', 'Bloom', 'Spark', 'Breeze', 'Tide', 'Frost'], storyStep: 17 })
    expect(frostComplete).toMatchObject({ completed: 17, title: 'Travel to Umbralis', finished: false })

    const inUmbralis = { ...readyForGlacia, badges: ['Ember', 'Bloom', 'Spark', 'Breeze', 'Tide', 'Frost'], storyStep: 18, currentPlanet: 7 as const }
    expect(getQuestObjective(inUmbralis)).toMatchObject({ completed: 18, title: 'Explore Umbralis and prepare your team' })

    const readyForNyx = {
      ...inUmbralis,
      gymProgress: { fire: 0 as const, grass: 0 as const, electric: 2 as const, cloud: 2 as const, water: 2 as const, ice: 2 as const, dark: 2 as const },
    }
    expect(getQuestObjective(readyForNyx)).toMatchObject({ completed: 19, title: 'Challenge Nyx for the Eclipse Badge' })

    const objective = getQuestObjective({ ...readyForNyx, badges: ['Ember', 'Bloom', 'Spark', 'Breeze', 'Tide', 'Frost', 'Eclipse'], storyStep: 20 })
    expect(objective.finished).toBe(true)
    expect(objective.completed).toBe(20)
  })
})
