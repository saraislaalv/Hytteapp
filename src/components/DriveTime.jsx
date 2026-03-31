import { useState, useEffect, useRef } from 'react'
import './DriveTime.css'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const HOME = 'Eiksmarka, Bærum, Norge'
const CABIN = 'Fåvang, Norge'

function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) return resolve()
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function DriveTime() {
  const [times, setTimes] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const mapRef = useRef(null)

  useEffect(() => {
    async function load() {
      try {
        await loadGoogleMaps()

        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 8,
          center: { lat: 61.0, lng: 10.3 },
          mapTypeId: 'roadmap',
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', stylers: [{ visibility: 'off' }] },
            { elementType: 'geometry', stylers: [{ color: '#f0f4f1' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c8dde0' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
            { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#d4e6d9' }] },
            { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#a8c9b0' }] },
            { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#e8f0ea' }] },
          ],
        })

        const directionsService = new window.google.maps.DirectionsService()
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#2d5a3d',
            strokeWeight: 4,
            strokeOpacity: 0.9,
          },
        })

        const result = await directionsService.route({
          origin: HOME,
          destination: CABIN,
          travelMode: window.google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: window.google.maps.TrafficModel.BEST_GUESS,
          },
        })

        directionsRenderer.setDirections(result)

        const leg = result.routes[0].legs[0]
        const toCabinTime = leg.duration_in_traffic?.text ?? leg.duration?.text

        // Marker for hjem
        new window.google.maps.Marker({
          position: leg.start_location,
          map,
          title: 'Eiksmarka',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4a7c59',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        })

        // Marker for hytta
        new window.google.maps.Marker({
          position: leg.end_location,
          map,
          title: 'Kneika',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#2d5a3d',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        })

        // Hent retur-tid separat
        const returnResult = await directionsService.route({
          origin: CABIN,
          destination: HOME,
          travelMode: window.google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: window.google.maps.TrafficModel.BEST_GUESS,
          },
        })
        const returnLeg = returnResult.routes[0].legs[0]
        const toHomeTime = returnLeg.duration_in_traffic?.text ?? returnLeg.duration?.text

        setTimes({ toCabin: toCabinTime, toHome: toHomeTime })
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="drivetime">
      <div ref={mapRef} className="drivetime-map" />
      {loading && <p className="drivetime-loading">Henter kjøretid…</p>}
      {error && <p className="drivetime-error">Kunne ikke hente kjøretid.</p>}
      {times && (
        <>
          <div className="drivetime-rows">
            <div className="drivetime-row">
              <span className="drivetime-icon">🏠</span>
              <span className="drivetime-label">Eiksmarka → Fåvang</span>
              <span className="drivetime-value">{times.toCabin}</span>
            </div>
            <div className="drivetime-row">
              <span className="drivetime-icon">🏔️</span>
              <span className="drivetime-label">Fåvang → Eiksmarka</span>
              <span className="drivetime-value">{times.toHome}</span>
            </div>
          </div>
          <p className="drivetime-note">Med trafikk nå</p>
        </>
      )}
    </div>
  )
}

export default DriveTime
