import { useEffect, useMemo, useState } from 'react'
import { createDragon, dragonSpecies, speciesById } from '../data'
import type { BattleEvent, BattleLogEntry, BattleState, DragonInstance, DragonType, GameSave, Move, View } from '../types'
import { clearSave, loadSave, persistSave } from '../game/storage'
import { addCapturedInstance, moveInstance, registerEvolution, registerSeen, renameInstance } from '../game/registration'
import { applyKnockoutExperience, doesLightEncounterAppear, effectivenessText, getLightEncounter, getLightEncounterPlanet, getWildEncounter, getOpponentTeam, isDarkGangAmbush, resolveAttack, resolveCaptureAttempt } from '../game/battle'
import { filterDexSpecies } from '../game/dex'
import { advanceStoryStep, getWildCaptureCount } from '../game/quests'
import type { UnlockOptions } from '../components/UnlockScreen'
import { consumeOrb, getBattleReward, getGymEntryCost, getSelectedHealingCost, normalizeCoins, orbById, PORTAL_COST, purchaseOrb, type CaptureOrbId } from '../game/economy'

const badgeNames = ['Ember', 'Bloom', 'Spark', 'Breeze', 'Tide', 'Frost', 'Eclipse', 'Radiant']
type TrainerBattleKind = 'fireGym' | 'grassGym' | 'electricGym' | 'cloudGym' | 'waterGym' | 'iceGym' | 'darkGym' | 'lightGym' | 'gang' | 'jakeBoss'
type GymBattleKind = Exclude<TrainerBattleKind, 'gang' | 'jakeBoss'>

function displayName(dragon: DragonInstance): string {
  const speciesName = speciesById[dragon.speciesId].name
  return dragon.nickname?.trim() ? `${speciesName} (${dragon.nickname.trim()})` : speciesName
}

export function useGameController() {
  const [initialSave] = useState(() => loadSave())
  const [save, setSave] = useState<GameSave | null>(initialSave)
  const [view, setViewState] = useState<View>(() =>
    initialSave
      ? initialSave.currentPlanet === 0
        ? 'town'
        : initialSave.currentPlanet === 1
          ? 'planet1'
          : initialSave.currentPlanet === 2
            ? 'planet2'
            : initialSave.currentPlanet === 3
              ? 'planet3'
              : initialSave.currentPlanet === 4
                ? 'planet4'
                : initialSave.currentPlanet === 5
                  ? 'planet5'
                  : initialSave.currentPlanet === 6
                    ? 'planet6'
                    : initialSave.currentPlanet === 7
                      ? 'planet7'
                      : 'planet8'
      : 'title',
  )
  const [selectedStarter, setSelectedStarter] = useState('embbite')
  const [playerName, setPlayerName] = useState('Nova')
  const [battle, setBattle] = useState<BattleState | null>(null)
  const [battlePlanet, setBattlePlanet] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>(1)
  const [activePartyIndex, setActivePartyIndex] = useState(0)
  const [battleBusy, setBattleBusy] = useState(false)
  const [dexFilter, setDexFilter] = useState<'all' | DragonType>('all')
  const [dexStatus, setDexStatus] = useState<'all' | 'seen' | 'caught'>('all')
  const [selectedDexId, setSelectedDexId] = useState('embbite')
  const [toast, setToast] = useState('')
  const [screenShake, setScreenShake] = useState(false)
  const [eventQueue, setEventQueue] = useState<BattleEvent[]>([])
  const [selectedCaptureOrb, setSelectedCaptureOrb] = useState<CaptureOrbId | ''>('')
  const [pendingCostAction, setPendingCostAction] = useState<
    | { kind: 'heal' }
    | { kind: 'gym'; battleKind: GymBattleKind }
    | { kind: 'travel'; destination: View }
    | null
  >(null)

  useEffect(() => {
    if (!save) return
    try {
      persistSave(save)
    } catch (error) {
      console.error('Unable to save Starcrest Dragons progress.', error)
      setToast('Progress could not be saved on this device.')
    }
  }, [save])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const setView = (nextView: View) => {
    if (nextView === 'town') {
      setSave((current) => current ? { ...current, currentPlanet: 0 } : current)
    }
    if (nextView === 'planet1' || nextView === 'planet2' || nextView === 'planet3' || nextView === 'planet4' || nextView === 'planet5' || nextView === 'planet6' || nextView === 'planet7' || nextView === 'planet8') {
      const currentPlanet: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 = nextView === 'planet1' ? 1 : nextView === 'planet2' ? 2 : nextView === 'planet3' ? 3 : nextView === 'planet4' ? 4 : nextView === 'planet5' ? 5 : nextView === 'planet6' ? 6 : nextView === 'planet7' ? 7 : 8
      setSave((current) => {
        if (!current) return current
        const enteringMossgrove = currentPlanet === 2 && current.currentPlanet !== 2 && current.storyStep < 3
        const navigated = {
          ...current,
          currentPlanet,
          mossgroveCaptureBaseline: enteringMossgrove
            ? getWildCaptureCount(current)
            : current.mossgroveCaptureBaseline,
        }
        return currentPlanet === 8
          ? advanceStoryStep(navigated, 21)
          : currentPlanet === 7
            ? advanceStoryStep(navigated, 18)
            : currentPlanet === 6
              ? advanceStoryStep(navigated, 15)
            : currentPlanet === 5
              ? advanceStoryStep(navigated, 12)
            : currentPlanet === 4
              ? advanceStoryStep(navigated, 9)
              : currentPlanet === 3
                ? advanceStoryStep(navigated, 6)
                : currentPlanet === 2
                  ? advanceStoryStep(navigated, 3)
                  : navigated
      })
      const lightPlanet = getLightEncounterPlanet(currentPlanet)
      if (lightPlanet && save && !save.lightEncountersCaught?.includes(lightPlanet) && doesLightEncounterAppear()) {
        beginLightEncounter(lightPlanet)
        return
      }
    }
    setViewState(nextView)
  }

  const setDragonNickname = (instanceId: string, nickname: string) => {
    setSave((current) => current ? renameInstance(current, instanceId, nickname) : current)
  }

  const moveDragon = (instanceId: string, destination: 'party' | 'reserve') => {
    setSave((current) => {
      if (!current) return current
      if (destination === 'party' && current.party.length >= 4) {
        setToast('Your Party already has 4 dragons.')
        return current
      }
      if (destination === 'reserve' && current.party.length <= 1) {
        setToast('Your team needs at least one dragon!')
        return current
      }
      setToast(destination === 'party' ? 'Dragon moved to Party.' : 'Dragon moved to Reserve.')
      return moveInstance(current, instanceId, destination)
    })
  }

  const startGame = () => {
    const starter = createDragon(selectedStarter, 5)
    const starterSpecies = speciesById[selectedStarter]
    setSave({
      saveVersion: 4,
      playerName: playerName.trim() || 'Nova',
      starterId: selectedStarter,
      party: [starter],
      reserve: [],
      seen: [selectedStarter],
      caught: [selectedStarter],
      captureCounts: { [selectedStarter]: 1 },
      badges: [],
      coins: 200,
      inventory: { sparkOrb: 3, moonOrb: 0, novaOrb: 0 },
      gymProgress: { fire: 0, grass: 0, electric: 0, cloud: 0, water: 0, ice: 0, dark: 0, light: 0 },
      storyStep: 0,
      darkGangDefeated: false,
      currentPlanet: 0,
      mossgroveCaptureBaseline: 0,
      hasVisitedEmberfall: false,
      lightEncountersCaught: [],
    })
    setSelectedDexId(selectedStarter)
    setToast(`${starterSpecies.name} joined your team!`)
    setViewState('intro')
  }

  const finishIntro = () => setView('town')

  const resetGame = () => {
    if (!window.confirm('Start over and erase this local save?')) return
    try {
      clearSave()
    } catch (error) {
      console.error('Unable to clear the local save.', error)
      setToast('The save could not be cleared.')
      return
    }
    setSave(null)
    setBattle(null)
    setEventQueue([])
    setViewState('title')
  }

  const dismissEvent = () => {
    const dismissedEvent = eventQueue[0]
    setEventQueue((queue) => queue.slice(1))
    if (dismissedEvent?.kind === 'escape') {
      setBattle(null)
      setSave((current) => current ? { ...current, currentPlanet: battlePlanet } : current)
      setViewState(battlePlanet === 1 ? 'planet1' : battlePlanet === 2 ? 'planet2' : battlePlanet === 3 ? 'planet3' : battlePlanet === 4 ? 'planet4' : battlePlanet === 5 ? 'planet5' : battlePlanet === 6 ? 'planet6' : battlePlanet === 7 ? 'planet7' : 'planet8')
    }
  }

  const [unlockScreenOpen, setUnlockScreenOpen] = useState(false)

  // Temporary localhost debug cheat: remove this block and the debugUnlockAll UI wiring to disable.
  const debugUnlockAll = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
    ? () => setUnlockScreenOpen(true)
    : undefined

  const applyUnlocks = (options: UnlockOptions) => {
      setSave((current) => {
        if (!current) return current
        let next = current
        if (options.allDragons) {
          const owned = new Set([...current.party, ...current.reserve].map((dragon) => dragon.speciesId))
          next = dragonSpecies.reduce((progress, species) => owned.has(species.id)
            ? progress
            : addCapturedInstance(progress, createDragon(species.id, 5)), current)
          const ids = dragonSpecies.map((species) => species.id)
          next = {
            ...next,
            seen: [...new Set([...next.seen, ...ids])],
            caught: [...new Set([...next.caught, ...ids])],
          }
        }
        return {
          ...next,
          badges: options.badges,
          gymProgress: options.gymProgress,
          darkGangDefeated: options.jakeDefeated,
          lightEncountersCaught: options.lightEncountersCaught ? [1, 3, 5, 7] : [],
          storyStep: options.badges.includes('Radiant') ? Math.max(23, next.storyStep) : next.storyStep,
        }
      })
      setUnlockScreenOpen(false)
      setToast('Selected debug unlocks applied.')
    }

  const markSeen = (speciesId: string) => {
    setSave((current) => current ? registerSeen(current, speciesId) : current)
  }

  const requestHealing = () => {
    if (!save) return
    if (save.party.every((dragon) => dragon.hp === dragon.maxHp)) {
      setToast('Your dragons are already fully rested.')
      return
    }
    setPendingCostAction({ kind: 'heal' })
  }

  const healParty = (selectedInstanceIds: string[]) => {
    if (!save) return
    if (save.party.every((dragon) => dragon.hp === dragon.maxHp)) {
      setToast('Your dragons are already fully rested.')
      return
    }
    const validSelections = new Set(save.party
      .filter((dragon) => selectedInstanceIds.includes(dragon.instanceId))
      .map((dragon) => dragon.instanceId))
    const healingCost = getSelectedHealingCost([...validSelections])
    if (healingCost === 0) return
    setSave((current) => current ? {
      ...current,
      coins: normalizeCoins(current.coins) - healingCost,
      party: current.party.map((dragon) => validSelections.has(dragon.instanceId)
        ? { ...dragon, hp: dragon.maxHp }
        : dragon),
    } : current)
    setActivePartyIndex((index) => save.party[index] && validSelections.has(save.party[index].instanceId) ? index : save.party.findIndex((dragon) => dragon.hp > 0 || validSelections.has(dragon.instanceId)))
    setToast(`${validSelections.size} ${validSelections.size === 1 ? 'dragon is' : 'dragons are'} fully rested! ${healingCost} Coins spent.`)
  }

  const beginLightEncounter = (planet: 1 | 3 | 5 | 7) => {
    if (!save) return
    const firstAbleDragon = save.party.findIndex((dragon) => dragon.hp > 0)
    if (firstAbleDragon < 0) {
      setToast('Heal your team, then revisit this planet to meet the Light dragon.')
      return
    }
    const { speciesId, level } = getLightEncounter(planet)
    const enemy = createDragon(speciesId, level)
    setBattlePlanet(planet)
    setActivePartyIndex(firstAbleDragon)
    markSeen(speciesId)
    setBattle({
      kind: 'lightEncounter',
      enemy,
      enemyTeam: [enemy],
      enemyActiveIndex: 0,
      enemyName: 'Rare Light Dragon',
      log: [
        { side: 'system', text: `A rare ${speciesById[speciesId].name} challenges you!` },
        { side: 'system', text: 'This Light dragon will not faint. Weaken it and catch it to continue.' },
      ],
      finished: false,
      won: false,
      caught: false,
      catchAttempts: 0,
    })
    setEventQueue([{ kind: 'lightEncounter', speciesId }])
    setBattleBusy(false)
    setViewState('battle')
  }

  const beginWildBattle = (planet: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) => {
    if (!save) return
    setBattlePlanet(planet)
    const firstAbleDragon = save.party.findIndex((dragon) => dragon.hp > 0)
    if (firstAbleDragon < 0) {
      setToast('No dragons can battle. Visit the Healing Center.')
      setView(planet === 1 ? 'planet1' : planet === 2 ? 'planet2' : planet === 3 ? 'planet3' : planet === 4 ? 'planet4' : planet === 5 ? 'planet5' : planet === 6 ? 'planet6' : planet === 7 ? 'planet7' : 'planet8')
      return
    }

    setActivePartyIndex(firstAbleDragon)
    if (isDarkGangAmbush()) {
      beginTrainerBattle('gang', planet)
      return
    }
    const { speciesId, level } = getWildEncounter()
    const enemy = createDragon(speciesId, level)
    markSeen(speciesId)
    setBattle({
      kind: 'wild',
      enemy,
      enemyTeam: [enemy],
      enemyActiveIndex: 0,
      enemyName: 'Wild',
      log: [{ side: 'system', text: `A wild ${speciesById[speciesId].name} appeared!` }],
      finished: false,
      won: false,
      caught: false,
      catchAttempts: 0,
    })
    setBattleBusy(false)
    setViewState('battle')
  }

  const beginTrainerBattle = (kind: TrainerBattleKind, originPlanet?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) => {
    if (!save) return
    const entryCost = getGymEntryCost(kind)
    if (entryCost > 0 && entryCost > normalizeCoins(save.coins)) {
      setToast(`This gym battle costs ${entryCost} Coins.`)
      return
    }
    const currentBattlePlanet: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 = save.currentPlanet === 0 ? 1 : save.currentPlanet
    const trainerPlanet = originPlanet ?? (
      kind === 'grassGym'
        ? 2
        : kind === 'electricGym'
          ? 3
        : kind === 'cloudGym'
          ? 4
        : kind === 'waterGym'
          ? 5
        : kind === 'iceGym'
          ? 6
        : kind === 'darkGym'
          ? 7
        : kind === 'lightGym'
          ? 8
        : kind === 'gang' || kind === 'jakeBoss'
          ? currentBattlePlanet
          : 1
    )
    setBattlePlanet(trainerPlanet)
    const firstAbleDragon = save.party.findIndex((dragon) => dragon.hp > 0)
    if (firstAbleDragon < 0) {
      setToast('No dragons can battle. Visit the Healing Center.')
      setView(trainerPlanet === 1 ? 'planet1' : trainerPlanet === 2 ? 'planet2' : trainerPlanet === 3 ? 'planet3' : trainerPlanet === 4 ? 'planet4' : trainerPlanet === 5 ? 'planet5' : trainerPlanet === 6 ? 'planet6' : trainerPlanet === 7 ? 'planet7' : 'planet8')
      return
    }
    if (entryCost > 0) {
      setSave((current) => current
        ? { ...current, coins: normalizeCoins(current.coins) - entryCost }
        : current)
    }
    setActivePartyIndex(firstAbleDragon)
    const trainerPhase = kind === 'fireGym'
      ? save.gymProgress.fire
      : kind === 'grassGym'
        ? save.gymProgress.grass
        : kind === 'electricGym'
          ? save.gymProgress.electric
          : kind === 'cloudGym'
            ? save.gymProgress.cloud
            : kind === 'waterGym'
              ? save.gymProgress.water
              : kind === 'iceGym'
                ? save.gymProgress.ice
                : kind === 'darkGym'
                  ? save.gymProgress.dark
                  : kind === 'lightGym'
                    ? save.gymProgress.light
                    : kind === 'jakeBoss'
                      ? 2
                      : 2
    const encounterName = kind === 'fireGym'
      ? trainerPhase === 2 ? 'Gym Leader Sol' : `Fire Gym Trainer ${trainerPhase + 1}`
      : kind === 'grassGym'
        ? trainerPhase === 2 ? 'Gym Leader Moss' : `Grass Gym Trainer ${trainerPhase + 1}`
        : kind === 'electricGym'
          ? trainerPhase === 2 ? 'Gym Leader Volt' : `Electric Gym Trainer ${trainerPhase + 1}`
          : kind === 'cloudGym'
            ? trainerPhase === 2 ? 'Gym Leader Cirrus' : `Cloud Gym Trainer ${trainerPhase + 1}`
            : kind === 'waterGym'
              ? trainerPhase === 2 ? 'Gym Leader Marina' : `Water Gym Trainer ${trainerPhase + 1}`
              : kind === 'iceGym'
                ? trainerPhase === 2 ? 'Gym Leader Glacia' : `Ice Gym Trainer ${trainerPhase + 1}`
                : kind === 'darkGym'
                  ? trainerPhase === 2 ? 'Gym Leader Nyx' : `Dark Gym Trainer ${trainerPhase + 1}`
                  : kind === 'lightGym'
                    ? trainerPhase === 2 ? 'Gym Leader Auriel' : `Light Gym Trainer ${trainerPhase + 1}`
                    : kind === 'jakeBoss'
                      ? 'Dark Gang Leader Jake'
                      : 'Dark Gang Captain'
    const enemyTeam = getOpponentTeam(kind, trainerPhase)
    const enemy = enemyTeam[0]
    enemyTeam.forEach((dragon) => markSeen(dragon.speciesId))
    setBattle({
      kind,
      trainerPhase,
      enemy,
      enemyTeam,
      enemyActiveIndex: 0,
      enemyName: encounterName,
      log: [{
        side: 'system',
        text: kind === 'jakeBoss'
          ? `Jake emerges from his fortress and sends out ${speciesById[enemy.speciesId].name}!`
          : kind === 'gang' && originPlanet
          ? `The Dark Gang ambushed you! ${encounterName} sent out ${speciesById[enemy.speciesId].name}!`
          : `${encounterName} sent out ${speciesById[enemy.speciesId].name}!`,
      }],
      finished: false,
      won: false,
      caught: false,
      catchAttempts: 0,
    })
    if (kind === 'jakeBoss') {
      setEventQueue([{ kind: 'ambush', captainName: 'Dark Gang Leader Jake', fortress: true }])
    } else if (kind === 'gang' && originPlanet) {
      setEventQueue([{ kind: 'ambush', captainName: encounterName }])
    }
    setBattleBusy(false)
    setViewState('battle')
  }

  const requestTrainerBattle = (kind: TrainerBattleKind) => {
    if (kind === 'gang' || kind === 'jakeBoss') {
      beginTrainerBattle(kind)
      return
    }
    setPendingCostAction({ kind: 'gym', battleKind: kind })
  }

  const confirmPendingCostAction = (selectedHealingIds: string[] = []) => {
    const action = pendingCostAction
    setPendingCostAction(null)
    if (action?.kind === 'heal') {
      healParty(selectedHealingIds)
      return
    }
    if (action?.kind === 'travel') {
      if (!save || normalizeCoins(save.coins) < PORTAL_COST) {
        setToast(`Portal travel costs ${PORTAL_COST} Coins.`)
        return
      }
      setSave((current) => current
        ? { ...current, coins: normalizeCoins(current.coins) - PORTAL_COST }
        : current)
      setView(action.destination)
      return
    }
    if (action?.kind === 'gym') beginTrainerBattle(action.battleKind)
  }

  const cancelPendingCostAction = () => setPendingCostAction(null)

  const requestTravel = (destination: View) => {
    if (!save) return
    const destinationPlanet = destination === 'planet1' ? 1
      : destination === 'planet2' ? 2
        : destination === 'planet3' ? 3
          : destination === 'planet4' ? 4
            : destination === 'planet5' ? 5
              : destination === 'planet6' ? 6
                : destination === 'planet7' ? 7
                  : destination === 'planet8' ? 8
                    : null
    if (destinationPlanet !== null && destinationPlanet === save.currentPlanet) {
      setView(destination)
      return
    }
    if (destination === 'planet1' && !save.hasVisitedEmberfall) {
      setSave((current) => current ? { ...current, hasVisitedEmberfall: true } : current)
      setView(destination)
      return
    }
    if (normalizeCoins(save.coins) < PORTAL_COST) {
      setToast(`Portal travel costs ${PORTAL_COST} Coins. Clear any debt before traveling.`)
      return
    }
    setPendingCostAction({ kind: 'travel', destination })
  }

  const enemyTurn = (attackingIndex = activePartyIndex) => {
    if (!save || !battle) return
    const active = save.party[attackingIndex]
    if (!active) return
    const currentEnemy = battle.enemyTeam[battle.enemyActiveIndex] ?? battle.enemy
    const enemyMove = currentEnemy.moves[Math.floor(Math.random() * currentEnemy.moves.length)]
    const enemySpecies = speciesById[currentEnemy.speciesId]
    const playerName = displayName(active)
    const result = resolveAttack(currentEnemy, active, enemyMove, Math.random, {
      accuracyCheck: false,
      attackScale: 0.28,
      defenseScale: 0.16,
      variance: false,
    })

    window.setTimeout(() => {
      if (!result.hit) {
        setBattle((currentBattle) => currentBattle ? {
          ...currentBattle,
          log: [...currentBattle.log, { side: 'opponent', text: `${enemySpecies.name} used ${enemyMove.name}, but missed!` }],
        } : currentBattle)
        setBattleBusy(false)
        return
      }

      const hp = Math.max(0, active.hp - result.damage)
      const party = save.party.map((dragon, index) => index === attackingIndex ? { ...dragon, hp } : dragon)
      const effect = effectivenessText(result.effectiveness)
      const entries: BattleLogEntry[] = [
        { side: 'opponent' as const, text: `${enemySpecies.name} used ${enemyMove.name}!${effect}` },
      ]

      if (hp <= 0) {
        entries.push({ side: 'system', text: `${playerName} fainted!` })
        const nextIndex = party.findIndex((dragon, index) => index !== attackingIndex && dragon.hp > 0)
        if (nextIndex >= 0) {
          setActivePartyIndex(nextIndex)
          entries.push({ side: 'player', text: `${displayName(party[nextIndex])} entered the battle!` })
          setBattle((currentBattle) => currentBattle ? {
            ...currentBattle,
            log: [...currentBattle.log, ...entries],
          } : currentBattle)
        } else {
          entries.push({ side: 'system', text: 'Your team has no dragons able to battle!' })
          setBattle((currentBattle) => currentBattle ? {
            ...currentBattle,
            finished: true,
            won: false,
            log: [...currentBattle.log, ...entries],
          } : currentBattle)
        }
      } else {
        setBattle((currentBattle) => currentBattle ? {
          ...currentBattle,
          log: [...currentBattle.log, ...entries],
        } : currentBattle)
      }

      setSave((current) => current ? { ...current, party } : current)
      setBattleBusy(false)
    }, 180)
  }

  const useMove = (move: Move) => {
    if (!save || !battle || battle.finished || battleBusy) return
    const activeIndex = activePartyIndex
    const active = save.party[activeIndex]
    if (!active || active.hp <= 0) {
      setToast('That dragon has fainted. Switch to another dragon!')
      return
    }

    setBattleBusy(true)
    const enemySpecies = speciesById[battle.enemy.speciesId]
    const playerName = displayName(active)
    const result = resolveAttack(active, battle.enemy, move)
    if (!result.hit) {
      setBattle((current) => current ? {
        ...current,
        log: [...current.log, { side: 'player', text: `${playerName} used ${move.name}, but missed!` }],
      } : current)
      enemyTurn(activeIndex)
      return
    }

    const enemyHp = battle.kind === 'lightEncounter'
      ? Math.max(1, battle.enemy.hp - result.damage)
      : Math.max(0, battle.enemy.hp - result.damage)
    const effect = effectivenessText(result.effectiveness)
    const enemyTeamAfterHit = battle.enemyTeam.map((enemy, index) =>
      index === battle.enemyActiveIndex ? { ...enemy, hp: enemyHp } : enemy,
    )
    setScreenShake(true)
    window.setTimeout(() => setScreenShake(false), 180)

    if (enemyHp <= 0) {
      const leaderBattle = battle.trainerPhase === 2
      const knockoutReward = applyKnockoutExperience(active, battle.enemy.level)
      const victoriousDragon = knockoutReward.instance
      const updatedParty = save.party.map((dragon, index) => index === activeIndex ? victoriousDragon : dragon)
      const { evolution } = knockoutReward

      if (evolution) {
        setEventQueue((queue) => [
          ...queue,
          { kind: 'evolution', beforeId: evolution.beforeId, afterId: evolution.afterId },
        ])
      }

      setSave((current) => current ? {
        ...(evolution
          ? registerEvolution(current, evolution.beforeId, evolution.afterId)
          : current),
        party: updatedParty,
      } : current)

      if (battle.kind !== 'wild' && battle.enemyTeam.length > battle.enemyActiveIndex + 1) {
        const nextEnemyIndex = battle.enemyActiveIndex + 1
        const nextEnemy = battle.enemyTeam[nextEnemyIndex]
        setBattle({
          ...battle,
          enemy: nextEnemy,
          enemyActiveIndex: nextEnemyIndex,
          enemyTeam: enemyTeamAfterHit.map((enemy, index) =>
            index === battle.enemyActiveIndex ? { ...enemy, hp: 0 } : enemy,
          ),
          log: [
            ...battle.log,
            { side: 'player', text: `${playerName} used ${move.name}!${effect}` },
            { side: 'system', text: `${enemySpecies.name} fainted!` },
            { side: 'system', text: `${playerName} gained ${knockoutReward.xpGain} XP.` },
            { side: 'opponent', text: `${battle.enemyName} sent out ${speciesById[nextEnemy.speciesId].name}!` },
          ],
        })
        setBattleBusy(false)
        return
      }
      if (battle.kind === 'fireGym' && leaderBattle && !save.badges.includes('Ember')) {
        setEventQueue((queue) => [...queue, { kind: 'badge', badge: 'Ember' }])
      }
      if (battle.kind === 'grassGym' && leaderBattle && !save.badges.includes('Bloom')) {
        setEventQueue((queue) => [...queue, { kind: 'badge', badge: 'Bloom' }])
      }
      if (battle.kind === 'electricGym' && leaderBattle && !save.badges.includes('Spark')) {
        setEventQueue((queue) => [...queue, { kind: 'badge', badge: 'Spark' }])
      }
      if (battle.kind === 'cloudGym' && leaderBattle && !save.badges.includes('Breeze')) {
        setEventQueue((queue) => [...queue, { kind: 'badge', badge: 'Breeze' }])
      }
      if (battle.kind === 'waterGym' && leaderBattle && !save.badges.includes('Tide')) {
        setEventQueue((queue) => [...queue, { kind: 'badge', badge: 'Tide' }])
      }
      if (battle.kind === 'iceGym' && leaderBattle && !save.badges.includes('Frost')) {
        setEventQueue((queue) => [...queue, { kind: 'badge', badge: 'Frost' }])
      }
      if (battle.kind === 'darkGym' && leaderBattle && !save.badges.includes('Eclipse')) {
        setEventQueue((queue) => [...queue, { kind: 'badge', badge: 'Eclipse' }, { kind: 'jakeReveal' }])
      }
      if (battle.kind === 'lightGym' && leaderBattle && !save.badges.includes('Radiant')) {
        setEventQueue((queue) => [...queue, { kind: 'badge', badge: 'Radiant' }])
      }
      if (battle.kind === 'jakeBoss') {
        setEventQueue((queue) => [...queue, { kind: 'jakeVictory' }])
      }

      setSave((current) => {
        if (!current) return current
        const nextBadges = battle.kind === 'fireGym' && leaderBattle
          ? current.badges.includes('Ember') ? current.badges : [...current.badges, 'Ember']
          : battle.kind === 'grassGym' && leaderBattle
            ? current.badges.includes('Bloom') ? current.badges : [...current.badges, 'Bloom']
            : battle.kind === 'electricGym' && leaderBattle
              ? current.badges.includes('Spark') ? current.badges : [...current.badges, 'Spark']
              : battle.kind === 'cloudGym' && leaderBattle
                ? current.badges.includes('Breeze') ? current.badges : [...current.badges, 'Breeze']
                : battle.kind === 'waterGym' && leaderBattle
                  ? current.badges.includes('Tide') ? current.badges : [...current.badges, 'Tide']
                : battle.kind === 'iceGym' && leaderBattle
                  ? current.badges.includes('Frost') ? current.badges : [...current.badges, 'Frost']
                  : battle.kind === 'darkGym' && leaderBattle
                    ? current.badges.includes('Eclipse') ? current.badges : [...current.badges, 'Eclipse']
                    : battle.kind === 'lightGym' && leaderBattle
                      ? current.badges.includes('Radiant') ? current.badges : [...current.badges, 'Radiant']
                      : current.badges
        const registered = evolution
          ? registerEvolution(current, evolution.beforeId, evolution.afterId)
          : current
        const withProgress = {
          ...registered,
          party: updatedParty,
          coins: normalizeCoins(current.coins) + getBattleReward(battle.kind, leaderBattle),
          badges: nextBadges,
          gymProgress: {
            fire: battle.kind === 'fireGym' ? Math.min(2, current.gymProgress.fire + (leaderBattle ? 0 : 1)) as 0 | 1 | 2 : current.gymProgress.fire,
            grass: battle.kind === 'grassGym' ? Math.min(2, current.gymProgress.grass + (leaderBattle ? 0 : 1)) as 0 | 1 | 2 : current.gymProgress.grass,
            electric: battle.kind === 'electricGym' ? Math.min(2, current.gymProgress.electric + (leaderBattle ? 0 : 1)) as 0 | 1 | 2 : current.gymProgress.electric,
            cloud: battle.kind === 'cloudGym' ? Math.min(2, current.gymProgress.cloud + (leaderBattle ? 0 : 1)) as 0 | 1 | 2 : current.gymProgress.cloud,
            water: battle.kind === 'waterGym' ? Math.min(2, current.gymProgress.water + (leaderBattle ? 0 : 1)) as 0 | 1 | 2 : current.gymProgress.water,
            ice: battle.kind === 'iceGym' ? Math.min(2, current.gymProgress.ice + (leaderBattle ? 0 : 1)) as 0 | 1 | 2 : current.gymProgress.ice,
            dark: battle.kind === 'darkGym' ? Math.min(2, current.gymProgress.dark + (leaderBattle ? 0 : 1)) as 0 | 1 | 2 : current.gymProgress.dark,
            light: battle.kind === 'lightGym' ? Math.min(2, current.gymProgress.light + (leaderBattle ? 0 : 1)) as 0 | 1 | 2 : current.gymProgress.light,
          },
          darkGangDefeated: battle.kind === 'jakeBoss' ? true : registered.darkGangDefeated,
          storyStep: leaderBattle && battle.kind === 'lightGym'
            ? Math.max(23, registered.storyStep)
            : leaderBattle && battle.kind === 'darkGym'
              ? Math.max(20, registered.storyStep)
              : leaderBattle && battle.kind === 'iceGym'
                ? Math.max(17, registered.storyStep)
              : leaderBattle && battle.kind === 'waterGym'
                ? Math.max(14, registered.storyStep)
              : leaderBattle && battle.kind === 'cloudGym'
                ? Math.max(11, registered.storyStep)
                : leaderBattle && battle.kind === 'electricGym'
                  ? Math.max(8, registered.storyStep)
                  : leaderBattle && battle.kind === 'grassGym'
                    ? Math.max(5, registered.storyStep)
                    : leaderBattle && battle.kind === 'fireGym'
                      ? Math.max(2, registered.storyStep)
                      : registered.storyStep,
        }
        return withProgress
      })
      setBattle({
        ...battle,
        enemy: { ...battle.enemy, hp: 0 },
        enemyTeam: enemyTeamAfterHit.map((enemy, index) =>
          index === battle.enemyActiveIndex ? { ...enemy, hp: 0 } : enemy,
        ),
        log: [
          ...battle.log,
          { side: 'player', text: `${playerName} used ${move.name}!${effect}` },
          { side: 'system', text: `${enemySpecies.name} fainted!` },
          { side: 'system', text: `${playerName} gained ${knockoutReward.xpGain} XP.` },
        ],
        finished: true,
        won: true,
        caught: false,
      })
      setBattleBusy(false)
      return
    }

    setBattle((current) => current ? {
      ...current,
      enemy: { ...current.enemy, hp: enemyHp },
      enemyTeam: enemyTeamAfterHit,
      log: [...current.log, { side: 'player', text: `${playerName} used ${move.name}!${effect}` }],
    } : current)
    enemyTurn(activeIndex)
  }

  const tryCapture = () => {
    if (!save || !battle || (battle.kind !== 'wild' && battle.kind !== 'lightEncounter') || battle.finished || battleBusy) return
    if (battle.kind === 'wild' && battle.catchAttempts >= 3) return
    setBattleBusy(true)
    const catchAttempts = battle.catchAttempts + 1
    if (!selectedCaptureOrb) {
      setToast('Choose an orb before trying to catch a dragon.')
      setBattleBusy(false)
      return
    }
    const orb = orbById[selectedCaptureOrb]
    if (!save.inventory[orb.id]) {
      setToast(`You have no ${orb.name}s left.`)
      setBattleBusy(false)
      return
    }
    const captureAttempt = resolveCaptureAttempt(
      battle.enemy.hp,
      battle.enemy.maxHp,
      catchAttempts,
      battle.kind === 'wild',
      Math.random,
      orb.multiplier,
    )
    setSave((current) => current ? consumeOrb(current, orb.id) ?? current : current)
    const species = speciesById[battle.enemy.speciesId]
    if (captureAttempt.caught) {
      const caughtIndividual = { ...battle.enemy, hp: battle.enemy.maxHp }
      const joinedParty = save.party.length < 4
      setSave((current) => {
        if (!current) return current
        let next = addCapturedInstance(current, caughtIndividual)
        const wildCaptures = getWildCaptureCount(next)
        next = advanceStoryStep(next, 1)
        if (next.currentPlanet === 2 && wildCaptures > next.mossgroveCaptureBaseline) {
          next = advanceStoryStep(next, 4)
        }
        if (battle.kind === 'lightEncounter' && !next.lightEncountersCaught?.includes(battlePlanet)) {
          next = {
            ...next,
            lightEncountersCaught: [...(next.lightEncountersCaught ?? []), battlePlanet],
          }
        }
        return next
      })
      setBattle({
        ...battle,
        finished: true,
        won: true,
        caught: true,
        catchAttempts,
        log: [...battle.log, {
          side: 'player',
          text: `Gotcha! ${species.name} joined your ${joinedParty ? 'Party' : 'Reserve'}!`,
        }],
      })
      setEventQueue((queue) => [
        ...queue,
        { kind: 'catch', speciesId: species.id, joinedParty },
      ])
      setBattleBusy(false)
      return
    }
    if (captureAttempt.escaped) {
      setBattle((current) => current ? {
        ...current,
        catchAttempts,
        finished: true,
        won: false,
        log: [
          ...current.log,
          { side: 'system', text: `${species.name} broke free and ran away!` },
        ],
      } : current)
      setEventQueue((queue) => [
        ...queue,
        { kind: 'escape', speciesId: species.id, attempts: catchAttempts },
      ])
      setBattleBusy(false)
      return
    }
    setBattle((current) => current ? {
      ...current,
      catchAttempts,
      log: [...current.log, {
        side: 'system',
        text: battle.kind === 'lightEncounter'
          ? `${species.name} broke free! Stay determined and try again.`
          : `${species.name} broke free! ${3 - catchAttempts} ${catchAttempts === 2 ? 'try' : 'tries'} left.`,
      }],
    } : current)
    enemyTurn(activePartyIndex)
  }

  const switchDragon = (nextIndex: number) => {
    if (!save || !battle || battle.finished || battleBusy || nextIndex === activePartyIndex) return
    const nextDragon = save.party[nextIndex]
    if (!nextDragon || nextDragon.hp <= 0) {
      setToast('That dragon needs to rest!')
      return
    }

    setBattleBusy(true)
    setActivePartyIndex(nextIndex)
    setBattle((current) => current ? {
      ...current,
      log: [...current.log, { side: 'player', text: `${displayName(nextDragon)} entered the battle!` }],
    } : current)
    enemyTurn(nextIndex)
  }

  const buyCaptureOrb = (orbId: CaptureOrbId) => {
    if (!save) return
    setSave((current) => {
      if (!current) return current
      const result = purchaseOrb(current, orbId)
      if (!result.purchased) {
        setToast('Not enough Coins for that orb.')
        return current
      }
      setToast(`${orbById[orbId].name} added to your bag.`)
      return result.save
    })
  }

  const runFromBattle = () => {
    if (battleBusy) return
    if (battle?.kind === 'lightEncounter' && !battle.won) {
      setToast('The rare Light dragon slipped away. The encounter may appear again later.')
      setBattle(null)
      setViewState(battlePlanet === 1 ? 'planet1' : battlePlanet === 3 ? 'planet3' : battlePlanet === 5 ? 'planet5' : 'planet7')
      return
    }
    setBattle(null)
    setSave((current) => current ? { ...current, currentPlanet: battlePlanet } : current)
    setView(battlePlanet === 1 ? 'planet1' : battlePlanet === 2 ? 'planet2' : battlePlanet === 3 ? 'planet3' : battlePlanet === 4 ? 'planet4' : battlePlanet === 5 ? 'planet5' : battlePlanet === 6 ? 'planet6' : battlePlanet === 7 ? 'planet7' : 'planet8')
  }

  const filteredDex = useMemo(
    () => filterDexSpecies(save, { type: dexFilter, status: dexStatus }),
    [dexFilter, dexStatus, save],
  )

  return {
    save,
    view,
    setView,
    selectedStarter,
    setSelectedStarter,
    playerName,
    setPlayerName,
    battle,
    activePartyIndex,
    battleBusy,
    dexFilter,
    setDexFilter,
    dexStatus,
    setDexStatus,
    selectedDexId,
    setSelectedDexId,
    toast,
    showToast: setToast,
    screenShake,
    eventQueue,
    selectedCaptureOrb,
    setSelectedCaptureOrb,
    badgeNames,
    filteredDex,
    setDragonNickname,
    moveDragon,
    startGame,
    finishIntro,
    resetGame,
    debugUnlockAll,
    unlockScreenOpen,
    applyUnlocks,
    closeUnlockScreen: () => setUnlockScreenOpen(false),
    dismissEvent,
    requestHealing,
    beginWildBattle,
    requestTrainerBattle,
    requestTravel,
    pendingCostAction,
    confirmPendingCostAction,
    cancelPendingCostAction,
    useMove,
    tryCapture,
    buyCaptureOrb,
    switchDragon,
    runFromBattle,
  }
}

