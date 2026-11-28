# Planet Globe Art Recipe

## Goal

Every route destination uses one illustrated globe that feels detailed enough to be a real place, but remains clean, soft, and readable at map size. The family must match the approved Willowvale globe rather than alternate between noisy miniature dioramas and overly simplified color blobs.

## Required reference recipe

Every globe revision must receive:

1. **Willowvale globe — style authority.** Match its:
   - elevated three-quarter view;
   - full sphere shape and apparent zoom;
   - clean upper-left lighting and deep lower-right shadow;
   - soft painterly edges and restrained detail density;
   - atmospheric rim and transparent padding;
   - balance between one dominant region, several secondary landforms, and open breathing room.
2. **Current planet globe — theme authority.** Preserve the planet's established palette, elemental identity, atmospheric behavior, major land/water balance, and approved landmark concepts.
3. **Matching gym image — landmark authority.** Borrow only a few recognizable materials, silhouette cues, and colors. Do not reproduce the gym as a city or miniature map.

## Composition balance

Target the same apparent zoom as Willowvale:

- The planet occupies roughly the same diameter in a 1024×1024 canvas.
- Keep about 25% transparent padding around the meaningful sphere.
- Show a complete, readable curved horizon.
- Use one dominant continental/weather region, three to five secondary regions, and open ocean or atmosphere between them.
- Keep 3–4 landmark clusters at most. A cluster may contain one main structure and a few tiny attached forms.
- Avoid a single repeated pattern filling the whole sphere.
- Vary placement of the dominant mass and secondary landforms by planet. Do not repeat Willowvale's or any earlier globe's exact upper-left / upper-right / lower-right arrangement.

## Detail density

The correct balance is:

- **Broad forms first:** the silhouette and major land/ocean/cloud masses must read in a thumbnail.
- **Medium detail second:** 6–12 clear secondary shapes establish type identity, such as reef chains, lava fields, forest masses, glacier shelves, storm bands, or crystal ridges.
- **Micro-detail last:** preserve only selected edge accents and local landmark detail. Do not cover every surface with marks, pebbles, trees, spikes, or buildings.
- When a smoothed surface feels empty, add 1–2 larger type-defining structures or terrain gestures instead of many tiny repeated details. Frostveil's readable crystal observatories worked better than extra ice chips and cracks.
- Gym-inspired landmarks must be sparse but large enough to read intentionally at map scale.

Reject either extreme:

- too noisy: grain, stippling, hundreds of rocks/trees, harsh micro-crags, repeated buildings, or texture visible at every pixel;
- too broad: flat color fields with only a few generic blobs and no sense of the planet's established character.

A useful check is to reduce the image to 160px. The type, dominant region, and 3–4 landmarks should remain legible without the surface becoming speckled.
The hero landmarks should survive this check; if only texture remains visible, increase landmark scale and reduce micro-detail instead.

## Planet-specific surfaces

Do not make every planet a floating-island world.

- **Emberfall:** mostly continuous volcanic land with lava channels and dark basins; little water.
- **Mossgrove:** continuous forest land, broad leafy masses, jade waterways, moderate water.
- **Voltspire:** broad yellow-gold metallic/rock plates, cobalt basins, clean gray-metal ridges, a few strong electric storm bands.
- **Cloudrest:** connected cloud continents and weather systems; no rocky floating platforms.
- **Tidehaven:** ocean-dominant sphere with reef archipelagos and broad currents; floating islands are acceptable only as reef/coastal land.
- **Frostveil:** continuous glacier shelves and arctic seas with broad ice fields; avoid piles of sharp fragments.
- **Umbralis:** connected dark-violet continents and midnight seas; moonlit ridges should remain broad and dark.
- **Luminara:** pearl/champagne/gold light land, warm cream atmosphere, sparse sacred landmarks; avoid pink and excessive pure white.

For softer themes, reduce sharp edge detail and micro-texture without flattening the major land masses. Keep 3–5 clear regions and a small number of readable landmarks so the result remains dimensional.

For Light/sacred worlds, build holiness through pearl-white and warm yellow-gold luminance, gentle internal sanctuary halos, and elegant gold architecture. Do not use pink undertones, blast the entire sphere to pure white, or create a large exterior glow.

Willowvale remains the style and composition authority: temperate green-blue land and sky, with a small number of clear floating terrain masses.

## Transparency and finish

- Output: `1024x1024` RGBA PNG.
- True transparent pixels outside the globe; no baked space, rectangle, or UI panel.
- Preserve the soft atmospheric rim, but do not add a large colored background halo.
- Do not place cloud, mist, smoke, steam, aura, or colored glow outside the globe's silhouette. The exterior surrounding the planet must be transparent except for an extremely subtle natural rim highlight.
- Verify the generated alpha channel after generation; a visually gray/black display can hide an improperly opaque outer rectangle. Exterior pixels should reach alpha `0`, while a narrow sphere-edge rim may remain.
- Any clouds, smoke, or weather effects belong on or inside the visible planetary surface/atmosphere, never as a separate halo floating outside the sphere.
- Use clean anti-aliased edges.
- Upper-left light, lower-right shadow.
- No text, labels, roads, map grids, route lines, logos, or dense cities.
- Keep any gym-inspired architecture miniature and naturally integrated.

## Surface composition and final cleanup

- Default to one continuous planetary surface rather than a repeated field of floating rocks or isolated islands.
- Water worlds may use archipelagos; cloud worlds may use connected cloud continents. Otherwise, connect major landforms through visible terrain, seas, ice, or atmosphere.
- “Less water” means changing topology—join land with continental bridges, dark lowlands, or mountain corridors—not merely darkening or recoloring an ocean. Umbralis established this distinction: a mostly continuous dark continent with only narrow midnight channels.
- Keep the planet's open-space silhouette nearly circular. Exterior puffs, spikes, or detached platforms are not allowed.
- A halo or glow should never be represented by an opaque colored rectangle. Use true alpha transparency and only a narrow rim highlight.
- Match Emberfall's approved cleanup as an additional reference:
  - crisp, clean transparent edge;
  - strong terrain readability without exterior mist;
  - broad dominant regions;
  - 3–4 sparse landmarks;
  - enough medium detail to distinguish the biome, but no noisy speckling or repeated micro-rocks.
- After the main generation, run a cleanup request that explicitly preserves composition/colors and removes exterior clouds, grain, rough speckles, detached terrain, and unnecessary micro-detail.
- Do not save the pre-cleanup candidate as the final globe.
- Keep the interior surface unchanged during exterior cleanup. Treat exterior transparency as a separate pass: remove the whole outer vignette/halo rather than repainting the globe's land or weather.
- After palette and atmosphere approval, perform softness as a distinct finish pass: smooth edge transitions and reduce noisy micro-detail, but preserve landmass silhouettes and the 3–4 hero landmarks.

## Prompt instruction

For revisions, explicitly ask for:

```text
Use Willowvale to match angle, zoom, composition density, painterly finish, edge softness, and landmark spacing.
Use the current planet image only for planet-specific theme, palette, and approved major features.
Use the matching gym image only for 3-4 sparse landmark/material cues.
Make continuous natural planetary surfaces where appropriate, not a generic floating-rock field.
Preserve broad readable masses; use medium detail in selected regions and avoid noisy micro-texture.
Reject both overly busy/rocky/grainy output and overly broad generic blobs.
Remove all clouds, mist, smoke, and colored bloom outside the sphere; retain only a subtle natural rim.
```

## Approval test

Approve a globe only if:

- it visibly matches Willowvale's camera, zoom, atmosphere, and painterly softness;
- its major colors and identity are distinct from every other planet;
- its major forms are readable at 160px;
- the surface is neither speckled/noisy nor empty/generic;
- land/water/air balance is appropriate to the planet type;
- landmark count is sparse and localized;
- the sphere is complete, centered, and transparent outside the rim.
