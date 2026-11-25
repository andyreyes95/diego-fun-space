# Battle Background Recipe

## Image output

- Canvas: `1536x1024` PNG or JPEG.
- Style: match the approved polished 2D fantasy-dragon art style.
- One battle background per battle category:
  - Wild encounter
  - Gym battle
  - Gang battle
- Wild backgrounds may vary by planet or elemental theme.
- Gym backgrounds must match the planet and gym type.
- Gang backgrounds must clearly feel like a dark-dragon hideout or rival gang arena.

## Required battle categories

### Wild battle

- Show only the natural environment.
- Do not show a gym, arena building, stadium, cage, or gang structure.
- Include type-appropriate surroundings:
  - Fire: ember trees, red crystals, warm volcanic land
  - Water: pools, reef, waterfalls, blue terrain
  - Grass: moss, vines, giant plants, forest clearing
  - Ice: snow, ice formations, crystalline cliffs
  - Electric: charged dunes, pylons, storm fields
  - Light: bright gardens, sunbeams, observatory ruins
  - Cloud: floating islands, sky bridges, open air
  - Dark: isolated shadows and moonlit wilderness, not an indoor gang base

### Gym battle

- Show an indoor gym or enclosed arena.
- Include visible arena walls, roof or arch structure, gym banners, pillars, and battle-floor markings.
- Gym banners must be painted into the generated background image, never recreated as CSS or DOM overlays.
- Apply the gym leader's dragon type throughout:
  - Fire: embers, red crystals, braziers
  - Grass: living-tree pillars, vines, greenhouse glass
- Keep the action area open and readable.

### Gang battle

- Show a dark-dragon hideout or underground rival-gang arena.
- Use purple, indigo, obsidian, cracked stone, and violet crystals.
- The arena may include cages, machinery, banners, or a portal.
- Keep it dramatic but kid-friendly: no gore or graphic danger.

## Fixed dragon platform geometry
Use stage percentages for every fixed battle, never viewport pixels:

- Player ring: `18.2292%` wide, `8.7891%` tall, `left:18%`, `bottom:20.2%`.
- Opponent ring: `18.2292%` wide, `8.7891%` tall, `right:18%`, `bottom:20.2%`.
- Player dragon: `17.25%` stage width, bottom `20.2%`.
- Opponent dragon: `17.25%` stage width, bottom `20.2%`.

Both combatants use the same elevation and size. They remain separate through horizontal position, while the opponent image is mirrored.

## Equal-Level Arena Rule

For the newer flat fixed battlegrounds:

- Player and opponent rings use the same `18.2292% × 8.7891%` logical size.
- Both rings use the same bottom position.
- Player ring: left `18%`, bottom `20.2%`.
- Opponent ring: right `18%`, bottom `20.2%`.
- Player and opponent dragons use the same `17.25%` stage width and the same bottom position.
- The opponent dragon remains horizontally mirrored.
- No stage-specific dragon resizing or vertical perspective offset is used.

The Emberfall wild battle uses a flat, open floor with the same-sized left and right ring positions. Gym stages remain indoors and include type-themed banners.

## Fixed virtual stage rule

Only after a battleground passes desktop and iPad rotation checks should its background be promoted to a fixed stage.

- Use the first Emberfall wild battle as the reference implementation.
- The fixed stage uses a `1536×1024` logical canvas with a `3:2` aspect ratio.
- The stage is centered inside `.battle-arena`.
- Never use `background-size: cover` on the fixed stage; it can crop the scene.
- Use `background-size: cover` only inside the clipped 3:2 stage if needed, because the stage itself has already preserved the full 1536×1024 ratio.
- Fixed platforms and dragon actors use stage percentages, not viewport pixels:
  - Opponent platform: `14.3229%` wide, `6.8359%` tall, `right:17%`, `top:31%`.
  - Player platform: `18.2292%` wide, `8.7891%` tall, `left:18%`, `bottom:12%`.
- Scale the stage uniformly using CSS container units or an equivalent scale factor.
- Header, console, action buttons, and bottom navigation remain outside the stage and do not participate in its scaling.
- On portrait screens, shrink the stage until it fits both arena width and height.
- On landscape or desktop, center the stage and use the same logical positions.
- Never move rings or dragons with viewport breakpoints; breakpoint CSS may change UI chrome only.

## Ring-free background and letterbox fill

- The generated fixed-stage background must contain no painted rings or battle platforms.
- Render rings as separate transparent CSS/SVG overlays so all stages share the same geometry.
- Align the bottom of the dragon image container with the bottom of the matching ring ellipse.
- Fill any letterbox area around a fixed stage with the same background image using `cover`, a blur, or a darkened matching color.
- Do not leave a neutral gray or flat blank area at the sides or top/bottom.

## Dragon placement

- Opponent dragon side: higher/right and aligned above the opponent platform.
- Player dragon side: lower/left and aligned above the player platform.
- Use contained 1024x1024 transparent dragon PNGs.
- Do not stretch dragon art; use 1:1 aspect ratio and `object-fit: contain`.
- Always mirror the opponent-side dragon horizontally with `transform: scaleX(-1)`.
- Never mirror the player-side dragon.
- The opponent faces left toward the player; the player faces right toward the opponent.

## Filenames

- `public/battle-wild-emberfall.png`
- `public/battle-wild-mossgrove.png`
- `public/battle-gym-emberfall.png`
- `public/battle-gym-mossgrove.png`
- `public/battle-gang-dark.png`

For future planets/types:

- `public/battle-wild-<planet-or-type>.png`
- `public/battle-gym-<planet-or-type>.png`
- `public/battle-gang-<gang-name>.png`

## CSS integration

The battle shell should select exactly one class:

- `battle-wild-emberfall`
- `battle-wild-mossgrove`
- `battle-gym-emberfall`
- `battle-gym-mossgrove`
- `battle-gang-dark`

The fixed platform spans must remain outside and independent of the background image. Never bake platform positions into the generated background unless the generated image already previews those exact zones.
