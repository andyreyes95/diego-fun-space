import { BottomNav, GameHeader } from './components/GameChrome'
import { BattleScreen } from './components/screens/BattleScreen'
import { EventScreen } from './components/screens/EventScreen'
import { OpeningStory } from './components/screens/OpeningStory'
import { DexView } from './components/screens/DexView'
import { SolarMap } from './components/screens/SolarMap'
import { TeamScreen } from './components/screens/TeamScreen'
import { TitleScreen } from './components/screens/TitleScreen'
import { PlanetScreen, TownScreen } from './components/screens/WorldScreens'
import { useGameController } from './hooks/useGameController'
import type { View } from './types'
import { UnlockScreen } from './components/UnlockScreen'
import { MarketScreen } from './components/screens/MarketScreen'
import { CostConfirmDialog } from './components/CostConfirmDialog'
import { getHealingCost, GYM_ENTRY_COST, normalizeCoins, PORTAL_COST } from './game/economy'

function App() {
  const game = useGameController()

  if (!game.save) {
    return (
      <TitleScreen
        playerName={game.playerName}
        selectedStarter={game.selectedStarter}
        onNameChange={game.setPlayerName}
        onStarterChange={game.setSelectedStarter}
        onStart={game.startGame}
      />
    )
  }

  const currentPlanet = game.save.currentPlanet

  if (game.view === 'intro') {
    return <OpeningStory save={game.save} onFinish={game.finishIntro} />
  }

  if (game.view === 'battle' && game.battle) {
    const activeIndex = game.save.party[game.activePartyIndex]?.hp > 0
      ? game.activePartyIndex
      : game.save.party.findIndex((dragon) => dragon.hp > 0)
    const active = activeIndex < 0 ? game.save.party[0] : game.save.party[activeIndex]

    if (game.eventQueue[0]) {
      return (
        <EventScreen
          event={game.eventQueue[0]}
          currentPlanet={currentPlanet}
          onDismiss={game.dismissEvent}
        />
      )
    }

    return (
      <BattleScreen
        save={game.save}
        battle={game.battle}
        active={active}
        activePartyIndex={activeIndex >= 0 ? activeIndex : 0}
        screenShake={game.screenShake}
        busy={game.battleBusy}
        onUseMove={game.useMove}
        onTryCapture={game.tryCapture}
        onRun={game.runFromBattle}
        onSwitch={game.switchDragon}
        selectedOrb={game.selectedCaptureOrb}
        onSelectOrb={game.setSelectedCaptureOrb}
        toast={game.toast}
      />
    )
  }

  return (
    <main className="game-shell">
      <GameHeader
        badgeNames={game.badgeNames}
        badges={game.save.badges}
        coins={game.save.coins}
        onHome={() => game.setView(currentPlanet === 0 ? 'town' : currentPlanet === 1 ? 'planet1' : currentPlanet === 2 ? 'planet2' : currentPlanet === 3 ? 'planet3' : currentPlanet === 4 ? 'planet4' : currentPlanet === 5 ? 'planet5' : currentPlanet === 6 ? 'planet6' : currentPlanet === 7 ? 'planet7' : 'planet8')}
      />

      {game.view === 'town' && (
        <TownScreen
          save={game.save}
          onTravel={() => game.setView('map')}
          onReplayStory={() => game.setView('intro')}
        />
      )}

      {game.view === 'planet1' && (
        <PlanetScreen save={game.save} planet={1} onViewChange={game.setView} onWildBattle={game.beginWildBattle} onTrainerBattle={game.requestTrainerBattle} onHeal={game.requestHealing} onToast={game.showToast} onMarket={() => game.setView('market')} />
      )}

      {game.view === 'planet2' && (
        <PlanetScreen save={game.save} planet={2} onViewChange={game.setView} onWildBattle={game.beginWildBattle} onTrainerBattle={game.requestTrainerBattle} onHeal={game.requestHealing} onToast={game.showToast} onMarket={() => game.setView('market')} />
      )}

      {game.view === 'planet3' && (
        <PlanetScreen save={game.save} planet={3} onViewChange={game.setView} onWildBattle={game.beginWildBattle} onTrainerBattle={game.requestTrainerBattle} onHeal={game.requestHealing} onToast={game.showToast} onMarket={() => game.setView('market')} />
      )}

      {game.view === 'planet4' && (
        <PlanetScreen save={game.save} planet={4} onViewChange={game.setView} onWildBattle={game.beginWildBattle} onTrainerBattle={game.requestTrainerBattle} onHeal={game.requestHealing} onToast={game.showToast} onMarket={() => game.setView('market')} />
      )}

      {game.view === 'planet5' && (
        <PlanetScreen save={game.save} planet={5} onViewChange={game.setView} onWildBattle={game.beginWildBattle} onTrainerBattle={game.requestTrainerBattle} onHeal={game.requestHealing} onToast={game.showToast} onMarket={() => game.setView('market')} />
      )}

      {game.view === 'planet6' && (
        <PlanetScreen save={game.save} planet={6} onViewChange={game.setView} onWildBattle={game.beginWildBattle} onTrainerBattle={game.requestTrainerBattle} onHeal={game.requestHealing} onToast={game.showToast} onMarket={() => game.setView('market')} />
      )}

      {game.view === 'planet7' && (
        <PlanetScreen save={game.save} planet={7} onViewChange={game.setView} onWildBattle={game.beginWildBattle} onTrainerBattle={game.requestTrainerBattle} onHeal={game.requestHealing} onToast={game.showToast} onMarket={() => game.setView('market')} />
      )}

      {game.view === 'planet8' && (
        <PlanetScreen save={game.save} planet={8} onViewChange={game.setView} onWildBattle={game.beginWildBattle} onTrainerBattle={game.requestTrainerBattle} onHeal={game.requestHealing} onToast={game.showToast} onMarket={() => game.setView('market')} />
      )}

      {game.view === 'map' && (
        <SolarMap save={game.save} onNavigate={game.requestTravel} onToast={game.showToast} />
      )}

      {game.view === 'market' && (
        <MarketScreen
          save={game.save}
          planet={game.save.currentPlanet}
          planetName={['Willowvale', 'Emberfall', 'Mossgrove', 'Voltspire', 'Cloudrest', 'Tidehaven', 'Frostveil', 'Umbralis', 'Luminara'][game.save.currentPlanet]}
          onBuy={game.buyCaptureOrb}
          onClose={() => game.setView(game.save!.currentPlanet === 0 ? 'town' : (`planet${game.save!.currentPlanet}` as View))}
        />
      )}

      {game.view === 'dex' && (
        <DexView
          save={game.save}
          dexFilter={game.dexFilter}
          dexStatus={game.dexStatus}
          selectedDexId={game.selectedDexId}
          filteredDex={game.filteredDex}
          onFilterChange={game.setDexFilter}
          onStatusChange={game.setDexStatus}
          onSelect={game.setSelectedDexId}
        />
      )}

      {game.view === 'team' && (
        <TeamScreen
          save={game.save}
          onNickname={game.setDragonNickname}
          onMove={game.moveDragon}
        />
      )}

      {/* Temporary localhost debug action is wired through onUnlockAll. */}
      <BottomNav
        view={game.view}
        currentPlanet={currentPlanet}
        setView={game.setView}
        onReset={game.resetGame}
        onUnlockAll={game.debugUnlockAll}
      />

      {game.unlockScreenOpen && (
        <UnlockScreen save={game.save} onApply={game.applyUnlocks} onClose={game.closeUnlockScreen} />
      )}

      {game.pendingCostAction && (
        <CostConfirmDialog
          kind={game.pendingCostAction.kind}
          battleKind={game.pendingCostAction.kind === 'gym' ? game.pendingCostAction.battleKind : undefined}
          cost={game.pendingCostAction.kind === 'heal'
            ? getHealingCost(game.save)
            : game.pendingCostAction.kind === 'travel'
              ? PORTAL_COST
              : GYM_ENTRY_COST}
          balance={normalizeCoins(game.save.coins)}
          party={game.save.party}
          onConfirm={game.confirmPendingCostAction}
          onCancel={game.cancelPendingCostAction}
        />
      )}

      {game.toast && <div className="toast" role="status">{game.toast}</div>}
    </main>
  )
}

export default App
