import { useState } from 'react'
import './App.css'
import Weather from './components/Weather'
import OpeningHours from './components/OpeningHours'
import SnowReport from './components/SnowReport'

const TABS = [
  { id: 'hjem', label: 'Hjem' },
  { id: 'snø', label: 'Snø' },
]

function App() {
  const [activeTab, setActiveTab] = useState('hjem')

  return (
    <div className="app">
      <header>
        <h1>🏔️ Hytteappen</h1>
        <p className="header-sub">Kneika</p>
      </header>

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
      </main>
    </div>
  )
}

export default App
