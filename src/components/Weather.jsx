import { useState, useEffect } from 'react'
import './Weather.css'

const DAYS_NO = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør']

// Yr symbol-koder → emoji + norsk tekst
function symbolInfo(code) {
  if (!code) return { label: 'Ukjent', icon: '🌡️' }
  if (code.includes('clearsky')) return { label: 'Klarvær', icon: '☀️' }
  if (code.includes('fair')) return { label: 'Lettskyet', icon: '🌤️' }
  if (code.includes('partlycloudy')) return { label: 'Delvis skyet', icon: '⛅' }
  if (code.includes('cloudy')) return { label: 'Overskyet', icon: '☁️' }
  if (code.includes('fog')) return { label: 'Tåke', icon: '🌫️' }
  if (code.includes('heavysnow')) return { label: 'Kraftig snø', icon: '❄️' }
  if (code.includes('snow')) return { label: 'Snø', icon: '🌨️' }
  if (code.includes('sleet')) return { label: 'Sludd', icon: '🌨️' }
  if (code.includes('thunder')) return { label: 'Tordenvær', icon: '⛈️' }
  if (code.includes('heavyrain')) return { label: 'Kraftig regn', icon: '🌧️' }
  if (code.includes('rain')) return { label: 'Regn', icon: '🌧️' }
  if (code.includes('drizzle') || code.includes('lightrain')) return { label: 'Yr', icon: '🌦️' }
  return { label: 'Skyet', icon: '☁️' }
}

function WindIcon({ degrees }) {
  return (
    <span
      className="wind-arrow"
      style={{ transform: `rotate(${degrees}deg)` }}
      title={`${degrees}°`}
    >
      ↑
    </span>
  )
}

export default function Weather() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(
      'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=61.4572&lon=10.0958',
      { headers: { 'User-Agent': 'hytteappen/1.0 github.com/saraislaalvestad/hytteapp' } }
    )
      .then((r) => r.json())
      .then((data) => {
        setWeather(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Kunne ikke hente vær.')
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="weather-card loading">Henter vær...</div>
  if (error) return <div className="weather-card error">{error}</div>

  const timeseries = weather.properties.timeseries
  const current = timeseries[0].data
  const temp = current.instant.details.air_temperature
  const windSpeed = current.instant.details.wind_speed
  const windDir = current.instant.details.wind_from_direction
  const precip = current.next_1_hours?.details?.precipitation_amount ?? 0
  const symbol = current.next_1_hours?.summary?.symbol_code ?? current.next_6_hours?.summary?.symbol_code
  const nowInfo = symbolInfo(symbol)

  // Bygg daglig prognose ved å gruppere timeseries per dato
  const dailyMap = {}
  for (const entry of timeseries) {
    const date = entry.time.slice(0, 10)
    const details = entry.data.instant.details
    const sym = entry.data.next_6_hours?.summary?.symbol_code ?? entry.data.next_1_hours?.summary?.symbol_code
    const precip6 = entry.data.next_6_hours?.details?.precipitation_amount ?? 0

    if (!dailyMap[date]) dailyMap[date] = { temps: [], symbol: sym, precip: 0 }
    dailyMap[date].temps.push(details.air_temperature)
    dailyMap[date].precip += precip6
    if (!dailyMap[date].symbol && sym) dailyMap[date].symbol = sym
  }

  const forecast = Object.entries(dailyMap).slice(0, 7)

  return (
    <div className="weather-card">
      <div className="weather-location">
        <span className="location-pin">📍</span> Kvitfjell
      </div>

      <div className="weather-current">
        <div className="weather-icon-big">{nowInfo.icon}</div>
        <div className="weather-temp-big">{Math.round(temp)}°</div>
        <div className="weather-desc">
          <span>{nowInfo.label}</span>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail">
          <span className="detail-label">Nedbør (1t)</span>
          <span>{precip.toFixed(1)} mm</span>
        </div>
        <div className="detail">
          <span className="detail-label">Vind</span>
          <span>
            <WindIcon degrees={windDir} />
            {Math.round(windSpeed)} m/s
          </span>
        </div>
      </div>

      <div className="weather-forecast">
        {forecast.map(([date, day], i) => {
          const d = new Date(date)
          const label = i === 0 ? 'I dag' : i === 1 ? 'I morgen' : DAYS_NO[d.getDay()]
          const info = symbolInfo(day.symbol)
          const max = Math.round(Math.max(...day.temps))
          const min = Math.round(Math.min(...day.temps))
          return (
            <div key={date} className="forecast-day">
              <span className="forecast-label">{label}</span>
              <span className="forecast-icon">{info.icon}</span>
              <span className="forecast-precip">{day.precip.toFixed(0)} mm</span>
              <span className="forecast-temps">
                <span className="temp-max">{max}°</span>
                <span className="temp-min">{min}°</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
