import { useState, type FormEvent } from 'react'
import { supabase } from '../../../shared/lib/supabase/client'

type AdminLoginPageProps = {
  onLoginSuccess: () => void
}

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
        <div className="admin-auth-brand">
          <span className="brand-mark" aria-hidden="true">
            <img src="/logo.svg" alt="" />
          </span>
          <div>
            <p className="eyebrow">Restricted staff portal</p>
            <h1 id="admin-login-heading">Officer sign in</h1>
          </div>
        </div>

        <p className="admin-auth-copy">
          This entry point is intentionally separate from the public complaint portal. Use an approved
          Supabase Auth account with an active staff profile.
        </p>

        <form className="admin-auth-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              autoComplete="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
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
              required
              type="password"
              value={password}
            />
          </label>

          {errorMessage && <p className="admin-auth-error">{errorMessage}</p>}

          <button className="button button-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}
