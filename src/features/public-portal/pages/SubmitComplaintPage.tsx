import { useId, useState, type FormEvent } from 'react'
import { usePublicLanguage, type PublicLanguage } from '../../../shared/i18n/PublicLanguageContext'

type ReportIconName =
  | 'alert'
  | 'arrow'
  | 'building'
  | 'camera'
  | 'check'
  | 'file'
  | 'light'
  | 'lock'
  | 'map'
  | 'phone'
  | 'road'
  | 'trash'
  | 'water'

const complaintCategories: Array<{
  value: string
  label: Record<PublicLanguage, string>
  helper: Record<PublicLanguage, string>
  icon: ReportIconName
}> = [
  {
    value: 'Roads and access',
    label: { en: 'Roads and access', ta: 'வீதிகள் / அணுகல் பாதைகள்' },
    helper: { en: 'Potholes, blocked access, culverts, road signs', ta: 'குழி, பாதை மறைவு, கல்வர்ட், வீதி பலகை' },
    icon: 'road',
  },
  {
    value: 'Drainage and water flow',
    label: { en: 'Drainage and water flow', ta: 'வடிகால் / நீரோட்டம்' },
    helper: { en: 'Blocked drains, stagnant water, flood points', ta: 'அடைந்த கால்வாய், தேங்கும் நீர், வெள்ளப்புள்ளி' },
    icon: 'water',
  },
  {
    value: 'Waste and public health',
    label: { en: 'Waste and public health', ta: 'குப்பை / பொது சுகாதாரம்' },
    helper: { en: 'Illegal dumping, missed collection, sanitation risks', ta: 'குப்பை கொட்டல், சேகரிப்பு தவறுதல், சுகாதார அபாயம்' },
    icon: 'trash',
  },
  {
    value: 'Street lighting and safety',
    label: { en: 'Street lighting and safety', ta: 'தெருவிளக்கு / பாதுகாப்பு' },
    helper: { en: 'Broken lamps, exposed wires, unsafe dark areas', ta: 'எரியாத விளக்கு, வெளிப்பட்ட வயர், இருண்ட இடம்' },
    icon: 'light',
  },
  {
    value: 'Public property',
    label: { en: 'Public property', ta: 'பொது சொத்து / வசதிகள்' },
    helper: { en: 'Parks, markets, halls, libraries, cemeteries', ta: 'பூங்கா, சந்தை, மண்டபம், நூலகம், மயானம்' },
    icon: 'building',
  },
  {
    value: 'Service feedback',
    label: { en: 'Service feedback', ta: 'சேவை கருத்து' },
    helper: { en: 'General civic service feedback or reassignment requests', ta: 'பொது சேவை கருத்து அல்லது சரியான அணிக்கு மாற்ற வேண்டுகோள்' },
    icon: 'file',
  },
]

function getCategoryOptions(language: PublicLanguage) {
  return complaintCategories.map((category) => ({
    description: category.helper[language],
    label: category.label[language],
    value: category.value,
  }))
}

const urgencyOptions: Record<PublicLanguage, Array<{ description: string; label: string; value: string }>> = {
  en: [
    { description: 'Standard review and assignment.', label: 'Normal service issue', value: 'normal' },
    { description: 'Use when access or public safety is affected.', label: 'Public safety affected', value: 'high' },
    { description: 'For comments or lower urgency requests.', label: 'General feedback', value: 'low' },
  ],
  ta: [
    { description: 'வழக்கமான பரிசீலனைக்கும் ஒதுக்கீட்டுக்கும்.', label: 'சாதாரண சேவை குறை', value: 'normal' },
    { description: 'பாதை பயன்பாடு அல்லது பொது பாதுகாப்பு பாதிக்கும்போது.', label: 'பாதுகாப்பு கவனம் தேவை', value: 'high' },
    { description: 'கருத்து அல்லது குறைந்த அவசர கோரிக்கைக்கு.', label: 'பொது கருத்து', value: 'low' },
  ],
}

const submitCopy = {
  en: {
    categoryRequired: 'Choose a category to continue.',
    heroEyebrow: 'Report an issue',
    heroTitle: 'Send a complete civic complaint in one flow.',
    heroBody:
      'Use this page for non-emergency Pradeshiya Sabha service issues. Clear category, location, and contact choices help the team review and assign the complaint faster.',
    summaryLabel: 'Submission summary',
    referenceIssued: 'Reference number issued after submission',
    referenceIssuedBody: 'Keep it for tracking, especially when the report is anonymous.',
    heroBullets: ['Add a clear location', 'Describe one main issue', 'Anonymous reports are supported'],
    important: 'Important',
    dangerTitle: 'Do not use this form for immediate danger.',
    dangerBody:
      'Fire, police, ambulance, rescue, or life-safety incidents should go through emergency services first. This portal is for civic service follow-up.',
    complaintReceived: 'Complaint received',
    successTitle: 'Complaint submitted successfully.',
    successBody: 'Save this number before leaving. It is the fastest way to check the latest status.',
    referenceNumber: 'Reference number',
    trackingHint: 'Use this reference on the tracking page.',
    reviewQueued: 'Review queued',
    reviewQueuedBody: 'Officers can now assess and assign it.',
    referenceSecured: 'Reference secured',
    referenceSecuredBody: 'Anonymous reports depend on this number.',
    trackThis: 'Track this complaint',
    submitAnother: 'Submit another',
    formLabel: 'Complaint submission form',
    stepText: (step: number) => `Step ${step} of 3`,
    formTitle: 'Complete your complaint',
    formBody: 'Fill one section at a time. Required details are kept visible and easy to scan.',
    stepperLabel: 'Complaint submission steps',
    steps: ['Issue', 'Follow-up', 'Submit'],
    category: 'Category',
    categoryPlaceholder: 'Select a service area',
    urgency: 'Urgency',
    urgencyHelp: 'Choose the closest level. Officers can adjust it after review.',
    urgencyPlaceholder: 'Select urgency',
    location: 'Location',
    locationPlaceholder: 'Ward, road name, landmark, pole number, or map note',
    description: 'Description',
    descriptionPlaceholder: 'Describe the issue, when it started, and who is affected.',
    evidence: 'Photo or document',
    evidenceHelp: 'Optional. Images or PDFs help confirm the issue and location.',
    anonymous: 'Submit anonymously',
    anonymousHelp: 'No name or phone number will be attached. Keep the reference number safe.',
    name: 'Name',
    namePlaceholder: 'Your name',
    phone: 'Phone number',
    phonePlaceholder: '07X XXX XXXX',
    submitTitle: 'Submit complaint',
    submitReminder: 'Check the reminder below, then submit the complaint.',
    readyTitle: 'Ready for review',
    readyBody: 'A reference number will be issued after submission. Save it to track progress.',
    formNote: 'For immediate danger, contact emergency services first. This portal is for civic service follow-up only.',
    back: 'Back',
    next: 'Next',
  },
  ta: {
    categoryRequired: 'தொடர ஒரு சேவை வகையைத் தேர்ந்தெடுக்கவும்.',
    heroEyebrow: 'முறைப்பாடு பதிவு',
    heroTitle: 'உங்கள் பகுதி சேவை குறையை தெளிவாக பதிவு செய்யுங்கள்.',
    heroBody:
      'இது அவசர சேவைக்கு அல்ல. பிரதேச சபை கவனிக்க வேண்டிய குறையை வகை, இடம், தொடர்பு விருப்பம் ஆகியவற்றுடன் சொன்னால் சரியான அணிக்கு விரைவாக செல்லும்.',
    summaryLabel: 'பதிவு சுருக்கம்',
    referenceIssued: 'அனுப்பியவுடன் குறிப்பு எண் கிடைக்கும்',
    referenceIssuedBody: 'பின்னர் நிலை பார்க்க இதை சேமியுங்கள்; பெயரில்லா முறைப்பாட்டுக்கு இது அவசியம்.',
    heroBullets: ['இடத்தை தெளிவாக சேர்க்கவும்', 'ஒரு முக்கிய பிரச்சினையை மட்டும் சொல்லவும்', 'பெயர் இல்லாமலும் அனுப்பலாம்'],
    important: 'கவனத்திற்கு',
    dangerTitle: 'உடனடி அபாயங்களுக்கு இந்த படிவம் அல்ல.',
    dangerBody:
      'தீ, பொலிஸ், ஆம்புலன்ஸ், மீட்பு அல்லது உயிர் பாதுகாப்பு அவசரம் என்றால் முதலில் அவசர சேவையை தொடர்புகொள்ளுங்கள். இந்த மையம் பொது சேவை தொடர்ச்சிக்காக.',
    complaintReceived: 'முறைப்பாடு பெறப்பட்டது',
    successTitle: 'முறைப்பாடு வெற்றிகரமாக அனுப்பப்பட்டது.',
    successBody: 'இந்த எண்ணை உடனே சேமியுங்கள். நிலையைப் பார்க்க இது வேகமான வழி.',
    referenceNumber: 'குறிப்பு எண்',
    trackingHint: 'நிலை பார்க்கும் பக்கத்தில் இந்த எண்ணை பயன்படுத்துங்கள்.',
    reviewQueued: 'பரிசீலனைக்கு சென்றது',
    reviewQueuedBody: 'அலுவலர்கள் இதை பார்த்து சரியான அணிக்கு ஒதுக்கலாம்.',
    referenceSecured: 'குறிப்பு எண் பாதுகாப்பாக வைத்துக்கொள்ளவும்',
    referenceSecuredBody: 'பெயரில்லா முறைப்பாட்டை தேட இந்த எண் தான் ஆதாரம்.',
    trackThis: 'இந்த முறைப்பாட்டின் நிலை பார்க்க',
    submitAnother: 'மற்றொன்று அனுப்ப',
    formLabel: 'முறைப்பாடு பதிவு படிவம்',
    stepText: (step: number) => `படி ${step} / 3`,
    formTitle: 'முறைப்பாட்டை முடிக்கவும்',
    formBody: 'ஒரு பகுதியை முடித்த பின் அடுத்ததுக்கு செல்லுங்கள். தேவையான விவரங்கள் கண்முன்னே இருக்கும்.',
    stepperLabel: 'முறைப்பாடு பதிவு படிகள்',
    steps: ['பிரச்சினை', 'தொடர்பு', 'அனுப்பு'],
    category: 'சேவை வகை',
    categoryPlaceholder: 'சரியான சேவை பகுதியை தேர்ந்தெடுக்கவும்',
    urgency: 'முக்கியத்துவம்',
    urgencyHelp: 'அருகிலான நிலையை தேர்வுசெய்யுங்கள். பரிசீலனையின் பின் அலுவலர்கள் மாற்றலாம்.',
    urgencyPlaceholder: 'முக்கியத்துவத்தை தேர்ந்தெடுக்கவும்',
    location: 'இடம்',
    locationPlaceholder: 'வார்டு, வீதி பெயர், அடையாளம், கம்ப எண் அல்லது வரைபட குறிப்பு',
    description: 'விவரம்',
    descriptionPlaceholder: 'என்ன பிரச்சினை, எப்போது தொடங்கியது, யாருக்கு பாதிப்பு என்று எழுதுங்கள்.',
    evidence: 'படம் அல்லது ஆவணம்',
    evidenceHelp: 'விருப்பம். படம் அல்லது PDF இருந்தால் இடமும் பிரச்சினையும் உறுதியாக புரியும்.',
    anonymous: 'பெயர் இல்லாமல் அனுப்ப',
    anonymousHelp: 'பெயர் அல்லது தொலைபேசி எண் சேராது. குறிப்பு எண்ணை பாதுகாப்பாக வைத்துக்கொள்ளுங்கள்.',
    name: 'பெயர்',
    namePlaceholder: 'உங்கள் பெயர்',
    phone: 'தொலைபேசி எண்',
    phonePlaceholder: '07X XXX XXXX',
    submitTitle: 'முறைப்பாடு பதிவு',
    submitReminder: 'கீழே உள்ள நினைவூட்டலை பார்த்து முறைப்பாட்டை அனுப்புங்கள்.',
    readyTitle: 'பரிசீலனைக்கு தயார்',
    readyBody: 'அனுப்பியதும் குறிப்பு எண் கிடைக்கும். முன்னேற்றத்தைப் பார்க்க அதை சேமியுங்கள்.',
    formNote: 'உடனடி அபாயம் என்றால் முதலில் அவசர சேவையை தொடர்புகொள்ளுங்கள். இது பொது சேவை தொடர்ச்சிக்காக மட்டும்.',
    back: 'பின்',
    next: 'அடுத்து',
  },
}

function getInitialCategory() {
  const category = new URLSearchParams(window.location.search).get('category')
  const availableCategories = new Set(complaintCategories.map((item) => item.value))
  return category && availableCategories.has(category) ? category : ''
}

function ReportIcon({ name }: { name: ReportIconName }) {
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
      {name === 'light' && (
        <>
          <path {...common} d="M9 18h6" />
          <path {...common} d="M10 22h4" />
          <path {...common} d="M8.5 14a6 6 0 1 1 7 0c-.8.6-1.1 1.4-1.2 2H9.7c-.1-.6-.4-1.4-1.2-2Z" />
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
        <path {...common} d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9Z" />
      )}
      {name === 'road' && (
        <>
          <path {...common} d="M8 21 11 3" />
          <path {...common} d="m13 3 3 18" />
          <path {...common} d="M12 8v2M12 14v2M5 21h14" />
        </>
      )}
      {name === 'trash' && (
        <>
          <path {...common} d="M4 7h16" />
          <path {...common} d="M9 7V4h6v3" />
          <path {...common} d="M6 7l1 14h10l1-14" />
          <path {...common} d="M10 11v6M14 11v6" />
        </>
      )}
      {name === 'water' && (
        <>
          <path {...common} d="M12 3s6 6.1 6 10.2A6 6 0 0 1 6 13.2C6 9.1 12 3 12 3Z" />
          <path {...common} d="M9 14.5a3.2 3.2 0 0 0 3 2" />
        </>
      )}
    </svg>
  )
}

type ReportDropdownProps = {
  description?: string
  error?: string
  id: string
  label: string
  name: string
  onChange: (value: string) => void
  options: Array<{ description?: string; label: string; value: string }>
  placeholder: string
  value: string
}

function ReportDropdown({
  description,
  error,
  id,
  label,
  name,
  onChange,
  options,
  placeholder,
  value,
}: ReportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={`field-preview report-select-field ${isOpen ? 'report-select-field-open' : ''} ${error ? 'report-select-field-error' : ''}`}>
      <label id={`${id}-label`} htmlFor={`${id}-button`}>{label}</label>
      <input name={name} type="hidden" value={value} />
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${id}-label ${id}-button`}
        className={`report-select-trigger ${selectedOption ? '' : 'report-select-trigger-placeholder'}`}
        id={`${id}-button`}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span>{selectedOption?.label ?? placeholder}</span>
        <span className="report-select-arrow" aria-hidden="true">v</span>
      </button>
      {description && <span className="report-select-help">{description}</span>}
      {error && <span className="report-select-error-text">{error}</span>}

      {isOpen && (
        <ul className="report-select-menu" role="listbox" aria-labelledby={`${id}-label`}>
          {options.map((option) => (
            <li key={option.value}>
              <button
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                role="option"
                type="button"
              >
                <strong>{option.label}</strong>
                {option.description && <span>{option.description}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function SubmitComplaintPage() {
  const language = usePublicLanguage()
  const copy = submitCopy[language]
  const categoryOptions = getCategoryOptions(language)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [submittedReference, setSubmittedReference] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [category, setCategory] = useState(getInitialCategory)
  const [categoryError, setCategoryError] = useState('')
  const [urgency, setUrgency] = useState('normal')
  const referenceHintId = useId()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentStep < 3) {
      goToNextStep(event.currentTarget)
      return
    }

    setSubmittedReference('PS-2026-00124')
  }

  const goToNextStep = (form: HTMLFormElement | null) => {
    if (currentStep === 1 && !category) {
      setCategoryError(copy.categoryRequired)
      return
    }

    if (form?.reportValidity()) {
      setCurrentStep((step) => Math.min(step + 1, 3))
    }
  }

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1))
  }

  const trackingHref = submittedReference
    ? `/track?reference=${encodeURIComponent(submittedReference)}`
    : '/track'

  return (
    <article className="public-page report-page">
      <section className="compact-page-hero report-hero" aria-labelledby="submit-title">
        <div className="report-hero-copy">
          <p className="eyebrow">{copy.heroEyebrow}</p>
          <h1 id="submit-title">{copy.heroTitle}</h1>
          <p>{copy.heroBody}</p>
        </div>
        <aside className="report-hero-card" aria-label={copy.summaryLabel}>
          <span className="report-hero-card-icon" aria-hidden="true">
            <ReportIcon name="check" />
          </span>
          <div>
            <strong>{copy.referenceIssued}</strong>
            <p>{copy.referenceIssuedBody}</p>
          </div>
          <ul>
            {copy.heroBullets.map((item, index) => (
              <li key={item}>
                <ReportIcon name={index === 0 ? 'map' : index === 1 ? 'file' : 'lock'} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="report-boundary-note" aria-labelledby="report-boundary-title">
        <span aria-hidden="true">
          <ReportIcon name="alert" />
        </span>
        <div>
          <p className="eyebrow">{copy.important}</p>
          <h2 id="report-boundary-title">{copy.dangerTitle}</h2>
          <p>{copy.dangerBody}</p>
        </div>
      </section>

      <section className="workflow-panel submit-panel complaint-intake-panel" aria-label="Complaint intake">
        {submittedReference ? (
          <section className="success-card report-success-card" aria-live="polite" aria-labelledby="submission-success-title">
            <span className="success-icon" aria-hidden="true">
              <ReportIcon name="check" />
            </span>
            <div className="report-success-copy">
              <p className="eyebrow">{copy.complaintReceived}</p>
              <h2 id="submission-success-title">{copy.successTitle}</h2>
              <p>{copy.successBody}</p>
            </div>
            <div className="reference-card" aria-describedby={referenceHintId}>
              <span>{copy.referenceNumber}</span>
              <strong>{submittedReference}</strong>
              <p id={referenceHintId}>{copy.trackingHint}</p>
            </div>
            <div className="report-success-next" aria-label="What happens next">
              <div>
                <ReportIcon name="file" />
                <strong>{copy.reviewQueued}</strong>
                <span>{copy.reviewQueuedBody}</span>
              </div>
              <div>
                <ReportIcon name="lock" />
                <strong>{copy.referenceSecured}</strong>
                <span>{copy.referenceSecuredBody}</span>
              </div>
            </div>
            <div className="report-success-actions">
              <a className="button button-primary" href={trackingHref}>
                {copy.trackThis}
                <ReportIcon name="arrow" />
              </a>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  setSubmittedReference('')
                  setCurrentStep(1)
                }}
              >
                {copy.submitAnother}
              </button>
            </div>
          </section>
        ) : (
          <form className="intake-card report-intake-card" aria-label={copy.formLabel} onSubmit={handleSubmit}>
            <div className="report-form-head">
              <span>{copy.stepText(currentStep)}</span>
              <h2>{copy.formTitle}</h2>
              <p>{copy.formBody}</p>
            </div>

            <ol className="report-stepper" aria-label={copy.stepperLabel}>
              {copy.steps.map((stepLabel, index) => (
                <li
                  className={[
                    currentStep === index + 1 ? 'report-step-active' : '',
                    currentStep > index + 1 ? 'report-step-complete' : '',
                  ].filter(Boolean).join(' ') || undefined}
                  key={stepLabel}
                >
                  <span>{index + 1}</span>
                  <strong>{stepLabel}</strong>
                </li>
              ))}
            </ol>

            <fieldset className="report-step-panel" disabled={currentStep !== 1} hidden={currentStep !== 1}>
              <ReportDropdown
                error={categoryError}
                id="complaint-category"
                label={copy.category}
                name="category"
                onChange={(value) => {
                  setCategory(value)
                  setCategoryError('')
                }}
                options={categoryOptions}
                placeholder={copy.categoryPlaceholder}
                value={category}
              />

              <ReportDropdown
                description={copy.urgencyHelp}
                id="complaint-urgency"
                label={copy.urgency}
                name="urgency"
                onChange={setUrgency}
                options={urgencyOptions[language]}
                placeholder={copy.urgencyPlaceholder}
                value={urgency}
              />

              <div className="field-preview">
                <label htmlFor="complaint-location">{copy.location}</label>
                <input
                  id="complaint-location"
                  name="location"
                  placeholder={copy.locationPlaceholder}
                  type="text"
                  required
                />
              </div>

              <div className="field-preview">
                <label htmlFor="complaint-details">{copy.description}</label>
                <textarea
                  id="complaint-details"
                  name="description"
                  placeholder={copy.descriptionPlaceholder}
                  rows={5}
                  required
                />
              </div>
            </fieldset>

            <fieldset className="report-step-panel" disabled={currentStep !== 2} hidden={currentStep !== 2}>
              <div className="field-preview file-field report-file-field">
                <label htmlFor="complaint-evidence">{copy.evidence}</label>
                <input
                  id="complaint-evidence"
                  name="evidence"
                  type="file"
                  accept="image/*,.pdf"
                />
                <span>{copy.evidenceHelp}</span>
              </div>

              <label className="toggle-row report-toggle-row" htmlFor="anonymous-complaint">
                <input
                  checked={isAnonymous}
                  id="anonymous-complaint"
                  name="anonymous"
                  onChange={(event) => setIsAnonymous(event.target.checked)}
                  type="checkbox"
                />
                <span>
                  <strong>{copy.anonymous}</strong>
                  <small>{copy.anonymousHelp}</small>
                </span>
              </label>

              {!isAnonymous && (
                <div className="contact-grid">
                  <div className="field-preview">
                    <label htmlFor="complainant-name">{copy.name}</label>
                    <input
                      id="complainant-name"
                      name="name"
                      placeholder={copy.namePlaceholder}
                      type="text"
                    />
                  </div>
                  <div className="field-preview">
                    <label htmlFor="complainant-phone">{copy.phone}</label>
                    <input
                      id="complainant-phone"
                      name="phone"
                      placeholder={copy.phonePlaceholder}
                      type="tel"
                    />
                  </div>
                </div>
              )}
            </fieldset>

            <fieldset className="report-step-panel" disabled={currentStep !== 3} hidden={currentStep !== 3}>
              <div className="form-section-title">
                <span aria-hidden="true">3</span>
                <div>
                  <h3>{copy.submitTitle}</h3>
                  <p>{copy.submitReminder}</p>
                </div>
              </div>

              <div className="report-submit-review">
                <ReportIcon name="check" />
                <div>
                  <strong>{copy.readyTitle}</strong>
                  <p>{copy.readyBody}</p>
                </div>
              </div>

              <p className="form-note report-form-note">
                {copy.formNote}
              </p>
            </fieldset>

            <div className="report-step-actions">
              {currentStep > 1 && (
                <button className="button button-secondary" type="button" onClick={goToPreviousStep}>
                  {copy.back}
                </button>
              )}

              {currentStep < 3 ? (
                <button className="button button-primary" type="button" onClick={(event) => goToNextStep(event.currentTarget.form)}>
                  {copy.next}
                  <ReportIcon name="arrow" />
                </button>
              ) : (
                <button className="button button-primary" type="submit">
                  {copy.submitTitle}
                  <ReportIcon name="arrow" />
                </button>
              )}
            </div>
          </form>
        )}
      </section>
    </article>
  )
}
