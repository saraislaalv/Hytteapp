import './App.css'
import Weather from './components/Weather'
import OpeningHours from './components/OpeningHours'

function App() {
  return (
    <div className="app">
      <header>
        <h1>🏔️ Hytteappen</h1>
        <p className="header-sub">Kneika</p>
      </header>
      <main>
        <section className="section">
          <h2 className="section-title">Vær</h2>
          <Weather />
        </section>
        <section className="section">
          <h2 className="section-title">Åpningstider</h2>
          <OpeningHours />
        </section>
      </main>
    </div>
  )
}

export default App
