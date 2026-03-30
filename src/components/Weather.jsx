import { useState, useEffect } from 'react'
import './Weather.css'

const WMO_CODES = {
  0: { label: 'Klarvær', icon: '☀️' },
  1: { label: 'Mest klart', icon: '🌤️' },
  2: { label: 'Delvis skyet', icon: '⛅' },
  3: { label: 'Overskyet', icon: '☁️' },
  45: { label: 'Tåke', icon: '🌫️' },
  48: { label: 'Rimtåke', icon: '🌫️' },
  51: { label: 'Yr', icon: '🌦️' },
  53: { label: 'Yr', icon: '🌦️' },
  55: { label: 'Yr', icon: '🌦️' },
  61: { label: 'Lett regn', icon: '🌧️' },
  63: { label: 'Regn', icon: '🌧️' },
  65: { label: 'Kraftig regn', icon: '🌧️' },
  71: { label: 'Lett snø', icon: '🌨️' },
  73: { label: 'Snø', icon: '❄️' },
  75: { label: 'Kraftig snø', icon: '❄️' },
  77: { label: 'Snøkorn', icon: '🌨️' },
  80: { label: 'Regnbyger', icon: '🌦️' },
  81: { label: 'Regnbyger', icon: '🌦️' },
  82: { label: 'Kraftige byger', icon: '⛈️' },
  85: { label: 'Snøbyger', icon: '🌨️' },
  86: { label: 'Kraftige snøbyger', icon: '❄️' },
  95: { label: 'Tordenvær', icon: '⛈️' },
  96: { label: 'Tordenvær med hagl', icon: '⛈️' },
  99: { label: 'Tordenvær med hagl', icon: '⛈️' },
}

const DAYS_NO = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør']

function getWeatherInfo(code) {
  return WMO_CODES[code] ?? { label: 'Ukjent', icon: '🌡️' }
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
    const url =
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=61.48&longitude=10.07' +
      '&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,precipitation' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max' +
      '&wind_speed_unit=ms&timezone=Europe%2FOslo&forecast_days=7'

    fetch(url)
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

  const { current, daily } = weather
  const now = getWeatherInfo(current.weather_code)

  return (
    <div className="weather-card">
      <div className="weather-location">
        <span className="location-pin">📍</span> Kvitfjell
      </div>

      <div className="weather-current">
        <div className="weather-icon-big">{now.icon}</div>
        <div className="weather-temp-big">{Math.round(current.temperature_2m)}°</div>
        <div className="weather-desc">
          <span>{now.label}</span>
          <span className="feels-like">
            Føles som {Math.round(current.apparent_temperature)}°
          </span>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail">
          <span className="detail-label">Nedbør</span>
          <span>{current.precipitation} mm</span>
        </div>
        <div className="detail">
          <span className="detail-label">Vind</span>
          <span>
            <WindIcon degrees={current.wind_direction_10m} />
            {Math.round(current.wind_speed_10m)} m/s
          </span>
        </div>
      </div>

      <div className="weather-forecast">
        {daily.time.map((date, i) => {
          const day = getWeatherInfo(daily.weather_code[i])
          const d = new Date(date)
          const label = i === 0 ? 'I dag' : i === 1 ? 'I morgen' : DAYS_NO[d.getDay()]
          return (
            <div key={date} className="forecast-day">
              <span className="forecast-label">{label}</span>
              <span className="forecast-icon">{day.icon}</span>
              <span className="forecast-precip">{daily.precipitation_sum[i].toFixed(0)} mm</span>
              <span className="forecast-temps">
                <span className="temp-max">{Math.round(daily.temperature_2m_max[i])}°</span>
                <span className="temp-min">{Math.round(daily.temperature_2m_min[i])}°</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
