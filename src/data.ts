import type { DragonInstance, DragonSpecies, DragonType, Move } from './types'
import { createInstanceId } from './game/registration'

export const dragonSpecies: DragonSpecies[] = [
  { id: 'embbite', dexNo: 1, name: 'Embbite', type: 'fire', stage: 1, evolvesAt: 8, evolvesTo: 'flamico', color: '#ef6a3a', accent: '#ffcf57', habitat: 'Sunlit ember plains', height: '0.7 m', weight: '8 kg', description: 'It warms lost travelers by glowing brighter near warm stones.' },
  { id: 'flamico', dexNo: 2, name: 'Flamico', type: 'fire', stage: 2, evolvesAt: 14, evolvesTo: 'pyravolt', color: '#c84f31', accent: '#ffd166', habitat: 'Cinderwood valleys', height: '1.2 m', weight: '24 kg', description: 'It races in circles, drawing curling flames into bright ribbons.' },
  { id: 'pyravolt', dexNo: 3, name: 'Pyravolt', type: 'fire', stage: 3, color: '#9f3b39', accent: '#ffb347', habitat: 'Solar crater ridges', height: '2.0 m', weight: '78 kg', description: 'Its storm of sparks creates constellations across the night sky.' },

  { id: 'puddlefin', dexNo: 4, name: 'Puddlefin', type: 'water', stage: 1, evolvesAt: 8, evolvesTo: 'tidehopper', color: '#4da8d8', accent: '#a9e6ff', habitat: 'Moonlit tide pools', height: '0.6 m', weight: '7 kg', description: 'It slips through shallow puddles by turning its feet into tiny fins.' },
  { id: 'tidehopper', dexNo: 5, name: 'Tidehopper', type: 'water', stage: 2, evolvesAt: 14, evolvesTo: 'leviquill', color: '#3188b8', accent: '#80d7f7', habitat: 'Bluewater reef islands', height: '1.1 m', weight: '21 kg', description: 'It stores raindrops in the frills along its head and tail.' },
  { id: 'leviquill', dexNo: 6, name: 'Leviquill', type: 'water', stage: 3, color: '#28639c', accent: '#74cdf1', habitat: 'The Deep Spiral Sea', height: '2.4 m', weight: '96 kg', description: 'Its tail quills spin like a waterwheel, making gentle sea tunnels.' },

  { id: 'spriglet', dexNo: 7, name: 'Spriglet', type: 'grass', stage: 1, evolvesAt: 8, evolvesTo: 'vinearo', color: '#66a84f', accent: '#bce87b', habitat: 'Meadowmoon forests', height: '0.5 m', weight: '6 kg', description: 'A new leaf grows on its back whenever it makes a new friend.' },
  { id: 'vinearo', dexNo: 8, name: 'Vinearo', type: 'grass', stage: 2, evolvesAt: 14, evolvesTo: 'thornow', color: '#4d8f48', accent: '#99ca63', habitat: 'Whispering canopy', height: '1.0 m', weight: '18 kg', description: 'It tucks seeds into hanging vines and plants tiny gardens in flight.' },
  { id: 'thornow', dexNo: 9, name: 'Thornow', type: 'grass', stage: 3, color: '#3e7044', accent: '#c0dc72', habitat: 'Ancient green sanctuaries', height: '2.1 m', weight: '84 kg', description: 'Its thorn crown shelters small forest creatures during storms.' },

  { id: 'frostle', dexNo: 10, name: 'Frostle', type: 'ice', stage: 1, evolvesAt: 8, evolvesTo: 'glacibun', color: '#78bfc8', accent: '#d9fbff', habitat: 'Crystal snowfields', height: '0.6 m', weight: '5 kg', description: 'It leaves tiny snowflakes hanging in the air after every jump.' },
  { id: 'glacibun', dexNo: 11, name: 'Glacibun', type: 'ice', stage: 2, evolvesAt: 14, evolvesTo: 'boreastra', color: '#66aab9', accent: '#bceef2', habitat: 'Glass-ice caverns', height: '1.2 m', weight: '17 kg', description: 'Its warm paws can skate across ice without ever cracking it.' },
  { id: 'boreastra', dexNo: 12, name: 'Boreastra', type: 'ice', stage: 3, color: '#4d8798', accent: '#d7f8fb', habitat: 'Aurora peaks', height: '2.3 m', weight: '88 kg', description: 'It paints slow aurora curtains across the polar sky.' },

  { id: 'zappup', dexNo: 13, name: 'Zappup', type: 'electric', stage: 1, evolvesAt: 8, evolvesTo: 'volthare', color: '#d9b630', accent: '#fff08a', habitat: 'Charged copper dunes', height: '0.5 m', weight: '6 kg', description: 'It charges in place until its ears blink like tiny yellow stars.' },
  { id: 'volthare', dexNo: 14, name: 'Volthare', type: 'electric', stage: 2, evolvesAt: 14, evolvesTo: 'stormaxa', color: '#c59a21', accent: '#ffe65c', habitat: 'Thunderstep mesas', height: '1.1 m', weight: '19 kg', description: 'It can race in two directions at once if the thunder is loud.' },
  { id: 'stormaxa', dexNo: 15, name: 'Stormaxa', type: 'electric', stage: 3, color: '#8f741d', accent: '#fff09b', habitat: 'Sky battery towers', height: '2.2 m', weight: '92 kg', description: 'It nestles above storm clouds and keeps every device charged.' },

  { id: 'lumopod', dexNo: 16, name: 'Lumopod', type: 'light', stage: 1, evolvesAt: 8, evolvesTo: 'rayfaun', color: '#d9a728', accent: '#fff3a1', habitat: 'Starlight gardens', height: '0.6 m', weight: '5 kg', description: 'It follows kindhearted people because their shadows glow gold.' },
  { id: 'rayfaun', dexNo: 17, name: 'Rayfaun', type: 'light', stage: 2, evolvesAt: 14, evolvesTo: 'solcrest', color: '#d49428', accent: '#fff6ba', habitat: 'Sunbeam sanctuaries', height: '1.2 m', weight: '16 kg', description: 'Its fur brightens in rhythm with friendly heartbeats nearby.' },
  { id: 'solcrest', dexNo: 18, name: 'Solcrest', type: 'light', stage: 3, color: '#ba7d24', accent: '#fff7cb', habitat: 'The Radiant Observatory', height: '2.1 m', weight: '81 kg', description: 'It bends darkness away from travelers and guides them home.' },

  { id: 'mistlet', dexNo: 19, name: 'Mistlet', type: 'cloud', stage: 1, evolvesAt: 8, evolvesTo: 'nimbuskit', color: '#7897ba', accent: '#d9ecff', habitat: 'Floating cloud groves', height: '0.5 m', weight: '4 kg', description: 'It naps inside clouds and sneezes tiny rainbows by accident.' },
  { id: 'nimbuskit', dexNo: 20, name: 'Nimbuskit', type: 'cloud', stage: 2, evolvesAt: 14, evolvesTo: 'aerowisp', color: '#6683a8', accent: '#eaf4ff', habitat: 'Breezy sky bridges', height: '1.0 m', weight: '13 kg', description: 'It bundles cool breezes into soft, bouncing pillows.' },
  { id: 'aerowisp', dexNo: 21, name: 'Aerowisp', type: 'cloud', stage: 3, color: '#527294', accent: '#f0f7ff', habitat: 'High-atmosphere rings', height: '2.0 m', weight: '62 kg', description: 'It carries seeds between planets on one gentle flap.' },

  { id: 'shadee', dexNo: 22, name: 'Shadee', type: 'dark', stage: 1, evolvesAt: 8, evolvesTo: 'noxibear', color: '#66567a', accent: '#b6a6d1', habitat: 'Ruined lunar alleys', height: '0.7 m', weight: '9 kg', description: 'It copies the shadow of a friend until it learns to trust them.' },
  { id: 'noxibear', dexNo: 23, name: 'Noxibear', type: 'dark', stage: 2, evolvesAt: 14, evolvesTo: 'umbrawyrm', color: '#503e69', accent: '#9d8bbd', habitat: 'The Eclipsed Quarry', height: '1.3 m', weight: '31 kg', description: 'It hides bad intentions behind a silent, inky smile.' },
  { id: 'umbrawyrm', dexNo: 24, name: 'Umbrawyrm', type: 'dark', stage: 3, color: '#3c3056', accent: '#88759f', habitat: 'Jake’s dark stronghold', height: '2.5 m', weight: '105 kg', description: 'It gathers every shadow nearby and becomes almost impossible to spot.' },

  { id: 'cindrake', dexNo: 25, name: 'Cindrake', type: 'fire', stage: 1, evolvesAt: 8, evolvesTo: 'pyrocub', color: '#ef6a3a', accent: '#ffd166', habitat: 'Emberglass dunes', height: '0.7 m', weight: '9 kg', description: 'A warm little spark that sleeps curled around smooth stones.' },
  { id: 'pyrocub', dexNo: 26, name: 'Pyrocub', type: 'fire', stage: 2, evolvesAt: 14, evolvesTo: 'ashrex', color: '#d85a35', accent: '#ffb347', habitat: 'Redstone ridges', height: '1.3 m', weight: '27 kg', description: 'It stamps out bright trails before pouncing through the cinders.' },
  { id: 'ashrex', dexNo: 27, name: 'Ashrex', type: 'fire', stage: 3, color: '#a83f32', accent: '#ffc857', habitat: 'Caldera crowns', height: '2.2 m', weight: '86 kg', description: 'Its mighty wings scatter cooling sparks across the mountain night.' },

  { id: 'shellfin', dexNo: 28, name: 'Shellfin', type: 'water', stage: 1, evolvesAt: 8, evolvesTo: 'marivolt', color: '#4da8d8', accent: '#a9e6ff', habitat: 'Pearl tide pools', height: '0.6 m', weight: '8 kg', description: 'It clicks its little shell crest to call distant shoals closer.' },
  { id: 'marivolt', dexNo: 29, name: 'Marivolt', type: 'water', stage: 2, evolvesAt: 14, evolvesTo: 'tidewyrm', color: '#3188b8', accent: '#74cdf1', habitat: 'Coral surge reefs', height: '1.2 m', weight: '25 kg', description: 'It swims in loops that braid foam into sparkling rings.' },
  { id: 'tidewyrm', dexNo: 30, name: 'Tidewyrm', type: 'water', stage: 3, color: '#28639c', accent: '#9ddfff', habitat: 'The Sapphire Trench', height: '2.5 m', weight: '112 kg', description: 'A sweep of its tail turns rough seas into gentle currents.' },

  { id: 'mossling', dexNo: 31, name: 'Mossling', type: 'grass', stage: 1, evolvesAt: 8, evolvesTo: 'thornfer', color: '#66a84f', accent: '#bce87b', habitat: 'Fernlight clearings', height: '0.5 m', weight: '7 kg', description: 'Tiny flowers open on its back whenever rain begins to fall.' },
  { id: 'thornfer', dexNo: 32, name: 'Thornfer', type: 'grass', stage: 2, evolvesAt: 14, evolvesTo: 'groveclaw', color: '#4d8f48', accent: '#99ca63', habitat: 'Bramblewood paths', height: '1.1 m', weight: '22 kg', description: 'It knots vines around old branches to build hidden rest stops.' },
  { id: 'groveclaw', dexNo: 33, name: 'Groveclaw', type: 'grass', stage: 3, color: '#3e7044', accent: '#c0dc72', habitat: 'The Elderroot Wilds', height: '2.3 m', weight: '98 kg', description: 'Its branch horns become a nesting place for woodland sprites.' },

  { id: 'chillka', dexNo: 34, name: 'Chillka', type: 'ice', stage: 1, evolvesAt: 8, evolvesTo: 'frosthorn', color: '#78bfc8', accent: '#d9fbff', habitat: 'Snowglass meadows', height: '0.6 m', weight: '6 kg', description: 'It leaves a string of tiny crystal footprints in fresh snow.' },
  { id: 'frosthorn', dexNo: 35, name: 'Frosthorn', type: 'ice', stage: 2, evolvesAt: 14, evolvesTo: 'cryowyrm', color: '#66aab9', accent: '#bceef2', habitat: 'Diamond frost caves', height: '1.2 m', weight: '20 kg', description: 'Its crystal horns chime softly before a sudden cold front.' },
  { id: 'cryowyrm', dexNo: 36, name: 'Cryowyrm', type: 'ice', stage: 3, color: '#4d8798', accent: '#d7f8fb', habitat: 'The Frozen Zenith', height: '2.4 m', weight: '94 kg', description: 'It coils around glaciers and hums to keep them from breaking.' },

  { id: 'voltick', dexNo: 37, name: 'Voltick', type: 'electric', stage: 1, evolvesAt: 8, evolvesTo: 'volthorn', color: '#d9b630', accent: '#fff08a', habitat: 'Staticflower fields', height: '0.5 m', weight: '7 kg', description: 'Its tiny ear sparks glow whenever a storm is approaching.' },
  { id: 'volthorn', dexNo: 38, name: 'Volthorn', type: 'electric', stage: 2, evolvesAt: 14, evolvesTo: 'thundermaw', color: '#c59a21', accent: '#ffe65c', habitat: 'Coppercoil canyons', height: '1.1 m', weight: '23 kg', description: 'It races along ridgelines and keeps its golden mane crackling.' },
  { id: 'thundermaw', dexNo: 39, name: 'Thundermaw', type: 'electric', stage: 3, color: '#8f741d', accent: '#fff09b', habitat: 'The Sky Conductor', height: '2.3 m', weight: '101 kg', description: 'One roar sends a ripple of lightning across the whole horizon.' },

  { id: 'gleamlet', dexNo: 40, name: 'Gleamlet', type: 'light', stage: 1, evolvesAt: 8, evolvesTo: 'rayhorn', color: '#d9a728', accent: '#fff3a1', habitat: 'Lanternflower lawns', height: '0.6 m', weight: '6 kg', description: 'It glows brighter with every kind deed witnessed nearby.' },
  { id: 'rayhorn', dexNo: 41, name: 'Rayhorn', type: 'light', stage: 2, evolvesAt: 14, evolvesTo: 'dawnflare', color: '#d49428', accent: '#fff6ba', habitat: 'Goldenbeam meadows', height: '1.2 m', weight: '19 kg', description: 'It carries a warm halo that guides lost friends through fog.' },
  { id: 'dawnflare', dexNo: 42, name: 'Dawnflare', type: 'light', stage: 3, color: '#ba7d24', accent: '#fff7cb', habitat: 'The First Light Summit', height: '2.2 m', weight: '89 kg', description: 'Its sunrise wings make shadowed valleys bloom with golden light.' },

  { id: 'pufflet', dexNo: 43, name: 'Pufflet', type: 'cloud', stage: 1, evolvesAt: 8, evolvesTo: 'cirruspaw', color: '#7897ba', accent: '#d9ecff', habitat: 'Softcloud gardens', height: '0.5 m', weight: '5 kg', description: 'It tumbles through air pockets like a little bouncing balloon.' },
  { id: 'cirruspaw', dexNo: 44, name: 'Cirruspaw', type: 'cloud', stage: 2, evolvesAt: 14, evolvesTo: 'skycrest', color: '#6683a8', accent: '#eaf4ff', habitat: 'Windmill skyways', height: '1.0 m', weight: '15 kg', description: 'Its fluffy mane gathers crosswinds into playful air currents.' },
  { id: 'skycrest', dexNo: 45, name: 'Skycrest', type: 'cloud', stage: 3, color: '#527294', accent: '#f0f7ff', habitat: 'The Celestial Jetstream', height: '2.1 m', weight: '68 kg', description: 'It opens vast wings and carries fair weather to distant islands.' },

  { id: 'dusklit', dexNo: 46, name: 'Dusklit', type: 'dark', stage: 1, evolvesAt: 8, evolvesTo: 'nightfang', color: '#66567a', accent: '#b6a6d1', habitat: 'Twilight hollow', height: '0.7 m', weight: '10 kg', description: 'It gathers shy shadows beneath its wings and takes careful steps.' },
  { id: 'nightfang', dexNo: 47, name: 'Nightfang', type: 'dark', stage: 2, evolvesAt: 14, evolvesTo: 'voidscale', color: '#503e69', accent: '#9d8bbd', habitat: 'Moonless ravines', height: '1.4 m', weight: '34 kg', description: 'It prowls where stars disappear and watches with silent crystal eyes.' },
  { id: 'voidscale', dexNo: 48, name: 'Voidscale', type: 'dark', stage: 3, color: '#3c3056', accent: '#88759f', habitat: 'The Umbral Rift', height: '2.6 m', weight: '118 kg', description: 'Its enormous wings hold the night still for a single breath.' },
]

export const speciesById = Object.fromEntries(dragonSpecies.map((species) => [species.id, species])) as Record<string, DragonSpecies>

export const moves: Record<DragonType, [Move, Move, Move]> = {
  fire: [
    { name: 'Ember Flick', type: 'fire', power: 13, accuracy: 95 },
    { name: 'Solar Flare', type: 'fire', power: 21, accuracy: 82 },
    { name: 'Warm Glow', type: 'fire', power: 9, accuracy: 100 },
  ],
  water: [
    { name: 'Bubble Jet', type: 'water', power: 13, accuracy: 95 },
    { name: 'Tidal Spin', type: 'water', power: 21, accuracy: 82 },
    { name: 'Mist Refresh', type: 'water', power: 9, accuracy: 100 },
  ],
  grass: [
    { name: 'Leaf Dart', type: 'grass', power: 13, accuracy: 95 },
    { name: 'Vine Crash', type: 'grass', power: 21, accuracy: 82 },
    { name: 'Petal Guard', type: 'grass', power: 9, accuracy: 100 },
  ],
  ice: [
    { name: 'Snow Ping', type: 'ice', power: 13, accuracy: 95 },
    { name: 'Glacier Arc', type: 'ice', power: 21, accuracy: 82 },
    { name: 'Frost Nap', type: 'ice', power: 9, accuracy: 100 },
  ],
  electric: [
    { name: 'Spark Zap', type: 'electric', power: 13, accuracy: 95 },
    { name: 'Thunder Dash', type: 'electric', power: 21, accuracy: 82 },
    { name: 'Static Curl', type: 'electric', power: 9, accuracy: 100 },
  ],
  light: [
    { name: 'Glow Beam', type: 'light', power: 14, accuracy: 95 },
    { name: 'Dawn Strike', type: 'light', power: 22, accuracy: 82 },
    { name: 'Star Shield', type: 'light', power: 9, accuracy: 100 },
  ],
  cloud: [
    { name: 'Puff Push', type: 'cloud', power: 13, accuracy: 95 },
    { name: 'Breeze Break', type: 'cloud', power: 21, accuracy: 82 },
    { name: 'Soft Cover', type: 'cloud', power: 9, accuracy: 100 },
  ],
  dark: [
    { name: 'Shadow Bite', type: 'dark', power: 14, accuracy: 95 },
    { name: 'Night Surge', type: 'dark', power: 22, accuracy: 82 },
    { name: 'Eclipse Sneak', type: 'dark', power: 9, accuracy: 100 },
  ],
}

export const typeNames: Record<DragonType, string> = {
  fire: 'Fire',
  water: 'Water',
  grass: 'Grass',
  ice: 'Ice',
  electric: 'Electric',
  light: 'Light',
  cloud: 'Cloud',
  dark: 'Dark',
}

export const typeColors: Record<DragonType, string> = {
  fire: '#e76f51',
  water: '#4e9ac5',
  grass: '#68a84e',
  ice: '#70bcc7',
  electric: '#d8b52d',
  light: '#e0b95f',
  cloud: '#7f9fbd',
  dark: '#645777',
}

const effectiveness: Partial<Record<DragonType, Partial<Record<DragonType, number>>>> = {
  fire: { grass: 1.5, ice: 1.5, fire: 0.75, water: 0.75, cloud: 0.75 },
  water: { fire: 1.5, grass: 0.75, water: 0.75, dark: 0.75 },
  grass: { water: 1.5, grass: 0.75, fire: 0.75, cloud: 1.5 },
  ice: { grass: 1.5, fire: 0.75, water: 0.75, cloud: 1.5 },
  electric: { water: 1.5, grass: 0.75, cloud: 1.5, electric: 0.75 },
  light: { dark: 2, grass: 1.5, light: 0.75 },
  cloud: { grass: 1.5, electric: 0.75, fire: 1.5, dark: 0.75 },
  dark: { light: 0.5, cloud: 1.5, dark: 0.75 },
}

export function getEffectiveness(moveType: DragonType, enemyType: DragonType): number {
  return effectiveness[moveType]?.[enemyType] ?? 1
}

export function createDragon(speciesId: string, level: number): DragonInstance {
  const species = speciesById[speciesId]
  const maxHp = 32 + level * 4 + species.stage * 3
  return {
    instanceId: createInstanceId(),
    speciesId,
    level,
    xp: 0,
    hp: maxHp,
    maxHp,
    attack: 8 + level * 2 + species.stage,
    defense: 7 + level * 2,
    moves: [...moves[species.type]],
  }
}
