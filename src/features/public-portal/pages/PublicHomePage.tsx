import type { FormEvent, MouseEvent } from 'react'

type PublicHomePageProps = {
  onNavigate: (href: string) => void
}

type IconName = 'alert' | 'arrow' | 'building' | 'check' | 'file' | 'light' | 'lock' | 'map' | 'road' | 'search' | 'trash' | 'water'

const serviceCategories: Array<{ title: string; description: string; icon: IconName; categoryValue: string }> = [
  {
    title: 'Road damage',
    description: 'Broken roads, potholes, unsafe culverts, damaged signs, or blocked access routes.',
    icon: 'road',
    categoryValue: 'Roads and access',
  },
  {
    title: 'Drainage and flooding',
    description: 'Blocked drains, stagnant water, overflowing canals, or recurring flood points.',
    icon: 'water',
    categoryValue: 'Drainage and water flow',
  },
  {
    title: 'Waste collection',
    description: 'Missed collection, illegal dumping, overflowing bins, or public area waste.',
    icon: 'trash',
    categoryValue: 'Waste and public health',
  },
  {
    title: 'Street lights',
    description: 'Broken lights, exposed wiring, dark junctions, or unsafe public lighting.',
    icon: 'light',
    categoryValue: 'Street lighting and safety',
  },
  {
    title: 'Public facilities',
    description: 'Issues in parks, markets, cemeteries, libraries, community halls, or public toilets.',
    icon: 'building',
    categoryValue: 'Public property',
  },
  {
    title: 'Public health concerns',
    description: 'Mosquito breeding places, unsafe premises, nuisance complaints, or sanitation risks.',
    icon: 'alert',
    categoryValue: 'Waste and public health',
  },
]

const trustFacts = [
  { value: 'Ref', label: 'Reference number issued after submission' },
  { value: '24/7', label: 'Online access to submit and track' },
  { value: 'SMS', label: 'Optional updates when a phone number is provided' },
  { value: 'Anon', label: 'Anonymous reports are supported' },
]

const requiredDetails = [
  'Location or landmark',
  'Issue and time noticed',
  'Photo or document',
  'Phone number for SMS',
]

function HomeIcon({ name }: { name: IconName }) {
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

export function PublicHomePage({ onNavigate }: PublicHomePageProps) {
  const navigateTo = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onNavigate(href)
  }

  const handleTrackSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const reference = String(formData.get('reference') ?? '').trim()
    onNavigate(reference ? `/track?reference=${encodeURIComponent(reference)}` : '/track')
  }

  return (
    <article className="home-page">
      <section className="hero-section civic-hero-section" aria-labelledby="public-home-title">
        <div className="hero-copy">
          <p className="eyebrow">Official civic complaint portal</p>
          <h1 id="public-home-title">Submit civic complaints and track the response.</h1>
          <p>
            Use this Pradeshiya Sabha public portal to report local service issues, receive a
            complaint reference, and check progress without visiting the office.
          </p>

          <div className="hero-actions" aria-label="Primary citizen actions">
            <a className="button button-primary" href="/submit" onClick={navigateTo('/submit')}>
              <HomeIcon name="file" />
              Submit complaint
            </a>
            <a className="button button-secondary" href="/track" onClick={navigateTo('/track')}>
              <HomeIcon name="search" />
              Track reference
            </a>
          </div>

          <div className="hero-trust-row" aria-label="Service highlights">
            <span>Anonymous option</span>
            <span>Optional SMS updates</span>
            <span>Mobile accessible</span>
          </div>
        </div>

        <div className="home-hero-stack">
          <figure className="home-hero-media">
            <img src="/sri-lanka-civic-office.jpg" alt="Colombo Town Hall civic office building in Sri Lanka" />
            <figcaption>Public service requests are recorded for review and follow-up.</figcaption>
          </figure>

          <aside className="home-action-panel" aria-label="Quick complaint actions">
            <div className="home-action-panel-header">
              <div>
                <p className="eyebrow">Quick access</p>
                <h2>Start here</h2>
              </div>
            </div>

            <a className="home-action-card home-action-card-primary" href="/submit" onClick={navigateTo('/submit')}>
              <span aria-hidden="true">
                <HomeIcon name="file" />
              </span>
              <div>
                <strong>Submit complaint</strong>
                <p>Report a civic service issue.</p>
              </div>
              <HomeIcon name="arrow" />
            </a>

            <form className="home-track-form" aria-label="Track complaint from home page" onSubmit={handleTrackSubmit}>
              <label htmlFor="home-reference">Track reference</label>
              <div>
                <input id="home-reference" name="reference" placeholder="PS-2026-00124" />
                <button type="submit">Track</button>
              </div>
              <p>Enter the complaint reference number.</p>
            </form>
          </aside>
        </div>
      </section>

      <section className="trust-fact-grid" aria-label="Service facts">
        {trustFacts.map((fact) => (
          <article key={fact.label}>
            <strong>{fact.value}</strong>
            <span>{fact.label}</span>
          </article>
        ))}
      </section>

      <section className="section-block" aria-labelledby="services-title">
        <div className="section-heading">
          <p className="eyebrow">What you can report</p>
          <h2 id="services-title">Choose the closest civic service category.</h2>
          <p>
            Citizens do not need to know the exact department. Pick the closest issue type, describe
            the location clearly, and officers can refine the category during review.
          </p>
        </div>

        <div className="service-grid citizen-category-grid">
          {serviceCategories.map((category) => {
            const href = `/submit?category=${encodeURIComponent(category.categoryValue)}`

            return (
              <a className="service-card service-card-link" href={href} key={category.title} onClick={navigateTo(href)}>
                <span aria-hidden="true">
                  <HomeIcon name={category.icon} />
                </span>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </a>
            )
          })}
        </div>
      </section>

      <section className="process-section" aria-labelledby="process-title">
        <div className="process-intro">
          <p className="eyebrow">How it works</p>
          <h2 id="process-title">A clear path from report to resolution.</h2>
          <p>
            Every complaint should move through visible stages, so citizens can understand what
            happened after submission and officers have an auditable service record.
          </p>
        </div>
        <ol className="process-list">
          <li>
            <span aria-hidden="true">1</span>
            <strong>Tell us what happened</strong>
            <p>Submit the category, location, description, and any useful photo or document.</p>
          </li>
          <li>
            <span aria-hidden="true">2</span>
            <strong>Save your reference</strong>
            <p>The reference number is needed for tracking, especially for anonymous complaints.</p>
          </li>
          <li>
            <span aria-hidden="true">3</span>
            <strong>Track status changes</strong>
            <p>Follow stages such as submitted, acknowledged, assigned, in progress, and resolved.</p>
          </li>
        </ol>
      </section>

      <section className="notice-section home-guidance-section" aria-labelledby="guidance-title">
        <div className="section-heading">
          <p className="eyebrow">Before you submit</p>
          <h2 id="guidance-title">A complete complaint is easier to resolve.</h2>
        </div>

        <div className="notice-grid">
          <article>
            <div className="notice-card-heading">
              <span aria-hidden="true">
                <HomeIcon name="alert" />
              </span>
              <strong>Emergency matters</strong>
            </div>
            <p>Use emergency services first for fire, crime, medical emergencies, or immediate life-safety risks.</p>
          </article>
          <article>
            <div className="notice-card-heading">
              <span aria-hidden="true">
                <HomeIcon name="map" />
              </span>
              <strong>Accurate locations help</strong>
            </div>
            <p>Add a road name, ward, nearby landmark, or clear directions so field officers can find the issue.</p>
          </article>
          <article>
            <div className="notice-card-heading">
              <span aria-hidden="true">
                <HomeIcon name="lock" />
              </span>
              <strong>Privacy is respected</strong>
            </div>
            <p>You may submit anonymously, or add a contact number when you want SMS status updates.</p>
          </article>
        </div>

        <div className="submission-checklist">
          <div>
            <p className="eyebrow">Useful details</p>
            <strong>Prepare these before submitting</strong>
          </div>
          <ul>
            {requiredDetails.map((detail) => (
              <li key={detail}>
                <HomeIcon name="check" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <div className="home-cta-banner" aria-label="Primary call to action">
        <p className="eyebrow">Need help choosing a category?</p>
        <h2>
          Browse service guidance, then submit the closest match.
        </h2>
        <div>
          <a className="button button-primary" href="/submit" onClick={navigateTo('/submit')}>
            Submit a complaint
          </a>
          <a className="button button-secondary" href="/services" onClick={navigateTo('/services')}>
            Browse services
          </a>
        </div>
      </div>
    </article>
  )
}
