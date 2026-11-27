# Repository Structure

```text
src/
  components/
    dex/
      DexDetailsPane.tsx
      DexTile.tsx
    team/
      TeamDetailsPane.tsx
      TeamPartyTile.tsx
      TeamTile.tsx
    screens/
      BattleScreen.tsx
      EventScreen.tsx
      DexView.tsx
      PlanetMap.tsx
      TitleScreen.tsx
      WorldScreens.tsx
    DragonIcon.tsx
    DragonName.tsx
    GameChrome.tsx
    LandscapeGate.tsx
    MapLocationCard.tsx
    StatusBars.tsx
  game/
    battle.ts
    battle.test.ts
    dex.ts
    dex.test.ts
    registration.ts
    registration.test.ts
    storage.ts
  hooks/
    useGameController.ts
  styles/
    reset.css
    tokens.css
  App.tsx
  data.ts
  main.tsx
  style.css
  types.ts

public/
  assets/
    dragons/
      dragon-001.png
      dragon-002.png
      dragon-284.png
    battlegrounds/
      wild-emberfall.png
      wild-mossgrove.png
      gym-emberfall.png
      gym-mossgrove.png
      gang-dark.png
    maps/
      willowvale.png
      emberfall.png
      emberfall-layered.png
      mossgrove.png
      mossgrove-layered.png
      planet-map.png
       map-locations/           # transparent layered planet destinations
      emberfall/
        wild.png
        gym.png
        healing.png
        market.png
        portal.png
         mossgrove/
        wild.png
        gym.png
        healing.png
        market.png
        portal.png
  favicon.svg
  manifest.webmanifest
  sw.js
```

## Ownership

- `src/App.tsx`: screen composition and top-level routing only.
- `src/components/screens/`: major full-screen views.
- `src/components/dex/`: reusable Pokédex tiles and species detail panes.
- `src/components/team/`: reusable Party list tiles, owned-copy tiles, and individual details.
- `src/components/`: reusable interface components.
- `src/components/LandscapeGate.tsx`: blocks interaction in portrait or square viewports with rotate/resize guidance, retaining mounted game state when the viewport changes. `src/main.tsx` wraps every screen with this gate; the web app manifest also requests landscape where supported.
- `src/game/`: persistence, registration, Dex filtering, battle math, and focused tests.
- `src/hooks/useGameController.ts`: UI orchestration, save mutations, encounters, battle actions, and navigation.
- `src/styles/`: shared reset and design-token styles; screen/component rules stay in `src/style.css`.
- `src/data.ts`: species, moves, type chart, and game content.
- `src/types.ts`: shared TypeScript types.
- `public/assets/dragons/`: individual Dragon Dex and battle PNGs.
- `public/assets/battlegrounds/`: fixed 1536×1024 battle scenes.
- `public/assets/maps/`: town, planet, and star-map artwork, including terrain-only layered-map bases.
- `public/assets/map-locations/`: transparent destinations positioned over layered planet maps.
