import type { DragonInstance, DragonSpecies, DragonType, Move } from './types'
import { createInstanceId } from './game/registration'

export const dragonSpecies: DragonSpecies[] = [
  { id: 'embbite', dexNo: 1, name: 'Embbite', type: 'fire', stage: 1, evolvesAt: 8, evolvesTo: 'flamico', color: '#ef6a3a', accent: '#ffcf57', habitat: 'Sunlit ember plains', height: '0.7 m', weight: '8 kg', description: 'It warms lost travelers by glowing brighter near warm stones.' },
  { id: 'flamico', dexNo: 2, name: 'Flamico', type: 'fire', stage: 2, evolvesAt: 14, evolvesTo: 'pyravolt', color: '#c84f31', accent: '#ffd166', habitat: 'Cinderwood valleys', height: '1.2 m', weight: '24 kg', description: 'It races in circles, drawing curling flames into bright ribbons.' },
  { id: 'pyravolt', dexNo: 3, name: 'Pyravolt', type: 'fire', stage: 3, color: '#9f3b39', accent: '#ffb347', habitat: 'Solar crater ridges', height: '2.0 m', weight: '78 kg', description: 'Its storm of sparks creates constellations across the night sky.' },

  { id: 'spriglet', dexNo: 4, name: 'Spriglet', type: 'grass', stage: 1, evolvesAt: 8, evolvesTo: 'vinearo', color: '#66a84f', accent: '#bce87b', habitat: 'Meadowmoon forests', height: '0.5 m', weight: '6 kg', description: 'A new leaf grows on its back whenever it makes a new friend.' },
  { id: 'vinearo', dexNo: 5, name: 'Vinearo', type: 'grass', stage: 2, evolvesAt: 14, evolvesTo: 'thornow', color: '#4d8f48', accent: '#99ca63', habitat: 'Whispering canopy', height: '1.0 m', weight: '18 kg', description: 'It tucks seeds into hanging vines and plants tiny gardens in flight.' },
  { id: 'thornow', dexNo: 6, name: 'Thornow', type: 'grass', stage: 3, color: '#3e7044', accent: '#c0dc72', habitat: 'Ancient green sanctuaries', height: '2.1 m', weight: '84 kg', description: 'Its thorn crown shelters small forest creatures during storms.' },

  { id: 'zappup', dexNo: 7, name: 'Zappup', type: 'electric', stage: 1, evolvesAt: 8, evolvesTo: 'volthare', color: '#d9b630', accent: '#fff08a', habitat: 'Charged copper dunes', height: '0.5 m', weight: '6 kg', description: 'It charges in place until its ears blink like tiny yellow stars.' },
  { id: 'volthare', dexNo: 8, name: 'Volthare', type: 'electric', stage: 2, evolvesAt: 14, evolvesTo: 'stormaxa', color: '#c59a21', accent: '#ffe65c', habitat: 'Thunderstep mesas', height: '1.1 m', weight: '19 kg', description: 'It can race in two directions at once if the thunder is loud.' },
  { id: 'stormaxa', dexNo: 9, name: 'Stormaxa', type: 'electric', stage: 3, color: '#8f741d', accent: '#fff09b', habitat: 'Sky battery towers', height: '2.2 m', weight: '92 kg', description: 'It nestles above storm clouds and keeps every device charged.' },

  { id: 'mistlet', dexNo: 10, name: 'Mistlet', type: 'cloud', stage: 1, evolvesAt: 8, evolvesTo: 'nimbuskit', color: '#7897ba', accent: '#d9ecff', habitat: 'Floating cloud groves', height: '0.5 m', weight: '4 kg', description: 'It naps inside clouds and sneezes tiny rainbows by accident.' },
  { id: 'nimbuskit', dexNo: 11, name: 'Nimbuskit', type: 'cloud', stage: 2, evolvesAt: 14, evolvesTo: 'aerowisp', color: '#6683a8', accent: '#eaf4ff', habitat: 'Breezy sky bridges', height: '1.0 m', weight: '13 kg', description: 'It bundles cool breezes into soft, bouncing pillows.' },
  { id: 'aerowisp', dexNo: 12, name: 'Aerowisp', type: 'cloud', stage: 3, color: '#527294', accent: '#f0f7ff', habitat: 'High-atmosphere rings', height: '2.0 m', weight: '62 kg', description: 'It carries seeds between planets on one gentle flap.' },

  { id: 'puddlefin', dexNo: 13, name: 'Puddlefin', type: 'water', stage: 1, evolvesAt: 8, evolvesTo: 'tidehopper', color: '#4da8d8', accent: '#a9e6ff', habitat: 'Moonlit tide pools', height: '0.6 m', weight: '7 kg', description: 'It slips through shallow puddles by turning its feet into tiny fins.' },
  { id: 'tidehopper', dexNo: 14, name: 'Tidehopper', type: 'water', stage: 2, evolvesAt: 14, evolvesTo: 'leviquill', color: '#3188b8', accent: '#80d7f7', habitat: 'Bluewater reef islands', height: '1.1 m', weight: '21 kg', description: 'It stores raindrops in the frills along its head and tail.' },
  { id: 'leviquill', dexNo: 15, name: 'Leviquill', type: 'water', stage: 3, color: '#28639c', accent: '#74cdf1', habitat: 'The Deep Spiral Sea', height: '2.4 m', weight: '96 kg', description: 'Its tail quills spin like a waterwheel, making gentle sea tunnels.' },

  { id: 'frostle', dexNo: 16, name: 'Frostle', type: 'ice', stage: 1, evolvesAt: 8, evolvesTo: 'glacibun', color: '#78bfc8', accent: '#d9fbff', habitat: 'Crystal snowfields', height: '0.6 m', weight: '5 kg', description: 'It leaves tiny snowflakes hanging in the air after every jump.' },
  { id: 'glacibun', dexNo: 17, name: 'Glacibun', type: 'ice', stage: 2, evolvesAt: 14, evolvesTo: 'boreastra', color: '#66aab9', accent: '#bceef2', habitat: 'Glass-ice caverns', height: '1.2 m', weight: '17 kg', description: 'Its warm paws can skate across ice without ever cracking it.' },
  { id: 'boreastra', dexNo: 18, name: 'Boreastra', type: 'ice', stage: 3, color: '#4d8798', accent: '#d7f8fb', habitat: 'Aurora peaks', height: '2.3 m', weight: '88 kg', description: 'It paints slow aurora curtains across the polar sky.' },

  { id: 'shadee', dexNo: 19, name: 'Shadee', type: 'dark', stage: 1, evolvesAt: 8, evolvesTo: 'noxibear', color: '#66567a', accent: '#b6a6d1', habitat: 'Ruined lunar alleys', height: '0.7 m', weight: '9 kg', description: 'It copies the shadow of a friend until it learns to trust them.' },
  { id: 'noxibear', dexNo: 20, name: 'Noxibear', type: 'dark', stage: 2, evolvesAt: 14, evolvesTo: 'umbrawyrm', color: '#503e69', accent: '#9d8bbd', habitat: 'The Eclipsed Quarry', height: '1.3 m', weight: '31 kg', description: 'It hides bad intentions behind a silent, inky smile.' },
  { id: 'umbrawyrm', dexNo: 21, name: 'Umbrawyrm', type: 'dark', stage: 3, color: '#3c3056', accent: '#88759f', habitat: 'Jake’s dark stronghold', height: '2.5 m', weight: '105 kg', description: 'It gathers every shadow nearby and becomes almost impossible to spot.' },

  { id: 'lumopod', dexNo: 22, name: 'Lumopod', type: 'light', stage: 1, evolvesAt: 8, evolvesTo: 'rayfaun', color: '#d9a728', accent: '#fff3a1', habitat: 'Starlight gardens', height: '0.6 m', weight: '5 kg', description: 'It follows kindhearted people because their shadows glow gold.' },
  { id: 'rayfaun', dexNo: 23, name: 'Rayfaun', type: 'light', stage: 2, evolvesAt: 14, evolvesTo: 'solcrest', color: '#d49428', accent: '#fff6ba', habitat: 'Sunbeam sanctuaries', height: '1.2 m', weight: '16 kg', description: 'Its fur brightens in rhythm with friendly heartbeats nearby.' },
  { id: 'solcrest', dexNo: 24, name: 'Solcrest', type: 'light', stage: 3, color: '#ba7d24', accent: '#fff7cb', habitat: 'The Radiant Observatory', height: '2.1 m', weight: '81 kg', description: 'It bends darkness away from travelers and guides them home.' },

  { id: 'cindrake', dexNo: 25, name: 'Cindrake', type: 'fire', stage: 1, evolvesAt: 8, evolvesTo: 'pyrocub', color: '#ef6a3a', accent: '#ffd166', habitat: 'Emberglass dunes', height: '0.7 m', weight: '9 kg', description: 'A warm little spark that sleeps curled around smooth stones.' },
  { id: 'pyrocub', dexNo: 26, name: 'Pyrocub', type: 'fire', stage: 2, evolvesAt: 14, evolvesTo: 'ashrex', color: '#d85a35', accent: '#ffb347', habitat: 'Redstone ridges', height: '1.3 m', weight: '27 kg', description: 'It stamps out bright trails before pouncing through the cinders.' },
  { id: 'ashrex', dexNo: 27, name: 'Ashrex', type: 'fire', stage: 3, color: '#a83f32', accent: '#ffc857', habitat: 'Caldera crowns', height: '2.2 m', weight: '86 kg', description: 'Its mighty wings scatter cooling sparks across the mountain night.' },

  { id: 'mossling', dexNo: 28, name: 'Mossling', type: 'grass', stage: 1, evolvesAt: 8, evolvesTo: 'thornfer', color: '#66a84f', accent: '#bce87b', habitat: 'Fernlight clearings', height: '0.5 m', weight: '7 kg', description: 'Tiny flowers open on its back whenever rain begins to fall.' },
  { id: 'thornfer', dexNo: 29, name: 'Thornfer', type: 'grass', stage: 2, evolvesAt: 14, evolvesTo: 'groveclaw', color: '#4d8f48', accent: '#99ca63', habitat: 'Bramblewood paths', height: '1.1 m', weight: '22 kg', description: 'It knots vines around old branches to build hidden rest stops.' },
  { id: 'groveclaw', dexNo: 30, name: 'Groveclaw', type: 'grass', stage: 3, color: '#3e7044', accent: '#c0dc72', habitat: 'The Elderroot Wilds', height: '2.3 m', weight: '98 kg', description: 'Its branch horns become a nesting place for woodland sprites.' },

  { id: 'voltick', dexNo: 31, name: 'Voltick', type: 'electric', stage: 1, evolvesAt: 8, evolvesTo: 'volthorn', color: '#d9b630', accent: '#fff08a', habitat: 'Staticflower fields', height: '0.5 m', weight: '7 kg', description: 'Its tiny ear sparks glow whenever a storm is approaching.' },
  { id: 'volthorn', dexNo: 32, name: 'Volthorn', type: 'electric', stage: 2, evolvesAt: 14, evolvesTo: 'thundermaw', color: '#c59a21', accent: '#ffe65c', habitat: 'Coppercoil canyons', height: '1.1 m', weight: '23 kg', description: 'It races along ridgelines and keeps its golden mane crackling.' },
  { id: 'thundermaw', dexNo: 33, name: 'Thundermaw', type: 'electric', stage: 3, color: '#8f741d', accent: '#fff09b', habitat: 'The Sky Conductor', height: '2.3 m', weight: '101 kg', description: 'One roar sends a ripple of lightning across the whole horizon.' },

  { id: 'pufflet', dexNo: 34, name: 'Pufflet', type: 'cloud', stage: 1, evolvesAt: 8, evolvesTo: 'cirruspaw', color: '#7897ba', accent: '#d9ecff', habitat: 'Softcloud gardens', height: '0.5 m', weight: '5 kg', description: 'It tumbles through air pockets like a little bouncing balloon.' },
  { id: 'cirruspaw', dexNo: 35, name: 'Cirruspaw', type: 'cloud', stage: 2, evolvesAt: 14, evolvesTo: 'skycrest', color: '#6683a8', accent: '#eaf4ff', habitat: 'Windmill skyways', height: '1.0 m', weight: '15 kg', description: 'Its fluffy mane gathers crosswinds into playful air currents.' },
  { id: 'skycrest', dexNo: 36, name: 'Skycrest', type: 'cloud', stage: 3, color: '#527294', accent: '#f0f7ff', habitat: 'The Celestial Jetstream', height: '2.1 m', weight: '68 kg', description: 'It opens vast wings and carries fair weather to distant islands.' },

  { id: 'shellfin', dexNo: 37, name: 'Shellfin', type: 'water', stage: 1, evolvesAt: 8, evolvesTo: 'marivolt', color: '#4da8d8', accent: '#a9e6ff', habitat: 'Pearl tide pools', height: '0.6 m', weight: '8 kg', description: 'It clicks its little shell crest to call distant shoals closer.' },
  { id: 'marivolt', dexNo: 38, name: 'Marivolt', type: 'water', stage: 2, evolvesAt: 14, evolvesTo: 'tidewyrm', color: '#3188b8', accent: '#74cdf1', habitat: 'Coral surge reefs', height: '1.2 m', weight: '25 kg', description: 'It swims in loops that braid foam into sparkling rings.' },
  { id: 'tidewyrm', dexNo: 39, name: 'Tidewyrm', type: 'water', stage: 3, color: '#28639c', accent: '#9ddfff', habitat: 'The Sapphire Trench', height: '2.5 m', weight: '112 kg', description: 'A sweep of its tail turns rough seas into gentle currents.' },

  { id: 'chillka', dexNo: 40, name: 'Chillka', type: 'ice', stage: 1, evolvesAt: 8, evolvesTo: 'frosthorn', color: '#78bfc8', accent: '#d9fbff', habitat: 'Snowglass meadows', height: '0.6 m', weight: '6 kg', description: 'It leaves a string of tiny crystal footprints in fresh snow.' },
  { id: 'frosthorn', dexNo: 41, name: 'Frosthorn', type: 'ice', stage: 2, evolvesAt: 14, evolvesTo: 'cryowyrm', color: '#66aab9', accent: '#bceef2', habitat: 'Diamond frost caves', height: '1.2 m', weight: '20 kg', description: 'Its crystal horns chime softly before a sudden cold front.' },
  { id: 'cryowyrm', dexNo: 42, name: 'Cryowyrm', type: 'ice', stage: 3, color: '#4d8798', accent: '#d7f8fb', habitat: 'The Frozen Zenith', height: '2.4 m', weight: '94 kg', description: 'It coils around glaciers and hums to keep them from breaking.' },

  { id: 'dusklit', dexNo: 43, name: 'Dusklit', type: 'dark', stage: 1, evolvesAt: 8, evolvesTo: 'nightfang', color: '#66567a', accent: '#b6a6d1', habitat: 'Twilight hollow', height: '0.7 m', weight: '10 kg', description: 'It gathers shy shadows beneath its wings and takes careful steps.' },
  { id: 'nightfang', dexNo: 44, name: 'Nightfang', type: 'dark', stage: 2, evolvesAt: 14, evolvesTo: 'voidscale', color: '#503e69', accent: '#9d8bbd', habitat: 'Moonless ravines', height: '1.4 m', weight: '34 kg', description: 'It prowls where stars disappear and watches with silent crystal eyes.' },
  { id: 'voidscale', dexNo: 45, name: 'Voidscale', type: 'dark', stage: 3, color: '#3c3056', accent: '#88759f', habitat: 'The Umbral Rift', height: '2.6 m', weight: '118 kg', description: 'Its enormous wings hold the night still for a single breath.' },

  { id: 'gleamlet', dexNo: 46, name: 'Gleamlet', type: 'light', stage: 1, evolvesAt: 8, evolvesTo: 'rayhorn', color: '#d9a728', accent: '#fff3a1', habitat: 'Lanternflower lawns', height: '0.6 m', weight: '6 kg', description: 'It glows brighter with every kind deed witnessed nearby.' },
  { id: 'rayhorn', dexNo: 47, name: 'Rayhorn', type: 'light', stage: 2, evolvesAt: 14, evolvesTo: 'dawnflare', color: '#d49428', accent: '#fff6ba', habitat: 'Goldenbeam meadows', height: '1.2 m', weight: '19 kg', description: 'It carries a warm halo that guides lost friends through fog.' },
  { id: 'dawnflare', dexNo: 48, name: 'Dawnflare', type: 'light', stage: 3, color: '#ba7d24', accent: '#fff7cb', habitat: 'The First Light Summit', height: '2.2 m', weight: '89 kg', description: 'Its sunrise wings make shadowed valleys bloom with golden light.' },

  { id: 'sparkfox', dexNo: 49, name: 'Sparkfox', type: 'fire', stage: 1, evolvesAt: 8, evolvesTo: 'flamewhisk', color: '#ff6b35', accent: '#ffd662', habitat: 'Wildfire meadows', height: '0.6 m', weight: '7 kg', description: 'Its foxlike tail trails playful sparks and leaves tiny ember flowers behind.' },
  { id: 'flamewhisk', dexNo: 50, name: 'Flamewhisk', type: 'fire', stage: 2, evolvesAt: 14, evolvesTo: 'infernotail', color: '#d84a35', accent: '#ffc857', habitat: 'Scorched scrublands', height: '1.3 m', weight: '26 kg', description: 'Its bushy flame tail whips sparks into curling ribbons of orange light.' },
  { id: 'infernotail', dexNo: 51, name: 'Infernotail', type: 'fire', stage: 3, color: '#a83f2f', accent: '#ffb347', habitat: 'Blazing fox hollows', height: '2.1 m', weight: '82 kg', description: 'Nine flame plumes dance along its magnificent tail in sunset colors.' },

  { id: 'budlet', dexNo: 52, name: 'Budlet', type: 'grass', stage: 1, evolvesAt: 8, evolvesTo: 'florwick', color: '#7cb342', accent: '#c5e1a5', habitat: 'Petal hollow meadows', height: '0.4 m', weight: '5 kg', description: 'Its drooping bud horns and tiny petal wings tuck close when it sleeps.' },
  { id: 'florwick', dexNo: 53, name: 'Florwick', type: 'grass', stage: 2, evolvesAt: 14, evolvesTo: 'bloomstrider', color: '#689f38', accent: '#dcedc8', habitat: 'Wildflower valleys', height: '0.9 m', weight: '14 kg', description: 'Its folded petal wings open like origami and scatter bright pollen trails.' },
  { id: 'bloomstrider', dexNo: 54, name: 'Bloomstrider', type: 'grass', stage: 3, color: '#558b2f', accent: '#e1f5fe', habitat: 'The Rainbow Bloom Gardens', height: '2.0 m', weight: '76 kg', description: 'Its vast stained-glass petals spread colorful seeds wherever it walks.' },

  { id: 'sparkwheel', dexNo: 55, name: 'Sparkwheel', type: 'electric', stage: 1, evolvesAt: 8, evolvesTo: 'gearstrike', color: '#e8c547', accent: '#fffabc', habitat: 'Windmill electric groves', height: '0.6 m', weight: '8 kg', description: 'Its circular wing hubs spin gently to store whirring sparks.' },
  { id: 'gearstrike', dexNo: 56, name: 'Gearstrike', type: 'electric', stage: 2, evolvesAt: 14, evolvesTo: 'turbovolt', color: '#d4a92e', accent: '#fff59a', habitat: 'Mechanic canyon cities', height: '1.2 m', weight: '24 kg', description: 'The gear motifs on its wings spin in rhythm with each electric surge.' },
  { id: 'turbovolt', dexNo: 57, name: 'Turbovolt', type: 'electric', stage: 3, color: '#a67d1f', accent: '#fff4a0', habitat: 'The Spinning Core', height: '2.3 m', weight: '95 kg', description: 'Its turbine core hums endlessly and powers every nearby machine.' },

  { id: 'cumulus', dexNo: 58, name: 'Cumulus', type: 'cloud', stage: 1, evolvesAt: 8, evolvesTo: 'stratolift', color: '#8fa5c4', accent: '#e8f2ff', habitat: 'Puffy plateau clouds', height: '0.6 m', weight: '5 kg', description: 'This cotton-puff dragon drifts lazily and leaves sparkling trails of dew.' },
  { id: 'stratolift', dexNo: 59, name: 'Stratolift', type: 'cloud', stage: 2, evolvesAt: 14, evolvesTo: 'cumulussovereign', color: '#7b92b4', accent: '#f0f7ff', habitat: 'Stratosphere skyways', height: '1.3 m', weight: '18 kg', description: 'Its taller cloud billows guide warm currents with gentle sweeping motions.' },
  { id: 'cumulussovereign', dexNo: 60, name: 'Cumulus Sovereign', type: 'cloud', stage: 3, color: '#6b7fa4', accent: '#f5fbff', habitat: 'The Great Cloud Throne', height: '2.4 m', weight: '72 kg', description: 'Its cumulus crown shelters travelers beneath a vast embrace of soft cloud.' },

  { id: 'coralkit', dexNo: 61, name: 'Coralkit', type: 'water', stage: 1, evolvesAt: 8, evolvesTo: 'reefsprite', color: '#20b2aa', accent: '#7fffd4', habitat: 'Shallow reef nurseries', height: '0.5 m', weight: '6 kg', description: 'Tiny coral branches on its body shelter fish fry and sea sprites.' },
  { id: 'reefsprite', dexNo: 62, name: 'Reefsprite', type: 'water', stage: 2, evolvesAt: 14, evolvesTo: 'coraluxe', color: '#1a9e8f', accent: '#5fd3d3', habitat: 'Vibrant coral gardens', height: '1.1 m', weight: '22 kg', description: 'The living coral crown on its head becomes a colorful moving reef.' },
  { id: 'coraluxe', dexNo: 63, name: 'Coraluxe', type: 'water', stage: 3, color: '#0d7a6b', accent: '#20d9d9', habitat: 'The Luminous Coral Throne', height: '2.2 m', weight: '88 kg', description: 'Its coral-covered form glows as a tiny ecosystem blooms across its back.' },

  { id: 'frostpip', dexNo: 64, name: 'Frostpip', type: 'ice', stage: 1, evolvesAt: 8, evolvesTo: 'glacielf', color: '#80deea', accent: '#e0f2f1', habitat: 'Sparkle snow dells', height: '0.5 m', weight: '5 kg', description: 'Its pointed ice ears leave little frosty sparkles in every footprint.' },
  { id: 'glacielf', dexNo: 65, name: 'Glacielf', type: 'ice', stage: 2, evolvesAt: 14, evolvesTo: 'icewarden', color: '#4dd0e1', accent: '#b2ebf2', habitat: 'Prismatic ice caverns', height: '1.1 m', weight: '18 kg', description: 'Crystalline patterns trace its slender body as it glides over frozen lakes.' },
  { id: 'icewarden', dexNo: 66, name: 'Icewarden', type: 'ice', stage: 3, color: '#00bcd4', accent: '#e0f7fa', habitat: 'The Crystal Citadel', height: '2.3 m', weight: '86 kg', description: 'Its living icicle robes can freeze a waterfall safely in mid-cascade.' },

  { id: 'glimspeck', dexNo: 67, name: 'Glimspeck', type: 'dark', stage: 1, evolvesAt: 8, evolvesTo: 'shadowmind', color: '#5a506d', accent: '#c0a8d8', habitat: 'Twilight moth groves', height: '0.6 m', weight: '7 kg', description: 'Tiny eyes gleam from its velvet-dark body as it whispers quiet riddles.' },
  { id: 'shadowmind', dexNo: 68, name: 'Shadowmind', type: 'dark', stage: 2, evolvesAt: 14, evolvesTo: 'noctilith', color: '#4a3e5d', accent: '#a898c8', habitat: 'Moonlit thinking caves', height: '1.3 m', weight: '28 kg', description: 'Luminous thoughts seem to drift behind the shadows around its eyes.' },
  { id: 'noctilith', dexNo: 69, name: 'Noctilith', type: 'dark', stage: 3, color: '#3a2e4d', accent: '#8878b8', habitat: 'The Library of Lost Nights', height: '2.4 m', weight: '94 kg', description: 'Its shadow mantle guards old stories, and its bright eyes hold quiet wisdom.' },

  { id: 'prismglow', dexNo: 70, name: 'Prismglow', type: 'light', stage: 1, evolvesAt: 8, evolvesTo: 'rainbright', color: '#e8d454', accent: '#fff9b8', habitat: 'Rainbow canyon passes', height: '0.6 m', weight: '7 kg', description: 'Its tiny faceted crest catches light and scatters soft rainbow arcs.' },
  { id: 'rainbright', dexNo: 71, name: 'Rainbright', type: 'light', stage: 2, evolvesAt: 14, evolvesTo: 'prismarch', color: '#dcc846', accent: '#fff8b0', habitat: 'Crystal refraction valleys', height: '1.2 m', weight: '21 kg', description: 'Sunlight passing through its translucent wings becomes ribbons of color.' },
  { id: 'prismarch', dexNo: 72, name: 'Prismarch', type: 'light', stage: 3, color: '#c8b03e', accent: '#fff6a0', habitat: 'The Spectrum Spire', height: '2.2 m', weight: '84 kg', description: 'Its crystalline crown splits daylight into permanent rainbows.' },

  { id: 'glowmoth', dexNo: 73, name: 'Glowmoth', type: 'fire', stage: 1, evolvesAt: 8, evolvesTo: 'luminard', color: '#f28500', accent: '#ffe680', habitat: 'Dusk-lit flower valleys', height: '0.5 m', weight: '6 kg', description: 'Its tiny lantern wings glow to warm night-blooming flowers and travelers.' },
  { id: 'luminard', dexNo: 74, name: 'Luminard', type: 'fire', stage: 2, evolvesAt: 14, evolvesTo: 'infernastra', color: '#e67e22', accent: '#ffd166', habitat: 'Ember-lit groves', height: '1.1 m', weight: '20 kg', description: 'Its lantern wings cast dancing amber paths through twilight woods.' },
  { id: 'infernastra', dexNo: 75, name: 'Infernastra', type: 'fire', stage: 3, color: '#c86432', accent: '#ffb967', habitat: 'The Eternal Dusk Canopy', height: '2.0 m', weight: '76 kg', description: 'Its vast glowing wings paint an amber aurora that comforts the whole forest.' },

  { id: 'sproutkin', dexNo: 76, name: 'Sproutkin', type: 'grass', stage: 1, evolvesAt: 8, evolvesTo: 'leafling', color: '#7cb342', accent: '#aed581', habitat: 'Sapling groves', height: '0.5 m', weight: '6 kg', description: 'A sprouting leaf crown bobs whenever this tiny woodland dragon hops.' },
  { id: 'leafling', dexNo: 77, name: 'Leafling', type: 'grass', stage: 2, evolvesAt: 14, evolvesTo: 'canopyshade', color: '#689f38', accent: '#c5e1a5', habitat: 'Canopy walkways', height: '1.0 m', weight: '19 kg', description: 'Leafy vines coil around its limbs as it swings from treetop to treetop.' },
  { id: 'canopyshade', dexNo: 78, name: 'Canopyshade', type: 'grass', stage: 3, color: '#558b2f', accent: '#e8f5e9', habitat: 'The Evergreen Sanctuary', height: '2.2 m', weight: '82 kg', description: 'Its sweeping leaf cloak shelters groves, and birds nest in its crown.' },

  { id: 'chargwig', dexNo: 79, name: 'Chargwig', type: 'electric', stage: 1, evolvesAt: 8, evolvesTo: 'fuzzcharge', color: '#f0d951', accent: '#ffffd4', habitat: 'Static thistle meadows', height: '0.5 m', weight: '7 kg', description: 'Its fluffy mane stands on end whenever stray electricity gathers nearby.' },
  { id: 'fuzzcharge', dexNo: 80, name: 'Fuzzcharge', type: 'electric', stage: 2, evolvesAt: 14, evolvesTo: 'shockfuzz', color: '#e3c33f', accent: '#ffffc0', habitat: 'Fluffcloud static fields', height: '1.1 m', weight: '22 kg', description: 'Golden threads crackle through its bristling coat as it absorbs energy.' },
  { id: 'shockfuzz', dexNo: 81, name: 'Shockfuzz', type: 'electric', stage: 3, color: '#d4a92e', accent: '#ffffc8', habitat: 'Hypercharge sanctuaries', height: '2.2 m', weight: '87 kg', description: 'Its enormous charged coat can light a village through a winter night.' },

  { id: 'mistwhisper', dexNo: 82, name: 'Mistwhisper', type: 'cloud', stage: 1, evolvesAt: 8, evolvesTo: 'fogwhirler', color: '#8db8d8', accent: '#e0f0ff', habitat: 'Hazy morning vales', height: '0.5 m', weight: '4 kg', description: 'Wispy mist ribbons trail from it as it hums soft songs through fog.' },
  { id: 'fogwhirler', dexNo: 83, name: 'Fogwhirler', type: 'cloud', stage: 2, evolvesAt: 14, evolvesTo: 'nimbusdancer', color: '#7ba5c8', accent: '#eef5ff', habitat: 'Spiral mist canyons', height: '1.1 m', weight: '14 kg', description: 'Its mist tendrils spin in calming spirals that soften restless storms.' },
  { id: 'nimbusdancer', dexNo: 84, name: 'Nimbus Dancer', type: 'cloud', stage: 3, color: '#6b92b8', accent: '#f5f9ff', habitat: 'The Twilight Cloud Symphony', height: '2.2 m', weight: '65 kg', description: 'Its layered mist tendrils conduct clouds in graceful rain ceremonies.' },

  { id: 'bubblekin', dexNo: 85, name: 'Bubblekin', type: 'water', stage: 1, evolvesAt: 8, evolvesTo: 'floatwhisper', color: '#4db8ff', accent: '#b0e0e6', habitat: 'Effervescent springs', height: '0.5 m', weight: '5 kg', description: 'It bounces through springs on the steady bubbles that form around its body.' },
  { id: 'floatwhisper', dexNo: 86, name: 'Floatwhisper', type: 'water', stage: 2, evolvesAt: 14, evolvesTo: 'aeroquell', color: '#2e8db8', accent: '#87ceeb', habitat: 'Buoyant lagoons', height: '1.0 m', weight: '16 kg', description: 'Gentle bubbles orbit its fins and whisper stories as it drifts through water.' },
  { id: 'aeroquell', dexNo: 87, name: 'Aeroquell', type: 'water', stage: 3, color: '#1a6d9e', accent: '#5fc3e4', habitat: 'The Sky-Kissed Pearl Pools', height: '2.0 m', weight: '72 kg', description: 'It rises on vast bubble currents, almost weightless between sea and sky.' },

  { id: 'snowmite', dexNo: 88, name: 'Snowmite', type: 'ice', stage: 1, evolvesAt: 8, evolvesTo: 'blizzkit', color: '#81d4fa', accent: '#e1f5fe', habitat: 'Powdered avalanche slopes', height: '0.5 m', weight: '6 kg', description: 'This plump snowball of a dragon digs tiny drifts with determined claws.' },
  { id: 'blizzkit', dexNo: 89, name: 'Blizzkit', type: 'ice', stage: 2, evolvesAt: 14, evolvesTo: 'frostdrake', color: '#4fc3f7', accent: '#b3e5fc', habitat: 'Whiteout storm fields', height: '1.2 m', weight: '22 kg', description: 'Its icy claws sharpen as it bounds through blizzards for fun.' },
  { id: 'frostdrake', dexNo: 90, name: 'Frostdrake', type: 'ice', stage: 3, color: '#29b6f6', accent: '#e3f2fd', habitat: 'The Howling Glacial Pass', height: '2.4 m', weight: '94 kg', description: 'Its roar summons snow, and its claws carve ice palaces from mountain walls.' },

  { id: 'cindersprite', dexNo: 91, name: 'Cindersprite', type: 'dark', stage: 1, evolvesAt: 8, evolvesTo: 'ashbeast', color: '#5f4a66', accent: '#b8a0c8', habitat: 'Scorched midnight ruins', height: '0.6 m', weight: '8 kg', description: 'Smoldering eyes shine through its ashen body while faint smoke trails behind.' },
  { id: 'ashbeast', dexNo: 92, name: 'Ashbeast', type: 'dark', stage: 2, evolvesAt: 14, evolvesTo: 'infernuscore', color: '#4d3a54', accent: '#a8889e', habitat: 'Cindery obsidian caverns', height: '1.4 m', weight: '32 kg', description: 'Ash-stained fur and smoldering patches mark the places this guardian protects.' },
  { id: 'infernuscore', dexNo: 93, name: 'Infernus Core', type: 'dark', stage: 3, color: '#3d2a44', accent: '#886678', habitat: 'The Burnt Sanctuary', height: '2.5 m', weight: '108 kg', description: 'Inner embers shine through cracks in its ashen armor as it guards old wounds.' },

  { id: 'haloflare', dexNo: 94, name: 'Haloflare', type: 'light', stage: 1, evolvesAt: 8, evolvesTo: 'coronaflame', color: '#e8d454', accent: '#fffab8', habitat: 'Sacred luminous sanctuaries', height: '0.6 m', weight: '8 kg', description: 'A gentle halo brightens around its head whenever it feels welcomed.' },
  { id: 'coronaflame', dexNo: 95, name: 'Coronaflame', type: 'light', stage: 2, evolvesAt: 14, evolvesTo: 'radianthalo', color: '#dcc846', accent: '#fff8b0', habitat: 'Corona peak temples', height: '1.3 m', weight: '25 kg', description: 'Its expanding halo casts protective golden crowns of light.' },
  { id: 'radianthalo', dexNo: 96, name: 'Radianthalo', type: 'light', stage: 3, color: '#c8b03e', accent: '#fff6a0', habitat: 'The Eternal Golden Crown', height: '2.4 m', weight: '91 kg', description: 'Its blazing corona spreads a warm protective glow for miles.' },

  { id: 'fluxite', dexNo: 97, name: 'Fluxite', type: 'fire', stage: 1, evolvesAt: 8, evolvesTo: 'prismflare', color: '#ff7f50', accent: '#ffd700', habitat: 'Crystalline volcanic caves', height: '0.5 m', weight: '8 kg', description: 'Its transparent scales split firelight into rainbow sparkles on cave walls.' },
  { id: 'prismflare', dexNo: 98, name: 'Prismflare', type: 'fire', stage: 2, evolvesAt: 14, evolvesTo: 'rubyblaze', color: '#ff6347', accent: '#ffa500', habitat: 'Gem-studded magma chambers', height: '1.2 m', weight: '28 kg', description: 'Its faceted plates refract inner flame into bright kaleidoscopic patterns.' },
  { id: 'rubyblaze', dexNo: 99, name: 'Rubyblaze', type: 'fire', stage: 3, color: '#d9480f', accent: '#ffb347', habitat: 'The Burning Crystal Depths', height: '2.3 m', weight: '95 kg', description: 'Its ruby facets scatter crimson light through even the deepest darkness.' },

  { id: 'seedpip', dexNo: 100, name: 'Seedpip', type: 'grass', stage: 1, evolvesAt: 8, evolvesTo: 'thornling', color: '#9ccc65', accent: '#c5e1a5', habitat: 'Berry patch meadows', height: '0.5 m', weight: '7 kg', description: 'Soft seed spikes cover its round body as it rolls through berry fields.' },
  { id: 'thornling', dexNo: 101, name: 'Thornling', type: 'grass', stage: 2, evolvesAt: 14, evolvesTo: 'bramblewhip', color: '#7cb342', accent: '#dcedc8', habitat: 'Thorny undergrowth', height: '1.1 m', weight: '21 kg', description: 'Its seed spikes grow into curling thorn vines that tap a gentle rhythm.' },
  { id: 'bramblewhip', dexNo: 102, name: 'Bramblewhip', type: 'grass', stage: 3, color: '#558b2f', accent: '#f1f8e9', habitat: 'The Briar Throne', height: '2.3 m', weight: '88 kg', description: 'Living bramble whips trail from its shoulders to guard and guide travelers.' },

  { id: 'buzzcoil', dexNo: 103, name: 'Buzzcoil', type: 'electric', stage: 1, evolvesAt: 8, evolvesTo: 'spiralvolt', color: '#f4d665', accent: '#fffed9', habitat: 'Copper spiral caverns', height: '0.5 m', weight: '6 kg', description: 'It coils into a tight spiral and hums whenever it senses stored energy.' },
  { id: 'spiralvolt', dexNo: 104, name: 'Spiralvolt', type: 'electric', stage: 2, evolvesAt: 14, evolvesTo: 'tornadzap', color: '#e8c547', accent: '#fffbc8', habitat: 'Whirlwind electric peaks', height: '1.2 m', weight: '26 kg', description: 'Its spiral tail pulls wind and electricity into tiny golden vortexes.' },
  { id: 'tornadzap', dexNo: 105, name: 'Tornadzap', type: 'electric', stage: 3, color: '#d4a92e', accent: '#ffffc0', habitat: 'The Charged Vortex', height: '2.4 m', weight: '99 kg', description: 'It drills upward in spirals to draw power from storm clouds.' },

  { id: 'zephyrmote', dexNo: 106, name: 'Zephyrmote', type: 'cloud', stage: 1, evolvesAt: 8, evolvesTo: 'windwhisker', color: '#89b0cc', accent: '#d9edff', habitat: 'Breezy hilltop meadows', height: '0.6 m', weight: '6 kg', description: 'Delicate feather wisps let it ride each breeze like a tiny silver bell.' },
  { id: 'windwhisker', dexNo: 107, name: 'Windwhisker', type: 'cloud', stage: 2, evolvesAt: 14, evolvesTo: 'galestream', color: '#7a9db8', accent: '#e8f1ff', habitat: 'Whistling windmills skyways', height: '1.2 m', weight: '17 kg', description: 'Its wind-feather whiskers carry the scents of faraway gardens.' },
  { id: 'galestream', dexNo: 108, name: 'Galestream', type: 'cloud', stage: 3, color: '#6b8ba4', accent: '#f0f6ff', habitat: 'The Windpipe Peaks', height: '2.3 m', weight: '71 kg', description: 'Its magnificent feathered wingstreams conduct refreshing winds across seas.' },

  { id: 'luminox', dexNo: 109, name: 'Luminox', type: 'water', stage: 1, evolvesAt: 8, evolvesTo: 'noctiluca', color: '#1e3a5f', accent: '#7ec8e3', habitat: 'Moonlit shallows', height: '0.6 m', weight: '7 kg', description: 'Bioluminescent spots along its sides blink in time with moon phases.' },
  { id: 'noctiluca', dexNo: 110, name: 'Noctiluca', type: 'water', stage: 2, evolvesAt: 14, evolvesTo: 'abyssalux', color: '#0f2740', accent: '#4fb3d9', habitat: 'Midnight ocean trenches', height: '1.4 m', weight: '31 kg', description: 'Its glowing spots form tiny constellations across its deep blue body.' },
  { id: 'abyssalux', dexNo: 111, name: 'Abyssalux', type: 'water', stage: 3, color: '#051a35', accent: '#3fa8d5', habitat: 'The Fathomless Star Trench', height: '2.6 m', weight: '118 kg', description: 'A galaxy of blue light pulses across its frame and guides the deep sea.' },

  { id: 'chillpod', dexNo: 112, name: 'Chillpod', type: 'ice', stage: 1, evolvesAt: 8, evolvesTo: 'frostbloom', color: '#80deea', accent: '#e0f2f1', habitat: 'Icicle crystal gardens', height: '0.4 m', weight: '4 kg', description: 'Its frosted petals chime softly whenever cold winds pass its frozen pod.' },
  { id: 'frostbloom', dexNo: 113, name: 'Frostbloom', type: 'ice', stage: 2, evolvesAt: 14, evolvesTo: 'glaciella', color: '#4dd0e1', accent: '#b2ebf2', habitat: 'Snowflake lattice fields', height: '1.0 m', weight: '15 kg', description: 'Its ice petals shimmer with aurora light and sing in winter wind.' },
  { id: 'glaciella', dexNo: 114, name: 'Glaciella', type: 'ice', stage: 3, color: '#00bcd4', accent: '#e0f7fa', habitat: 'The Frozen Bloom Paradise', height: '2.2 m', weight: '79 kg', description: 'Its singing ice blossom paints aurora light across frozen fields.' },

  { id: 'veilcat', dexNo: 115, name: 'Veilcat', type: 'dark', stage: 1, evolvesAt: 8, evolvesTo: 'shadowstalk', color: '#56476a', accent: '#b0a0c8', habitat: 'Secretive night groves', height: '0.6 m', weight: '6 kg', description: 'A shadow veil trails from this silent feline dragon’s knowing gaze.' },
  { id: 'shadowstalk', dexNo: 116, name: 'Shadowstalk', type: 'dark', stage: 2, evolvesAt: 14, evolvesTo: 'phantomcrest', color: '#463a5a', accent: '#9d88b8', habitat: 'The Velvet Pouncing Paths', height: '1.3 m', weight: '25 kg', description: 'Ribbonlike shadow veils follow its paws between patches of darkness.' },
  { id: 'phantomcrest', dexNo: 117, name: 'Phantomcrest', type: 'dark', stage: 3, color: '#342844', accent: '#7f6898', habitat: 'The Ethereal Black Garden', height: '2.3 m', weight: '86 kg', description: 'Its spectral crown and shadow cape drift silently through the darkest gardens.' },

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
