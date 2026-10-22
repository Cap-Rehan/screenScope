import { KIND_LABEL, SOURCES, type Kind, type SourceId } from '../content/sources'

export function EvIcon({ kind }: { kind: Kind }) {
  return (
    <svg viewBox="0 0 12 12" width="0.62em" height="0.62em" aria-hidden="true" className="ev-icon">
      {kind === 'standard' && <circle cx="6" cy="6" r="5" fill="currentColor" />}
      {kind === 'filing' && <path d="M6 0.6 11.4 6 6 11.4 0.6 6Z" fill="currentColor" />}
      {kind === 'claim' && <circle cx="6" cy="6" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.4" />}
      {kind === 'independent' && (
        <>
          <circle cx="6" cy="6" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M6 1.6a4.4 4.4 0 0 1 0 8.8Z" fill="currentColor" />
        </>
      )}
      {kind === 'estimate' && (
        <circle cx="6" cy="6" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="1.6 1.6" />
      )}
    </svg>
  )
}

/** Evidence mark: shows where a number comes from and links to its source note. */
export function Ev({ k, s }: { k: Kind; s?: SourceId }) {
  const label = s ? `${KIND_LABEL[k]}: ${SOURCES[s].title}` : KIND_LABEL[k]
  return (
    <a className="ev" href={s ? `#src-${s}` : '#sources'} title={label}>
      <EvIcon kind={k} />
      <span className="sr-only">({label})</span>
    </a>
  )
}
