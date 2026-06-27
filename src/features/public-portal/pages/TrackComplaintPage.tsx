import { useState, type FormEvent } from 'react'

const demoReference = 'PS-2026-00124'

type TrackIconName = 'alert' | 'calendar' | 'check' | 'clipboard' | 'file' | 'lock' | 'search' | 'shield' | 'user' | 'work'

const statusStages: Array<{ label: string; description: string; icon: TrackIconName }> = [
  {
    label: 'Submitted',
    description: 'The portal received the complaint and created a reference number.',
    icon: 'file',
  },
  {
    label: 'Acknowledged',
    description: 'The front desk or review team checked the category and basic details.',
    icon: 'clipboard',
  },
  {
    label: 'Assigned',
    description: 'The complaint was sent to the responsible department or field officer.',
    icon: 'user',
  },
  {
    label: 'In progress',
    description: 'An officer or department is inspecting, updating, or resolving the issue.',
    icon: 'work',
  },
  {
    label: 'Resolved',
    description: 'The team has marked the service issue as handled.',
    icon: 'check',
  },
  {
    label: 'Closed',
    description: 'The complaint record is complete and kept for future audit history.',
    icon: 'lock',
  },
]

const demoTimeline = [
  {
    label: 'Submitted',
    detail: 'Complaint submitted through the public portal.',
    time: 'Today, 9:12 AM',
    complete: true,
    icon: 'file' as const,
  },
  {
    label: 'Acknowledged',
    detail: 'Front desk team checked the drainage category and location details.',
    time: 'Today, 9:24 AM',
    complete: true,
    icon: 'clipboard' as const,
  },
  {
    label: 'Assigned',
    detail: 'Forwarded to the Public Health field team for inspection.',
    time: 'Today, 10:05 AM',
    complete: true,
    icon: 'user' as const,
  },
  {
    label: 'In progress',
    detail: 'Officer visit pending. Next update is expected after inspection.',
    time: 'Pending',
    complete: false,
    icon: 'work' as const,
  },
]

function normalizeReference(reference: string) {
  return reference.trim().toUpperCase()
}

function getInitialReference() {
  return normalizeReference(new URLSearchParams(window.location.search).get('reference') ?? '')
}

function TrackIcon({ name }: { name: TrackIconName }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      {name === 'alert' && (
        <>
          <path {...common} d="M12 9v4" />
          <path {...common} d="M12 17h.01" />
          <path {...common} d="M10.3 4.3 2.8 17.1A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.9L13.7 4.3a2 2 0 0 0-3.4 0Z" />
        </>
      )}
      {name === 'calendar' && (
        <>
          <rect {...common} x="4" y="5" width="16" height="15" rx="2" />
          <path {...common} d="M8 3v4M16 3v4M4 10h16" />
        </>
      )}
      {name === 'check' && <path {...common} d="m5 13 4 4L19 7" />}
      {name === 'clipboard' && (
        <>
          <path {...common} d="M9 4h6l1 2h3v15H5V6h3l1-2Z" />
          <path {...common} d="M9 12h6M9 16h4" />
        </>
      )}
      {name === 'file' && (
        <>
          <path {...common} d="M7 3h7l4 4v14H7z" />
          <path {...common} d="M14 3v5h5" />
          <path {...common} d="M9.5 13h5M9.5 17h5" />
        </>
      )}
      {name === 'lock' && (
        <>
          <rect {...common} x="5" y="10" width="14" height="10" rx="2" />
          <path {...common} d="M8 10V7a4 4 0 0 1 8 0v3" />
        </>
      )}
      {name === 'search' && (
        <>
          <circle {...common} cx="10.5" cy="10.5" r="6.5" />
          <path {...common} d="m16 16 4 4" />
        </>
      )}
      {name === 'shield' && (
        <>
          <path {...common} d="M12 3 5 6v5c0 4.7 2.8 8.1 7 10 4.2-1.9 7-5.3 7-10V6l-7-3Z" />
          <path {...common} d="m9 12 2 2 4-4" />
        </>
      )}
      {name === 'user' && (
        <>
          <circle {...common} cx="12" cy="8" r="4" />
          <path {...common} d="M4 21a8 8 0 0 1 16 0" />
        </>
      )}
      {name === 'work' && (
        <>
          <path {...common} d="M4 8h16v11H4z" />
          <path {...common} d="M9 8V5h6v3" />
          <path {...common} d="M4 13h16" />
        </>
      )}
    </svg>
  )
}

export function TrackComplaintPage() {
  const [referenceNumber, setReferenceNumber] = useState(getInitialReference)
  const [lookupState, setLookupState] = useState<'idle' | 'found' | 'missing'>(() => {
    const initialReference = getInitialReference()
    if (!initialReference) {
      return 'idle'
    }

    return initialReference === demoReference ? 'found' : 'missing'
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedReference = normalizeReference(referenceNumber)
    setReferenceNumber(normalizedReference)
    setLookupState(normalizedReference === demoReference ? 'found' : 'missing')
  }

  const resetLookup = () => {
    setLookupState('idle')
    setReferenceNumber('')
  }

  return (
    <article className="public-page track-page">
      <section className="compact-page-hero track-hero" aria-labelledby="track-title">
        <div>
          <p className="eyebrow">Track complaint</p>
          <h1 id="track-title">Check the latest status using your reference number.</h1>
          <p>
            The reference number is shown after submission. It is required for anonymous complaints
            and useful when following up with the Pradeshiya Sabha office.
          </p>
        </div>
        <aside className="track-hero-panel" aria-label="Tracking portal summary">
          <span className="track-hero-icon" aria-hidden="true">
            <TrackIcon name="search" />
          </span>
          <div>
            <strong>Reference-based tracking portal</strong>
            <p>See whether a complaint is submitted, acknowledged, assigned, in progress, or resolved.</p>
          </div>
          <ul>
            <li>
              <TrackIcon name="shield" />
              <span>Private reference lookup</span>
            </li>
            <li>
              <TrackIcon name="calendar" />
              <span>Latest status and next step</span>
            </li>
          </ul>
        </aside>
      </section>

      <section className="track-lookup-panel" aria-label="Reference tracking">
        <div className={`track-card-flip ${lookupState !== 'idle' ? 'track-card-flip-active' : ''}`}>
          <div className="track-card-flip-inner">
            <form className="track-card track-card-front" aria-label="Track complaint by reference" onSubmit={handleSubmit}>
              <span className="track-card-icon" aria-hidden="true">
                <TrackIcon name="search" />
              </span>
              <div>
                <label htmlFor="reference-number">Complaint reference number</label>
                <h2>Enter your reference to track progress.</h2>
                <p>Use the full reference exactly as shown after submission.</p>
              </div>
              <div className="track-form-row">
                <input
                  id="reference-number"
                  name="reference-number"
                  onChange={(event) => setReferenceNumber(event.target.value)}
                  placeholder={`Example: ${demoReference}`}
                  required
                  type="text"
                  value={referenceNumber}
                  disabled={lookupState !== 'idle'}
                />
                <button type="submit" disabled={lookupState !== 'idle'}>
                  <TrackIcon name="search" />
                  Track
                </button>
              </div>
            </form>

            <div className="track-card track-card-back" aria-live="polite">
              {lookupState === 'found' && (
                <>
                  <div className="tracking-summary">
                    <div>
                      <p className="eyebrow">Current status</p>
                      <h2 id="tracking-result-title">Assigned to Public Health</h2>
                      <p>Blocked drainage near market road. Last updated today at 10:05 AM.</p>
                    </div>
                    <span className="status-pill status-pill-active">In progress</span>
                  </div>

                  <div className="track-reference-badge">
                    <span>Reference</span>
                    <strong>{referenceNumber}</strong>
                  </div>

                  <ol className="track-timeline">
                    {demoTimeline.map((item) => (
                      <li className={item.complete ? 'timeline-complete' : undefined} key={item.label}>
                        <span aria-hidden="true">
                          <TrackIcon name={item.icon} />
                        </span>
                        <div>
                          <strong>{item.label}</strong>
                          <p>{item.detail}</p>
                        </div>
                        <time>{item.time}</time>
                      </li>
                    ))}
                  </ol>

                  <div className="track-next-step">
                    <span aria-hidden="true">
                      <TrackIcon name="calendar" />
                    </span>
                    <div>
                      <strong>Next expected update</strong>
                      <p>The assigned officer will update the record after the site inspection.</p>
                    </div>
                  </div>

                  <button className="button button-secondary track-card-reset" type="button" onClick={resetLookup}>
                    Track another reference
                  </button>
                </>
              )}

              {lookupState === 'missing' && (
                <div className="track-empty-content">
                  <span aria-hidden="true">
                    <TrackIcon name="search" />
                  </span>
                  <p className="eyebrow">Reference not found</p>
                  <h2 id="tracking-missing-title">Check the number and try again.</h2>
                  <p>
                    Use the full reference exactly as shown after submission. If you submitted anonymously,
                    the portal cannot recover the reference from a phone number.
                  </p>
                  <button className="button button-secondary" type="button" onClick={resetLookup}>
                    Clear and try again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="track-lookup-support" aria-label="Tracking guidance">
          <div className="track-reference-demo" aria-label="Demo reference">
            <span>Try this demo reference</span>
            <strong>{demoReference}</strong>
          </div>

          <div className="track-privacy-note" role="note">
            <span aria-hidden="true">
              <TrackIcon name="shield" />
            </span>
            <p>Keep the reference private if the complaint was submitted anonymously.</p>
          </div>

          <div className="track-form-tip">
            <span aria-hidden="true">
              <TrackIcon name="alert" />
            </span>
            <p>SMS updates are only available when a phone number was provided during submission.</p>
          </div>
        </div>
      </section>

      <section className="track-status-guide" aria-labelledby="track-status-guide-title">
        <div className="section-heading">
          <p className="eyebrow">Status guide</p>
          <h2 id="track-status-guide-title">What each status means</h2>
          <p>
            These labels help citizens understand what is happening after a complaint reaches the
            office or field team.
          </p>
        </div>
        <div className="track-status-grid">
          {statusStages.map((stage) => (
            <article key={stage.label}>
              <span aria-hidden="true">
                <TrackIcon name={stage.icon} />
              </span>
              <div>
                <strong>{stage.label}</strong>
                <p>{stage.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </article>
  )
}
