import { useState } from 'react'
import { HouseSimple, StarFour } from '@phosphor-icons/react'
import { speciesById } from '../../data'
import type { GameSave } from '../../types'
import { BadgeIcon } from '../BadgeIcon'
import { DragonIcon } from '../DragonIcon'

interface OpeningStoryProps {
  save: GameSave
  onFinish: () => void
}

const storyPanels = [
  {
    eyebrow: 'Willowvale · Your home',
    title: 'A dream beneath the stars',
    text: 'In the quiet town of Willowvale, {name} grew up listening to stories of fearless Dragon Tamers and the worlds beyond the sky.',
  },
  {
    eyebrow: 'A champion to surpass',
    title: 'The name every tamer knows',
    text: 'Champion Mark has held the Starcrest crown for years. To earn a place in front of him, a challenger must prove themself across all eight dragon worlds.',
  },
  {
    eyebrow: 'The eight-planet journey',
    title: 'Eight badges. One way forward.',
    text: 'Fire, Grass, Electric, Cloud, Water, Ice, Dark, and Light: each planet guards a Gym Badge—and each victory brings Mark one step closer.',
  },
  {
    eyebrow: 'The first partner',
    title: '{starter} believes in you',
    text: 'With a new friend at your side and a whole sky of possibilities ahead, {name} leaves Willowvale to begin the journey toward becoming the greatest Dragon Tamer ever.',
  },
] as const

const badges = [
  ['bloom', 'grass', 'Bloom'],
  ['breeze', 'cloud', 'Breeze'],
  ['eclipse', 'dark', 'Eclipse'],
  ['ember', 'fire', 'Ember'],
  ['frost', 'ice', 'Frost'],
  ['radiant', 'light', 'Radiant'],
  ['spark', 'electric', 'Spark'],
  ['tide', 'water', 'Tide'],
] as const

export function OpeningStory({ save, onFinish }: OpeningStoryProps) {
  const [panelIndex, setPanelIndex] = useState(0)
  const starter = speciesById[save.starterId]
  const panel = storyPanels[panelIndex]
  const text = panel.text
    .replaceAll('{name}', save.playerName)
    .replaceAll('{starter}', starter.name)

  return (
    <main className={`opening-story story-panel-${panelIndex + 1}`}>
      <section className="opening-story-card" aria-live="polite">
        <button className="story-skip-button" type="button" onClick={onFinish}>Skip intro</button>
        <div className="story-art" aria-hidden="true">
          {panelIndex === 0 && (
            <div className="story-home-scene">
              <img src="/assets/planet-globes/willowvale.png" alt="" />
              <span className="story-home-label"><HouseSimple weight="fill" /> Willowvale</span>
            </div>
          )}
          {panelIndex === 1 && (
            <div className="story-champion-scene">
              <span className="champion-spark champion-spark-one"><StarFour weight="fill" /></span>
              <span className="champion-spark champion-spark-two"><StarFour weight="fill" /></span>
              <img className="champion-mark" src="/assets/characters/mark.png" alt="" />
              <div className="champion-nameplate">
                <strong>MARK</strong>
                <small>Starcrest Champion</small>
              </div>
            </div>
          )}
          {panelIndex === 2 && (
            <div className="story-badge-route">
              {badges.map(([id, type, name]) => (
                <div className="story-route-badge" key={id}>
                  <span className={`story-earned-badge badge-${type}`}>
                    <BadgeIcon type={type} size={32} className="story-badge-symbol" />
                  </span>
                  <strong>{name}</strong>
                  <small>{type}</small>
                </div>
              ))}
            </div>
          )}
          {panelIndex === 3 && (
            <div className="story-partner-scene">
              <div className="story-departure-portal" />
              <DragonIcon species={starter} size={230} battleMode />
              <span className="story-partner-name">{starter.name} · Your first partner</span>
            </div>
          )}
        </div>
        <div className="story-copy">
          <p className="eyebrow">{panel.eyebrow}</p>
          <h1>{panel.title.replaceAll('{starter}', starter.name)}</h1>
          <p>{text}</p>
        </div>
        <div className="story-progress" aria-label={`Opening scene ${panelIndex + 1} of ${storyPanels.length}`}>
          {storyPanels.map((_, index) => (
            <span key={index} className={index === panelIndex ? 'active' : index < panelIndex ? 'complete' : ''} />
          ))}
        </div>
        <div className="story-actions">
          <button
            className="secondary-button"
            type="button"
            disabled={panelIndex === 0}
            onClick={() => setPanelIndex((index) => Math.max(0, index - 1))}
          >
            Back
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => panelIndex === storyPanels.length - 1
              ? onFinish()
              : setPanelIndex((index) => Math.min(storyPanels.length - 1, index + 1))}
          >
            {panelIndex === storyPanels.length - 1 ? 'Begin the journey' : 'Continue'}
          </button>
        </div>
      </section>
    </main>
  )
}
