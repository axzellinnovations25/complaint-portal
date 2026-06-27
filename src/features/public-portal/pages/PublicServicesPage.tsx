import type { MouseEvent } from 'react'

type PublicServicesPageProps = {
  onNavigate: (href: string) => void
}

type ServiceIconName = 'alert' | 'arrow' | 'building' | 'check' | 'file' | 'light' | 'lock' | 'map' | 'road' | 'search' | 'trash' | 'water'

const serviceGroups: Array<{
  title: string
  owner: string
  examples: string[]
  details: string
  icon: ServiceIconName
  tone: 'cyan' | 'blue' | 'teal' | 'amber' | 'violet' | 'rose'
}> = [
  {
    title: 'Roads and access',
    owner: 'Road works / field maintenance',
    examples: ['Potholes', 'Broken culverts', 'Blocked footpaths', 'Damaged name boards'],
    details: 'Include the road name, nearby landmark, direction of travel, and whether the issue blocks access.',
    icon: 'road',
    tone: 'cyan',
  },
  {
    title: 'Drainage and water flow',
    owner: 'Drainage / public works',
    examples: ['Blocked drains', 'Flood points', 'Stagnant water', 'Erosion near roads'],
    details: 'Mention if flooding happens after rain, where water collects, and whether homes or roads are affected.',
    icon: 'water',
    tone: 'blue',
  },
  {
    title: 'Waste and sanitation',
    owner: 'Solid waste / public health',
    examples: ['Missed collection', 'Illegal dumping', 'Overflowing bins', 'Public toilet issues'],
    details: 'Add collection route, bin location, frequency of the issue, and any visible public health risk.',
    icon: 'trash',
    tone: 'teal',
  },
  {
    title: 'Street lighting and safety',
    owner: 'Electrical / field service',
    examples: ['Broken lamps', 'Dark junctions', 'Exposed wiring', 'Unsafe public spaces'],
    details: 'Include pole number when available, street name, and whether the location is unsafe at night.',
    icon: 'light',
    tone: 'amber',
  },
  {
    title: 'Public property and facilities',
    owner: 'Facilities / asset maintenance',
    examples: ['Parks', 'Markets', 'Community halls', 'Libraries and cemeteries'],
    details: 'Describe the damaged facility, exact area, safety risk, and whether it affects public use.',
    icon: 'building',
    tone: 'violet',
  },
  {
    title: 'Public health concerns',
    owner: 'Public health / inspection',
    examples: ['Mosquito breeding', 'Nuisance complaints', 'Unsafe premises', 'Sanitation risks'],
    details: 'Share the location, visible risk, how long it has continued, and whether children or elders are affected.',
    icon: 'alert',
    tone: 'rose',
  },
]

const portalBoundaries = [
  {
    title: 'Use emergency channels first',
    description: 'Fire, crime, medical emergencies, and immediate life-safety matters should not wait for portal review.',
    icon: 'alert' as const,
  },
  {
    title: 'Use the closest category',
    description: 'If the category is not exact, submit anyway. Officers can reassign the complaint during review.',
    icon: 'check' as const,
  },
  {
    title: 'Keep your reference number',
    description: 'Anonymous complaints cannot be recovered from a phone number, so the reference is required for tracking.',
    icon: 'lock' as const,
  },
]

const submissionTips = [
  'Use a road name, ward, landmark, or nearby public building.',
  'Describe what is wrong, how long it has continued, and who is affected.',
  'Attach a photo when it helps officers confirm the location or severity.',
  'Add your phone number only if you want SMS status updates.',
]

function ServiceIcon({ name }: { name: ServiceIconName }) {
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
      {name === 'building' && (
        <>
          <path {...common} d="M4 21h16" />
          <path {...common} d="M6 21V8l6-4 6 4v13" />
          <path {...common} d="M9 21v-6h6v6" />
          <path {...common} d="M9 10h.01M12 10h.01M15 10h.01" />
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
      {name === 'light' && (
        <>
          <path {...common} d="M9 18h6" />
          <path {...common} d="M10 22h4" />
          <path {...common} d="M8.5 14.5A6 6 0 1 1 15.5 14c-.8.7-1.2 1.6-1.3 2.5H9.8c-.1-.8-.5-1.5-1.3-2Z" />
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
      {name === 'road' && (
        <>
          <path {...common} d="M8 21 11 3" />
          <path {...common} d="M16 21 13 3" />
          <path {...common} d="M12 8v2M12 14v2" />
        </>
      )}
      {name === 'search' && (
        <>
          <circle {...common} cx="10.5" cy="10.5" r="6.5" />
          <path {...common} d="m16 16 4 4" />
        </>
      )}
      {name === 'trash' && (
        <>
          <path {...common} d="M4 7h16" />
          <path {...common} d="M9 7V4h6v3" />
          <path {...common} d="m7 7 1 14h8l1-14" />
          <path {...common} d="M10 11v6M14 11v6" />
        </>
      )}
      {name === 'water' && (
        <>
          <path {...common} d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z" />
          <path {...common} d="M9 15a3 3 0 0 0 4 2.8" />
        </>
      )}
    </svg>
  )
}

export function PublicServicesPage({ onNavigate }: PublicServicesPageProps) {
  const navigateTo = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <article className="public-page services-page">
      <section className="compact-page-hero services-hero" aria-labelledby="services-page-title">
        <div>
          <p className="eyebrow">Public service categories</p>
          <h1 id="services-page-title">Find the right civic issue type before you report.</h1>
          <p>
            Choose the closest category, add a clear location, and describe the issue in practical
            terms. The Pradeshiya Sabha team can refine the department after review.
          </p>
        </div>
        <div className="services-hero-actions">
          <a className="button button-primary" href="/submit" onClick={navigateTo('/submit')}>
            <ServiceIcon name="file" />
            Submit a complaint
          </a>
          <a className="button button-secondary" href="/track" onClick={navigateTo('/track')}>
            <ServiceIcon name="search" />
            Track reference
          </a>
        </div>
      </section>

      <section className="services-boundary-grid" aria-label="Important service guidance">
        {portalBoundaries.map((item) => (
          <article key={item.title}>
            <span aria-hidden="true">
              <ServiceIcon name={item.icon} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="section-block page-section" aria-labelledby="service-groups-title">
        <div className="section-heading">
          <p className="eyebrow">Common categories</p>
          <h2 id="service-groups-title">Issues citizens usually report</h2>
          <p>
            These categories match how citizens describe problems. Pick the closest match and the
            operations team can assign it to the right officer or department.
          </p>
        </div>

        <div className="services-category-grid">
          {serviceGroups.map((service) => (
            <article className={`services-category-card services-category-card-${service.tone}`} key={service.title}>
              <div className="services-category-heading">
                <span aria-hidden="true">
                  <ServiceIcon name={service.icon} />
                </span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.owner}</p>
                </div>
              </div>

              <ul aria-label={`${service.title} examples`}>
                {service.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>

              <p>{service.details}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="services-help-section" aria-labelledby="services-help-title">
        <div>
          <p className="eyebrow">Submission quality</p>
          <h2 id="services-help-title">Better details help officers act faster.</h2>
          <p>
            A complaint should help an officer understand where to go, what to inspect, and how
            urgent the issue is. Keep the description factual and specific.
          </p>
        </div>
        <ul>
          {submissionTips.map((tip) => (
            <li key={tip}>
              <ServiceIcon name="check" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="help-band" aria-label="Ready to report?">
        <div>
          <strong>Ready to submit a complaint?</strong>
          <span>No account needed. Keep your reference number after submission.</span>
        </div>
        <a className="button button-primary" href="/submit" onClick={navigateTo('/submit')}>
          Submit complaint
          <ServiceIcon name="arrow" />
        </a>
      </div>
    </article>
  )
}
