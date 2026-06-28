import type { FormEvent, MouseEvent } from 'react'
import { usePublicLanguage } from '../../../shared/i18n/PublicLanguageContext'

type PublicHomePageProps = {
  onNavigate: (href: string) => void
}

type IconName = 'alert' | 'arrow' | 'building' | 'check' | 'file' | 'light' | 'lock' | 'map' | 'road' | 'search' | 'trash' | 'water'

const homeCopy = {
  en: {
    heroEyebrow: 'Official civic complaint portal',
    heroTitle: 'Submit civic complaints and track the response.',
    heroBody:
      'Use this Pradeshiya Sabha public portal to report local service issues, receive a complaint reference, and check progress without visiting the office.',
    submitComplaint: 'Submit complaint',
    trackReference: 'Track reference',
    trustRow: ['Anonymous option', 'Optional SMS updates', 'Mobile accessible'],
    imageAlt: 'Colombo Town Hall civic office building in Sri Lanka',
    imageCaption: 'Public service requests are recorded for review and follow-up.',
    quickAccess: 'Quick access',
    startHere: 'Start here',
    reportIssue: 'Report a civic service issue.',
    trackLabel: 'Track reference',
    trackButton: 'Track',
    referencePlaceholder: 'PS-2026-00124',
    referenceHelp: 'Enter the complaint reference number.',
    serviceEyebrow: 'What you can report',
    serviceTitle: 'Choose the closest civic service category.',
    serviceBody:
      'Citizens do not need to know the exact department. Pick the closest issue type, describe the location clearly, and officers can refine the category during review.',
    processEyebrow: 'How it works',
    processTitle: 'A clear path from report to resolution.',
    processBody:
      'Every complaint should move through visible stages, so citizens can understand what happened after submission and officers have an auditable service record.',
    guidanceEyebrow: 'Before you submit',
    guidanceTitle: 'A complete complaint is easier to resolve.',
    checklistEyebrow: 'Useful details',
    checklistTitle: 'Prepare these before submitting',
    ctaLabel: 'Primary call to action',
    ctaEyebrow: 'Need help choosing a category?',
    ctaTitle: 'Browse service guidance, then submit the closest match.',
    browseServices: 'Browse services',
    services: [
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
    ] as Array<{ title: string; description: string; icon: IconName; categoryValue: string }>,
    facts: [
      { value: 'Ref', label: 'Reference number issued after submission' },
      { value: '24/7', label: 'Online access to submit and track' },
      { value: 'SMS', label: 'Optional updates when a phone number is provided' },
      { value: 'Anon', label: 'Anonymous reports are supported' },
    ],
    steps: [
      {
        title: 'Tell us what happened',
        body: 'Submit the category, location, description, and any useful photo or document.',
      },
      {
        title: 'Save your reference',
        body: 'The reference number is needed for tracking, especially for anonymous complaints.',
      },
      {
        title: 'Track status changes',
        body: 'Follow stages such as submitted, acknowledged, assigned, in progress, and resolved.',
      },
    ],
    notices: [
      {
        icon: 'alert',
        title: 'Emergency matters',
        body: 'Use emergency services first for fire, crime, medical emergencies, or immediate life-safety risks.',
      },
      {
        icon: 'map',
        title: 'Accurate locations help',
        body: 'Add a road name, ward, nearby landmark, or clear directions so field officers can find the issue.',
      },
      {
        icon: 'lock',
        title: 'Privacy is respected',
        body: 'You may submit anonymously, or add a contact number when you want SMS status updates.',
      },
    ] as Array<{ icon: IconName; title: string; body: string }>,
    details: ['Location or landmark', 'Issue and time noticed', 'Photo or document', 'Phone number for SMS'],
  },
  ta: {
    heroEyebrow: 'உங்கள் ஊருக்கான முறைப்பாட்டு மையம்',
    heroTitle: 'ஊரில் தெரியும் பிரச்சினையை இங்கிருந்தே சொல்லுங்கள்.',
    heroTitleLines: ['ஊரில் தெரியும் பிரச்சினையை', 'இங்கிருந்தே சொல்லுங்கள்.'],
    heroBody:
      'வீதி, வடிகால், குப்பை, தெருவிளக்கு போன்ற பிரதேச சபை சேவை குறைகளை அலுவலகம் வராமலே பதிவு செய்து, குறிப்பு எண்ணுடன் முன்னேற்றத்தைப் பாருங்கள்.',
    submitComplaint: 'முறைப்பாடு பதிவு',
    trackReference: 'குறிப்பு எண் பார்க்க',
    trustRow: ['பெயரில்லா பதிவு', 'SMS புதுப்பிப்பு', 'கைபேசி சேவை'],
    imageAlt: 'இலங்கையில் உள்ள நகராட்சி அலுவலகக் கட்டிடம்',
    imageCaption: 'பொது சேவை கோரிக்கைகள் பரிசீலனைக்காக பதிவு செய்யப்படும்.',
    quickAccess: 'விரைவு வழி',
    startHere: 'இங்கிருந்து தொடங்குங்கள்',
    reportIssue: 'உங்கள் பகுதி சேவை குறையை பதிவு செய்யுங்கள்.',
    trackLabel: 'குறிப்பு எண்',
    trackButton: 'பார்',
    referencePlaceholder: 'PS-2026-00124',
    referenceHelp: 'முறைப்பாட்டு குறிப்பு எண்ணை இங்கே இடுங்கள்.',
    serviceEyebrow: 'சேவை வகைகள்',
    serviceTitle: 'உங்கள் பிரச்சினைக்கு அருகிலான சேவை வகையை தேர்ந்தெடுங்கள்.',
    serviceBody:
      'சரியான துறையைத் தெரிந்திருக்க வேண்டிய அவசியமில்லை. உங்கள் பிரச்சினைக்கு அருகிலான சேவை வகையைத் தேர்வு செய்து, இட விவரத்தை தெளிவாக வழங்கினால், பரிசீலனையின் பின் அது உரிய அணிக்கு ஒதுக்கப்படும்.',
    processEyebrow: 'செயல்முறை',
    processTitle: 'முறைப்பாட்டிலிருந்து தீர்வுவரை தெளிவான பாதை.',
    processBody:
      'முறைப்பாடு எந்த நிலையில் இருக்கிறது என்பதை மக்கள் பார்க்கலாம்; அலுவலர்களுக்கும் ஒவ்வொரு நடவடிக்கைக்கும் தெளிவான பதிவு இருக்கும்.',
    guidanceEyebrow: 'அனுப்புவதற்கு முன்',
    guidanceTitle: 'தெளிவான முறைப்பாடு விரைவான நடவடிக்கைக்கு உதவும்.',
    checklistEyebrow: 'உதவும் விவரங்கள்',
    checklistTitle: 'அனுப்புவதற்கு முன் இதை தயார் வைத்துக்கொள்ளுங்கள்',
    ctaLabel: 'முக்கிய செயல் அழைப்பு',
    ctaEyebrow: 'எந்த வகை என்று குழப்பமா?',
    ctaTitle: 'சேவை வழிகாட்டியைப் பார்த்து, அருகிலான வகையில் முறைப்பாடு அனுப்புங்கள்.',
    browseServices: 'சேவைகளைப் பார்க்க',
    services: [
      {
        title: 'வீதி சேதம்',
        description: 'குழி, உடைந்த கல்வர்ட், மறைக்கப்பட்ட பாதை, பெயர்பலகை சேதம் போன்றவை.',
        icon: 'road',
        categoryValue: 'Roads and access',
      },
      {
        title: 'வடிகால் / நீர் தேக்கம்',
        description: 'அடைந்த கால்வாய், தேங்கும் நீர், மழைக்குப் பின் மீண்டும் வரும் வெள்ளப்புள்ளிகள்.',
        icon: 'water',
        categoryValue: 'Drainage and water flow',
      },
      {
        title: 'குப்பை சேகரிப்பு',
        description: 'சேகரிப்பு தவறுதல், சட்டவிரோத குப்பை கொட்டல், நிரம்பிய தொட்டிகள், பொது இடக் குப்பை.',
        icon: 'trash',
        categoryValue: 'Waste and public health',
      },
      {
        title: 'தெருவிளக்கு',
        description: 'எரியாத விளக்கு, வெளிப்பட்ட வயர், இருண்ட சந்திப்பு, இரவில் பாதுகாப்பு குறைவு.',
        icon: 'light',
        categoryValue: 'Street lighting and safety',
      },
      {
        title: 'பொது வசதிகள்',
        description: 'பூங்கா, சந்தை, மண்டபம், நூலகம், மயானம், பொது கழிப்பறை போன்ற இடங்களில் உள்ள குறைகள்.',
        icon: 'building',
        categoryValue: 'Public property',
      },
      {
        title: 'பொது சுகாதாரம்',
        description: 'நுளம்பு பெருகும் இடம், சுகாதார அபாயம், தொந்தரவு, பாதுகாப்பற்ற வளாகம்.',
        icon: 'alert',
        categoryValue: 'Waste and public health',
      },
    ] as Array<{ title: string; description: string; icon: IconName; categoryValue: string }>,
    facts: [
      { value: 'குறிப்பு', label: 'பதிவுக்குப் பின் எண் வழங்கப்படும்' },
      { value: '24/7', label: 'எந்நேரமும் இணைய சேவை' },
      { value: 'SMS', label: 'நிலை மாற்ற அறிவிப்பு' },
      { value: 'தனியுரிமை', label: 'பெயரில்லா பதிவு வசதி' },
    ],
    steps: [
      {
        title: 'நடந்ததை சுருக்கமாக சொல்லுங்கள்',
        body: 'வகை, இடம், விவரம், உதவும் படம் அல்லது ஆவணத்தை சேர்க்கலாம்.',
      },
      {
        title: 'குறிப்பு எண்ணை சேமியுங்கள்',
        body: 'பிறகு நிலை பார்க்க இந்த எண் தேவைப்படும்; பெயரில்லா முறைப்பாட்டுக்கு இது மிகவும் முக்கியம்.',
      },
      {
        title: 'நிலையை தொடர்ந்து பாருங்கள்',
        body: 'பெறப்பட்டது, ஏற்றுக்கொள்ளப்பட்டது, ஒதுக்கப்பட்டது, செயலில் உள்ளது, தீர்ந்தது போன்ற நிலைகள் தெரியும்.',
      },
    ],
    notices: [
      {
        icon: 'alert',
        title: 'அவசர நிலை தனி',
        body: 'தீ, குற்றம், மருத்துவ அவசரம், உடனடி உயிர் அபாயம் என்றால் முதலில் அவசர சேவையை தொடர்புகொள்ளுங்கள்.',
      },
      {
        icon: 'map',
        title: 'இடம் தெளிவாக இருந்தால் வேலை வேகமாகும்',
        body: 'வீதி பெயர், வார்டு, அருகிலுள்ள அடையாளம், செல்லும் வழி போன்றதை சேர்த்தால் கள அலுவலர்கள் இடத்தை எளிதாக கண்டுபிடிப்பார்கள்.',
      },
      {
        icon: 'lock',
        title: 'தனியுரிமைக்கு மதிப்பு',
        body: 'பெயர் இல்லாமலும் அனுப்பலாம்; SMS நிலை வேண்டுமென்றால் மட்டும் தொலைபேசி எண்ணை சேருங்கள்.',
      },
    ] as Array<{ icon: IconName; title: string; body: string }>,
    details: ['இடம் அல்லது அடையாளம்', 'பிரச்சினை மற்றும் தெரிந்த நேரம்', 'படம் அல்லது ஆவணம்', 'SMS வேண்டுமெனில் தொலைபேசி எண்'],
  },
}

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
  const language = usePublicLanguage()
  const copy = homeCopy[language]

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
          <p className="eyebrow">{copy.heroEyebrow}</p>
          <h1 id="public-home-title">
            {'heroTitleLines' in copy
              ? copy.heroTitleLines.map((line) => <span key={line}>{line}</span>)
              : copy.heroTitle}
          </h1>
          <p>{copy.heroBody}</p>

          <div className="hero-actions" aria-label="Primary citizen actions">
            <a className="button button-primary" href="/submit" onClick={navigateTo('/submit')}>
              <HomeIcon name="file" />
              {copy.submitComplaint}
            </a>
            <a className="button button-secondary" href="/track" onClick={navigateTo('/track')}>
              <HomeIcon name="search" />
              {copy.trackReference}
            </a>
          </div>

          <div className="hero-trust-row" aria-label="Service highlights">
            {copy.trustRow.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="home-hero-stack">
          <figure className="home-hero-media">
            <img src="/sri-lanka-civic-office.jpg" alt={copy.imageAlt} />
            <figcaption>{copy.imageCaption}</figcaption>
          </figure>

          <aside className="home-action-panel" aria-label="Quick complaint actions">
            <div className="home-action-panel-header">
              <div>
                <p className="eyebrow">{copy.quickAccess}</p>
                <h2>{copy.startHere}</h2>
              </div>
            </div>

            <a className="home-action-card home-action-card-primary" href="/submit" onClick={navigateTo('/submit')}>
              <span aria-hidden="true">
                <HomeIcon name="file" />
              </span>
              <div>
                <strong>{copy.submitComplaint}</strong>
                <p>{copy.reportIssue}</p>
              </div>
              <HomeIcon name="arrow" />
            </a>

            <form className="home-track-form" aria-label="Track complaint from home page" onSubmit={handleTrackSubmit}>
              <label htmlFor="home-reference">{copy.trackLabel}</label>
              <div>
                <input id="home-reference" name="reference" placeholder={copy.referencePlaceholder} />
                <button type="submit">{copy.trackButton}</button>
              </div>
              <p>{copy.referenceHelp}</p>
            </form>
          </aside>
        </div>
      </section>

      <section className="trust-fact-grid" aria-label="Service facts">
        {copy.facts.map((fact) => (
          <article key={fact.label}>
            <strong>{fact.value}</strong>
            <span>{fact.label}</span>
          </article>
        ))}
      </section>

      <section className="section-block" aria-labelledby="services-title">
        <div className="section-heading">
          <p className="eyebrow">{copy.serviceEyebrow}</p>
          <h2 id="services-title">{copy.serviceTitle}</h2>
          <p>{copy.serviceBody}</p>
        </div>

        <div className="service-grid citizen-category-grid">
          {copy.services.map((category) => {
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
          <p className="eyebrow">{copy.processEyebrow}</p>
          <h2 id="process-title">{copy.processTitle}</h2>
          <p>{copy.processBody}</p>
        </div>
        <ol className="process-list">
          {copy.steps.map((step, index) => (
            <li key={step.title}>
              <span aria-hidden="true">{index + 1}</span>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="notice-section home-guidance-section" aria-labelledby="guidance-title">
        <div className="section-heading">
          <p className="eyebrow">{copy.guidanceEyebrow}</p>
          <h2 id="guidance-title">{copy.guidanceTitle}</h2>
        </div>

        <div className="notice-grid">
          {copy.notices.map((notice) => (
            <article key={notice.title}>
              <div className="notice-card-heading">
                <span aria-hidden="true">
                  <HomeIcon name={notice.icon} />
                </span>
                <strong>{notice.title}</strong>
              </div>
              <p>{notice.body}</p>
            </article>
          ))}
        </div>

        <div className="submission-checklist">
          <div>
            <p className="eyebrow">{copy.checklistEyebrow}</p>
            <strong>{copy.checklistTitle}</strong>
          </div>
          <ul>
            {copy.details.map((detail) => (
              <li key={detail}>
                <HomeIcon name="check" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <div className="home-cta-banner" aria-label={copy.ctaLabel}>
        <p className="eyebrow">{copy.ctaEyebrow}</p>
        <h2>{copy.ctaTitle}</h2>
        <div>
          <a className="button button-primary" href="/submit" onClick={navigateTo('/submit')}>
            {copy.submitComplaint}
          </a>
          <a className="button button-secondary" href="/services" onClick={navigateTo('/services')}>
            {copy.browseServices}
          </a>
        </div>
      </div>
    </article>
  )
}
