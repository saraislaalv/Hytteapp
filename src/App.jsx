import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import './App.css'
import Weather from './components/Weather'
import OpeningHours from './components/OpeningHours'
import SnowReport from './components/SnowReport'
import ShoppingList from './components/ShoppingList'
import Login from './components/Login'
import AddUser from './components/AddUser'

const TABS = [
  { id: 'hjem', label: 'Hjem' },
  { id: 'snø', label: 'Snø' },
  { id: 'handleliste', label: 'Handleliste' },
]

function App() {
  const [activeTab, setActiveTab] = useState('hjem')
  const [user, setUser] = useState(undefined)
  const [showAddUser, setShowAddUser] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u))
    return unsubscribe
  }, [])

  if (user === undefined) return null

  if (!user) return <Login />

  return (
    <div className="app">
      <header>
        <h1>🏔️ Hytteappen</h1>
        <p className="header-sub">Kneika</p>
        <div className="header-actions">
          <button className="add-user-btn" onClick={() => setShowAddUser(true)}>
            + Ny bruker
          </button>
          <button className="logout-btn" onClick={() => signOut(auth)}>
            Logg ut
          </button>
        </div>
      </header>
      {showAddUser && <AddUser onClose={() => setShowAddUser(false)} />}

      <nav className="tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {activeTab === 'hjem' && (
          <>
            <section className="section">
              <h2 className="section-title">Vær</h2>
              <Weather />
            </section>
            <section className="section">
              <h2 className="section-title">Åpningstider</h2>
              <OpeningHours />
            </section>
          </>
        )}

        {activeTab === 'snø' && (
          <section className="section full-width">
            <h2 className="section-title">Snøforhold og webkamera</h2>
            <SnowReport />
          </section>
        )}

        {activeTab === 'handleliste' && (
          <section className="section full-width">
            <ShoppingList />
          </section>
        )}
      </main>
    </div>
  )
}

export default App
