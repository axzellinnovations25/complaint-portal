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
    title: { en: 'Use emergency services for immediate danger', ta: 'உடனடி அபாயம் என்றால் அவசர சேவையே முதலில்' },
    detail: {
      en: 'This portal is for civic service follow-up. Fire, police, ambulance, or immediate life-safety situations should be reported through emergency channels first.',
      ta: 'இந்த மையம் பொது சேவை தொடர்ச்சிக்காக. தீ, பொலிஸ், ஆம்புலன்ஸ் அல்லது உயிர் பாதுகாப்பு அவசரம் என்றால் முதலில் அவசர சேவையை தொடர்புகொள்ளுங்கள்.',
    },
    icon: 'alert',
    tone: 'rose',
  },
  {
    title: { en: 'Accurate locations speed up field visits', ta: 'இடம் தெளிவாக இருந்தால் கள ஆய்வு வேகமாகும்' },
    detail: {
      en: 'Add the ward, road name, nearby landmark, house number range, or a clear place description when a map pin is not available.',
      ta: 'வார்டு, வீதி பெயர், அருகிலுள்ள அடையாளம், வீட்டு எண் பகுதி அல்லது தெளிவான இட விளக்கம் சேர்க்கவும்.',
    },
    icon: 'map',
    tone: 'teal',
  },
  {
    title: { en: 'Anonymous reports can still be tracked', ta: 'பெயரில்லா முறைப்பாட்டையும் நிலை பார்க்கலாம்' },
    detail: {
      en: 'Save the complaint reference number after submission. Anonymous complaints will not receive SMS, but the reference can be used on the tracking page.',
      ta: 'அனுப்பிய பின் கிடைக்கும் குறிப்பு எண்ணை சேமியுங்கள். SMS வராது, ஆனால் அந்த எண்ணை வைத்து நிலையைப் பார்க்கலாம்.',
    },
    icon: 'lock',
    tone: 'violet',
  },
  {
    title: { en: 'Evidence is optional but useful', ta: 'ஆதாரம் கட்டாயம் இல்லை, இருந்தால் உதவும்' },
    detail: {
      en: 'Photos, PDFs, video, or audio can help officers confirm the issue and avoid repeated calls for more information.',
      ta: 'படம், PDF, வீடியோ அல்லது ஒலி இருந்தால் பிரச்சினையை உறுதிப்படுத்தவும் மீண்டும் மீண்டும் விவரம் கேட்க வேண்டாமலும் உதவும்.',
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
    heroEyebrow: 'அறிவிப்புகள் / வழிகாட்டி',
    heroTitle: 'முறைப்பாடு அனுப்புவதற்கு முன் இதை பாருங்கள்.',
    heroBody:
      'சரியான, பயனுள்ள முறைப்பாடு அனுப்பவும் எந்த சூழலில் வேறு சேவையை அணுக வேண்டும் என்பதையும் புரிந்துகொள்ள இந்த குறிப்புகள் உதவும்.',
    startReport: 'முறைப்பாடு தொடங்கு',
    trackComplaint: 'நிலை பார்க்க',
    summaryLabel: 'அறிவிப்பு சுருக்கம்',
    summaryTitle: 'முதலில் வழிகாட்டியைப் பாருங்கள்',
    summaryBody: 'இது பொது சேவை முறைப்பாடுகளுக்கே; உடனடி அபாயம் அல்லது அவசர கோரிக்கைக்கு அல்ல.',
    summaryBullets: ['அவசர விஷயங்கள் வேறு சேவைக்கு', 'இட விவரம் கள அணிக்கு உதவும்', 'குறிப்பு எண் நிலை பார்க்க உதவும்'],
    boundaryEyebrow: 'முக்கிய வரம்பு',
    boundaryTitle: 'இந்த மையம் அவசர சேவைக்கு மாற்றாகாது.',
    boundaryBody:
      'உயிர், சொத்து அல்லது பொது பாதுகாப்புக்கு உடனடி அபாயம் இருந்தால் சம்பந்தப்பட்ட அவசர சேவையை முதலில் தொடர்புகொள்ளுங்கள். இந்த மையம் அவசரம் இல்லாத பொது சேவை தொடர்ச்சிக்காக மட்டும்.',
    guidanceEyebrow: 'தற்போதைய வழிகாட்டி',
    guidanceTitle: 'பொது அறிவிப்பு பலகை',
    guidanceBody:
      'இந்த மையம் வழியாக அனுப்பப்படும் எல்லா முறைப்பாடுகளுக்கும் இந்த குறிப்புகள் பொருந்தும். புதிய முறைப்பாடு உருவாக்கும் முன் பார்த்தால் சேவை அணி நடவடிக்கை எடுக்க தேவையான விவரம் கிடைக்கும்.',
    beforeEyebrow: 'அனுப்புவதற்கு முன்',
    beforeTitle: 'முறைப்பாடு சரியாக கையாளக்கூடியதா என்று உறுதி செய்யுங்கள்.',
    beforeBody:
      'நல்ல முறைப்பாடு குறிப்பிட்டதாகவும், பொது சேவையுடன் தொடர்புடையதாகவும், கள அலுவலர் அல்லது துறைத் தலைவர் எளிதில் ஒதுக்கக்கூடியதாகவும் இருக்கும்.',
    goodChecklist: 'நல்ல முறைப்பாட்டுக்கான சரிபார்ப்பு',
    notForPortal: 'இந்த மையத்தில் அனுப்ப வேண்டாதவை',
    beforeSubmitItems: [
      'இது பிரதேச சபை பொது சேவை பொறுப்புக்குள் வருகிறதா என்று பாருங்கள்.',
      'ஒரு முறைப்பாட்டில் ஒரு முக்கிய பிரச்சினை மட்டும் எழுதுங்கள்.',
      'உண்மை விவரங்களை மட்டும் எழுதுங்கள்; தனிப்பட்ட அல்லது தொடர்பில்லாத தகவலை தவிர்க்கவும்.',
      'அனுப்பிய பின் காட்டப்படும் குறிப்பு எண்ணை சேமியுங்கள்.',
    ],
    notForPortalItems: [
      'குற்றம், தீ, ஆம்புலன்ஸ் அல்லது உடனடி மீட்பு கோரிக்கைகள்',
      'பொது சேவை பிரச்சினை அல்லாத தனிப்பட்ட தகராறுகள்',
      'நேரடியாக தேசிய சேவை வழங்குநரிடம் செல்ல வேண்டிய மின்/நீர் போன்ற பிரச்சினைகள்',
      'ஏற்கனவே குறிப்பு எண் உள்ள அதே விஷயத்தை மீண்டும் மீண்டும் அனுப்புதல்',
    ],
    helpLabel: 'சரியான பக்கத்தை தேர்வு செய்ய உதவி',
    submittedTitle: 'முறைப்பாடு ஏற்கனவே அனுப்பியுள்ளீர்களா?',
    submittedBody: 'சமீபத்திய நிலையைப் பார்க்க உங்கள் குறிப்பு எண்ணை பயன்படுத்துங்கள்.',
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
