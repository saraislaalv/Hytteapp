import { useState, useEffect } from 'react'
import './SnowReport.css'

const CAMERAS = [
  {
    name: 'Toppen',
    images: [
      'https://aws-cdn.norwaylive.tv/snapshots/b7c558b2-dcf2-4d38-8280-ee5afa0533b4/kam1utsnitt1.jpg',
      'https://aws-cdn.norwaylive.tv/snapshots/b7c558b2-dcf2-4d38-8280-ee5afa0533b4/kam1utsnitt2.jpg',
      'https://aws-cdn.norwaylive.tv/snapshots/b7c558b2-dcf2-4d38-8280-ee5afa0533b4/kam1utsnitt3.jpg',
    ],
  },
  {
    name: 'Varden',
    images: [
      'https://aws-cdn.norwaylive.tv/snapshots/b7c558b2-dcf2-4d38-8280-ee5afa0533b4/kam2utsnitt1.jpg',
      'https://aws-cdn.norwaylive.tv/snapshots/b7c558b2-dcf2-4d38-8280-ee5afa0533b4/kam2utsnitt2.jpg',
      'https://aws-cdn.norwaylive.tv/snapshots/b7c558b2-dcf2-4d38-8280-ee5afa0533b4/kam2utsnitt3.jpg',
    ],
  },
  {
    name: 'Mellomstasjonen',
    images: [
      'https://aws-cdn.norwaylive.tv/snapshots/b7c558b2-dcf2-4d38-8280-ee5afa0533b4/kam3utsnitt1.jpg',
      'https://aws-cdn.norwaylive.tv/snapshots/b7c558b2-dcf2-4d38-8280-ee5afa0533b4/kam3utsnitt2.jpg',
      'https://aws-cdn.norwaylive.tv/snapshots/b7c558b2-dcf2-4d38-8280-ee5afa0533b4/kam3utsnitt3.jpg',
    ],
  },
  {
    name: 'Skitorget',
    images: [
      'https://aws-cdn.norwaylive.tv/snapshots/b7c558b2-dcf2-4d38-8280-ee5afa0533b4/kam4utsnitt1.jpg',
      'https://aws-cdn.norwaylive.tv/snapshots/b7c558b2-dcf2-4d38-8280-ee5afa0533b4/kam4utsnitt2.jpg',
      'https://aws-cdn.norwaylive.tv/snapshots/b7c558b2-dcf2-4d38-8280-ee5afa0533b4/kam4utsnitt3.jpg',
      'https://aws-cdn.norwaylive.tv/snapshots/b7c558b2-dcf2-4d38-8280-ee5afa0533b4/kam4utsnitt4.jpg',
    ],
  },
]

function formatTime(isoStr) {
  const d = new Date(isoStr)
  return d.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })
}

function SnowStats({ data }) {
  const top = data.conditions?.combined?.top
  const snow = top?.snow
  const lifts = data.lifts
  const slopes = data.slopes
  const isOpen = data.resort_open
  const updatedAt = data.last_updated

  return (
    <div className="snow-stats-card">
      <div className="snow-header">
        <div className="snow-title">
          <span className="snow-status-dot" data-open={String(isOpen)} />
          <span>{isOpen ? 'Anlegget er åpent' : 'Anlegget er stengt'}</span>
        </div>
        {updatedAt && (
          <span className="snow-updated">Oppdatert {formatTime(updatedAt)}</span>
        )}
      </div>

      <div className="snow-grid">
        <div className="snow-stat">
          <span className="stat-value">{snow?.depth_slope ?? '–'} cm</span>
          <span className="stat-label">Snødybde</span>
        </div>
        <div className="snow-stat">
          <span className="stat-value">+{snow?.today ?? '0'} cm</span>
          <span className="stat-label">Siste 24t</span>
        </div>
        <div className="snow-stat">
          <span className="stat-value">{top?.temperature?.value ?? '–'}°</span>
          <span className="stat-label">Temperatur</span>
        </div>
        <div className="snow-stat">
          <span className="stat-value">{top?.wind?.mps ?? '–'} m/s</span>
          <span className="stat-label">Vind</span>
        </div>
      </div>

      {top?.condition_description && (
        <div className="snow-condition">{top.condition_description}</div>
      )}

      <div className="snow-open-info">
        <div className="open-item">
          <span className="open-icon">🚡</span>
          <span>{lifts?.open ?? '–'} av {lifts?.count ?? '–'} heiser åpne</span>
        </div>
        <div className="open-item">
          <span className="open-icon">⛷️</span>
          <span>{slopes?.open ?? '–'} av {slopes?.count ?? '–'} løyper åpne</span>
        </div>
      </div>
    </div>
  )
}

function CameraCard({ camera }) {
  const [imgIndex, setImgIndex] = useState(0)
  // Bust cache ved å legge til timestamp som oppdateres hvert 4. minutt
  const [cacheBust, setCacheBust] = useState(() => Math.floor(Date.now() / 240000))

  useEffect(() => {
    const interval = setInterval(() => {
      setCacheBust(Math.floor(Date.now() / 240000))
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const src = `${camera.images[imgIndex]}?t=${cacheBust}`

  return (
    <div className="camera-card">
      <div className="camera-img-wrap">
        <img
          src={src}
          alt={camera.name}
          loading="lazy"
          onError={(e) => { e.target.style.display = 'none' }}
        />
        {camera.images.length > 1 && (
          <div className="camera-nav">
            {camera.images.map((_, i) => (
              <button
                key={i}
                className={`camera-dot ${i === imgIndex ? 'active' : ''}`}
                onClick={() => setImgIndex(i)}
                aria-label={`Vinkel ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="camera-name">{camera.name}</div>
    </div>
  )
}

export default function SnowReport() {
  const [snow, setSnow] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://api.fnugg.no/get/resort/13')
      .then((r) => r.json())
      .then((data) => {
        setSnow(data._source)
        setLoading(false)
      })
      .catch(() => {
        setError('Kunne ikke hente snøforhold.')
        setLoading(false)
      })
  }, [])

  return (
    <div className="snow-report">
      <div className="snow-section">
        {loading && <div className="snow-loading">Henter snøforhold...</div>}
        {error && <div className="snow-error">{error}</div>}
        {snow && <SnowStats data={snow} />}
      </div>

      <div className="cameras-section">
        <h3 className="cameras-title">Webkamera · oppdateres hvert 4. min</h3>
        <div className="cameras-grid">
          {CAMERAS.map((cam) => (
            <CameraCard key={cam.name} camera={cam} />
          ))}
        </div>
      </div>
    </div>
  )
}
