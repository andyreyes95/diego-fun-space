import { useEffect, useMemo, useState } from 'react'
import { createDragon, dragonSpecies, getEffectiveness, speciesById, typeColors, typeNames } from './data'
import type { BattleState, DragonInstance, DragonSpecies, DragonType, GameSave, Move, View } from './types'

const SAVE_KEY = 'starcrest-dragons-save-v1'

const starterIds = ['embbite', 'puddlefin', 'spriglet']

function loadSave(): GameSave | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY)
    if (!saved) return null
    const parsed = JSON.parse(saved) as Partial<GameSave>
    if (!parsed.party || !parsed.caught) return null
    return {
      playerName: parsed.playerName ?? 'Nova',
      starterId: parsed.starterId ?? 'embbite',
      party: parsed.party,
      bench: parsed.bench ?? [],
      seen: parsed.seen ?? [],
      caught: parsed.caught,
      badges: parsed.badges ?? [],
      storyStep: parsed.storyStep ?? 0,
      darkGangDefeated: parsed.darkGangDefeated ?? false,
      currentPlanet: parsed.currentPlanet ?? 1,
    }
  } catch {
    return null
  }
}

function DragonIcon({
  species,
  size = 180,
  silhouette = false,
  battleMode = false,
}: {
  species: DragonSpecies
  size?: number
  silhouette?: boolean
  battleMode?: boolean
}) {
  if (battleMode) {
    return (
      <img
        className={silhouette ? 'dragon-icon dragon-cutout dragon-silhouette' : 'dragon-icon dragon-cutout'}
        src={`${import.meta.env.BASE_URL}dragon-cutouts/dragon-${String(species.dexNo).padStart(3, '0')}.png`}
        width={size}
        height={size}
        alt={silhouette ? 'Unknown dragon silhouette' : species.name}
      />
    )
  }

  return (
    <img
      className={silhouette ? 'dragon-icon dragon-silhouette' : 'dragon-icon'}
      src={`${import.meta.env.BASE_URL}dragon-cutouts/dragon-${String(species.dexNo).padStart(3, '0')}.png`}
      width={size}
      height={size}
      alt={silhouette ? 'Unknown dragon silhouette' : species.name}
    />
  )
}

function HealthBar({ current, max }: { current: number; max: number }) {
  const percent = Math.max(0, Math.min(100, (current / max) * 100))
  return (
    <div className="health-track" aria-label={`${current} of ${max} health`}>
      <div className={percent > 50 ? 'health-fill' : percent > 25 ? 'health-fill warning' : 'health-fill danger'} style={{ width: `${percent}%` }} />
    </div>
  )
}

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
  const selectedDexSpecies = speciesById[selectedDexId]
  const selectedPartyIndex = save?.party.findIndex((dragon) => dragon.speciesId === selectedDexId) ?? -1
  const selectedCaught = save?.caught.includes(selectedDexId) ?? false
  const badgeNames = ['Ember', 'Bloom', 'Frost', 'Spark', 'Radiant', 'Breeze', 'Eclipse', 'Champion']
  const badgeSymbols = ['◆', '♧', '❉', 'ϟ', '☀', '☁', '◐', '✦']

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

  const navButton = (target: View, label: string, icon: string) => (
    <button className={view === target ? 'nav-button active' : 'nav-button'} onClick={() => setView(target)} type="button">
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  )

  if (!save) {
    return (
      <main className="title-screen">
        <div className="title-sky" aria-hidden="true">
          <span className="cloud cloud-one" />
          <span className="cloud cloud-two" />
          <span className="star star-one">✦</span>
          <span className="star star-two">✦</span>
          <span className="star star-three">✦</span>
        </div>
        <section className="title-card">
          <div className="title-dragons" aria-hidden="true">
            <DragonIcon species={speciesById.embbite} size={150} />
            <DragonIcon species={speciesById.puddlefin} size={150} />
            <DragonIcon species={speciesById.spriglet} size={150} />
          </div>
          <p className="eyebrow">A journey beyond the stars</p>
          <h1>Starcrest<br /><span>Dragons</span></h1>
          <label className="name-field">
            Your trainer name
            <input value={playerName} maxLength={14} onChange={(event) => setPlayerName(event.target.value)} />
          </label>
          <div className="starter-grid">
            {starterIds.map((id) => {
              const species = speciesById[id]
              return (
                <button
                  key={id}
                  type="button"
                  className={selectedStarter === id ? 'starter-card selected' : 'starter-card'}
                  onClick={() => setSelectedStarter(id)}
                >
                  <DragonIcon species={species} size={120} />
                  <strong>{species.name}</strong>
                  <span className="type-pill" style={{ background: typeColors[species.type] }}>{typeNames[species.type]}</span>
                </button>
              )
            })}
          </div>
          <button className="primary-button" type="button" onClick={startGame}>Begin the adventure</button>
        </section>
      </main>
    )
  }

  if (view === 'battle' && battle) {
    const activeIndex = save.party[activePartyIndex]?.hp > 0
      ? activePartyIndex
      : save.party.findIndex((dragon) => dragon.hp > 0)
    const noAbleDragons = activeIndex < 0
    const active = noAbleDragons ? save.party[0] : save.party[activeIndex]
    const activeSpecies = speciesById[active.speciesId]
    const enemySpecies = speciesById[battle.enemy.speciesId]
    const currentCelebration = celebrationQueue[0]
    if (currentCelebration) {
      if (currentCelebration.kind === 'evolution') {
        const before = speciesById[currentCelebration.beforeId]
        const after = speciesById[currentCelebration.afterId]
        return (
          <main className="celebration-screen evolution-celebration">
            <div className="celebration-rays" aria-hidden="true" />
            <section className="celebration-card" role="dialog" aria-modal="true" aria-labelledby="evolution-title">
              <p className="eyebrow">What a glow-up!</p>
              <h1 id="evolution-title">{before.name} evolved!</h1>
              <div className="evolution-reveal">
                <div className="evolution-before">
                  <DragonIcon species={before} size={170} battleMode />
                  <strong>{before.name}</strong>
                </div>
                <span className="evolution-arrow" aria-hidden="true">➜</span>
                <div className="evolution-after">
                  <DragonIcon species={after} size={210} battleMode />
                  <strong>{after.name}</strong>
                  <span className="type-pill" style={{ background: typeColors[after.type] }}>{typeNames[after.type]}</span>
                </div>
              </div>
              <p>{after.description}</p>
              <button className="primary-button" type="button" onClick={dismissCelebration}>Amazing!</button>
            </section>
          </main>
        )
      }
      if (currentCelebration.kind === 'catch') {
        const caughtSpecies = speciesById[currentCelebration.speciesId]
        return (
          <main className="celebration-screen catch-celebration">
            <div className="celebration-rays" aria-hidden="true" />
            <section className="celebration-card catch-card" role="dialog" aria-modal="true" aria-labelledby="catch-title">
              <p className="eyebrow">Gotcha!</p>
              <h1 id="catch-title">{caughtSpecies.name} joined your team!</h1>
              <div className="catch-reveal">
                <div className="catch-sparkles" aria-hidden="true">
                  <span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span>
                </div>
                <div className="capture-star" aria-hidden="true">★</div>
                <DragonIcon species={caughtSpecies} size={230} battleMode />
              </div>
              <div className="detail-pills">
                <span style={{ background: typeColors[caughtSpecies.type] }}>{typeNames[caughtSpecies.type]}</span>
                <span>{currentCelebration.joinedParty ? 'Added to party' : 'Saved to the Dragon Dex'}</span>
              </div>
              <p>{caughtSpecies.description}</p>
              <button className="primary-button" type="button" onClick={dismissCelebration}>
                {currentCelebration.joinedParty ? 'Welcome aboard!' : 'See my team'}
              </button>
            </section>
          </main>
        )
      }
      const badgeName = currentCelebration.badge === 'Ember' ? 'Ember Badge' : 'Bloom Badge'
      const badgeType = currentCelebration.badge === 'Ember' ? 'fire' : 'grass'
      return (
        <main className="celebration-screen badge-celebration">
          <div className="celebration-rays" aria-hidden="true" />
          <section className="celebration-card badge-card" role="dialog" aria-modal="true" aria-labelledby="badge-title">
            <p className="eyebrow">Gym Victory</p>
            <h1 id="badge-title">You defeated {currentCelebration.badge === 'Ember' ? 'Sol' : 'Moss'}!</h1>
            <div className={`earned-badge ${badgeType}`} aria-label={badgeName}>
              {badgeType === 'fire' ? (
                <>
                  <span className="badge-wing left" />
                  <span className="badge-gem">✦</span>
                  <span className="badge-wing right" />
                </>
              ) : (
                <>
                  <span className="badge-leaf left" />
                  <span className="badge-gem">♧</span>
                  <span className="badge-leaf right" />
                </>
              )}
            </div>
            <h2>{badgeName}</h2>
            <p>{badgeType === 'fire'
              ? 'Emberfall recognizes your courage. Fire dragons will remember your brave start.'
              : 'Mossgrove recognizes your teamwork. The path to the Light dragons is now open.'}</p>
            <button className="primary-button" type="button" onClick={dismissCelebration}>Add to my badges</button>
          </section>
        </main>
      )
    }
    return (
      <main className={`${screenShake ? 'battle-screen shake' : 'battle-screen'} ${save.currentPlanet === 2 ? 'battle-mossgrove' : 'battle-emberfall'}`}>
        <header className="battle-header">
          <button className="icon-button" type="button" onClick={() => battle.finished ? runFromBattle() : runFromBattle()} aria-label="Leave battle">×</button>
          <div>
            <span>{battle.enemyName} Battle</span>
            {battle.kind !== 'wild' && <strong>{battle.kind === 'gang' ? 'Dark Gang' : 'Gym Leader'}</strong>}
          </div>
        </header>
        <section className="battle-arena">
          <div className="enemy-side">
            <div className="battle-status enemy-status">
              <strong>{enemySpecies.name}</strong>
              <span>Lv. {battle.enemy.level}</span>
              <HealthBar current={battle.enemy.hp} max={battle.enemy.maxHp} />
            </div>
            <DragonIcon species={enemySpecies} size={210} battleMode />
          </div>
          <div className="player-side">
            <DragonIcon species={activeSpecies} size={210} battleMode />
            <div className="battle-status player-status">
              <strong>{activeSpecies.name}</strong>
              <span>Lv. {active.level}</span>
              <HealthBar current={active.hp} max={active.maxHp} />
              <small>{active.hp} / {active.maxHp} HP</small>
            </div>
          </div>
        </section>
        <section className="battle-console">
          <div className="battle-log" aria-live="polite">
            {battle.log.slice(-3).map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
          </div>
          {battle.finished || noAbleDragons ? (
            <div className="battle-actions">
              <button className="primary-button" type="button" onClick={runFromBattle}>
                {battle.won ? 'Continue' : noAbleDragons ? 'Go heal' : 'Return'}
              </button>
            </div>
          ) : (
            <div className="battle-controls">
              <div className="battle-actions">
                {active.moves.map((move) => (
                  <button key={move.name} type="button" className="move-button" onClick={() => useMove(move)}>
                    <span>{move.name}</span>
                    <small style={{ color: typeColors[move.type] }}>{typeNames[move.type]} · {move.power} power</small>
                  </button>
                ))}
                {battle.kind === 'wild' && (
                  <button type="button" className="capture-button" onClick={tryCapture}>Catch</button>
                )}
                <button type="button" className="run-button" onClick={runFromBattle}>Run</button>
              </div>
              <div className="team-switcher" aria-label="Switch active dragon">
                {save.party.map((dragon, index) => {
                  const species = speciesById[dragon.speciesId]
                  return (
                    <button
                      key={`${dragon.speciesId}-${index}`}
                      type="button"
                      className={index === activePartyIndex ? 'team-slot active' : dragon.hp <= 0 ? 'team-slot fainted' : 'team-slot'}
                      onClick={() => switchDragon(index)}
                      disabled={battle.finished || dragon.hp <= 0}
                    >
                      <span className="team-slot-dot" style={{ background: typeColors[species.type] }} />
                      <strong>{species.name}</strong>
                      <small>{dragon.hp}/{dragon.maxHp}</small>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      </main>
    )
  }

  return (
    <main className="game-shell">
      <header className="game-header">
        <button className="brand-button" type="button" onClick={() => setView('town')}>
          <span className="brand-mark">✦</span>
          <span><strong>STARCREST</strong><small>DRAGONS</small></span>
        </button>
        <div className="header-progress">
          <span><strong>{caughtCount}</strong> caught</span>
          <span><strong>{seenCount}</strong> seen</span>
          <span className="badge-dots" aria-label={`${save.badges.length} gym badges`}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <span
                key={index}
                className={save.badges.includes(badgeNames[index]) ? `header-badge earned badge-${index}` : `header-badge badge-${index}`}
                title={save.badges.includes(badgeNames[index]) ? `${badgeNames[index]} Badge earned` : `${badgeNames[index]} Badge locked`}
                aria-label={save.badges.includes(badgeNames[index]) ? `${badgeNames[index]} Badge earned` : `${badgeNames[index]} Badge locked`}
              >
                {badgeSymbols[index]}
              </span>
            ))}
          </span>
        </div>
      </header>

      {view === 'town' && (
        <section className="world-view town-view">
          <div className="world-copy">
            <p className="eyebrow">Home planet · Willowvale</p>
            <h1>Welcome home, {save.playerName}.</h1>
            <p>Your dream begins here. Choose a route, meet other tamers, and prepare for Planet Emberfall.</p>
          </div>
          <div className="town-map" aria-label="Willowvale town map">
            <div className="house house-left"><span>Lab</span></div>
            <div className="house house-right"><span>Dragon Center</span></div>
            <div className="town-portal" />
            <button
              className="map-location portal-location"
              type="button"
              onClick={() => {
                setSave((current) => current ? { ...current, currentPlanet: 1 } : current)
                setView('planet1')
              }}
            >
              <span>Travel to Planet 1</span>
              <strong>Emberfall</strong>
            </button>
            <button className="map-location center-location" type="button" onClick={healParty}>
              <span>Healing Center</span>
              <strong>Rest your team</strong>
            </button>
          </div>
          <aside className="quest-card">
            <p>Next objective</p>
            <strong>{save.badges.includes('Ember') ? 'Travel to Mossgrove' : 'Earn the Ember Gym Badge'}</strong>
            <div className="quest-progress"><i style={{ width: save.badges.includes('Ember') ? '50%' : '25%' }} /></div>
          </aside>
        </section>
      )}

      {view === 'planet1' && (
        <section className="world-view planet-view emberfall">
          <div className="world-copy">
            <p className="eyebrow">Planet 01 · Emberfall</p>
            <h1>Cinderwood Trail</h1>
            <p>Warm winds carry Fire, Grass, and Electric dragons between the crater flowers.</p>
          </div>
          <div className="planet-map">
            <span className="planet-sun" />
            <span className="planet-rock rock-one" />
            <span className="planet-rock rock-two" />
            <button className="map-location wild-location" type="button" onClick={() => beginWildBattle(1)}>
              <span>Explore</span><strong>Wild dragons</strong>
            </button>
            <button className="map-location gym-location" type="button" onClick={() => beginTrainerBattle('fireGym')}>
              <span>{save.badges.includes('Ember') ? 'Badge earned' : 'Fire Gym'}</span>
              <strong>Challenge Sol</strong>
            </button>
            <button
              className="map-location next-location"
              type="button"
              onClick={() => {
                if (!save.badges.includes('Ember')) {
                  setToast('Beat Gym Leader Sol to unlock Mossgrove!')
                  return
                }
                setSave((current) => current ? { ...current, currentPlanet: 2 } : current)
                setView('planet2')
              }}
            >
              <span>Next planet</span><strong>Mossgrove</strong>
            </button>
          </div>
        </section>
      )}

      {view === 'planet2' && (
        <section className="world-view planet-view mossgrove">
          <div className="world-copy">
            <p className="eyebrow">Planet 02 · Mossgrove</p>
            <h1>The Whispering Canopy</h1>
            <p>Track bright Light dragons while keeping watch for the Dark Gang.</p>
          </div>
          <div className="planet-map moss-map">
            <span className="giant-tree tree-one" />
            <span className="giant-tree tree-two" />
            <button className="map-location wild-location" type="button" onClick={() => beginWildBattle(2)}>
              <span>Explore</span><strong>Wild dragons</strong>
            </button>
            <button className="map-location gym-location" type="button" onClick={() => beginTrainerBattle('grassGym')}>
              <span>{save.badges.includes('Bloom') ? 'Badge earned' : 'Grass Gym'}</span>
              <strong>Challenge Moss</strong>
            </button>
            <button className="map-location gang-location" type="button" onClick={() => beginTrainerBattle('gang')}>
              <span>Dark Gang</span><strong>Break the ambush</strong>
            </button>
          </div>
        </section>
      )}

      {view === 'map' && (
        <section className="planet-map-view">
          <div className="map-heading">
            <div>
              <p className="eyebrow">Starlane Map</p>
              <h1>Choose a planet</h1>
            </div>
            <span>{save.currentPlanet === 1 ? 'Emberfall route' : 'Mossgrove route'}</span>
          </div>
          <div className="planet-route" aria-label="Planet route">
            <button
              type="button"
              className={save.currentPlanet === 1 ? 'planet-node active' : 'planet-node'}
              onClick={() => setView('town')}
            >
              <span className="planet-preview willow-preview" />
              <strong>Willowvale</strong>
              <small>Home planet · Town</small>
              <i>Available</i>
            </button>
            <span className="route-line" aria-hidden="true" />
            <button
              type="button"
              className={save.currentPlanet === 1 ? 'planet-node active' : 'planet-node'}
              onClick={() => {
                setSave((current) => current ? { ...current, currentPlanet: 1 } : current)
                setView('planet1')
              }}
            >
              <span className="planet-preview ember-preview" />
              <strong>Emberfall</strong>
              <small>Planet 1 · Fire Gym</small>
              <i>Available</i>
            </button>
            <span className={save.badges.includes('Ember') ? 'route-line unlocked' : 'route-line'} aria-hidden="true" />
            <button
              type="button"
              className={save.currentPlanet === 2 ? 'planet-node active' : save.badges.includes('Ember') ? 'planet-node' : 'planet-node locked'}
              onClick={() => {
                if (!save.badges.includes('Ember')) {
                  setToast('Beat Gym Leader Sol to unlock Mossgrove!')
                  return
                }
                setSave((current) => current ? { ...current, currentPlanet: 2 } : current)
                setView('planet2')
              }}
            >
              <span className="planet-preview moss-preview" />
              <strong>Mossgrove</strong>
              <small>Planet 2 · Grass Gym</small>
              <i>{save.badges.includes('Ember') ? 'Available' : 'Locked: Ember Badge'}</i>
            </button>
          </div>
        </section>
      )}

      {view === 'dex' && (
        <section className="dex-view">
          <div className="dex-heading">
            <div>
              <p className="eyebrow">Dragon Dex</p>
              <h1>Dragon Collection</h1>
            </div>
            <div className="dex-progress">
              <strong>{caughtCount} / 24</strong>
              <span>Caught</span>
            </div>
          </div>
          <div className="dex-controls">
            <div className="filter-row" aria-label="Filter by type">
              {(['all', 'fire', 'water', 'grass', 'ice', 'electric', 'light', 'cloud', 'dark'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={dexFilter === filter ? 'filter-button active' : 'filter-button'}
                  onClick={() => setDexFilter(filter)}
                >
                  {filter === 'all' ? 'All' : typeNames[filter]}
                </button>
              ))}
            </div>
            <select value={dexStatus} onChange={(event) => setDexStatus(event.target.value as 'all' | 'seen' | 'caught')} aria-label="Filter by discovery status">
              <option value="all">All dragons</option>
              <option value="seen">Seen</option>
              <option value="caught">Caught</option>
            </select>
          </div>
          <div className="dex-layout">
            <div className="dex-grid">
              {filteredDex.map((species) => {
                const seen = save.seen.includes(species.id)
                const caught = save.caught.includes(species.id)
                return (
                  <button
                    type="button"
                    key={species.id}
                    className={[
                      'dex-card',
                      selectedDexId === species.id ? 'selected' : '',
                      seen ? '' : 'undiscovered',
                    ].filter(Boolean).join(' ')}
                    onClick={() => setSelectedDexId(species.id)}
                    aria-label={seen ? `${species.name}, Dex number ${species.dexNo}` : `Undiscovered dragon, Dex number ${species.dexNo}`}
                  >
                    <span className="dex-number">#{String(species.dexNo).padStart(3, '0')}</span>
                    {seen ? <DragonIcon species={species} size={100} /> : <DragonIcon species={species} size={100} silhouette />}
                    <strong>{seen ? species.name : 'Unknown'}</strong>
                    {seen && <small style={{ color: typeColors[species.type] }}>{caught ? 'Caught' : 'Seen'}</small>}
                  </button>
                )
              })}
            </div>
            <aside className="dex-detail">
              {save.seen.includes(selectedDexId) ? (
                <>
                  <DragonIcon species={selectedDexSpecies} size={220} />
                  <div className="dex-detail-title">
                    <span>#{String(selectedDexSpecies.dexNo).padStart(3, '0')}</span>
                    <h2>{selectedDexSpecies.name}</h2>
                  </div>
                  <div className="detail-pills">
                    <span style={{ background: typeColors[selectedDexSpecies.type] }}>{typeNames[selectedDexSpecies.type]}</span>
                    <span>Stage {selectedDexSpecies.stage}</span>
                  </div>
                  <div className="dex-party-control">
                    <div className="party-slots" aria-label="Battle team slots">
                      {[0, 1, 2, 3].map((slot) => {
                        const dragon = save.party[slot]
                        return (
                          <span key={slot} className={dragon ? 'party-slot filled' : 'party-slot'}>
                            {dragon ? String(speciesById[dragon.speciesId].name).slice(0, 1) : slot + 1}
                          </span>
                        )
                      })}
                    </div>
                    {selectedCaught && (
                      <button
                        type="button"
                        className={selectedPartyIndex >= 0 ? 'party-toggle remove' : 'party-toggle'}
                        onClick={() => toggleBattleParty(selectedDexId)}
                      >
                        {selectedPartyIndex >= 0 ? 'Remove from team' : save.party.length >= 4 ? 'Team full' : 'Add to team'}
                      </button>
                    )}
                  </div>
                  <p>{selectedDexSpecies.description}</p>
                  <dl>
                    <div><dt>Habitat</dt><dd>{selectedDexSpecies.habitat}</dd></div>
                    <div><dt>Height</dt><dd>{selectedDexSpecies.height}</dd></div>
                    {selectedDexSpecies.evolvesTo && (
                      <div><dt>Evolution</dt><dd>Level {selectedDexSpecies.evolvesAt} · {speciesById[selectedDexSpecies.evolvesTo].name}</dd></div>
                    )}
                  </dl>
                </>
              ) : (
                <div className="unknown-detail">
                  <DragonIcon species={selectedDexSpecies} size={220} silhouette />
                  <h2>Undiscovered</h2>
                  <p>Explore planets and meet wild dragons to reveal this entry.</p>
                </div>
              )}
            </aside>
          </div>
        </section>
      )}

      <nav className="bottom-nav" aria-label="Main navigation">
        {navButton('town', 'Town', '⌂')}
        <button
          className={view === 'planet1' || view === 'planet2' ? 'nav-button active' : 'nav-button'}
          type="button"
          onClick={() => setView(save.currentPlanet === 2 ? 'planet2' : 'planet1')}
        >
          <span aria-hidden="true">✦</span>
          <span>{save.currentPlanet === 2 ? 'Mossgrove' : 'Emberfall'}</span>
        </button>
        {navButton('map', 'Planet Map', '◎')}
        {navButton('dex', 'Dragon Dex', '◎')}
        <button className="nav-button" type="button" onClick={resetGame}>Reset</button>
      </nav>

      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  )
}

export default App
