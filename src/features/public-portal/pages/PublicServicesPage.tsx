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
    title: { en: 'Roads and access', ta: 'வீதிகள் மற்றும் அணுகல் பாதைகள்' },
    owner: { en: 'Road works / field maintenance', ta: 'வீதி பணிகள் / கள பராமரிப்பு அணி' },
    examples: { en: ['Potholes', 'Broken culverts', 'Blocked footpaths', 'Damaged name boards'], ta: ['வீதி குழிகள்', 'சேதமடைந்த கல்வர்ட்கள்', 'தடைப்பட்ட நடைபாதைகள்', 'சேதமடைந்த பெயர்பலகைகள்'] },
    details: { en: 'Include the road name, nearby landmark, direction of travel, and whether the issue blocks access.', ta: 'வீதி பெயர், அருகிலுள்ள அடையாளம், பயண திசை, அணுகல் பாதை தடைப்பட்டுள்ளதா என்பதைக் குறிப்பிடவும்.' },
    icon: 'road',
    tone: 'cyan',
  },
  {
    title: { en: 'Drainage and water flow', ta: 'வடிகால் மற்றும் நீரோட்டம்' },
    owner: { en: 'Drainage / public works', ta: 'வடிகால் / பொதுப் பணிகள்' },
    examples: { en: ['Blocked drains', 'Flood points', 'Stagnant water', 'Erosion near roads'], ta: ['அடைந்த வடிகால்கள்', 'வெள்ளம் ஏற்படும் இடங்கள்', 'தேங்கிய நீர்', 'வீதியோர அரிப்பு'] },
    details: { en: 'Mention if flooding happens after rain, where water collects, and whether homes or roads are affected.', ta: 'மழைக்குப் பிறகு நீர் தேங்குகிறதா, அது எங்கு தேங்குகிறது, வீடுகள் அல்லது வீதிகள் பாதிக்கப்படுகின்றனவா என்பதைக் குறிப்பிடவும்.' },
    icon: 'water',
    tone: 'blue',
  },
  {
    title: { en: 'Waste and sanitation', ta: 'கழிவு மேலாண்மை மற்றும் சுகாதாரம்' },
    owner: { en: 'Solid waste / public health', ta: 'திடக்கழிவு / பொது சுகாதார அணி' },
    examples: { en: ['Missed collection', 'Illegal dumping', 'Overflowing bins', 'Public toilet issues'], ta: ['சேகரிப்பு தவறுதல்', 'சட்டவிரோத கழிவு கொட்டுதல்', 'நிரம்பிய கழிவு தொட்டிகள்', 'பொது கழிப்பறை குறைகள்'] },
    details: { en: 'Add collection route, bin location, frequency of the issue, and any visible public health risk.', ta: 'சேகரிப்பு பாதை, தொட்டி அமைந்த இடம், பிரச்சினை ஏற்படும் அடிக்கடி நிலை, தெரியும் சுகாதார அபாயம் ஆகியவற்றைக் குறிப்பிடவும்.' },
    icon: 'trash',
    tone: 'teal',
  },
  {
    title: { en: 'Street lighting and safety', ta: 'தெருவிளக்குகள் மற்றும் பாதுகாப்பு' },
    owner: { en: 'Electrical / field service', ta: 'மின்சார / கள சேவை அணி' },
    examples: { en: ['Broken lamps', 'Dark junctions', 'Exposed wiring', 'Unsafe public spaces'], ta: ['செயலிழந்த விளக்குகள்', 'இருண்ட சந்திப்புகள்', 'வெளிப்பட்ட மின்கம்பிகள்', 'பாதுகாப்பற்ற பொது இடங்கள்'] },
    details: { en: 'Include pole number when available, street name, and whether the location is unsafe at night.', ta: 'கம்ப எண் தெரிந்தால் சேர்க்கவும்; வீதி பெயர் மற்றும் இரவு நேர பாதுகாப்பு குறை உள்ளதா என்பதையும் குறிப்பிடவும்.' },
    icon: 'light',
    tone: 'amber',
  },
  {
    title: { en: 'Public property and facilities', ta: 'பொது சொத்துகள் மற்றும் வசதிகள்' },
    owner: { en: 'Facilities / asset maintenance', ta: 'வசதிகள் / சொத்து பராமரிப்பு அணி' },
    examples: { en: ['Parks', 'Markets', 'Community halls', 'Libraries and cemeteries'], ta: ['பூங்காக்கள்', 'சந்தைகள்', 'சமூக மண்டபங்கள்', 'நூலகங்கள் / மயானங்கள்'] },
    details: { en: 'Describe the damaged facility, exact area, safety risk, and whether it affects public use.', ta: 'சேதமடைந்த வசதி, துல்லியமான பகுதி, பாதுகாப்பு அபாயம், பொதுமக்கள் பயன்பாட்டில் ஏற்படும் பாதிப்பு ஆகியவற்றை விவரிக்கவும்.' },
    icon: 'building',
    tone: 'violet',
  },
  {
    title: { en: 'Public health concerns', ta: 'பொது சுகாதார கவலைகள்' },
    owner: { en: 'Public health / inspection', ta: 'பொது சுகாதாரம் / ஆய்வு அணி' },
    examples: { en: ['Mosquito breeding', 'Nuisance complaints', 'Unsafe premises', 'Sanitation risks'], ta: ['நுளம்பு பெருக்கும் இடங்கள்', 'தொந்தரவு தொடர்பான முறைப்பாடுகள்', 'பாதுகாப்பற்ற வளாகங்கள்', 'சுகாதார அபாயங்கள்'] },
    details: { en: 'Share the location, visible risk, how long it has continued, and whether children or elders are affected.', ta: 'இடம், தென்படும் அபாயம், அது தொடரும் காலம், குழந்தைகள் அல்லது முதியவர்கள் பாதிக்கப்படுகிறார்களா என்பதைக் குறிப்பிடவும்.' },
    icon: 'alert',
    tone: 'rose',
  },
]

const portalBoundaries = [
  {
    title: { en: 'Use emergency channels first', ta: 'அவசர நிலைகளில் முதலில் அவசர சேவைகளை அணுகவும்' },
    description: { en: 'Fire, crime, medical emergencies, and immediate life-safety matters should not wait for portal review.', ta: 'தீ, குற்றம், மருத்துவ அவசரம், உடனடி உயிர் பாதுகாப்பு அபாயம் போன்றவை மைய பரிசீலனைக்காக காத்திருக்கக் கூடாது.' },
    icon: 'alert' as const,
  },
  {
    title: { en: 'Use the closest category', ta: 'மிகப் பொருத்தமான வகையைத் தேர்ந்தெடுக்கவும்' },
    description: { en: 'If the category is not exact, submit anyway. Officers can reassign the complaint during review.', ta: 'சரியான வகை உறுதியாக தெரியாவிட்டாலும் பதிவு செய்யலாம். பரிசீலனையின் போது அலுவலர்கள் முறைப்பாட்டை உரிய அணிக்கு மாற்றுவார்கள்.' },
    icon: 'check' as const,
  },
  {
    title: { en: 'Keep your reference number', ta: 'குறிப்பு எண்ணை பாதுகாப்பாக வைத்திருக்கவும்' },
    description: { en: 'Anonymous complaints cannot be recovered from a phone number, so the reference is required for tracking.', ta: 'அடையாளம் வெளிப்படுத்தாத முறைப்பாடுகளை தொலைபேசி எண்ணால் மீட்க முடியாது; நிலையை அறிய குறிப்பு எண் அவசியம்.' },
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
    heroEyebrow: 'பொதுச் சேவை வகைகள்',
    heroTitle: 'முறைப்பாட்டைப் பதிவு செய்வதற்கு முன் பொருத்தமான சேவை வகையை அறியவும்.',
    heroTitleLines: ['முறைப்பாட்டைப் பதிவுசெய்ய முன்', 'பொருத்தமான சேவை வகையை', 'அறியவும்.'],
    heroBody:
      'பிரச்சினைக்கு மிகப் பொருத்தமான வகையைத் தேர்ந்தெடுத்து, இட விவரத்தை தெளிவாக வழங்கவும். தேவையெனில் பிரதேச சபை அணி பரிசீலனையின் பின்னர் உரிய துறைக்கு மாற்றும்.',
    submitComplaint: 'முறைப்பாடு பதிவு',
    trackReference: 'குறிப்பு எண்ணைத் தேடவும்',
    summaryLabel: 'சேவை வகைச் சுருக்கம்',
    closestCategory: 'மிகப் பொருத்தமான வகையைத் தேர்வு செய்தால் போதுமானது',
    closestCategoryBody: 'வேறு அணி கையாள வேண்டியிருந்தால், பரிசீலனையின் பின்னர் அலுவலர்கள் முறைப்பாட்டை மாற்றுவார்கள்.',
    heroBullets: ['6 பொதுவான குடிமக்கள் சேவை பிரிவுகள்', 'இட விவரம் கள அணிக்கு வழிகாட்டும்', 'குறிப்பு எண் மூலம் நிலையை கண்காணிக்கலாம்'],
    guidanceLabel: 'முக்கிய சேவை வழிகாட்டல்',
    commonEyebrow: 'பொதுவான பிரிவுகள்',
    commonTitle: 'குடிமக்கள் வழக்கமாக பதிவு செய்யும் பிரச்சினைகள்',
    commonBody:
      'குடிமக்கள் பொதுவாக விவரிக்கும் பிரச்சினைகளின் அடிப்படையில் இவ்வகைகள் அமைக்கப்பட்டுள்ளன. மிகப் பொருத்தமான ஒன்றைத் தேர்ந்தெடுத்தால் செயற்பாட்டு அணி அதை உரிய அலுவலர் அல்லது துறைக்கு ஒதுக்கும்.',
    examplesSuffix: 'எடுத்துக்காட்டுகள்',
    qualityEyebrow: 'முறைப்பாட்டின் தரம்',
    qualityTitle: 'தெளிவான விவரங்கள் அலுவலர்கள் விரைவாக நடவடிக்கை எடுக்க உதவும்.',
    qualityBody:
      'அலுவலர் எங்கு செல்ல வேண்டும், என்ன ஆய்வு செய்ய வேண்டும், பிரச்சினையின் அவசரம் என்ன என்பதைப் புரிந்துகொள்ளும் வகையில் உண்மைநிலை சார்ந்த, குறிப்பான விவரங்களை வழங்கவும்.',
    tips: [
      'வீதி பெயர், வார்டு, அருகிலுள்ள அடையாளம் அல்லது பொது கட்டிடம் போன்ற விவரங்களைச் சேர்க்கவும்.',
      'பிரச்சினையின் தன்மை, அது தொடரும் காலம், பாதிக்கப்படுபவர்கள் ஆகியவற்றைத் தெளிவாக குறிப்பிடவும்.',
      'இடம் அல்லது தீவிரத்தைக் உறுதிப்படுத்த உதவுமானால் படம் இணைக்கவும்.',
      'SMS நிலை புதுப்பிப்புகள் தேவைப்பட்டால் மட்டும் தொலைபேசி எண்ணைச் சேர்க்கவும்.',
    ],
    readyLabel: 'முறைப்பாடு பதிவு செய்ய தயாரா?',
    readyTitle: 'முறைப்பாடு பதிவு செய்ய தயாரா?',
    readyBody: 'கணக்கு தேவையில்லை. பதிவு செய்த பின் வழங்கப்படும் குறிப்பு எண்ணை பாதுகாப்பாக வைத்திருக்கவும்.',
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
          <h1 id="services-page-title">
            {'heroTitleLines' in copy
              ? copy.heroTitleLines.map((line) => <span key={line}>{line}</span>)
              : copy.heroTitle}
          </h1>
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
