import type { DragonInstance, GameSave } from '../types'

export function createInstanceId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `dragon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function isSeen(save: GameSave, speciesId: string): boolean {
  return save.seen.includes(speciesId)
}

export function isCaught(save: GameSave, speciesId: string): boolean {
  return save.caught.includes(speciesId)
}

export function isInParty(save: GameSave, speciesId: string): boolean {
  return save.party.some((dragon) => dragon.speciesId === speciesId)
}

export function isInReserve(save: GameSave, speciesId: string): boolean {
  return save.reserve.some((dragon) => dragon.speciesId === speciesId)
}

export function getPartyInstances(save: GameSave, speciesId?: string): DragonInstance[] {
  return speciesId
    ? save.party.filter((dragon) => dragon.speciesId === speciesId)
    : [...save.party]
}

export function getReserveInstances(save: GameSave, speciesId?: string): DragonInstance[] {
  return speciesId
    ? save.reserve.filter((dragon) => dragon.speciesId === speciesId)
    : [...save.reserve]
}

export function registerSeen(save: GameSave, speciesId: string): GameSave {
  return save.seen.includes(speciesId)
    ? save
    : { ...save, seen: [...save.seen, speciesId] }
}

export function registerCaught(save: GameSave, speciesId: string): GameSave {
  return save.caught.includes(speciesId)
    ? save
    : { ...save, caught: [...save.caught, speciesId] }
}

export function recordCapture(save: GameSave, speciesId: string): GameSave {
  const nextSave = registerCaught(registerSeen(save, speciesId), speciesId)
  return {
    ...nextSave,
    captureCounts: {
      ...nextSave.captureCounts,
      [speciesId]: (nextSave.captureCounts[speciesId] ?? 0) + 1,
    },
  }
}

export function registerEvolution(save: GameSave, beforeId: string, afterId: string): GameSave {
  let nextSave = registerSeen(save, beforeId)
  nextSave = registerSeen(nextSave, afterId)
  nextSave = registerCaught(nextSave, afterId)
  return nextSave
}

export function addCapturedInstance(save: GameSave, dragon: DragonInstance): GameSave {
  const destination = save.party.length < 4 ? 'party' : 'reserve'
  let nextSave = recordCapture(save, dragon.speciesId)
  nextSave = destination === 'party'
    ? { ...nextSave, party: [...nextSave.party, dragon] }
    : { ...nextSave, reserve: [...nextSave.reserve, dragon] }
  return nextSave
}

export function moveInstance(save: GameSave, instanceId: string, destination: 'party' | 'reserve'): GameSave {
  const partyDragon = save.party.find((dragon) => dragon.instanceId === instanceId)
  const reserveDragon = save.reserve.find((dragon) => dragon.instanceId === instanceId)
  const dragon = partyDragon ?? reserveDragon
  if (!dragon) return save
  if (destination === 'party') {
    if (save.party.length >= 4) return save
    if (partyDragon) return save
    return {
      ...save,
      party: [...save.party, dragon],
      reserve: save.reserve.filter((item) => item.instanceId !== instanceId),
    }
  }
  if (reserveDragon) return save
  return {
    ...save,
    party: save.party.filter((item) => item.instanceId !== instanceId),
    reserve: [...save.reserve, dragon],
  }
}

export function renameInstance(save: GameSave, instanceId: string, nickname: string): GameSave {
  const normalizedNickname = nickname || undefined
  return {
    ...save,
    party: save.party.map((dragon) => dragon.instanceId === instanceId ? { ...dragon, nickname: normalizedNickname } : dragon),
    reserve: save.reserve.map((dragon) => dragon.instanceId === instanceId ? { ...dragon, nickname: normalizedNickname } : dragon),
  }
}

