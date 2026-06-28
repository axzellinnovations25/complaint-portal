import type { MouseEvent } from 'react'
import { usePublicLanguage, type PublicLanguage } from '../../../shared/i18n/PublicLanguageContext'

type PublicNoticesPageProps = {
  onNavigate: (href: string) => void
}

type NoticeIconName = 'alert' | 'arrow' | 'camera' | 'check' | 'file' | 'lock' | 'map' | 'phone' | 'search'

const primaryNotices: Array<{
  title: Record<PublicLanguage, string>
  detail: Record<PublicLanguage, string>
  icon: NoticeIconName
  tone: 'rose' | 'teal' | 'violet' | 'cyan'
}> = [
  {
    title: { en: 'Use emergency services for immediate danger', ta: 'உடனடி அபாயங்களில் முதலில் அவசர சேவைகளை அணுகவும்' },
    detail: {
      en: 'This portal is for civic service follow-up. Fire, police, ambulance, or immediate life-safety situations should be reported through emergency channels first.',
      ta: 'இந்த மையம் பொது சேவை தொடர்பான தொடர்ச்சித் நடவடிக்கைகளுக்காக மட்டுமே. தீ, பொலிஸ், ஆம்புலன்ஸ் அல்லது உயிர் பாதுகாப்பு அவசரம் ஏற்பட்டால் முதலில் உரிய அவசர சேவையைத் தொடர்பு கொள்ளவும்.',
    },
    icon: 'alert',
    tone: 'rose',
  },
  {
    title: { en: 'Accurate locations speed up field visits', ta: 'துல்லியமான இட விவரம் கள ஆய்வை விரைவாக்கும்' },
    detail: {
      en: 'Add the ward, road name, nearby landmark, house number range, or a clear place description when a map pin is not available.',
      ta: 'வரைபட குறியீடு இல்லாதபோது வார்டு, வீதி பெயர், அருகிலுள்ள அடையாளம், வீட்டு எண் வரம்பு அல்லது தெளிவான இட விளக்கத்தைச் சேர்க்கவும்.',
    },
    icon: 'map',
    tone: 'teal',
  },
  {
    title: { en: 'Anonymous reports can still be tracked', ta: 'அடையாளம் வெளிப்படுத்தாத முறைப்பாடுகளையும் கண்காணிக்கலாம்' },
    detail: {
      en: 'Save the complaint reference number after submission. Anonymous complaints will not receive SMS, but the reference can be used on the tracking page.',
      ta: 'பதிவு செய்த பின் வழங்கப்படும் குறிப்பு எண்ணை பாதுகாப்பாக வைத்திருக்கவும். SMS அறிவிப்பு கிடைக்காது; இருப்பினும் அந்த எண்ணைப் பயன்படுத்தி கண்காணிப்பு பக்கத்தில் நிலையை அறியலாம்.',
    },
    icon: 'lock',
    tone: 'violet',
  },
  {
    title: { en: 'Evidence is optional but useful', ta: 'ஆதாரம் கட்டாயமில்லை; இருந்தால் பயனுள்ளதாகும்' },
    detail: {
      en: 'Photos, PDFs, video, or audio can help officers confirm the issue and avoid repeated calls for more information.',
      ta: 'படம், PDF, வீடியோ அல்லது ஒலி இணைப்புகள் இருந்தால் பிரச்சினையை உறுதிப்படுத்தவும், கூடுதல் விவரங்களை மீண்டும் மீண்டும் கோர வேண்டிய நிலையை குறைக்கவும் உதவும்.',
    },
    icon: 'camera',
    tone: 'cyan',
  },
]

const noticesCopy = {
  en: {
    heroEyebrow: 'Notices and guidance',
    heroTitle: 'Read this before sending a complaint.',
    heroBody:
      'These notes help citizens submit complete, useful complaints and understand when another service channel is more appropriate.',
    startReport: 'Start a report',
    trackComplaint: 'Track complaint',
    summaryLabel: 'Notice summary',
    summaryTitle: 'Check the guidance first',
    summaryBody: 'Use this portal for civic service complaints, not immediate danger or emergency requests.',
    summaryBullets: ['Emergency matters go elsewhere', 'Location details help field teams', 'Reference numbers support tracking'],
    boundaryEyebrow: 'Important boundary',
    boundaryTitle: 'This portal does not replace emergency services.',
    boundaryBody:
      'If there is immediate danger to life, property, or public safety, contact the appropriate emergency service first. Use this portal only for civic service follow-up and non-emergency complaints.',
    guidanceEyebrow: 'Current guidance',
    guidanceTitle: 'Public notice board',
    guidanceBody:
      'These notices apply to all complaints submitted through the platform. Review them before creating a new complaint so the civic team receives enough information to act.',
    beforeEyebrow: 'Before submitting',
    beforeTitle: 'Make sure the complaint can be handled properly.',
    beforeBody:
      'A good report is specific, civic-service related, and easy for a field officer or department head to assign.',
    goodChecklist: 'Good complaint checklist',
    notForPortal: 'Do not use this portal for',
    beforeSubmitItems: [
      'Check that the issue is within Pradeshiya Sabha civic service responsibility.',
      'Use one complaint for one main issue so it can be assigned clearly.',
      'Keep descriptions factual and avoid personal or unrelated information.',
      'Save the reference number shown after submission.',
    ],
    notForPortalItems: [
      'Crime, fire, ambulance, or urgent rescue requests',
      'Private disputes that do not involve a civic service issue',
      'National utility failures that should go directly to the utility provider',
      'Repeated duplicate reports when a reference number already exists',
    ],
    helpLabel: 'Need help choosing a page',
    submittedTitle: 'Already submitted a complaint?',
    submittedBody: 'Use your reference number to see the latest status.',
  },
  ta: {
    heroEyebrow: 'அறிவிப்புகள் மற்றும் வழிகாட்டல்',
    heroTitle: 'முறைப்பாட்டைப் பதிவு செய்வதற்கு முன் இவ்வழிகாட்டலைப் படிக்கவும்.',
    heroBody:
      'முழுமையான மற்றும் பயனுள்ள முறைப்பாட்டைப் பதிவு செய்யவும், எந்த சூழலில் வேறு சேவை வழியை அணுக வேண்டும் என்பதையும் புரிந்துகொள்ளவும் இக்குறிப்புகள் உதவும்.',
    startReport: 'முறைப்பாடு பதிவு செய்யவும்',
    trackComplaint: 'நிலையைத் தேடவும்',
    summaryLabel: 'அறிவிப்புச் சுருக்கம்',
    summaryTitle: 'முதலில் வழிகாட்டலை சரிபார்க்கவும்',
    summaryBody: 'இம்மையம் பொது சேவை முறைப்பாடுகளுக்காக மட்டுமே; உடனடி அபாயங்கள் அல்லது அவசர கோரிக்கைகளுக்காக அல்ல.',
    summaryBullets: ['அவசர நிலைகள் உரிய அவசர சேவைக்கு', 'இட விவரம் கள அணிக்கு உதவும்', 'குறிப்பு எண் கண்காணிப்பிற்கு உதவும்'],
    boundaryEyebrow: 'முக்கிய வரம்பு',
    boundaryTitle: 'இந்த மையம் அவசர சேவைகளுக்கான மாற்று அல்ல.',
    boundaryBody:
      'உயிர், சொத்து அல்லது பொது பாதுகாப்பிற்கு உடனடி அபாயம் இருந்தால், முதலில் சம்பந்தப்பட்ட அவசர சேவையைத் தொடர்பு கொள்ளவும். இம்மையம் அவசரமற்ற பொது சேவை தொடர்பான தொடர்ச்சித் நடவடிக்கைகளுக்காக மட்டுமே பயன்பட வேண்டும்.',
    guidanceEyebrow: 'தற்போதைய வழிகாட்டல்',
    guidanceTitle: 'பொது அறிவிப்பு மையம்',
    guidanceBody:
      'இந்த மையம் வழியாக பதிவு செய்யப்படும் அனைத்து முறைப்பாடுகளுக்கும் இக்குறிப்புகள் பொருந்தும். புதிய முறைப்பாட்டை உருவாக்கும் முன் இவற்றைப் பரிசீலித்தால், சேவை அணிக்கு நடவடிக்கை எடுக்க தேவையான விவரங்கள் கிடைக்கும்.',
    beforeEyebrow: 'பதிவிற்கு முன்',
    beforeTitle: 'முறைப்பாடு முறையாக கையாளக்கூடியதா என்பதை உறுதி செய்யவும்.',
    beforeBody:
      'தரமான முறைப்பாடு குறிப்பானதாகவும், பொது சேவையுடன் தொடர்புடையதாகவும், கள அலுவலர் அல்லது துறைத் தலைவர் எளிதில் ஒதுக்கக்கூடியதாகவும் இருக்கும்.',
    goodChecklist: 'தரமான முறைப்பாட்டிற்கான சரிபார்ப்பு',
    notForPortal: 'இந்த மையத்தில் பதிவு செய்ய வேண்டாதவை',
    beforeSubmitItems: [
      'இது பிரதேச சபையின் பொது சேவை பொறுப்பிற்குள் வருகிறதா என்பதை உறுதி செய்யவும்.',
      'ஒரு முறைப்பாட்டில் ஒரு முக்கிய பிரச்சினையை மட்டும் பதிவு செய்யவும்.',
      'உண்மை சார்ந்த விவரங்களை மட்டும் வழங்கவும்; தனிப்பட்ட அல்லது தொடர்பற்ற தகவல்களைத் தவிர்க்கவும்.',
      'பதிவு செய்த பின் காட்டப்படும் குறிப்பு எண்ணை பாதுகாப்பாக வைத்திருக்கவும்.',
    ],
    notForPortalItems: [
      'குற்றம், தீ, ஆம்புலன்ஸ் அல்லது உடனடி மீட்பு கோரிக்கைகள்',
      'பொது சேவை பிரச்சினை அல்லாத தனிப்பட்ட தகராறுகள்',
      'நேரடியாக தேசிய சேவை வழங்குநரிடம் தெரிவிக்க வேண்டிய மின்சாரம், நீர் போன்ற சேவை செயலிழப்புகள்',
      'ஏற்கனவே குறிப்பு எண் வழங்கப்பட்ட அதே விஷயத்தை மீண்டும் மீண்டும் பதிவு செய்தல்',
    ],
    helpLabel: 'சரியான பக்கத்தைத் தேர்வு செய்ய உதவி',
    submittedTitle: 'முறைப்பாடு ஏற்கனவே பதிவு செய்யப்பட்டுள்ளதா?',
    submittedBody: 'சமீபத்திய நிலையை அறிய உங்கள் குறிப்பு எண்ணைப் பயன்படுத்தவும்.',
  },
}

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
  const language = usePublicLanguage()
  const copy = noticesCopy[language]

  const navigateTo = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <article className="public-page notices-page">
      <section className="compact-page-hero notices-hero" aria-labelledby="notices-page-title">
        <div className="notices-hero-copy">
          <p className="eyebrow">{copy.heroEyebrow}</p>
          <h1 id="notices-page-title">{copy.heroTitle}</h1>
          <p>{copy.heroBody}</p>
          <div className="notices-hero-actions">
            <a className="button button-primary" href="/submit" onClick={navigateTo('/submit')}>
              <NoticeIcon name="file" />
              {copy.startReport}
            </a>
            <a className="button button-secondary" href="/track" onClick={navigateTo('/track')}>
              <NoticeIcon name="search" />
              {copy.trackComplaint}
            </a>
          </div>
        </div>

        <aside className="notices-hero-card" aria-label={copy.summaryLabel}>
          <span className="notices-hero-card-icon" aria-hidden="true">
            <NoticeIcon name="alert" />
          </span>
          <div>
            <strong>{copy.summaryTitle}</strong>
            <p>{copy.summaryBody}</p>
          </div>
          <ul>
            {copy.summaryBullets.map((item, index) => (
              <li key={item}>
                <NoticeIcon name={index === 0 ? 'phone' : index === 1 ? 'map' : 'lock'} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="notices-priority-panel" aria-labelledby="priority-notice-title">
        <span aria-hidden="true">
          <NoticeIcon name="phone" />
        </span>
        <div>
          <p className="eyebrow">{copy.boundaryEyebrow}</p>
          <h2 id="priority-notice-title">{copy.boundaryTitle}</h2>
          <p>{copy.boundaryBody}</p>
        </div>
      </section>

      <section className="notice-section page-section" aria-labelledby="notice-list-title">
        <div className="section-heading">
          <p className="eyebrow">{copy.guidanceEyebrow}</p>
          <h2 id="notice-list-title">{copy.guidanceTitle}</h2>
          <p>{copy.guidanceBody}</p>
        </div>

        <div className="notices-grid">
          {primaryNotices.map((notice) => (
            <article className={`notice-card notice-card-${notice.tone}`} key={notice.title.en}>
              <span aria-hidden="true">
                <NoticeIcon name={notice.icon} />
              </span>
              <div>
                <strong>{notice.title[language]}</strong>
                <p>{notice.detail[language]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="notices-check-section" aria-labelledby="notice-check-title">
        <div>
          <p className="eyebrow">{copy.beforeEyebrow}</p>
          <h2 id="notice-check-title">{copy.beforeTitle}</h2>
          <p>{copy.beforeBody}</p>
        </div>

        <div className="notices-check-grid">
          <article>
            <strong>{copy.goodChecklist}</strong>
            <ul>
              {copy.beforeSubmitItems.map((item) => (
                <li key={item}>
                  <NoticeIcon name="check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article>
            <strong>{copy.notForPortal}</strong>
            <ul>
              {copy.notForPortalItems.map((item) => (
                <li key={item}>
                  <NoticeIcon name="alert" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <div className="help-band" aria-label={copy.helpLabel}>
        <div>
          <strong>{copy.submittedTitle}</strong>
          <span>{copy.submittedBody}</span>
        </div>
        <a className="button button-primary" href="/track" onClick={navigateTo('/track')}>
          {copy.trackComplaint}
          <NoticeIcon name="arrow" />
        </a>
      </div>
    </article>
  )
}
