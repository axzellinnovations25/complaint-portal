import type { MouseEvent } from 'react'

type PublicNoticesPageProps = {
  onNavigate: (href: string) => void
}

type NoticeIconName = 'alert' | 'arrow' | 'camera' | 'check' | 'file' | 'lock' | 'map' | 'phone' | 'search'

const primaryNotices: Array<{
  title: string
  detail: string
  icon: NoticeIconName
  tone: 'rose' | 'teal' | 'violet' | 'cyan'
}> = [
  {
    title: 'Use emergency services for immediate danger',
    detail:
      'This portal is for civic service follow-up. Fire, police, ambulance, or immediate life-safety situations should be reported through emergency channels first.',
    icon: 'alert',
    tone: 'rose',
  },
  {
    title: 'Accurate locations speed up field visits',
    detail:
      'Add the ward, road name, nearby landmark, house number range, or a clear place description when a map pin is not available.',
    icon: 'map',
    tone: 'teal',
  },
  {
    title: 'Anonymous reports can still be tracked',
    detail:
      'Save the complaint reference number after submission. Anonymous complaints will not receive SMS, but the reference can be used on the tracking page.',
    icon: 'lock',
    tone: 'violet',
  },
  {
    title: 'Evidence is optional but useful',
    detail:
      'Photos, PDFs, video, or audio can help officers confirm the issue and avoid repeated calls for more information.',
    icon: 'camera',
    tone: 'cyan',
  },
]

const beforeSubmitItems = [
  'Check that the issue is within Pradeshiya Sabha civic service responsibility.',
  'Use one complaint for one main issue so it can be assigned clearly.',
  'Keep descriptions factual and avoid personal or unrelated information.',
  'Save the reference number shown after submission.',
]

const notForPortalItems = [
  'Crime, fire, ambulance, or urgent rescue requests',
  'Private disputes that do not involve a civic service issue',
  'National utility failures that should go directly to the utility provider',
  'Repeated duplicate reports when a reference number already exists',
]

function NoticeIcon({ name }: { name: NoticeIconName }) {
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
      {name === 'arrow' && <path {...common} d="M5 12h14m-5-5 5 5-5 5" />}
      {name === 'camera' && (
        <>
          <path {...common} d="M4 8h4l2-3h4l2 3h4v12H4z" />
          <circle {...common} cx="12" cy="14" r="3.5" />
        </>
      )}
      {name === 'check' && <path {...common} d="m5 13 4 4L19 7" />}
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
      {name === 'map' && (
        <>
          <path {...common} d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" />
          <circle {...common} cx="12" cy="10" r="2.5" />
        </>
      )}
      {name === 'phone' && (
        <>
          <path {...common} d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9Z" />
        </>
      )}
      {name === 'search' && (
        <>
          <circle {...common} cx="10.5" cy="10.5" r="6.5" />
          <path {...common} d="m16 16 4 4" />
        </>
      )}
    </svg>
  )
}

export function PublicNoticesPage({ onNavigate }: PublicNoticesPageProps) {
  const navigateTo = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <article className="public-page notices-page">
      <section className="compact-page-hero notices-hero" aria-labelledby="notices-page-title">
        <div className="notices-hero-copy">
          <p className="eyebrow">Notices and guidance</p>
          <h1 id="notices-page-title">Read this before sending a complaint.</h1>
          <p>
            These notes help citizens submit complete, useful complaints and understand when another
            service channel is more appropriate.
          </p>
          <div className="notices-hero-actions">
            <a className="button button-primary" href="/submit" onClick={navigateTo('/submit')}>
              <NoticeIcon name="file" />
              Start a report
            </a>
            <a className="button button-secondary" href="/track" onClick={navigateTo('/track')}>
              <NoticeIcon name="search" />
              Track complaint
            </a>
          </div>
        </div>

        <aside className="notices-hero-card" aria-label="Notice summary">
          <span className="notices-hero-card-icon" aria-hidden="true">
            <NoticeIcon name="alert" />
          </span>
          <div>
            <strong>Check the guidance first</strong>
            <p>Use this portal for civic service complaints, not immediate danger or emergency requests.</p>
          </div>
          <ul>
            <li>
              <NoticeIcon name="phone" />
              <span>Emergency matters go elsewhere</span>
            </li>
            <li>
              <NoticeIcon name="map" />
              <span>Location details help field teams</span>
            </li>
            <li>
              <NoticeIcon name="lock" />
              <span>Reference numbers support tracking</span>
            </li>
          </ul>
        </aside>
      </section>

      <section className="notices-priority-panel" aria-labelledby="priority-notice-title">
        <span aria-hidden="true">
          <NoticeIcon name="phone" />
        </span>
        <div>
          <p className="eyebrow">Important boundary</p>
          <h2 id="priority-notice-title">This portal does not replace emergency services.</h2>
          <p>
            If there is immediate danger to life, property, or public safety, contact the appropriate
            emergency service first. Use this portal only for civic service follow-up and non-emergency complaints.
          </p>
        </div>
      </section>

      <section className="notice-section page-section" aria-labelledby="notice-list-title">
        <div className="section-heading">
          <p className="eyebrow">Current guidance</p>
          <h2 id="notice-list-title">Public notice board</h2>
          <p>
            These notices apply to all complaints submitted through the platform. Review them before
            creating a new complaint so the civic team receives enough information to act.
          </p>
        </div>

        <div className="notices-grid">
          {primaryNotices.map((notice) => (
            <article className={`notice-card notice-card-${notice.tone}`} key={notice.title}>
              <span aria-hidden="true">
                <NoticeIcon name={notice.icon} />
              </span>
              <div>
                <strong>{notice.title}</strong>
                <p>{notice.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="notices-check-section" aria-labelledby="notice-check-title">
        <div>
          <p className="eyebrow">Before submitting</p>
          <h2 id="notice-check-title">Make sure the complaint can be handled properly.</h2>
          <p>
            A good report is specific, civic-service related, and easy for a field officer or department
            head to assign.
          </p>
        </div>

        <div className="notices-check-grid">
          <article>
            <strong>Good complaint checklist</strong>
            <ul>
              {beforeSubmitItems.map((item) => (
                <li key={item}>
                  <NoticeIcon name="check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article>
            <strong>Do not use this portal for</strong>
            <ul>
              {notForPortalItems.map((item) => (
                <li key={item}>
                  <NoticeIcon name="alert" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <div className="help-band" aria-label="Need help choosing a page">
        <div>
          <strong>Already submitted a complaint?</strong>
          <span>Use your reference number to see the latest status.</span>
        </div>
        <a className="button button-primary" href="/track" onClick={navigateTo('/track')}>
          Track complaint
          <NoticeIcon name="arrow" />
        </a>
      </div>
    </article>
  )
}
