import { useId, useState, type FormEvent } from 'react'

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
  helper: string
  icon: ReportIconName
}> = [
  {
    value: 'Roads and access',
    helper: 'Potholes, blocked access, culverts, road signs',
    icon: 'road',
  },
  {
    value: 'Drainage and water flow',
    helper: 'Blocked drains, stagnant water, flood points',
    icon: 'water',
  },
  {
    value: 'Waste and public health',
    helper: 'Illegal dumping, missed collection, sanitation risks',
    icon: 'trash',
  },
  {
    value: 'Street lighting and safety',
    helper: 'Broken lamps, exposed wires, unsafe dark areas',
    icon: 'light',
  },
  {
    value: 'Public property',
    helper: 'Parks, markets, halls, libraries, cemeteries',
    icon: 'building',
  },
  {
    value: 'Service feedback',
    helper: 'General civic service feedback or reassignment requests',
    icon: 'file',
  },
]

const categoryOptions = complaintCategories.map((category) => ({
  description: category.helper,
  label: category.value,
  value: category.value,
}))

const urgencyOptions = [
  {
    description: 'Standard review and assignment.',
    label: 'Normal service issue',
    value: 'normal',
  },
  {
    description: 'Use when access or public safety is affected.',
    label: 'Public safety affected',
    value: 'high',
  },
  {
    description: 'For comments or lower urgency requests.',
    label: 'General feedback',
    value: 'low',
  },
]

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
      setCategoryError('Choose a category to continue.')
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
          <p className="eyebrow">Report an issue</p>
          <h1 id="submit-title">Send a complete civic complaint in one flow.</h1>
          <p>
            Use this page for non-emergency Pradeshiya Sabha service issues. Clear category,
            location, and contact choices help the team review and assign the complaint faster.
          </p>
        </div>
        <aside className="report-hero-card" aria-label="Submission summary">
          <span className="report-hero-card-icon" aria-hidden="true">
            <ReportIcon name="check" />
          </span>
          <div>
            <strong>Reference number issued after submission</strong>
            <p>Keep it for tracking, especially when the report is anonymous.</p>
          </div>
          <ul>
            <li>
              <ReportIcon name="map" />
              <span>Add a clear location</span>
            </li>
            <li>
              <ReportIcon name="file" />
              <span>Describe one main issue</span>
            </li>
            <li>
              <ReportIcon name="lock" />
              <span>Anonymous reports are supported</span>
            </li>
          </ul>
        </aside>
      </section>

      <section className="report-boundary-note" aria-labelledby="report-boundary-title">
        <span aria-hidden="true">
          <ReportIcon name="alert" />
        </span>
        <div>
          <p className="eyebrow">Important</p>
          <h2 id="report-boundary-title">Do not use this form for immediate danger.</h2>
          <p>
            Fire, police, ambulance, rescue, or life-safety incidents should go through emergency
            services first. This portal is for civic service follow-up.
          </p>
        </div>
      </section>

      <section className="workflow-panel submit-panel complaint-intake-panel" aria-label="Complaint intake">
        {submittedReference ? (
          <section className="success-card report-success-card" aria-live="polite" aria-labelledby="submission-success-title">
            <span className="success-icon" aria-hidden="true">
              <ReportIcon name="check" />
            </span>
            <div className="report-success-copy">
              <p className="eyebrow">Complaint received</p>
              <h2 id="submission-success-title">Complaint submitted successfully.</h2>
              <p>
                Save this number before leaving. It is the fastest way to check the latest status.
              </p>
            </div>
            <div className="reference-card" aria-describedby={referenceHintId}>
              <span>Reference number</span>
              <strong>{submittedReference}</strong>
              <p id={referenceHintId}>Use this reference on the tracking page.</p>
            </div>
            <div className="report-success-next" aria-label="What happens next">
              <div>
                <ReportIcon name="file" />
                <strong>Review queued</strong>
                <span>Officers can now assess and assign it.</span>
              </div>
              <div>
                <ReportIcon name="lock" />
                <strong>Reference secured</strong>
                <span>Anonymous reports depend on this number.</span>
              </div>
            </div>
            <div className="report-success-actions">
              <a className="button button-primary" href={trackingHref}>
                Track this complaint
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
                Submit another
              </button>
            </div>
          </section>
        ) : (
          <form className="intake-card report-intake-card" aria-label="Complaint submission form" onSubmit={handleSubmit}>
            <div className="report-form-head">
              <span>Step {currentStep} of 3</span>
              <h2>Complete your complaint</h2>
              <p>Fill one section at a time. Required details are kept visible and easy to scan.</p>
            </div>

            <ol className="report-stepper" aria-label="Complaint submission steps">
              {['Issue', 'Follow-up', 'Submit'].map((stepLabel, index) => (
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
                label="Category"
                name="category"
                onChange={(value) => {
                  setCategory(value)
                  setCategoryError('')
                }}
                options={categoryOptions}
                placeholder="Select a service area"
                value={category}
              />

              <ReportDropdown
                description="Choose the closest level. Officers can adjust it after review."
                id="complaint-urgency"
                label="Urgency"
                name="urgency"
                onChange={setUrgency}
                options={urgencyOptions}
                placeholder="Select urgency"
                value={urgency}
              />

              <div className="field-preview">
                <label htmlFor="complaint-location">Location</label>
                <input
                  id="complaint-location"
                  name="location"
                  placeholder="Ward, road name, landmark, pole number, or map note"
                  type="text"
                  required
                />
              </div>

              <div className="field-preview">
                <label htmlFor="complaint-details">Description</label>
                <textarea
                  id="complaint-details"
                  name="description"
                  placeholder="Describe the issue, when it started, and who is affected."
                  rows={5}
                  required
                />
              </div>
            </fieldset>

            <fieldset className="report-step-panel" disabled={currentStep !== 2} hidden={currentStep !== 2}>
              <div className="field-preview file-field report-file-field">
                <label htmlFor="complaint-evidence">Photo or document</label>
                <input
                  id="complaint-evidence"
                  name="evidence"
                  type="file"
                  accept="image/*,.pdf"
                />
                <span>Optional. Images or PDFs help confirm the issue and location.</span>
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
                  <strong>Submit anonymously</strong>
                  <small>No name or phone number will be attached. Keep the reference number safe.</small>
                </span>
              </label>

              {!isAnonymous && (
                <div className="contact-grid">
                  <div className="field-preview">
                    <label htmlFor="complainant-name">Name</label>
                    <input
                      id="complainant-name"
                      name="name"
                      placeholder="Your name"
                      type="text"
                    />
                  </div>
                  <div className="field-preview">
                    <label htmlFor="complainant-phone">Phone number</label>
                    <input
                      id="complainant-phone"
                      name="phone"
                      placeholder="07X XXX XXXX"
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
                  <h3>Submit complaint</h3>
                  <p>Check the reminder below, then submit the complaint.</p>
                </div>
              </div>

              <div className="report-submit-review">
                <ReportIcon name="check" />
                <div>
                  <strong>Ready for review</strong>
                  <p>A reference number will be issued after submission. Save it to track progress.</p>
                </div>
              </div>

              <p className="form-note report-form-note">
                For immediate danger, contact emergency services first. This portal is for civic service follow-up only.
              </p>
            </fieldset>

            <div className="report-step-actions">
              {currentStep > 1 && (
                <button className="button button-secondary" type="button" onClick={goToPreviousStep}>
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button className="button button-primary" type="button" onClick={(event) => goToNextStep(event.currentTarget.form)}>
                  Next
                  <ReportIcon name="arrow" />
                </button>
              ) : (
                <button className="button button-primary" type="submit">
                  Submit complaint
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
