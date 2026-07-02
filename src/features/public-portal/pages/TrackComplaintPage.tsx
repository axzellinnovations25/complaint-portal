import { useState, type FormEvent } from 'react'
import { usePublicLanguage, type PublicLanguage } from '../../../shared/i18n/PublicLanguageContext'

const demoReference = 'PS-2026-00124'

type TrackIconName = 'alert' | 'calendar' | 'check' | 'clipboard' | 'file' | 'lock' | 'search' | 'shield' | 'user' | 'work'

const statusStages: Array<{ label: Record<PublicLanguage, string>; description: Record<PublicLanguage, string>; icon: TrackIconName }> = [
  {
    label: { en: 'Submitted', ta: 'பதிவு செய்யப்பட்டது' },
    description: { en: 'The portal received the complaint and created a reference number.', ta: 'முறைப்பாடு பதிவு செய்யப்பட்டு குறிப்பு எண் உருவாக்கப்பட்டது.' },
    icon: 'file',
  },
  {
    label: { en: 'Acknowledged', ta: 'ஏற்றுக்கொள்ளப்பட்டது' },
    description: { en: 'The front desk or review team checked the category and basic details.', ta: 'சேவை வகையும் அடிப்படை விவரங்களும் பரிசீலனை அணியால் சரிபார்க்கப்பட்டன.' },
    icon: 'clipboard',
  },
  {
    label: { en: 'Assigned', ta: 'ஒதுக்கப்பட்டது' },
    description: { en: 'The complaint was sent to the responsible department or field officer.', ta: 'முறைப்பாடு பொறுப்பான துறை அல்லது கள அலுவலருக்கு ஒதுக்கப்பட்டது.' },
    icon: 'user',
  },
  {
    label: { en: 'In progress', ta: 'செயல்பாட்டில் உள்ளது' },
    description: { en: 'An officer or department is inspecting, updating, or resolving the issue.', ta: 'அலுவலர் ஆய்வு, புதுப்பிப்பு அல்லது தீர்வு நடவடிக்கையில் உள்ளார்.' },
    icon: 'work',
  },
  {
    label: { en: 'Resolved', ta: 'தீர்க்கப்பட்டது' },
    description: { en: 'The team has marked the service issue as handled.', ta: 'சேவை குறை கையாளப்பட்டதாக அணி பதிவு செய்துள்ளது.' },
    icon: 'check',
  },
  {
    label: { en: 'Closed', ta: 'மூடப்பட்டது' },
    description: { en: 'The complaint record is complete and kept for future audit history.', ta: 'பதிவு முடிக்கப்பட்டு எதிர்கால சரிபார்ப்புக்காக சேமிக்கப்பட்டுள்ளது.' },
    icon: 'lock',
  },
]

const demoTimeline = [
  {
    label: { en: 'Submitted', ta: 'பதிவு செய்யப்பட்டது' },
    detail: { en: 'Complaint submitted through the public portal.', ta: 'பொது மையம் வழியாக முறைப்பாடு பதிவு செய்யப்பட்டது.' },
    time: { en: 'Today, 9:12 AM', ta: 'இன்று, காலை 9:12' },
    complete: true,
    icon: 'file' as const,
  },
  {
    label: { en: 'Acknowledged', ta: 'ஏற்றுக்கொள்ளப்பட்டது' },
    detail: { en: 'Front desk team checked the drainage category and location details.', ta: 'வடிகால் வகையும் இட விவரங்களும் முன்பரிசீலனையில் சரிபார்க்கப்பட்டன.' },
    time: { en: 'Today, 9:24 AM', ta: 'இன்று, காலை 9:24' },
    complete: true,
    icon: 'clipboard' as const,
  },
  {
    label: { en: 'Assigned', ta: 'ஒதுக்கப்பட்டது' },
    detail: { en: 'Forwarded to the Public Health field team for inspection.', ta: 'ஆய்விற்காக பொது சுகாதார கள அணிக்கு அனுப்பப்பட்டது.' },
    time: { en: 'Today, 10:05 AM', ta: 'இன்று, காலை 10:05' },
    complete: true,
    icon: 'user' as const,
  },
  {
    label: { en: 'In progress', ta: 'செயல்பாட்டில் உள்ளது' },
    detail: { en: 'Officer visit pending. Next update is expected after inspection.', ta: 'அலுவலர் வருகை நிலுவையில் உள்ளது. ஆய்விற்குப் பிறகு அடுத்த புதுப்பிப்பு வழங்கப்படும்.' },
    time: { en: 'Pending', ta: 'நிலுவை' },
    complete: false,
    icon: 'work' as const,
  },
]

const trackCopy = {
  en: {
    heroEyebrow: 'Track complaint',
    heroTitle: 'Check the latest status using your reference number.',
    heroBody:
      'The reference number is shown after submission. It is required for anonymous complaints and useful when following up with the Pradeshiya Sabha office.',
    summaryLabel: 'Tracking portal summary',
    summaryTitle: 'Reference-based tracking portal',
    summaryBody: 'See whether a complaint is submitted, acknowledged, assigned, in progress, or resolved.',
    summaryBullets: ['Private reference lookup', 'Latest status and next step'],
    lookupLabel: 'Reference tracking',
    formLabel: 'Track complaint by reference',
    referenceLabel: 'Complaint reference number',
    formTitle: 'Enter your reference to track progress.',
    formBody: 'Use the full reference exactly as shown after submission.',
    example: 'Example',
    track: 'Track',
    currentStatus: 'Current status',
    assignedTitle: 'Assigned to Public Health',
    assignedBody: 'Blocked drainage near market road. Last updated today at 10:05 AM.',
    progressStatus: 'In progress',
    reference: 'Reference',
    nextUpdate: 'Next expected update',
    nextUpdateBody: 'The assigned officer will update the record after the site inspection.',
    trackAnother: 'Track another reference',
    missingEyebrow: 'Reference not found',
    missingTitle: 'Check the number and try again.',
    missingBody:
      'Use the full reference exactly as shown after submission. If you submitted anonymously, the portal cannot recover the reference from a phone number.',
    clear: 'Clear and try again',
    supportLabel: 'Tracking guidance',
    demoLabel: 'Try this demo reference',
    privacyNote: 'Keep the reference private if the complaint was submitted anonymously.',
    smsNote: 'SMS updates are only available when a phone number was provided during submission.',
    guideEyebrow: 'Status guide',
    guideTitle: 'What each status means',
    guideBody: 'These labels help citizens understand what is happening after a complaint reaches the office or field team.',
  },
  ta: {
    heroEyebrow: 'முறைப்பாட்டு நிலை கண்காணிப்பு',
    heroTitle: 'குறிப்பு எண்ணைப் பயன்படுத்தி முறைப்பாட்டின் தற்போதைய நிலையை அறியவும்.',
    heroTitleLines: ['குறிப்பு எண்ணைப் பயன்படுத்தி', 'முறைப்பாட்டின் தற்போதைய', 'நிலையை அறியவும்.'],
    heroBody:
      'முறைப்பாடு பதிவு செய்த பின் வழங்கப்படும் குறிப்பு எண் இங்கு தேவைப்படும். அடையாளம் வெளிப்படுத்தாத முறைப்பாடுகளுக்கும் அலுவலகத் தொடர்ச்சிக்கும் இது முக்கியமானது.',
    summaryLabel: 'கண்காணிப்பு மையச் சுருக்கம்',
    summaryTitle: 'குறிப்பு எண் அடிப்படையிலான கண்காணிப்பு மையம்',
    summaryBody: 'பதிவு செய்யப்பட்டது, ஏற்றுக்கொள்ளப்பட்டது, ஒதுக்கப்பட்டது, செயல்பாட்டில் உள்ளது, தீர்க்கப்பட்டது போன்ற நிலைகளை அறியலாம்.',
    summaryBullets: ['தனிப்பட்ட குறிப்பு எண் தேடல்', 'சமீபத்திய நிலை மற்றும் அடுத்த நடவடிக்கை'],
    lookupLabel: 'குறிப்பு எண் கண்காணிப்பு',
    formLabel: 'குறிப்பு எண்ணின் மூலம் முறைப்பாட்டைத் தேடுதல்',
    referenceLabel: 'முறைப்பாட்டு குறிப்பு எண்',
    formTitle: 'முன்னேற்ற நிலையை அறிய குறிப்பு எண்ணை உள்ளிடவும்.',
    formBody: 'பதிவு செய்த பின் காட்டப்பட்ட முழு குறிப்பு எண்ணையும் அதேபடி பயன்படுத்தவும்.',
    example: 'உதாரணம்',
    track: 'தேடவும்',
    currentStatus: 'தற்போதைய நிலை',
    assignedTitle: 'பொது சுகாதார அணிக்கு ஒதுக்கப்பட்டது',
    assignedBody: 'சந்தை வீதிக்கருகிலுள்ள வடிகால் அடைப்பு. கடைசியாக இன்று காலை 10:05க்கு புதுப்பிக்கப்பட்டது.',
    progressStatus: 'செயல்பாட்டில் உள்ளது',
    reference: 'குறிப்பு எண்',
    nextUpdate: 'அடுத்த புதுப்பிப்பு',
    nextUpdateBody: 'இட ஆய்விற்குப் பிறகு பொறுப்பான அலுவலர் பதிவை புதுப்பிப்பார்.',
    trackAnother: 'மற்றொரு எண்ணைத் தேடவும்',
    missingEyebrow: 'குறிப்பு எண் கிடைக்கவில்லை',
    missingTitle: 'எண்ணை சரிபார்த்து மீண்டும் முயற்சி செய்யவும்.',
    missingBody:
      'பதிவு செய்த பின் காட்டப்பட்ட முழு குறிப்பு எண்ணையும் அதேபடி உள்ளிடவும். அடையாளம் வெளிப்படுத்தாமல் பதிவு செய்திருந்தால், தொலைபேசி எண்ணின் மூலம் இதை மீட்டெடுக்க முடியாது.',
    clear: 'அழித்து மீண்டும் முயற்சி செய்யவும்',
    supportLabel: 'கண்காணிப்பு வழிகாட்டல்',
    demoLabel: 'மாதிரி குறிப்பு எண்',
    privacyNote: 'அடையாளம் வெளிப்படுத்தாத பதிவுகளுக்கு குறிப்பு எண்ணை பாதுகாப்பாக வைத்திருக்கவும்.',
    smsNote: 'தொலைபேசி எண் வழங்கப்பட்டிருந்தால் மட்டுமே SMS புதுப்பிப்புகள் கிடைக்கும்.',
    guideEyebrow: 'நிலை விளக்கம்',
    guideTitle: 'ஒவ்வொரு நிலையினதும் அர்த்தம்',
    guideBody: 'முறைப்பாடு அலுவலகம் அல்லது கள அணியை அடைந்த பின் நடைபெறும் நடவடிக்கைகளை இந்நிலைகள் தெளிவாக விளக்குகின்றன.',
  },
}

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
  const language = usePublicLanguage()
  const copy = trackCopy[language]
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
          <p className="eyebrow">{copy.heroEyebrow}</p>
          <h1 id="track-title">
            {'heroTitleLines' in copy
              ? copy.heroTitleLines.map((line) => <span key={line}>{line}</span>)
              : copy.heroTitle}
          </h1>
          <p>{copy.heroBody}</p>
        </div>
        <aside className="track-hero-panel" aria-label={copy.summaryLabel}>
          <span className="track-hero-icon" aria-hidden="true">
            <TrackIcon name="search" />
          </span>
          <div>
            <strong>{copy.summaryTitle}</strong>
            <p>{copy.summaryBody}</p>
          </div>
          <ul>
            {copy.summaryBullets.map((item, index) => (
              <li key={item}>
                <TrackIcon name={index === 0 ? 'shield' : 'calendar'} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="track-lookup-panel" aria-label={copy.lookupLabel}>
        <div className={`track-card-flip ${lookupState !== 'idle' ? 'track-card-flip-active' : ''}`}>
          <div className="track-card-flip-inner">
            <form className="track-card track-card-front" aria-label={copy.formLabel} onSubmit={handleSubmit}>
              <span className="track-card-icon" aria-hidden="true">
                <TrackIcon name="search" />
              </span>
              <div>
                <label htmlFor="reference-number">{copy.referenceLabel}</label>
                <h2>{copy.formTitle}</h2>
                <p>{copy.formBody}</p>
              </div>
              <div className="track-form-row">
                <input
                  id="reference-number"
                  name="reference-number"
                  onChange={(event) => setReferenceNumber(event.target.value)}
                  placeholder={`${copy.example}: ${demoReference}`}
                  required
                  type="text"
                  value={referenceNumber}
                  disabled={lookupState !== 'idle'}
                />
                <button type="submit" disabled={lookupState !== 'idle'}>
                  <TrackIcon name="search" />
                  {copy.track}
                </button>
              </div>
            </form>

            <div className="track-card track-card-back" aria-live="polite">
              {lookupState === 'found' && (
                <>
                  <div className="tracking-summary">
                    <div>
                      <p className="eyebrow">{copy.currentStatus}</p>
                      <h2 id="tracking-result-title">{copy.assignedTitle}</h2>
                      <p>{copy.assignedBody}</p>
                    </div>
                    <span className="status-pill status-pill-active">{copy.progressStatus}</span>
                  </div>

                  <div className="track-reference-badge">
                    <span>{copy.reference}</span>
                    <strong>{referenceNumber}</strong>
                  </div>

                  <ol className="track-timeline">
                    {demoTimeline.map((item) => (
                      <li className={item.complete ? 'timeline-complete' : undefined} key={item.label.en}>
                        <span aria-hidden="true">
                          <TrackIcon name={item.icon} />
                        </span>
                        <div>
                          <strong>{item.label[language]}</strong>
                          <p>{item.detail[language]}</p>
                        </div>
                        <time>{item.time[language]}</time>
                      </li>
                    ))}
                  </ol>

                  <div className="track-next-step">
                    <span aria-hidden="true">
                      <TrackIcon name="calendar" />
                    </span>
                    <div>
                      <strong>{copy.nextUpdate}</strong>
                      <p>{copy.nextUpdateBody}</p>
                    </div>
                  </div>

                  <button className="button button-secondary track-card-reset" type="button" onClick={resetLookup}>
                    {copy.trackAnother}
                  </button>
                </>
              )}

              {lookupState === 'missing' && (
                <div className="track-empty-content">
                  <span aria-hidden="true">
                    <TrackIcon name="search" />
                  </span>
                  <p className="eyebrow">{copy.missingEyebrow}</p>
                  <h2 id="tracking-missing-title">{copy.missingTitle}</h2>
                  <p>{copy.missingBody}</p>
                  <button className="button button-secondary" type="button" onClick={resetLookup}>
                    {copy.clear}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="track-lookup-support" aria-label={copy.supportLabel}>
          <div className="track-reference-demo" aria-label="Demo reference">
            <span>{copy.demoLabel}</span>
            <strong>{demoReference}</strong>
          </div>

          <div className="track-privacy-note" role="note">
            <span aria-hidden="true">
              <TrackIcon name="shield" />
            </span>
            <p>{copy.privacyNote}</p>
          </div>

          <div className="track-form-tip">
            <span aria-hidden="true">
              <TrackIcon name="alert" />
            </span>
            <p>{copy.smsNote}</p>
          </div>
        </div>
      </section>

      <section className="track-status-guide" aria-labelledby="track-status-guide-title">
        <div className="section-heading">
          <p className="eyebrow">{copy.guideEyebrow}</p>
          <h2 id="track-status-guide-title">{copy.guideTitle}</h2>
          <p>{copy.guideBody}</p>
        </div>
        <div className="track-status-grid">
          {statusStages.map((stage) => (
            <article key={stage.label.en}>
              <span aria-hidden="true">
                <TrackIcon name={stage.icon} />
              </span>
              <div>
                <strong>{stage.label[language]}</strong>
                <p>{stage.description[language]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </article>
  )
}
