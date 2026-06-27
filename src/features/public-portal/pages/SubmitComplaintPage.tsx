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

const preparationSteps = [
  {
    title: 'Choose one main issue',
    detail: 'One complaint should describe one service problem so it can be assigned cleanly.',
    icon: 'file' as const,
  },
  {
    title: 'Make the location inspectable',
    detail: 'Use a ward, road name, landmark, pole number, or nearby public building.',
    icon: 'map' as const,
  },
  {
    title: 'Add follow-up details only if needed',
    detail: 'Anonymous complaints are supported, but SMS updates require a phone number.',
    icon: 'lock' as const,
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

export function SubmitComplaintPage() {
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [submittedReference, setSubmittedReference] = useState('')
  const [initialCategory] = useState(getInitialCategory)
  const referenceHintId = useId()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmittedReference('PS-2026-00124')
  }

  return (
    <article className="public-page report-page">
      <section className="compact-page-hero report-hero" aria-labelledby="submit-title">
        <div>
          <p className="eyebrow">Report an issue</p>
          <h1 id="submit-title">Send a complete civic complaint in one flow.</h1>
          <p>
            Use this page for non-emergency Pradeshiya Sabha service issues. Clear category,
            location, and contact choices help the team review and assign the complaint faster.
          </p>
        </div>
        <aside className="report-hero-card" aria-label="Submission summary">
          <span aria-hidden="true">
            <ReportIcon name="check" />
          </span>
          <strong>Reference number issued after submission</strong>
          <p>Keep it for tracking, especially when the report is anonymous.</p>
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
        <div className="workflow-copy report-workflow-copy">
          <p className="eyebrow">What to prepare</p>
          <h2>Include the details officers need.</h2>
          <p>
            Keep the report factual and specific. Mention where the issue is, when you noticed it,
            whether it affects access or safety, and what evidence is available.
          </p>

          <ol className="report-guidance-list" aria-label="Complaint submission preparation">
            {preparationSteps.map((step, index) => (
              <li key={step.title}>
                <span aria-hidden="true">
                  <ReportIcon name={step.icon} />
                </span>
                <div>
                  <strong>{index + 1}. {step.title}</strong>
                  <p>{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="report-category-panel">
            <p className="eyebrow">Available categories</p>
            <div>
              {complaintCategories.map((category) => (
                <article key={category.value}>
                  <span aria-hidden="true">
                    <ReportIcon name={category.icon} />
                  </span>
                  <div>
                    <strong>{category.value}</strong>
                    <p>{category.helper}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {submittedReference ? (
          <section className="success-card report-success-card" aria-live="polite" aria-labelledby="submission-success-title">
            <span className="success-icon" aria-hidden="true">
              <ReportIcon name="check" />
            </span>
            <div>
              <p className="eyebrow">Complaint received</p>
              <h2 id="submission-success-title">Save your reference number.</h2>
              <p>
                Your complaint has been captured for review. Use this reference on the tracking page
                whenever you want to check progress.
              </p>
            </div>
            <div className="reference-card" aria-describedby={referenceHintId}>
              <span>Reference number</span>
              <strong>{submittedReference}</strong>
              <p id={referenceHintId}>Anonymous reports are tracked only with this number.</p>
            </div>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => setSubmittedReference('')}
            >
              Submit another complaint
            </button>
          </section>
        ) : (
          <form className="intake-card report-intake-card" aria-label="Complaint submission form" onSubmit={handleSubmit}>
            <div className="form-section-title">
              <span aria-hidden="true">1</span>
              <div>
                <h3>Issue details</h3>
                <p>Tell officers what type of service problem this is.</p>
              </div>
            </div>

            <div className="field-preview">
              <label htmlFor="complaint-category">Category</label>
              <select id="complaint-category" name="category" required defaultValue={initialCategory}>
                <option value="" disabled>Select a service area</option>
                {complaintCategories.map((category) => (
                  <option value={category.value} key={category.value}>
                    {category.value}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-preview">
              <label htmlFor="complaint-urgency">Urgency</label>
              <select id="complaint-urgency" name="urgency" required defaultValue="normal">
                <option value="normal">Normal service issue</option>
                <option value="high">Public safety affected</option>
                <option value="low">General feedback</option>
              </select>
            </div>

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

            <div className="form-section-title">
              <span aria-hidden="true">2</span>
              <div>
                <h3>Evidence and follow-up</h3>
                <p>Photos are optional. Contact details are only needed for updates.</p>
              </div>
            </div>

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

            <p className="form-note report-form-note">
              For immediate danger, contact emergency services first. This portal is for civic service follow-up only.
            </p>

            <button className="button button-primary report-submit-button" type="submit">
              Submit complaint
              <ReportIcon name="arrow" />
            </button>
          </form>
        )}
      </section>
    </article>
  )
}
