import { useEffect, useMemo, useState } from 'react'
import { createDragon, speciesById } from '../data'
import type { BattleLogEntry, BattleState, Celebration, DragonInstance, DragonType, GameSave, Move, View } from '../types'
import { clearSave, loadSave, persistSave } from '../game/storage'
import { addCapturedInstance, moveInstance, registerEvolution, registerSeen, renameInstance } from '../game/registration'
import { effectivenessText, evolveInstance, gainExperience, getOpponentTeam, resolveAttack } from '../game/battle'
import { filterDexSpecies } from '../game/dex'
import { advanceStoryStep, getWildCaptureCount } from '../game/quests'

const badgeNames = ['Ember', 'Bloom', 'Frost', 'Spark', 'Radiant', 'Breeze', 'Eclipse', 'Champion']

function displayName(dragon: DragonInstance): string {
  const speciesName = speciesById[dragon.speciesId].name
  return dragon.nickname?.trim() ? `${speciesName} (${dragon.nickname.trim()})` : speciesName
}

export function useGameController() {
  const [initialSave] = useState(() => loadSave())
  const [save, setSave] = useState<GameSave | null>(initialSave)
  const [view, setViewState] = useState<View>(() => (initialSave ? 'town' : 'title'))
  const [selectedStarter, setSelectedStarter] = useState('embbite')
  const [playerName, setPlayerName] = useState('Nova')
  const [battle, setBattle] = useState<BattleState | null>(null)
  const [battlePlanet, setBattlePlanet] = useState<1 | 2>(1)
  const [activePartyIndex, setActivePartyIndex] = useState(0)
  const [battleBusy, setBattleBusy] = useState(false)
  const [dexFilter, setDexFilter] = useState<'all' | DragonType>('all')
  const [dexStatus, setDexStatus] = useState<'all' | 'seen' | 'caught'>('all')
  const [selectedDexId, setSelectedDexId] = useState('embbite')
  const [toast, setToast] = useState('')
  const [screenShake, setScreenShake] = useState(false)
  const [celebrationQueue, setCelebrationQueue] = useState<Celebration[]>([])

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
    if (nextView === 'planet1' || nextView === 'planet2') {
      const currentPlanet: 1 | 2 = nextView === 'planet2' ? 2 : 1
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
        return currentPlanet === 2 ? advanceStoryStep(navigated, 3) : navigated
      })
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
      saveVersion: 3,
      playerName: playerName.trim() || 'Nova',
      starterId: selectedStarter,
      party: [starter],
      reserve: [],
      seen: [selectedStarter],
      caught: [selectedStarter],
      captureCounts: { [selectedStarter]: 1 },
      badges: [],
      storyStep: 0,
      darkGangDefeated: false,
      currentPlanet: 1,
      mossgroveCaptureBaseline: 0,
    })
    setSelectedDexId(selectedStarter)
    setToast(`${starterSpecies.name} joined your team!`)
    setView('town')
  }

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
    setCelebrationQueue([])
    setViewState('title')
  }

  const dismissCelebration = () => {
    setCelebrationQueue((queue) => queue.slice(1))
  }

  const markSeen = (speciesId: string) => {
    setSave((current) => current ? registerSeen(current, speciesId) : current)
  }

  const healParty = () => {
    setSave((current) => current ? {
      ...current,
      party: current.party.map((dragon) => ({ ...dragon, hp: dragon.maxHp })),
    } : current)
    setActivePartyIndex(0)
    setToast('Your dragons are fully rested!')
  }

  const beginWildBattle = (planet: 1 | 2) => {
    if (!save) return
    setBattlePlanet(planet)
    const firstAbleDragon = save.party.findIndex((dragon) => dragon.hp > 0)
    if (firstAbleDragon < 0) {
      setToast('No dragons can battle. Visit the Healing Center.')
      setView('town')
      return
    }
    setActivePartyIndex(firstAbleDragon)
    const pool = planet === 1
      ? ['embbite', 'puddlefin', 'spriglet', 'zappup', 'mistlet', 'shadee']
      : ['frostle', 'lumopod', 'noxibear', 'shadee', 'spriglet', 'puddlefin']
    const speciesId = pool[Math.floor(Math.random() * pool.length)]
    const enemy = createDragon(speciesId, 5 + Math.floor(Math.random() * 4))
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
    })
    setBattleBusy(false)
    setViewState('battle')
  }

  const beginTrainerBattle = (kind: 'fireGym' | 'grassGym' | 'gang') => {
    if (!save) return
    setBattlePlanet(kind === 'grassGym' || kind === 'gang' ? 2 : 1)
    const firstAbleDragon = save.party.findIndex((dragon) => dragon.hp > 0)
    if (firstAbleDragon < 0) {
      setToast('No dragons can battle. Visit the Healing Center.')
      setView('town')
      return
    }
    setActivePartyIndex(firstAbleDragon)
    const encounterName = kind === 'fireGym'
      ? 'Gym Leader Sol'
      : kind === 'grassGym'
        ? 'Gym Leader Moss'
        : 'Dark Gang Captain'
    const enemyTeam = getOpponentTeam(kind)
    const enemy = enemyTeam[0]
    enemyTeam.forEach((dragon) => markSeen(dragon.speciesId))
    setBattle({
      kind,
      enemy,
      enemyTeam,
      enemyActiveIndex: 0,
      enemyName: encounterName,
      log: [{ side: 'system', text: `${encounterName} sent out ${speciesById[enemy.speciesId].name}!` }],
      finished: false,
      won: false,
      caught: false,
    })
    setBattleBusy(false)
    setViewState('battle')
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

    const enemyHp = Math.max(0, battle.enemy.hp - result.damage)
    const effect = effectivenessText(result.effectiveness)
    const enemyTeamAfterHit = battle.enemyTeam.map((enemy, index) =>
      index === battle.enemyActiveIndex ? { ...enemy, hp: enemyHp } : enemy,
    )
    setScreenShake(true)
    window.setTimeout(() => setScreenShake(false), 180)

    if (enemyHp <= 0) {
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
            { side: 'opponent', text: `${battle.enemyName} sent out ${speciesById[nextEnemy.speciesId].name}!` },
          ],
        })
        setBattleBusy(false)
        return
      }
      const xpGain = battle.enemy.level * 7
      const gained = gainExperience(active, xpGain)
      const evolution = evolveInstance(gained)
      const victoriousDragon = evolution?.instance ?? gained
      const updatedParty = save.party.map((dragon, index) => index === activeIndex ? victoriousDragon : dragon)

      if (evolution) {
        setCelebrationQueue((queue) => [
          ...queue,
          { kind: 'evolution', beforeId: evolution.beforeId, afterId: evolution.afterId },
        ])
      }
      if (battle.kind === 'fireGym' && !save.badges.includes('Ember')) {
        setCelebrationQueue((queue) => [...queue, { kind: 'badge', badge: 'Ember' }])
      }
      if (battle.kind === 'grassGym' && !save.badges.includes('Bloom')) {
        setCelebrationQueue((queue) => [...queue, { kind: 'badge', badge: 'Bloom' }])
      }

      setSave((current) => {
        if (!current) return current
        const nextBadges = battle.kind === 'fireGym'
          ? current.badges.includes('Ember') ? current.badges : [...current.badges, 'Ember']
          : battle.kind === 'grassGym'
            ? current.badges.includes('Bloom') ? current.badges : [...current.badges, 'Bloom']
            : current.badges
        const registered = evolution
          ? registerEvolution(current, evolution.beforeId, evolution.afterId)
          : current
        const withProgress = {
          ...registered,
          party: updatedParty,
          badges: nextBadges,
          darkGangDefeated: battle.kind === 'gang' ? true : registered.darkGangDefeated,
          storyStep: battle.kind === 'grassGym' ? Math.max(5, registered.storyStep) : battle.kind === 'fireGym' ? Math.max(2, registered.storyStep) : registered.storyStep,
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
    if (!save || !battle || battle.kind !== 'wild' || battle.finished || battleBusy) return
    setBattleBusy(true)
    const hpRatio = battle.enemy.hp / battle.enemy.maxHp
    const chance = 0.35 + (1 - hpRatio) * 0.55
    const species = speciesById[battle.enemy.speciesId]
    if (Math.random() < chance) {
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
        return next
      })
      setBattle({
        ...battle,
        finished: true,
        won: true,
        caught: true,
        log: [...battle.log, { side: 'player', text: `Gotcha! ${species.name} joined your ${joinedParty ? 'Party' : 'Reserve'}!` }],
      })
      setCelebrationQueue((queue) => [
        ...queue,
        { kind: 'catch', speciesId: species.id, joinedParty },
      ])
      setBattleBusy(false)
      return
    }
    setBattle((current) => current ? {
      ...current,
      log: [...current.log, { side: 'system', text: `${species.name} broke free!` }],
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

  const runFromBattle = () => {
    if (battleBusy) return
    setBattle(null)
    setSave((current) => current ? { ...current, currentPlanet: battlePlanet } : current)
    setView(battlePlanet === 2 ? 'planet2' : 'planet1')
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
    celebrationQueue,
    badgeNames,
    filteredDex,
    setDragonNickname,
    moveDragon,
    startGame,
    resetGame,
    dismissCelebration,
    healParty,
    beginWildBattle,
    beginTrainerBattle,
    useMove,
    tryCapture,
    switchDragon,
    runFromBattle,
  }
}

