interface MapLocationCardProps {
  eyebrow?: string
  title: string
  className: string
  onClick: () => void
  detail?: string
  status?: string
  previewClass?: string
  artSrc?: string
  artAlt?: string
  baseClassName?: string
  disabled?: boolean
}

export function MapLocationCard({
  eyebrow,
  title,
  className,
  onClick,
  detail,
  status,
  previewClass,
  artSrc,
  artAlt = '',
  baseClassName = 'map-location',
  disabled = false,
}: MapLocationCardProps) {
  const resolvedArtSrc = artSrc?.startsWith('/')
    ? `${import.meta.env.BASE_URL}${artSrc.slice(1)}`
    : artSrc

  return (
    <button className={`${baseClassName} ${className}`} type="button" onClick={onClick} disabled={disabled}>
      {previewClass ? <span className={`planet-preview ${previewClass}`} /> : null}
      {resolvedArtSrc ? <img className="map-location-art" src={resolvedArtSrc} alt={artAlt} /> : null}
      <span className="map-location-copy">
        {eyebrow ? <span className="map-location-eyebrow">{eyebrow}</span> : null}
        <strong>{title}</strong>
        {detail ? <small>{detail}</small> : null}
        {status ? <i>{status}</i> : null}
      </span>
    </button>
  )
}
