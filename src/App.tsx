import { useEffect, useMemo, useState } from 'react'
import { createDragon, dragonSpecies, getEffectiveness, speciesById } from './data'
import type { BattleState, DragonInstance, DragonType, GameSave, Move, View } from './types'
import { BottomNav, GameHeader } from './components/GameChrome'
import { loadSave, SAVE_KEY } from './game/storage'
import { TitleScreen } from './components/screens/TitleScreen'
import { TownScreen, PlanetScreen } from './components/screens/WorldScreens'
import { PlanetMap } from './components/screens/PlanetMap'
import { DexView } from './components/screens/DexView'
import { BattleScreen } from './components/screens/BattleScreen'
import { CelebrationScreen } from './components/screens/CelebrationScreen'


function App() {
  const [save, setSave] = useState<GameSave | null>(() => loadSave())
  const [view, setView] = useState<View>(() => (loadSave() ? 'town' : 'title'))
  const [selectedStarter, setSelectedStarter] = useState('embbite')
  const [playerName, setPlayerName] = useState('Nova')
  const [battle, setBattle] = useState<BattleState | null>(null)
  const [battlePlanet, setBattlePlanet] = useState<1 | 2>(1)
  const [activePartyIndex, setActivePartyIndex] = useState(0)
  const [dexFilter, setDexFilter] = useState<'all' | DragonType>('all')
  const [dexStatus, setDexStatus] = useState<'all' | 'seen' | 'caught'>('all')
  const [selectedDexId, setSelectedDexId] = useState('embbite')
  const [toast, setToast] = useState('')
  const [screenShake, setScreenShake] = useState(false)
  const [celebrationQueue, setCelebrationQueue] = useState<Array<
    | { kind: 'evolution'; beforeId: string; afterId: string }
    | { kind: 'badge'; badge: 'Ember' | 'Bloom' }
    | { kind: 'catch'; speciesId: string; joinedParty: boolean }
  >>([])

  useEffect(() => {
    if (save) localStorage.setItem(SAVE_KEY, JSON.stringify(save))
  }, [save])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const caughtCount = save?.caught.length ?? 0
  const seenCount = save?.seen.length ?? 0
  const selectedPartyIndex = save?.party.findIndex((dragon) => dragon.speciesId === selectedDexId) ?? -1
  const selectedCaught = save?.caught.includes(selectedDexId) ?? false
  const badgeNames = ['Ember', 'Bloom', 'Frost', 'Spark', 'Radiant', 'Breeze', 'Eclipse', 'Champion']

  const toggleBattleParty = (speciesId: string) => {
    if (!save) return
    const partyIndex = save.party.findIndex((dragon) => dragon.speciesId === speciesId)
    if (partyIndex >= 0) {
      if (save.party.length <= 1) {
        setToast('Your team needs at least one dragon!')
        return
      }
      setSave((current) => current ? {
        ...current,
        party: current.party.filter((_, index) => index !== partyIndex),
        bench: [...current.bench, current.party[partyIndex]],
      } : current)
      setToast(`${speciesById[speciesId].name} moved out of the battle team.`)
      return
    }
    if (!save.caught.includes(speciesId)) {
      setToast('Catch this dragon before adding it!')
      return
    }
    if (save.party.length >= 4) {
      setToast('Your battle team is full. Remove a dragon first.')
      return
    }
    const benchIndex = save.bench.findIndex((dragon) => dragon.speciesId === speciesId)
    const restoredDragon = benchIndex >= 0
      ? save.bench[benchIndex]
      : createDragon(speciesId, 5)
    setSave((current) => current ? {
      ...current,
      party: [...current.party, restoredDragon],
      bench: benchIndex >= 0
        ? current.bench.filter((_, index) => index !== benchIndex)
        : current.bench,
    } : current)
    setToast(`${speciesById[speciesId].name} joined the battle team!`)
  }

  const startGame = () => {
    const starter = createDragon(selectedStarter, 5)
    const starterSpecies = speciesById[selectedStarter]
    const starterSave: GameSave = {
      playerName: playerName.trim() || 'Nova',
      starterId: selectedStarter,
      party: [starter],
      bench: [],
      seen: [selectedStarter],
      caught: [selectedStarter],
      badges: [],
      storyStep: 0,
      darkGangDefeated: false,
      currentPlanet: 1,
    }
    setSave(starterSave)
    setSelectedDexId(selectedStarter)
    setToast(`${starterSpecies.name} joined your team!`)
    setView('town')
  }

  const resetGame = () => {
    if (!window.confirm('Start over and erase this local save?')) return
    localStorage.removeItem(SAVE_KEY)
    setSave(null)
    setBattle(null)
    setCelebrationQueue([])
    setView('title')
  }

  const dismissCelebration = () => {
    setCelebrationQueue((queue) => queue.slice(1))
  }

  const markSeen = (speciesId: string) => {
    setSave((current) => current && !current.seen.includes(speciesId)
      ? { ...current, seen: [...current.seen, speciesId] }
      : current)
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
      enemyName: 'Wild',
      log: [`A wild ${speciesById[speciesId].name} appeared!`],
      finished: false,
      won: false,
      caught: false,
    })
    setView('battle')
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
    let enemy: DragonInstance
    let enemyName: string
    if (kind === 'fireGym') {
      enemy = createDragon('flamico', 8)
      enemyName = 'Gym Leader Sol'
    } else if (kind === 'grassGym') {
      enemy = createDragon('thornow', 12)
      enemyName = 'Gym Leader Moss'
    } else {
      enemy = createDragon('umbrawyrm', 16)
      enemyName = 'Dark Gang Captain'
    }
    markSeen(enemy.speciesId)
    setBattle({
      kind,
      enemy,
      enemyName,
      log: [`${enemyName} sent out ${speciesById[enemy.speciesId].name}!`],
      finished: false,
      won: false,
      caught: false,
    })
    setView('battle')
  }

  const evolveDragon = (dragon: DragonInstance): DragonInstance => {
    const species = speciesById[dragon.speciesId]
    if (!species.evolvesAt || !species.evolvesTo || dragon.level < species.evolvesAt) return dragon
    const evolvesTo = species.evolvesTo
    const evolved = createDragon(evolvesTo, dragon.level)
    evolved.xp = dragon.xp
    setCelebrationQueue((queue) => [
      ...queue,
      { kind: 'evolution', beforeId: dragon.speciesId, afterId: evolvesTo },
    ])
    return evolved
  }

  const useMove = (move: Move) => {
    if (!save || !battle || battle.finished) return
    const activeIndex = activePartyIndex
    const active = save.party[activeIndex]
    if (!active || active.hp <= 0) {
      setToast('That dragon has fainted. Switch to another dragon!')
      return
    }
    const enemySpecies = speciesById[battle.enemy.speciesId]
    const playerSpecies = speciesById[active.speciesId]
    const hit = Math.random() * 100 <= move.accuracy
    if (!hit) {
      setBattle((current) => current ? {
        ...current,
        log: [...current.log, `${playerSpecies.name} missed!`],
      } : current)
      enemyTurn(activeIndex)
      return
    }

    const effectiveness = getEffectiveness(move.type, enemySpecies.type)
    const variance = 0.88 + Math.random() * 0.24
    const damage = Math.max(1, Math.round((move.power + active.attack * 0.32 - battle.enemy.defense * 0.18) * effectiveness * variance))
    const enemyHp = Math.max(0, battle.enemy.hp - damage)
    const effectivenessText = effectiveness > 1 ? ' It was super effective!' : effectiveness < 1 ? ' It was not very effective.' : ''
    setScreenShake(true)
    window.setTimeout(() => setScreenShake(false), 180)

    if (enemyHp <= 0) {
      const xpGain = battle.enemy.level * 7
      const updatedParty = save.party.map((dragon, index) => {
        if (index !== activeIndex) return dragon
        const nextXp = dragon.xp + xpGain
        let leveled = nextXp >= dragon.level * 10
          ? { ...dragon, level: dragon.level + 1, xp: nextXp - dragon.level * 10, maxHp: dragon.maxHp + 5, hp: dragon.hp + 5, attack: dragon.attack + 2, defense: dragon.defense + 2 }
          : { ...dragon, xp: nextXp }
        leveled = evolveDragon(leveled)
        return leveled
      })

      setSave((current) => {
        if (!current) return current
        const nextBadges = battle.kind === 'fireGym'
          ? current.badges.includes('Ember') ? current.badges : [...current.badges, 'Ember']
          : battle.kind === 'grassGym'
            ? current.badges.includes('Bloom') ? current.badges : [...current.badges, 'Bloom']
            : current.badges
        if (battle.kind === 'fireGym' && !current.badges.includes('Ember')) {
          setCelebrationQueue((queue) => [...queue, { kind: 'badge', badge: 'Ember' }])
        } else if (battle.kind === 'grassGym' && !current.badges.includes('Bloom')) {
          setCelebrationQueue((queue) => [...queue, { kind: 'badge', badge: 'Bloom' }])
        }
        const partyIds = updatedParty.map((dragon) => dragon.speciesId)
        const seen = Array.from(new Set([...current.seen, ...partyIds]))
        const caught = Array.from(new Set([...current.caught, ...partyIds]))
        return {
          ...current,
          party: updatedParty,
          seen,
          caught,
          badges: nextBadges,
          darkGangDefeated: battle.kind === 'gang' ? true : current.darkGangDefeated,
          storyStep: battle.kind === 'gang' ? 3 : battle.kind === 'grassGym' ? 2 : battle.kind === 'fireGym' ? 1 : current.storyStep,
        }
      })
      setBattle({
        ...battle,
        enemy: { ...battle.enemy, hp: 0 },
        log: [...battle.log, `${playerSpecies.name} used ${move.name}!${effectivenessText}`, `${enemySpecies.name} fainted!`],
        finished: true,
        won: true,
        caught: false,
      })
      return
    }

    setBattle((current) => current ? {
      ...current,
      enemy: { ...current.enemy, hp: enemyHp },
      log: [...current.log, `${playerSpecies.name} used ${move.name}!${effectivenessText}`],
    } : current)
    enemyTurn(activeIndex)
  }

  const enemyTurn = (attackingIndex = activePartyIndex) => {
    if (!save || !battle) return
    const active = save.party[attackingIndex]
    const playerSpecies = speciesById[active.speciesId]
    const enemyMove = battle.enemy.moves[Math.floor(Math.random() * battle.enemy.moves.length)]
    const enemySpecies = speciesById[battle.enemy.speciesId]
    const effectiveness = getEffectiveness(enemyMove.type, playerSpecies.type)
    const damage = Math.max(1, Math.round((enemyMove.power + battle.enemy.attack * 0.28 - active.defense * 0.16) * effectiveness))

    window.setTimeout(() => {
      setSave((current) => {
        if (!current) return current
        const hp = Math.max(0, current.party[attackingIndex].hp - damage)
        const party = current.party.map((dragon, index) => index === attackingIndex ? { ...dragon, hp } : dragon)
        if (hp <= 0) {
          const nextIndex = party.findIndex((dragon, index) => index !== attackingIndex && dragon.hp > 0)
          if (nextIndex >= 0) {
            setActivePartyIndex(nextIndex)
            setBattle((currentBattle) => currentBattle ? {
              ...currentBattle,
              log: [...currentBattle.log, `${enemySpecies.name} used ${enemyMove.name}!`, `${playerSpecies.name} fainted!`, `${speciesById[party[nextIndex].speciesId].name} entered the battle!`],
            } : currentBattle)
          } else {
            setBattle((currentBattle) => currentBattle ? {
              ...currentBattle,
              finished: true,
              won: false,
              log: [...currentBattle.log, `${enemySpecies.name} used ${enemyMove.name}!`, `${playerSpecies.name} fainted!`, 'Your team has no dragons able to battle!'],
            } : currentBattle)
          }
        } else {
          setBattle((currentBattle) => currentBattle ? {
            ...currentBattle,
            log: [...currentBattle.log, `${enemySpecies.name} used ${enemyMove.name}!${effectiveness > 1 ? ' It was super effective!' : effectiveness < 1 ? ' It was not very effective.' : ''}`],
          } : currentBattle)
        }
        return { ...current, party }
      })
    }, 180)
  }

  const tryCapture = () => {
    if (!save || !battle || battle.kind !== 'wild' || battle.finished) return
    const hpRatio = battle.enemy.hp / battle.enemy.maxHp
    const chance = 0.35 + (1 - hpRatio) * 0.55
    const success = Math.random() < chance
    const species = speciesById[battle.enemy.speciesId]
    if (success) {
      const caughtParty = save.party.length < 4
        ? [...save.party, { ...battle.enemy, hp: battle.enemy.maxHp }]
        : save.party
      setSave((current) => current ? {
        ...current,
        party: caughtParty,
        seen: current.seen.includes(species.id) ? current.seen : [...current.seen, species.id],
        caught: current.caught.includes(species.id) ? current.caught : [...current.caught, species.id],
      } : current)
      setBattle({
        ...battle,
        finished: true,
        won: true,
        caught: true,
        log: [...battle.log, `Gotcha! ${species.name} joined your team!`],
      })
      setCelebrationQueue((queue) => [
        ...queue,
        {
          kind: 'catch',
          speciesId: species.id,
          joinedParty: save.party.length < 4,
        },
      ])
    } else {
      setBattle((current) => current ? {
        ...current,
        log: [...current.log, `${species.name} broke free!`],
      } : current)
      enemyTurn(activePartyIndex)
    }
  }

  const switchDragon = (nextIndex: number) => {
    if (!save || !battle || battle.finished || nextIndex === activePartyIndex) return
    const nextDragon = save.party[nextIndex]
    if (!nextDragon || nextDragon.hp <= 0) {
      setToast('That dragon needs to rest!')
      return
    }
    const nextSpecies = speciesById[nextDragon.speciesId]
    setActivePartyIndex(nextIndex)
    setBattle((current) => current ? {
      ...current,
      log: [...current.log, `${nextSpecies.name} entered the battle!`],
    } : current)
    enemyTurn(nextIndex)
  }

  const runFromBattle = () => {
    setBattle(null)
    setSave((current) => current ? { ...current, currentPlanet: battlePlanet } : current)
    setView(battlePlanet === 2 ? 'planet2' : 'planet1')
  }

  const filteredDex = useMemo(() => {
    return dragonSpecies.filter((species) => {
      const typeMatch = dexFilter === 'all' || species.type === dexFilter
      const statusMatch = dexStatus === 'all'
        || (dexStatus === 'seen' && save?.seen.includes(species.id))
        || (dexStatus === 'caught' && save?.caught.includes(species.id))
      return typeMatch && statusMatch
    })
  }, [dexFilter, dexStatus, save])

  if (!save) {
    return (
      <TitleScreen
        playerName={playerName}
        selectedStarter={selectedStarter}
        onNameChange={setPlayerName}
        onStarterChange={setSelectedStarter}
        onStart={startGame}
      />
    )
  }

  if (view === 'battle' && battle) {
    const activeIndex = save.party[activePartyIndex]?.hp > 0
      ? activePartyIndex
      : save.party.findIndex((dragon) => dragon.hp > 0)
    const noAbleDragons = activeIndex < 0
    const active = noAbleDragons ? save.party[0] : save.party[activeIndex]

    if (celebrationQueue[0]) {
      return (
        <CelebrationScreen
          celebration={celebrationQueue[0]}
          onDismiss={dismissCelebration}
        />
      )
    }

    return (
      <BattleScreen
        save={save}
        battle={battle}
        active={active}
        activePartyIndex={activeIndex >= 0 ? activeIndex : 0}
        screenShake={screenShake}
        onUseMove={useMove}
        onTryCapture={tryCapture}
        onRun={runFromBattle}
        onSwitch={switchDragon}
      />
    )
  }

  return (
    <main className="game-shell">
      <GameHeader
        caughtCount={caughtCount}
        seenCount={seenCount}
        badgeNames={badgeNames}
        badges={save.badges}
        onTown={() => setView('town')}
      />

      {view === 'town' && (
        <TownScreen save={save} setView={setView} setSave={setSave} onHeal={healParty} />
      )}

      {view === 'planet1' && (
        <PlanetScreen save={save} planet={1} setView={setView} setSave={setSave} onWildBattle={beginWildBattle} onTrainerBattle={beginTrainerBattle} onToast={setToast} />
      )}

      {view === 'planet2' && (
        <PlanetScreen save={save} planet={2} setView={setView} setSave={setSave} onWildBattle={beginWildBattle} onTrainerBattle={beginTrainerBattle} onToast={setToast} />
      )}

      {view === 'map' && (
        <PlanetMap save={save} setSave={setSave} setView={setView} onToast={setToast} />
      )}

      {view === 'dex' && (
        <DexView save={save} dexFilter={dexFilter} dexStatus={dexStatus} selectedDexId={selectedDexId} filteredDex={filteredDex} selectedPartyIndex={selectedPartyIndex} selectedCaught={selectedCaught} onFilterChange={setDexFilter} onStatusChange={setDexStatus} onSelect={setSelectedDexId} onToggleTeam={toggleBattleParty} />
      )}

      <BottomNav
        view={view}
        currentPlanet={save.currentPlanet}
        setView={setView}
        onReset={resetGame}
      />

      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  )
}

export default App
