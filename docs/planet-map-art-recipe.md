# Planet Map Art Recipe

## Goal

Every planet uses the same interaction layout while retaining its own elemental theme. A planet map is assembled from one terrain-only base image and location assets layered over six permanent map areas. Five areas contain the core destinations; the sixth is reserved at the center for planet-specific story or event content. Location positions never depend on what happens to be in a planet's background.

The first implementation is the Emberfall trial. Mossgrove is the first repeat using the same recipe:

- `public/assets/maps/emberfall-layered.png`
- `public/assets/map-locations/emberfall/wild.png`
- `public/assets/map-locations/emberfall/gym.png`
- `public/assets/map-locations/emberfall/healing.png`
- `public/assets/map-locations/emberfall/market.png`
- `public/assets/map-locations/emberfall/portal.png`
- `public/assets/maps/mossgrove-layered.png`
- `public/assets/map-locations/mossgrove/wild.png`
- `public/assets/map-locations/mossgrove/gym.png`
- `public/assets/map-locations/mossgrove/healing.png`
- `public/assets/map-locations/mossgrove/market.png`
- `public/assets/map-locations/mossgrove/portal.png`

Use `public/assets/maps/emberfall-layered.png` as the required blueprint image for every later planet. Include it in every base-map generation request alongside a simple one-color overlay showing the six area boundaries. The blueprint carries the actual path rhythm, partition balance, horizon height, camera angle, usable footprint, and visual spacing; the prompt provides the new elemental theme. The next planet must preserve that composition rather than independently reinterpret the layout.

## Shared map canvas

- Base image: `1536x1024` PNG.
- Logical aspect ratio: `3:2`.
- View: elevated three-quarter aerial/isometric map view.
- Camera, horizon height, light direction, contrast, scale, and path width must match across planets.
- The complete base must remain visible. Do not position a `cover` image independently of the location layer.
- Letterbox space outside the 3:2 map may reuse the same base image, darkened and blurred.
- Every location card, image, and label belongs to the same 3:2 stage. They scale and move as one unit.
- Core location artwork is displayed at `19%` of stage width.

## Required locations and reserved area

Every planet must expose these locations, even if the destination is locked:

1. Wild dragon exploration
2. Gym
3. Healing center
4. Market
5. Interplanetary portal

The sixth central area is reserved clear space for a future story beat, special encounter, landmark, or planet-specific destination. It must remain visually usable, but it should not displace any of the five core locations. Do not generate or place a special-area asset until that feature is designed.

Future planet-specific encounters may use this reserved area after their behavior and interaction are defined. Do not assume a permanent destination for gang ambushes or other events.

## Fixed anchor positions

Positions are percentages of the `1536x1024` map stage, measured from the top-left. The center of each transparent PNG is anchored at:

| Location | Left | Top |
| --- | ---: | ---: |
| Wild exploration | `25%` | `31%` |
| Gym | `75%` | `31%` |
| Reserved special area | `50%` | `51%` |
| Healing center | `20%` | `64%` |
| Market | `80%` | `64%` |
| Portal | `50%` | `79%` |

Keep these values in CSS for every planet. The pairs are intentionally mirrored around the `50%` center line: wild/gym, healing/market. The portal remains centered on that line. Themed assets may be different shapes, but their exported footprint, anchor, and transparent padding must be consistent.

## Terrain-only base generation

Generate the base separately from every location. It must include:

- The planet's natural terrain and elemental palette.
- A broad, readable route that connects all six partitioned areas.
- Open, comparatively flat ground around every anchor.
- Distant scenery, mountains, clouds, floating islands, lava, rivers, or large trees only where they do not obscure an anchor.

It must not include:

- Gyms, healing centers, markets, portals, camps, or other interactive destinations.
- A wild exploration structure that would collide with its overlay.
- Text, labels, signs, logos, UI, characters, or dragons.

Use the approved Emberfall base as the geometric reference for subsequent planets. A repeated text prompt is not sufficient to guarantee matching placement.

Reference input for a new planet:

1. `public/assets/maps/emberfall-layered.png` as the strict composition authority.
2. The planet's existing approved scenic art as the palette/theme authority.
3. A six-area coordinate guide matching the anchor table above.

Do not ask the model to invent the map partitions from the text alone. Explicitly require it to preserve the blueprint's camera, path rhythm, horizon, foreground, and destination clearings. Approve the base before generating any overlays.

Suggested base prompt:

```text
Create a polished 2D fantasy game planet map background.
Canvas: 1536x1024 PNG, elevated three-quarter aerial/isometric view.
Match the approved Dragon Tamer map style, camera, and lighting.
Theme: <planet name and elemental environment>.
Show terrain, distant scenery, and a simple connecting trail only.
Leave clear, flat buildable terrain centered at:
wild 25% left / 31% top,
gym 75% left / 31% top,
reserved special area 50% left / 51% top,
healing 20% left / 64% top,
market 80% left / 64% top,
portal 50% left / 79% top.
Preserve the six connected partitions visible in the blueprint image, while adapting only the terrain and elemental scenery.
Keep the lower map readable and avoid occluding those six zones.
No structures, destinations, characters, creatures, text, labels, signs, logos, UI, or watermarks.
```

## Transparent location assets

Generate one separate asset for each destination:

- Output: `1024x1024` RGBA PNG.
- Background: true alpha transparency.
- View: same elevated three-quarter/isometric camera as the base.
- Light source: upper left for every asset and every planet.
- Keep the meaningful footprint centered within roughly 80% of the canvas.
- Preserve equal transparent padding on all assets of the same type.
- Export a soft contact shadow into the alpha where necessary.
- Do not bake labels, buttons, letters, signs, borders, or UI into the image.
- Supply both the approved new planet base and the matching approved Emberfall destination asset as generation references.
- Preserve the reference asset's overall footprint, vertical mass, silhouette, transparent padding, and map-scale readability; change materials and elemental motifs, not the anchor geometry.
- Approve all five core assets as a set before integrating them. Check them at map size, not only at full resolution.

The destination family should remain recognizable across planets:

| Asset | Shared identity | Planet variation |
| --- | --- | --- |
| `wild.png` | Natural habitat entrance and short trail | Foliage, crystals, rock, weather |
| `gym.png` | Prominent trainer building with strong type crest | Architecture and elemental materials |
| `healing.png` | Welcoming lodge with a subtle cross/health symbol | Roof, stone, plants, elemental glow |
| `market.png` | Open-air stalls and awnings | Goods, fabrics, lanterns, local materials |
| `portal.png` | Freestanding oval portal with a front approach | Frame materials and local accent crystals |

Suggested asset prompt:

```text
Create one isolated transparent PNG for the <planet> <location>.
Canvas: 1024x1024 RGBA with true transparency.
Match the approved 2D fantasy Dragon Tamer map style.
Use the same elevated three-quarter camera, scale, and upper-left lighting as the approved map assets.
Keep the destination centered with consistent transparent padding and a subtle contact shadow.
<shared destination identity and planet-specific visual details>
No text, sign, letters, label, border, UI, characters, dragons, creatures, or watermark.
```

## Integration

Use one CSS map stage for all planets:

```text
<planet-base-stage>
  <background>
  <wild location>
  <gym location>
  <reserved special area>
  <healing location>
  <market location>
  <portal location>
</background>
```

For a new planet:

```text
public/assets/maps/<planet>-layered.png
public/assets/map-locations/<planet>/wild.png
public/assets/map-locations/<planet>/gym.png
public/assets/map-locations/<planet>/healing.png
public/assets/map-locations/<planet>/market.png
public/assets/map-locations/<planet>/portal.png
```

The React component selects the planet's asset paths. It must not hard-code different anchor coordinates for each planet. Responsive rules may scale the shared 3:2 stage, but must never move individual location anchors.

The planet's base path is selected through the shared `--planet-map-image` CSS variable. Do not replace the stage geometry with a planet-specific selector.

## Label treatment

Location labels are compact overlays beneath their artwork, not part of either generated PNG:

- Translucent dark surface: `rgba(31, 48, 48, 0.78)`.
- White 2px border at `0.58` opacity.
- `11px` corner radius.
- `10px` backdrop blur.
- White location title with subtle dark text shadow.
- Pale-green uppercase eyebrow (`#dff4b5`).
- Title size `clamp(10px, 1.1cqw, 14px)`.
- Padding `5px 8px 6px`.

This treatment matches the smaller `world-copy` banner, whose dark glass, soft border, backdrop blur, white heading, pale-green eyebrow, and small supporting paragraph use the same visual family.

## Repeatable production order

1. Copy the current fixed anchor table without modification.
2. Generate the `1536x1024` terrain base from the Emberfall blueprint plus the destination planet's approved old scenic art.
3. Inspect the six clearings and connecting paths before generating location overlays.
4. Generate `wild`, `gym`, `healing`, `market`, and `portal` one at a time from the new base plus the matching Emberfall asset.
5. Leave the reserved center area empty until a story or encounter mechanic explicitly requires an asset there.
6. Confirm every overlay PNG is truly RGBA and every base has no alpha.
7. Integrate paths without changing shared anchor coordinates.
8. Check desktop, landscape tablet, and portrait tablet; reject crops or independently moving layers.
9. Once approved, use the completed planet as a comparison reference, but keep Emberfall as the composition blueprint for future maps.

## Approval checklist

- Base is exactly `1536x1024`.
- Every destination asset is exactly `1024x1024` RGBA with real transparent pixels.
- All six areas are clear, partitioned, and connected.
- The background and all overlays share the same camera and light direction.
- Assets sit on the terrain without visible rectangular edges.
- All five core locations remain in their fixed positions.
- Wild mirrors gym, healing mirrors market, and the portal is centered.
- The approved Emberfall base was supplied as the visual blueprint for the generation.
- The destination planet's existing scenic art was supplied as the theme authority.
- Matching Emberfall location art was supplied for each generated overlay.
- All transparent assets retain consistent padding and contact shadow.
- All labels use the shared world-copy-style treatment.
- Core locations use the same `19%` display width.
- The reserved center area remains clear unless a future, approved feature explicitly needs it.
- Base and overlays were approved separately, in that order.
- The complete map scales as one unit on desktop, landscape tablet, and portrait tablet.
- The planet's theme is distinct without changing the shared layout.
