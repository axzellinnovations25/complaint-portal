import type { MouseEvent } from 'react'
import { usePublicLanguage, type PublicLanguage } from '../../../shared/i18n/PublicLanguageContext'

type PublicServicesPageProps = {
  onNavigate: (href: string) => void
}

type ServiceIconName = 'alert' | 'arrow' | 'building' | 'check' | 'file' | 'light' | 'lock' | 'map' | 'road' | 'search' | 'trash' | 'water'

const serviceGroups: Array<{
  title: Record<PublicLanguage, string>
  owner: Record<PublicLanguage, string>
  examples: Record<PublicLanguage, string[]>
  details: Record<PublicLanguage, string>
  icon: ServiceIconName
  tone: 'cyan' | 'blue' | 'teal' | 'amber' | 'violet' | 'rose'
}> = [
  {
    title: { en: 'Roads and access', ta: 'வீதிகள் / அணுகல் பாதைகள்' },
    owner: { en: 'Road works / field maintenance', ta: 'வீதி பராமரிப்பு / கள அணி' },
    examples: { en: ['Potholes', 'Broken culverts', 'Blocked footpaths', 'Damaged name boards'], ta: ['வீதி குழி', 'உடைந்த கல்வர்ட்', 'மறைக்கப்பட்ட நடைபாதை', 'சேதமான பெயர்பலகை'] },
    details: { en: 'Include the road name, nearby landmark, direction of travel, and whether the issue blocks access.', ta: 'வீதி பெயர், அருகிலுள்ள அடையாளம், செல்லும் திசை, பாதை மறைக்கப்பட்டுள்ளதா என்பதைக் குறிப்பிடுங்கள்.' },
    icon: 'road',
    tone: 'cyan',
  },
  {
    title: { en: 'Drainage and water flow', ta: 'வடிகால் / நீரோட்டம்' },
    owner: { en: 'Drainage / public works', ta: 'வடிகால் / பொதுப்பணி' },
    examples: { en: ['Blocked drains', 'Flood points', 'Stagnant water', 'Erosion near roads'], ta: ['அடைந்த கால்வாய்', 'மழைநீர் நிற்கும் இடம்', 'தேங்கிய நீர்', 'வீதியோர அரிப்பு'] },
    details: { en: 'Mention if flooding happens after rain, where water collects, and whether homes or roads are affected.', ta: 'மழைக்கு பின் நீர் தேங்குகிறதா, எந்த இடத்தில் தேங்குகிறது, வீடு அல்லது வீதி பாதிக்கப்படுகிறதா என்று எழுதுங்கள்.' },
    icon: 'water',
    tone: 'blue',
  },
  {
    title: { en: 'Waste and sanitation', ta: 'குப்பை / சுத்தம்' },
    owner: { en: 'Solid waste / public health', ta: 'திடக்கழிவு / பொது சுகாதாரம்' },
    examples: { en: ['Missed collection', 'Illegal dumping', 'Overflowing bins', 'Public toilet issues'], ta: ['சேகரிப்பு தவறுதல்', 'குப்பை கொட்டல்', 'நிரம்பிய தொட்டி', 'பொது கழிப்பறை குறை'] },
    details: { en: 'Add collection route, bin location, frequency of the issue, and any visible public health risk.', ta: 'சேகரிப்பு பாதை, தொட்டி இடம், பிரச்சினை எவ்வளவு அடிக்கடி நடக்கிறது, சுகாதார அபாயம் உள்ளதா என்பதைக் குறிப்பிடுங்கள்.' },
    icon: 'trash',
    tone: 'teal',
  },
  {
    title: { en: 'Street lighting and safety', ta: 'தெருவிளக்கு / பாதுகாப்பு' },
    owner: { en: 'Electrical / field service', ta: 'மின்சார / கள சேவை' },
    examples: { en: ['Broken lamps', 'Dark junctions', 'Exposed wiring', 'Unsafe public spaces'], ta: ['எரியாத விளக்கு', 'இருண்ட சந்திப்பு', 'வெளிப்பட்ட வயர்', 'பாதுகாப்பற்ற பொது இடம்'] },
    details: { en: 'Include pole number when available, street name, and whether the location is unsafe at night.', ta: 'கம்ப எண் தெரிந்தால் சேர்க்கவும்; வீதி பெயர் மற்றும் இரவில் பாதுகாப்பு குறை இருக்கிறதா என்பதையும் எழுதுங்கள்.' },
    icon: 'light',
    tone: 'amber',
  },
  {
    title: { en: 'Public property and facilities', ta: 'பொது சொத்து / வசதிகள்' },
    owner: { en: 'Facilities / asset maintenance', ta: 'வசதி / சொத்து பராமரிப்பு' },
    examples: { en: ['Parks', 'Markets', 'Community halls', 'Libraries and cemeteries'], ta: ['பூங்கா', 'சந்தை', 'சமூக மண்டபம்', 'நூலகம் / மயானம்'] },
    details: { en: 'Describe the damaged facility, exact area, safety risk, and whether it affects public use.', ta: 'சேதமடைந்த வசதி, சரியான பகுதி, பாதுகாப்பு அபாயம், மக்கள் பயன்படுத்துவதில் பாதிப்பு உள்ளதா என்பதைக் கூறுங்கள்.' },
    icon: 'building',
    tone: 'violet',
  },
  {
    title: { en: 'Public health concerns', ta: 'பொது சுகாதார கவலைகள்' },
    owner: { en: 'Public health / inspection', ta: 'பொது சுகாதாரம் / ஆய்வு' },
    examples: { en: ['Mosquito breeding', 'Nuisance complaints', 'Unsafe premises', 'Sanitation risks'], ta: ['நுளம்பு பெருகும் இடம்', 'தொந்தரவு முறைப்பாடு', 'பாதுகாப்பற்ற வளாகம்', 'சுகாதார அபாயம்'] },
    details: { en: 'Share the location, visible risk, how long it has continued, and whether children or elders are affected.', ta: 'இடம், தெரியும் அபாயம், எவ்வளவு காலமாக உள்ளது, குழந்தைகள் அல்லது முதியவர்கள் பாதிக்கப்படுகிறார்களா என்பதைக் கூறுங்கள்.' },
    icon: 'alert',
    tone: 'rose',
  },
]

const portalBoundaries = [
  {
    title: { en: 'Use emergency channels first', ta: 'அவசர நிலைக்கு முதலில் அவசர சேவை' },
    description: { en: 'Fire, crime, medical emergencies, and immediate life-safety matters should not wait for portal review.', ta: 'தீ, குற்றம், மருத்துவ அவசரம், உடனடி உயிர் அபாயம் போன்றவை மைய பரிசீலனைக்காக காத்திருக்கக்கூடாது.' },
    icon: 'alert' as const,
  },
  {
    title: { en: 'Use the closest category', ta: 'அருகிலான வகையை தேர்ந்தெடுக்கவும்' },
    description: { en: 'If the category is not exact, submit anyway. Officers can reassign the complaint during review.', ta: 'சரியான வகை தெரியாவிட்டாலும் பரவாயில்லை. பரிசீலனையில் அலுவலர்கள் சரியான அணிக்கு மாற்றுவார்கள்.' },
    icon: 'check' as const,
  },
  {
    title: { en: 'Keep your reference number', ta: 'குறிப்பு எண்ணை சேமியுங்கள்' },
    description: { en: 'Anonymous complaints cannot be recovered from a phone number, so the reference is required for tracking.', ta: 'பெயரில்லா முறைப்பாட்டை தொலைபேசி எண்ணால் தேட முடியாது; நிலை பார்க்க குறிப்பு எண் அவசியம்.' },
    icon: 'lock' as const,
  },
]

const servicesCopy = {
  en: {
    heroEyebrow: 'Public service categories',
    heroTitle: 'Find the right civic issue type before you report.',
    heroBody:
      'Choose the closest category, add a clear location, and describe the issue in practical terms. The Pradeshiya Sabha team can refine the department after review.',
    submitComplaint: 'Submit a complaint',
    trackReference: 'Track reference',
    summaryLabel: 'Service category summary',
    closestCategory: 'Choose the closest category',
    closestCategoryBody: 'Officers can reassign the complaint after review if another team should handle it.',
    heroBullets: ['6 common civic service groups', 'Location details guide field officers', 'Reference number supports tracking'],
    guidanceLabel: 'Important service guidance',
    commonEyebrow: 'Common categories',
    commonTitle: 'Issues citizens usually report',
    commonBody:
      'These categories match how citizens describe problems. Pick the closest match and the operations team can assign it to the right officer or department.',
    examplesSuffix: 'examples',
    qualityEyebrow: 'Submission quality',
    qualityTitle: 'Better details help officers act faster.',
    qualityBody:
      'A complaint should help an officer understand where to go, what to inspect, and how urgent the issue is. Keep the description factual and specific.',
    tips: [
      'Use a road name, ward, landmark, or nearby public building.',
      'Describe what is wrong, how long it has continued, and who is affected.',
      'Attach a photo when it helps officers confirm the location or severity.',
      'Add your phone number only if you want SMS status updates.',
    ],
    readyLabel: 'Ready to report?',
    readyTitle: 'Ready to submit a complaint?',
    readyBody: 'No account needed. Keep your reference number after submission.',
    submitShort: 'Submit complaint',
  },
  ta: {
    heroEyebrow: 'சேவை வகைகள்',
    heroTitle: 'முறைப்பாடு அனுப்புவதற்கு முன் சரியான பாதையை கண்டுபிடிக்கவும்.',
    heroBody:
      'பிரச்சினைக்கு அருகிலான வகையைத் தேர்ந்தெடுத்து, இடத்தை தெளிவாகச் சொல்லுங்கள். தேவையெனில் பிரதேச சபை அணி பின்னர் சரியான துறைக்கு மாற்றும்.',
    submitComplaint: 'முறைப்பாடு பதிவு',
    trackReference: 'குறிப்பு எண் பார்க்க',
    summaryLabel: 'சேவை வகை சுருக்கம்',
    closestCategory: 'அருகிலான வகை போதும்',
    closestCategoryBody: 'மற்றொரு அணி பார்க்க வேண்டுமெனில் பரிசீலனையின் பின் அலுவலர்கள் மாற்றுவார்கள்.',
    heroBullets: ['6 பொதுவான சேவை குழுக்கள்', 'இட விவரம் கள அணிக்கு வழிகாட்டும்', 'குறிப்பு எண் மூலம் நிலை பார்க்கலாம்'],
    guidanceLabel: 'முக்கிய சேவை வழிகாட்டி',
    commonEyebrow: 'பொதுவான வகைகள்',
    commonTitle: 'மக்கள் அதிகம் தெரிவிக்கும் பிரச்சினைகள்',
    commonBody:
      'மக்கள் பேசும் வழக்குக்கு ஏற்ப இந்த வகைகள் அமைக்கப்பட்டுள்ளன. அருகிலான ஒன்றைத் தேர்ந்தெடுத்தால் செயற்பாட்டு அணி சரியான அலுவலருக்கு ஒதுக்கும்.',
    examplesSuffix: 'எடுத்துக்காட்டுகள்',
    qualityEyebrow: 'முறைப்பாட்டு தரம்',
    qualityTitle: 'விவரம் தெளிவாக இருந்தால் நடவடிக்கை வேகமாகும்.',
    qualityBody:
      'எங்கு செல்ல வேண்டும், என்ன பார்க்க வேண்டும், எவ்வளவு அவசரம் என்பதை அலுவலர் புரிந்துகொள்ளும் வகையில் எழுதுங்கள்.',
    tips: [
      'வீதி பெயர், வார்டு, அடையாளம் அல்லது அருகிலுள்ள பொது கட்டிடம் சேர்க்கவும்.',
      'என்ன பிரச்சினை, எத்தனை காலமாக உள்ளது, யார் பாதிக்கப்படுகிறார்கள் என்று சொல்லுங்கள்.',
      'இடம் அல்லது தீவிரத்தை உறுதிப்படுத்த உதவினால் படம் சேர்க்கவும்.',
      'SMS நிலை வேண்டுமென்றால் மட்டும் தொலைபேசி எண்ணை சேருங்கள்.',
    ],
    readyLabel: 'முறைப்பாடு அனுப்ப தயாரா?',
    readyTitle: 'முறைப்பாடு அனுப்ப தயாரா?',
    readyBody: 'கணக்கு தேவையில்லை. அனுப்பிய பின் குறிப்பு எண்ணை சேமியுங்கள்.',
    submitShort: 'முறைப்பாடு பதிவு',
  },
}

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
  const language = usePublicLanguage()
  const copy = servicesCopy[language]

  const navigateTo = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <article className="public-page services-page">
      <section className="compact-page-hero services-hero" aria-labelledby="services-page-title">
        <div className="services-hero-copy">
          <p className="eyebrow">{copy.heroEyebrow}</p>
          <h1 id="services-page-title">{copy.heroTitle}</h1>
          <p>{copy.heroBody}</p>
          <div className="services-hero-actions">
            <a className="button button-primary" href="/submit" onClick={navigateTo('/submit')}>
              <ServiceIcon name="file" />
              {copy.submitComplaint}
            </a>
            <a className="button button-secondary" href="/track" onClick={navigateTo('/track')}>
              <ServiceIcon name="search" />
              {copy.trackReference}
            </a>
          </div>
        </div>

        <aside className="services-hero-card" aria-label={copy.summaryLabel}>
          <span className="services-hero-card-icon" aria-hidden="true">
            <ServiceIcon name="check" />
          </span>
          <div>
            <strong>{copy.closestCategory}</strong>
            <p>{copy.closestCategoryBody}</p>
          </div>
          <ul>
            {copy.heroBullets.map((item, index) => (
              <li key={item}>
                <ServiceIcon name={index === 0 ? 'building' : index === 1 ? 'map' : 'lock'} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="services-boundary-grid" aria-label={copy.guidanceLabel}>
        {portalBoundaries.map((item) => (
          <article key={item.title.en}>
            <span aria-hidden="true">
              <ServiceIcon name={item.icon} />
            </span>
            <div>
              <strong>{item.title[language]}</strong>
              <p>{item.description[language]}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="section-block page-section" aria-labelledby="service-groups-title">
        <div className="section-heading">
          <p className="eyebrow">{copy.commonEyebrow}</p>
          <h2 id="service-groups-title">{copy.commonTitle}</h2>
          <p>{copy.commonBody}</p>
        </div>

        <div className="services-category-grid">
          {serviceGroups.map((service) => (
            <article className={`services-category-card services-category-card-${service.tone}`} key={service.title.en}>
              <div className="services-category-heading">
                <span aria-hidden="true">
                  <ServiceIcon name={service.icon} />
                </span>
                <div>
                  <h3>{service.title[language]}</h3>
                  <p>{service.owner[language]}</p>
                </div>
              </div>

              <ul aria-label={`${service.title[language]} ${copy.examplesSuffix}`}>
                {service.examples[language].map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>

              <p>{service.details[language]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="services-help-section" aria-labelledby="services-help-title">
        <div>
          <p className="eyebrow">{copy.qualityEyebrow}</p>
          <h2 id="services-help-title">{copy.qualityTitle}</h2>
          <p>{copy.qualityBody}</p>
        </div>
        <ul>
          {copy.tips.map((tip) => (
            <li key={tip}>
              <ServiceIcon name="check" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="help-band" aria-label={copy.readyLabel}>
        <div>
          <strong>{copy.readyTitle}</strong>
          <span>{copy.readyBody}</span>
        </div>
        <a className="button button-primary" href="/submit" onClick={navigateTo('/submit')}>
          {copy.submitShort}
          <ServiceIcon name="arrow" />
        </a>
      </div>
    </article>
  )
}
