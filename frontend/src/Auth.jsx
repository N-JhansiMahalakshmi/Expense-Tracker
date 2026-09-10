import { useState } from 'react'
import { login, register } from './api.js'

function Auth({ onLogin }) {
  const [mode, setMode] = useState('login')

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function switchMode() {
    setMode(current =>
      current === 'login' ? 'register' : 'login'
    )

    setUsername('')
    setEmail('')
    setPassword('')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')

    if (!username.trim()) {
      setError('Username is required.')
      return
    }

    if (!password) {
      setError('Password is required.')
      return
    }

    if (mode === 'register' && !email.trim()) {
      setError('Email is required.')
      return
    }

    try {
      setLoading(true)

      let user

      if (mode === 'login') {
        user = await login(
          username.trim(),
          password
        )
      } else {
        user = await register(
          username.trim(),
          email.trim(),
          password
        )
      }

      localStorage.setItem(
        'expense-tracker-user',
        JSON.stringify(user)
      )

      onLogin(user)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>Ledger</h1>

        <p>
          {mode === 'login'
            ? 'Sign in to your account'
            : 'Create your account'}
        </p>

        <form onSubmit={handleSubmit}>

          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={e =>
                setUsername(e.target.value)
              }
              placeholder="Username"
            />
          </label>

          {mode === 'register' && (
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={e =>
                  setEmail(e.target.value)
                }
                placeholder="Email"
              />
            </label>
          )}

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={e =>
                setPassword(e.target.value)
              }
              placeholder="Password"
            />
          </label>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </button>

        </form>

        <button
          type="button"
          className="switch-auth"
          onClick={switchMode}
        >
          {mode === 'login'
            ? 'Create a new account'
            : 'Already have an account? Sign in'}
        </button>

      </div>
    </div>
  )
}

export default Auth