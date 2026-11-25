interface MapLocationCardProps {
  eyebrow?: string
  title: string
  className: string
  onClick: () => void
  detail?: string
  status?: string
  previewClass?: string
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
  baseClassName = 'map-location',
}: MapLocationCardProps) {
  return (
    <button className={`${baseClassName} ${className}`} type="button" onClick={onClick}>
      {previewClass ? <span className={`planet-preview ${previewClass}`} /> : null}
      {eyebrow ? <span>{eyebrow}</span> : null}
      <strong>{title}</strong>
      {detail ? <small>{detail}</small> : null}
      {status ? <i>{status}</i> : null}
    </button>
  )
}
