import { useState } from 'react'
import {
  loginUser,
  registerUser,
} from './api.js'

function AuthScreen({ onLogin }) {
  const [isRegistering, setIsRegistering] =
    useState(false)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

    if (isRegistering && !email.trim()) {
      setError('Email is required.')
      return
    }

    try {
      setLoading(true)

      let user

      if (isRegistering) {
        user = await registerUser(
          username.trim(),
          email.trim(),
          password
        )
      } else {
        user = await loginUser(
          username.trim(),
          password
        )
      }

      // Store only the user returned by the backend.
      localStorage.setItem(
        'expense-tracker-session',
        JSON.stringify(user)
      )

      onLogin(user)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function switchMode() {
    setIsRegistering(current => !current)
    setError('')
    setUsername('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Paisa Dairy</h1>

        <p>
          {isRegistering
            ? 'Create your expense tracker account'
            : 'Sign in to your expense tracker'}
        </p>

        <form onSubmit={handleSubmit}>

          <label>
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={event =>
              setUsername(event.target.value)
            }
            placeholder="Enter username"
          />

          {isRegistering && (
            <>
              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={event =>
                  setEmail(event.target.value)
                }
                placeholder="Enter email"
              />
            </>
          )}

          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={event =>
              setPassword(event.target.value)
            }
            placeholder="Enter password"
          />

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isRegistering
                ? 'Create account'
                : 'Login'}
          </button>

        </form>

        <button
          type="button"
          className="switch-button"
          onClick={switchMode}
        >
          {isRegistering
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </button>

      </div>

    </div>
  )
}

export default AuthScreen