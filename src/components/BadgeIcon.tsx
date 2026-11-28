import {
  Cloud,
  Drop,
  Fire,
  Leaf,
  Lightning,
  MoonStars,
  Snowflake,
  Sun,
} from '@phosphor-icons/react'
import type { DragonType } from '../types'

const badgeIcons = {
  fire: Fire,
  grass: Leaf,
  electric: Lightning,
  cloud: Cloud,
  water: Drop,
  ice: Snowflake,
  dark: MoonStars,
  light: Sun,
} as const

interface BadgeIconProps {
  type: DragonType
  size?: number
  className?: string
}

export function BadgeIcon({ type, size = 24, className }: BadgeIconProps) {
  const Icon = badgeIcons[type]
  return <Icon size={size} weight="fill" className={className} aria-hidden="true" />
}
