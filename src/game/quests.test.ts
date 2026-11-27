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
    gymProgress: { fire: 0, grass: 0 },
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

  it('finishes after the Bloom badge', () => {
    const objective = getQuestObjective(save({ badges: ['Ember', 'Bloom'], storyStep: 5, currentPlanet: 2, mossgroveCaptureBaseline: 1, captureCounts: { embbite: 1, spriglet: 1, shadee: 1 } }))
    expect(objective.finished).toBe(true)
    expect(objective.completed).toBe(5)
  })
})
