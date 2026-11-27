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
}: MapLocationCardProps) {
  return (
    <button className={`${baseClassName} ${className}`} type="button" onClick={onClick}>
      {previewClass ? <span className={`planet-preview ${previewClass}`} /> : null}
      {artSrc ? <img className="map-location-art" src={artSrc} alt={artAlt} /> : null}
      <span className="map-location-copy">
        {eyebrow ? <span className="map-location-eyebrow">{eyebrow}</span> : null}
        <strong>{title}</strong>
        {detail ? <small>{detail}</small> : null}
        {status ? <i>{status}</i> : null}
      </span>
    </button>
  )
}
