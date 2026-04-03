import { useState, useEffect, useCallback } from 'react'
import './App.css'

const DOCTORS = [
  { id: 1, name: 'Dr. Rajesh Sharma', specialty: 'Cardiologist', area: 'Vijay Nagar', cluster: 'Indore West', lastVisit: 'Mar 28', color: '#2D5F8A', visited: true },
  { id: 2, name: 'Dr. Priya Mehta', specialty: 'General Physician', area: 'Palasia', cluster: 'Indore West', lastVisit: 'Mar 25', color: '#5B8C5A', visited: true },
  { id: 3, name: 'Dr. Anil Gupta', specialty: 'Diabetologist', area: 'Sapna Sangeeta', cluster: 'Indore West', lastVisit: 'Mar 30', color: '#8B5CF6', visited: false },
  { id: 4, name: 'Dr. Sunita Joshi', specialty: 'Gynecologist', area: 'South Tukoganj', cluster: 'Indore South', lastVisit: 'Mar 22', color: '#D4538A', visited: true },
  { id: 5, name: 'Dr. Vikram Patel', specialty: 'Orthopedic', area: 'MG Road', cluster: 'Indore South', lastVisit: 'Mar 20', color: '#D4A853', visited: false },
  { id: 6, name: 'Dr. Kavita Verma', specialty: 'Dermatologist', area: 'Race Course', cluster: 'Indore South', lastVisit: 'Mar 27', color: '#E8703A', visited: false },
  { id: 7, name: 'Dr. Rakesh Tiwari', specialty: 'General Physician', area: 'Bhawarkua', cluster: 'Indore Central', lastVisit: 'Mar 18', color: '#3B82F6', visited: false },
  { id: 8, name: 'Dr. Neha Agarwal', specialty: 'Pediatrician', area: 'Rajwada', cluster: 'Indore Central', lastVisit: 'Mar 26', color: '#14B8A6', visited: false },
  { id: 9, name: 'Dr. Sanjay Kulkarni', specialty: 'ENT Specialist', area: 'Cloth Market', cluster: 'Indore Central', lastVisit: 'Mar 15', color: '#6366F1', visited: false },
]

const DRUGS = ['Azitel-500', 'CardioSafe-10', 'GlucoNorm-M', 'NeuroCalm-25']

const VOICE_TRANSCRIPT = "Dr. Sharma ko CardioSafe-10 ke baare mein bataya, 3 samples diye, unhe pasand aaya, next week follow-up karunga..."

const PARSED_FIELDS = [
  { label: 'Drug Detailed', value: 'CardioSafe-10', delay: 800 },
  { label: 'Samples Given', value: '3', delay: 1600 },
  { label: 'Sentiment', value: 'Positive', delay: 2400 },
  { label: 'Follow-up', value: 'Next week', delay: 3200 },
]

function getInitials(name) {
  return name.replace('Dr. ', '').split(' ').map(n => n[0]).join('')
}

function TodayScreen({ doctors, onSelectDoctor }) {
  const visited = doctors.filter(d => d.visited).length
  const total = doctors.length
  const clusters = [...new Set(doctors.map(d => d.cluster))]

  return (
    <div className="screen">
      <div className="header">
        <div className="header-date">Thursday, April 3</div>
        <div className="header-greeting">Good morning, Rahul</div>
        <div className="header-subtitle">Indore HQ · Tour Plan Day 18</div>
      </div>

      <div className="stats-bar">
        <div className="stat-chip">
          <div className="stat-chip-number">{total}</div>
          <div className="stat-chip-label">Planned</div>
        </div>
        <div className="stat-chip">
          <div className="stat-chip-number">{visited}</div>
          <div className="stat-chip-label">Visited</div>
        </div>
        <div className="stat-chip">
          <div className="stat-chip-number">{total - visited}</div>
          <div className="stat-chip-label">Remaining</div>
        </div>
      </div>

      <div className="section-header">
        <div className="section-title">Today's Doctors</div>
        <div className="section-badge">{visited}/{total} done</div>
      </div>

      <div className="doctor-list">
        {clusters.map(cluster => (
          <div key={cluster}>
            <div className="cluster-label">📍 {cluster}</div>
            {doctors.filter(d => d.cluster === cluster).map(doc => (
              <div
                key={doc.id}
                className={`doctor-card${doc.visited ? ' visited' : ''}`}
                onClick={() => !doc.visited && onSelectDoctor(doc)}
              >
                <div className="doctor-avatar" style={{ background: doc.color }}>
                  {getInitials(doc.name)}
                </div>
                <div className="doctor-info">
                  <div className="doctor-name">{doc.name}</div>
                  <div className="doctor-meta">{doc.specialty} · {doc.area}</div>
                </div>
                <div className="doctor-right">
                  {doc.visited ? (
                    <div className="visited-badge">✓ Visited</div>
                  ) : (
                    <>
                      <div className="doctor-last-visit">Last: {doc.lastVisit}</div>
                      <div className="chevron">›</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="bottom-nav">
        <button className="nav-item active">
          <span className="nav-icon">📋</span>
          Today
        </button>
        <button className="nav-item">
          <span className="nav-icon">📊</span>
          History
        </button>
        <button className="nav-item">
          <span className="nav-icon">👤</span>
          Profile
        </button>
      </div>
    </div>
  )
}

function VisitLogScreen({ doctor, onBack, onStartVoice, onSubmitManual }) {
  const [showManual, setShowManual] = useState(false)
  const [selectedDrug, setSelectedDrug] = useState(null)
  const [samples, setSamples] = useState(0)
  const [sentiment, setSentiment] = useState(null)

  const canSubmit = selectedDrug && samples > 0 && sentiment

  return (
    <div className="screen" style={{ paddingBottom: 0 }}>
      <div className="visit-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="visit-header-info">
          <h2>{doctor.name}</h2>
          <p>{doctor.specialty} · {doctor.area}</p>
        </div>
      </div>

      <div className="visit-meta">
        <div className="meta-pill">
          <span className="meta-pill-icon">📍</span>
          Location captured — {doctor.cluster}
        </div>
        <div className="meta-pill">
          <span className="meta-pill-icon">🕐</span>
          10:32 AM
        </div>
      </div>

      {!showManual ? (
        <div className="voice-cta-section">
          <button className="voice-btn" onClick={onStartVoice}>
            <span className="voice-btn-icon">🎤</span>
            <span className="voice-btn-text">Tap & Speak</span>
          </button>
          <div className="voice-hint">
            Just say what happened in Hindi or English.<br/>
            AI will fill the form for you.
          </div>
          <button className="manual-link" onClick={() => setShowManual(true)}>
            Or log manually
          </button>
        </div>
      ) : (
        <div className="manual-form">
          <div className="form-section">
            <div className="form-label">Drug Detailed</div>
            <div className="drug-pills">
              {DRUGS.map(drug => (
                <button
                  key={drug}
                  className={`drug-pill${selectedDrug === drug ? ' selected' : ''}`}
                  onClick={() => setSelectedDrug(drug)}
                >
                  {drug}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <div className="form-label">Samples Given</div>
            <div className="stepper">
              <button className="stepper-btn" onClick={() => setSamples(Math.max(0, samples - 1))}>−</button>
              <div className="stepper-value">{samples}</div>
              <button className="stepper-btn" onClick={() => setSamples(samples + 1)}>+</button>
            </div>
          </div>

          <div className="form-section">
            <div className="form-label">Doctor's Sentiment</div>
            <div className="sentiment-options">
              {[
                { key: 'Positive', emoji: '😊', label: 'Positive' },
                { key: 'Neutral', emoji: '😐', label: 'Neutral' },
                { key: 'Cold', emoji: '😕', label: 'Cold' },
              ].map(s => (
                <button
                  key={s.key}
                  className={`sentiment-btn${sentiment === s.key ? ' selected' : ''}`}
                  onClick={() => setSentiment(s.key)}
                >
                  <span className="sentiment-emoji">{s.emoji}</span>
                  <span className="sentiment-label">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className="submit-btn"
            disabled={!canSubmit}
            onClick={() => onSubmitManual({ drug: selectedDrug, samples, sentiment })}
          >
            Log Visit ✓
          </button>
        </div>
      )}
    </div>
  )
}

function VoiceScreen({ doctor, onDone }) {
  const [transcriptLen, setTranscriptLen] = useState(0)
  const [visibleFields, setVisibleFields] = useState([])
  const [showDone, setShowDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTranscriptLen(prev => {
        if (prev >= VOICE_TRANSCRIPT.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 35)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    PARSED_FIELDS.forEach((field, i) => {
      setTimeout(() => {
        setVisibleFields(prev => [...prev, i])
      }, field.delay)
    })
    setTimeout(() => setShowDone(true), 3800)
  }, [])

  return (
    <div className="voice-screen">
      <div className="voice-screen-header">
        <button className="back-btn" onClick={onDone}>←</button>
        <h2>Logging visit — {doctor.name}</h2>
      </div>

      <div className="voice-recording-area">
        <div className="pulse-container">
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
          <div className="pulse-mic">🎤</div>
        </div>
        <div className="recording-label">
          <span className="recording-dot"></span>
          Listening...
        </div>
      </div>

      <div className="transcription-box">
        <div className="transcription-label">Live Transcription</div>
        <div className="transcription-text">
          "{VOICE_TRANSCRIPT.slice(0, transcriptLen)}"
          {transcriptLen < VOICE_TRANSCRIPT.length && <span className="typing-cursor"></span>}
        </div>
      </div>

      <div className="parsed-fields">
        <div className="parsed-fields-title">AI-Parsed Fields</div>
        {PARSED_FIELDS.map((field, i) => (
          <div key={i} className={`parsed-field${visibleFields.includes(i) ? ' visible' : ''}`}>
            <span className="parsed-field-label">{field.label}</span>
            <span className="parsed-field-value">
              {field.value} <span className="parsed-check">✓</span>
            </span>
          </div>
        ))}
      </div>

      <button
        className={`voice-done-btn${showDone ? ' visible' : ''}`}
        onClick={onDone}
      >
        Done — Log Visit ✓
      </button>
    </div>
  )
}

function ConfirmScreen({ doctor, visitData, onBackToList }) {
  return (
    <div className="confirm-screen">
      <div className="confirm-success">
        <div className="confirm-check">✓</div>
        <div className="confirm-title">Visit Logged</div>
      </div>

      <div className="summary-card">
        <div className="summary-card-header">
          <div className="doctor-avatar" style={{ background: doctor.color, width: 32, height: 32, fontSize: 13, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {getInitials(doctor.name)}
          </div>
          <h3>{doctor.name}</h3>
        </div>
        <div className="summary-card-body">
          <div className="summary-row">
            <span className="summary-row-label">Drug Detailed</span>
            <span className="summary-row-value">{visitData.drug}</span>
          </div>
          <div className="summary-row">
            <span className="summary-row-label">Samples</span>
            <span className="summary-row-value">{visitData.samples}</span>
          </div>
          <div className="summary-row">
            <span className="summary-row-label">Sentiment</span>
            <span className="summary-row-value">{visitData.sentiment === 'Positive' ? '😊' : visitData.sentiment === 'Neutral' ? '😐' : '😕'} {visitData.sentiment}</span>
          </div>
          <div className="summary-row">
            <span className="summary-row-label">Time</span>
            <span className="summary-row-value">10:32 AM</span>
          </div>
          <div className="summary-row">
            <span className="summary-row-label">Location</span>
            <span className="summary-row-value">📍 {doctor.cluster}</span>
          </div>
        </div>
      </div>

      <div className="time-saved">
        <div className="time-saved-icon">⚡</div>
        <div className="time-saved-text">~8 minutes saved vs. evening DCR entry</div>
        <div className="time-saved-sub">No more end-of-day form filling</div>
      </div>

      <div className="next-suggestion">
        <div className="next-suggestion-icon">→</div>
        <div className="next-suggestion-text">
          <div className="next-suggestion-label">Next Suggested</div>
          <div className="next-suggestion-name">Dr. Vikram Patel — Orthopedic</div>
          <div className="next-suggestion-dist">0.8 km away · MG Road</div>
        </div>
      </div>

      <button className="back-to-list-btn" onClick={onBackToList}>
        Back to Today's List
      </button>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('today')
  const [doctors, setDoctors] = useState(DOCTORS)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [visitData, setVisitData] = useState(null)

  const handleSelectDoctor = useCallback((doc) => {
    setSelectedDoctor(doc)
    setScreen('visit')
  }, [])

  const handleStartVoice = useCallback(() => {
    setScreen('voice')
  }, [])

  const handleVoiceDone = useCallback(() => {
    setVisitData({ drug: 'CardioSafe-10', samples: 3, sentiment: 'Positive' })
    setScreen('confirm')
    setDoctors(prev => prev.map(d =>
      d.id === selectedDoctor.id ? { ...d, visited: true } : d
    ))
  }, [selectedDoctor])

  const handleManualSubmit = useCallback((data) => {
    setVisitData(data)
    setScreen('confirm')
    setDoctors(prev => prev.map(d =>
      d.id === selectedDoctor.id ? { ...d, visited: true } : d
    ))
  }, [selectedDoctor])

  const handleBackToList = useCallback(() => {
    setScreen('today')
    setSelectedDoctor(null)
    setVisitData(null)
  }, [])

  switch (screen) {
    case 'today':
      return <TodayScreen doctors={doctors} onSelectDoctor={handleSelectDoctor} />
    case 'visit':
      return (
        <VisitLogScreen
          doctor={selectedDoctor}
          onBack={handleBackToList}
          onStartVoice={handleStartVoice}
          onSubmitManual={handleManualSubmit}
        />
      )
    case 'voice':
      return <VoiceScreen doctor={selectedDoctor} onDone={handleVoiceDone} />
    case 'confirm':
      return (
        <ConfirmScreen
          doctor={selectedDoctor}
          visitData={visitData}
          onBackToList={handleBackToList}
        />
      )
    default:
      return null
  }
}
