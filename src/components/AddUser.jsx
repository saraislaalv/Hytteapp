import { useState } from 'react'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { secondaryAuth } from '../firebase'
import './AddUser.css'

function AddUser({ onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(secondaryAuth, email, password)
      await signOut(secondaryAuth)
      setSuccess(`Bruker «${email}» ble opprettet.`)
      setEmail('')
      setPassword('')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Det finnes allerede en bruker med den e-posten.')
      } else if (err.code === 'auth/weak-password') {
        setError('Passordet må være minst 6 tegn.')
      } else {
        setError('Noe gikk galt. Prøv igjen.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-user-overlay" onClick={onClose}>
      <div className="add-user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="add-user-header">
          <h3>Legg til bruker</h3>
          <button className="add-user-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="add-user-form">
          <label>
            E-post
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />
          </label>
          <label>
            Passord
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </label>
          {error && <p className="add-user-error">{error}</p>}
          {success && <p className="add-user-success">{success}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Oppretter…' : 'Opprett bruker'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddUser
