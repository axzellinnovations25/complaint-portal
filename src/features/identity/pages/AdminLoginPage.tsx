import { useState, type FormEvent } from 'react'
import { supabase } from '../../../shared/lib/supabase/client'

type AdminLoginPageProps = {
  onLoginSuccess: () => void
}

const accessNotes = [
  'Authorized staff only',
  'Access matched to your duties',
  'Activity reviewed by administrators',
]

export function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    onLoginSuccess()
  }

  return (
    <main className="admin-auth-shell">
      <section className="admin-auth-card" aria-labelledby="admin-login-heading">
        <div className="admin-auth-hero">
          <div className="admin-auth-brand">
            <span className="admin-auth-logo" aria-hidden="true">
              <img src="/logo.svg" alt="" />
            </span>
            <div>
              <span>Smart Citizen Platform</span>
              <strong>Complaint Administration</strong>
            </div>
          </div>

          <div className="admin-auth-hero-copy">
            <p className="eyebrow">Restricted staff portal</p>
            <h1 id="admin-login-heading">Sign in to manage civic operations</h1>
            <p>
              Review complaints, coordinate departments, publish public updates, and monitor response deadlines
              from the staff workspace.
            </p>
          </div>

          <div className="admin-auth-note-panel">
            <strong>Access policy</strong>
            <ul>
              {accessNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="admin-auth-form-panel">
          <div className="admin-auth-form-heading">
            <p className="eyebrow">Officer access</p>
            <h2>Welcome back</h2>
            <p>Use your staff account to continue.</p>
          </div>

          <form className="admin-auth-form" onSubmit={handleSubmit}>
            <label>
              Email address
              <input
                autoComplete="email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="officer@pradeshiya.gov.lk"
                required
                type="email"
                value={email}
              />
            </label>

            <label>
              Password
              <input
                autoComplete="current-password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                type="password"
                value={password}
              />
            </label>

            {errorMessage && <p className="admin-auth-error">{errorMessage}</p>}

            <button className="button button-primary admin-auth-submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Signing in...' : 'Sign in securely'}
            </button>
          </form>

          <div className="admin-auth-support">
            <span>Need access?</span>
            <strong>Contact the main administrator to activate your access.</strong>
          </div>
        </div>
      </section>
    </main>
  )
}
