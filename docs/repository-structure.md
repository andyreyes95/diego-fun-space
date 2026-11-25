# Repository Structure

```text
src/
  components/
    screens/
      BattleScreen.tsx
      CelebrationScreen.tsx
      DexView.tsx
      PlanetMap.tsx
      TitleScreen.tsx
      WorldScreens.tsx
    DragonIcon.tsx
    GameChrome.tsx
    StatusBars.tsx
  game/
    storage.ts
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
      mossgrove.png
      planet-map.png
  favicon.svg
  manifest.webmanifest
  sw.js
```

## Ownership

- `src/App.tsx`: application state, save mutations, encounter setup, battle calculations, and screen routing.
- `src/components/screens/`: major full-screen views.
- `src/components/`: reusable interface components.
- `src/game/`: persistence and future engine helpers.
- `src/data.ts`: species, moves, type chart, and game content.
- `src/types.ts`: shared TypeScript types.
- `public/assets/dragons/`: individual Dragon Dex and battle PNGs.
- `public/assets/battlegrounds/`: fixed 1536×1024 battle scenes.
- `public/assets/maps/`: town, planet, and star-map artwork.
