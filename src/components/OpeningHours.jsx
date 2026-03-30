import './OpeningHours.css'

// day: 0=sun, 1=mon, ..., 6=sat
// hours: array indexed by day — normaltider for inneværende uke
// holidays: { "YYYY-MM-DD": { open, close } | null } — dato-spesifikke avvik
const PLACES = [
  {
    name: 'Kvitfjell Alpinsenter',
    emoji: '⛷️',
    // Uke 14 (30. mars – 5. april): alle dager 09:30–16:30
    hours: [
      { open: '09:30', close: '16:30' }, // søn
      { open: '09:30', close: '16:30' }, // man
      { open: '09:30', close: '16:30' }, // tir
      { open: '09:30', close: '16:30' }, // ons
      { open: '09:30', close: '16:30' }, // tor
      { open: '09:30', close: '16:30' }, // fre
      { open: '09:30', close: '16:30' }, // lør
    ],
    note: 'Sesongslutt ca. 19. april · Avhenger av vær og føre',
    holidays: {
      // Uke 15–16 (6.–19. april): man–tor og søn 09:30–16:00, fre–lør 09:30–16:30
      '2026-04-06': { open: '09:30', close: '16:00' }, // man
      '2026-04-07': { open: '09:30', close: '16:00' }, // tir
      '2026-04-08': { open: '09:30', close: '16:00' }, // ons
      '2026-04-09': { open: '09:30', close: '16:00' }, // tor
      '2026-04-10': { open: '09:30', close: '16:30' }, // fre
      '2026-04-11': { open: '09:30', close: '16:30' }, // lør
      '2026-04-12': { open: '09:30', close: '16:00' }, // søn
      '2026-04-13': { open: '09:30', close: '16:00' }, // man
      '2026-04-14': { open: '09:30', close: '16:00' }, // tir
      '2026-04-15': { open: '09:30', close: '16:00' }, // ons
      '2026-04-16': { open: '09:30', close: '16:00' }, // tor
      '2026-04-17': { open: '09:30', close: '16:30' }, // fre
      '2026-04-18': { open: '09:30', close: '16:30' }, // lør
      '2026-04-19': { open: '09:30', close: '16:00' }, // søn — siste dag
    },
  },
  {
    name: 'Hev Vestsiden Deli',
    emoji: '🏪',
    hours: [
      { open: '10:00', close: '18:00' }, // søn
      { open: '10:00', close: '18:00' }, // man
      { open: '10:00', close: '18:00' }, // tir
      { open: '10:00', close: '18:00' }, // ons
      { open: '10:00', close: '18:00' }, // tor
      { open: '10:00', close: '18:00' }, // fre
      { open: '10:00', close: '18:00' }, // lør
    ],
    note: 'Åpningstider kan variere',
    holidays: {},
  },
  {
    name: 'Kiwi Fåvang',
    emoji: '🛒',
    hours: [
      null,                              // søn
      { open: '07:00', close: '23:00' }, // man
      { open: '07:00', close: '23:00' }, // tir
      { open: '07:00', close: '23:00' }, // ons
      { open: '07:00', close: '23:00' }, // tor
      { open: '07:00', close: '23:00' }, // fre
      { open: '07:00', close: '21:00' }, // lør
    ],
    note: null,
    holidays: {
      '2026-01-01': null,                              // Nyttårsdag
      '2026-04-02': { open: '10:00', close: '18:00' }, // Skjærtorsdag
      '2026-04-03': { open: '10:00', close: '18:00' }, // Langfredag
      '2026-04-04': { open: '07:00', close: '16:00' }, // Påskeaften
      '2026-04-05': null,                              // 1. påskedag
      '2026-04-06': { open: '10:00', close: '18:00' }, // 2. påskedag
      '2026-05-01': null,                              // Arbeidernes dag
      '2026-05-14': null,                              // Kristi himmelfartsdag
      '2026-05-17': { open: '10:00', close: '18:00' }, // Grunnlovsdag
      '2026-05-24': null,                              // 1. pinsedag
      '2026-05-25': { open: '10:00', close: '18:00' }, // 2. pinsedag
      '2026-12-24': { open: '07:00', close: '14:00' }, // Julaften
      '2026-12-25': null,                              // 1. juledag
      '2026-12-26': { open: '10:00', close: '18:00' }, // 2. juledag
      '2026-12-31': { open: '07:00', close: '18:00' }, // Nyttårsaften
    },
  },
  {
    name: 'Extra Fåvang',
    emoji: '🛒',
    hours: [
      null,                              // søn
      { open: '07:00', close: '23:00' }, // man
      { open: '07:00', close: '23:00' }, // tir
      { open: '07:00', close: '23:00' }, // ons
      { open: '07:00', close: '23:00' }, // tor
      { open: '07:00', close: '23:00' }, // fre
      { open: '08:00', close: '21:00' }, // lør
    ],
    note: null,
    holidays: {
      '2026-01-01': null,
      '2026-04-02': { open: '10:00', close: '18:00' }, // Skjærtorsdag
      '2026-04-03': { open: '10:00', close: '18:00' }, // Langfredag
      '2026-04-04': { open: '07:00', close: '16:00' }, // Påskeaften
      '2026-04-05': null,                              // 1. påskedag
      '2026-04-06': { open: '10:00', close: '18:00' }, // 2. påskedag
      '2026-05-01': null,
      '2026-05-14': null,                              // Kristi himmelfartsdag
      '2026-05-17': { open: '10:00', close: '18:00' },
      '2026-05-24': null,                              // 1. pinsedag
      '2026-05-25': { open: '10:00', close: '18:00' }, // 2. pinsedag
      '2026-12-24': { open: '07:00', close: '14:00' },
      '2026-12-25': null,
      '2026-12-26': { open: '10:00', close: '18:00' },
      '2026-12-31': { open: '07:00', close: '18:00' },
    },
  },
]

const DAY_NAMES = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør']

function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function toMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

function getEffectiveHours(place, date) {
  const key = toDateKey(date)
  if (place.holidays && key in place.holidays) {
    return place.holidays[key]
  }
  return place.hours[date.getDay()]
}

function getStatusInfo(place) {
  const now = new Date()
  const todayHours = getEffectiveHours(place, now)
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const isHoliday = place.holidays && toDateKey(now) in place.holidays

  if (!todayHours) {
    for (let i = 1; i <= 7; i++) {
      const next = new Date(now)
      next.setDate(now.getDate() + i)
      const nextHours = getEffectiveHours(place, next)
      if (nextHours) {
        const label = i === 1 ? 'i morgen' : DAY_NAMES[next.getDay()]
        return { open: false, isHoliday, label: `Stengt · Åpner ${label} ${nextHours.open}` }
      }
    }
    return { open: false, isHoliday, label: 'Stengt' }
  }

  const openAt = toMinutes(todayHours.open)
  const closeAt = toMinutes(todayHours.close)

  if (currentMinutes < openAt) {
    return { open: false, isHoliday, label: `Åpner kl. ${todayHours.open}` }
  }
  if (currentMinutes >= closeAt) {
    for (let i = 1; i <= 7; i++) {
      const next = new Date(now)
      next.setDate(now.getDate() + i)
      const nextHours = getEffectiveHours(place, next)
      if (nextHours) {
        const label = i === 1 ? 'i morgen' : DAY_NAMES[next.getDay()]
        return { open: false, isHoliday, label: `Stengt · Åpner ${label} ${nextHours.open}` }
      }
    }
    return { open: false, isHoliday, label: 'Stengt for i dag' }
  }

  const minutesLeft = closeAt - currentMinutes
  if (minutesLeft <= 60) {
    return { open: true, isHoliday, label: `Stenger om ${minutesLeft} min` }
  }
  return { open: true, isHoliday, label: `Åpent til ${todayHours.close}` }
}

// Returnerer neste dato for en gitt ukedag (0=søn) fra og med i dag
function nextDateForWeekday(dayIndex) {
  const now = new Date()
  const diff = (dayIndex - now.getDay() + 7) % 7
  const d = new Date(now)
  d.setDate(now.getDate() + diff)
  return d
}

function PlaceCard({ place }) {
  const status = getStatusInfo(place)
  const todayIdx = new Date().getDay()

  return (
    <div className="place-card">
      <div className="place-header">
        <span className="place-emoji">{place.emoji}</span>
        <div className="place-info">
          <span className="place-name">{place.name}</span>
          {place.phone && (
            <a href={`tel:${place.phone}`} className="place-phone">{place.phone}</a>
          )}
        </div>
        <span className={`status-badge ${status.open ? 'open' : 'closed'}`}>
          {status.open ? 'Åpent' : 'Stengt'}
        </span>
      </div>

      <div className="status-label">
        {status.label}
        {status.isHoliday && <span className="holiday-tag"> · Helligdag</span>}
      </div>

      <div className="hours-grid">
        {DAY_NAMES.map((dayName, i) => {
          const isToday = i === todayIdx
          const dateForDay = nextDateForWeekday(i)
          const displayHours = getEffectiveHours(place, dateForDay)
          const isHolidayDay = !!(place.holidays && toDateKey(dateForDay) in place.holidays)
          return (
            <div key={i} className={`hours-row ${isToday ? 'today' : ''} ${isHolidayDay ? 'holiday' : ''}`}>
              <span className="day-name">{dayName}</span>
              <span className="day-hours">
                {displayHours ? `${displayHours.open}–${displayHours.close}` : 'Stengt'}
                {isHolidayDay && <span className="holiday-marker"> *</span>}
              </span>
            </div>
          )
        })}
      </div>

      {place.note && <p className="place-note">{place.note}</p>}
    </div>
  )
}

export default function OpeningHours() {
  return (
    <div className="opening-hours">
      {PLACES.map((place) => (
        <PlaceCard key={place.name} place={place} />
      ))}
    </div>
  )
}
