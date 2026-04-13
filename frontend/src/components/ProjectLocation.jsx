import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000/api'

function ProjectLocation({ disabled }) {
  const [showPopup, setShowPopup] = useState(false)
  const [mode, setMode] = useState(null) // 'location' or 'custom'

  // State → District selection
  const [states, setStates] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [districts, setDistricts] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const [locationData, setLocationData] = useState(null)
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState('')

  const [customValues, setCustomValues] = useState({
    wind_speed: '', seismic_zone: '', zone_factor: '', temp_max: '', temp_min: ''
  })

  // Fetch states on mount
  useEffect(() => {
    setLoadingStates(true)
    fetch(`${API_BASE}/states/`)
      .then(r => r.json())
      .then(data => { setStates(data); setLoadingStates(false) })
      .catch(() => { setError('Failed to load states'); setLoadingStates(false) })
  }, [])

  // Fetch districts when state changes
  useEffect(() => {
    if (!selectedState) { setDistricts([]); setSelectedDistrict(''); setLocationData(null); return }
    setLoadingDistricts(true)
    setSelectedDistrict('')
    setLocationData(null)
    fetch(`${API_BASE}/states/${encodeURIComponent(selectedState)}/districts/`)
      .then(r => r.json())
      .then(data => { setDistricts(data); setLoadingDistricts(false) })
      .catch(() => { setError('Failed to load districts'); setLoadingDistricts(false) })
  }, [selectedState])

  // Fetch location data when district changes
  useEffect(() => {
    if (!selectedState || !selectedDistrict) { setLocationData(null); return }
    setLoadingData(true)
    fetch(`${API_BASE}/states/${encodeURIComponent(selectedState)}/districts/${encodeURIComponent(selectedDistrict)}/data/`)
      .then(r => r.json())
      .then(data => { setLocationData(data); setLoadingData(false) })
      .catch(() => { setError('Failed to load location data'); setLoadingData(false) })
  }, [selectedState, selectedDistrict])

  const handleModeChange = (newMode) => {
    setMode(newMode === mode ? null : newMode)
    setLocationData(null)
    setSelectedState('')
    setSelectedDistrict('')
    setDistricts([])
    setCustomValues({ wind_speed: '', seismic_zone: '', zone_factor: '', temp_max: '', temp_min: '' })
    setError('')
  }

  const handleCustomSubmit = () => {
    setLocationData({
      wind_speed: customValues.wind_speed,
      seismic_zone: customValues.seismic_zone,
      zone_factor: customValues.zone_factor,
      temp_max: customValues.temp_max,
      temp_min: customValues.temp_min
    })
    setShowPopup(false)
  }

  const selectStyle = {
    padding: '4px 6px',
    background: '#2a2a4a',
    color: '#fff',
    border: '1px solid #4a4a6a',
    borderRadius: '4px',
    fontSize: '12px',
    flex: 1,
    minWidth: 0,
  }

  const inputStyle = {
    width: '100%',
    padding: '5px',
    background: '#2a2a4a',
    color: '#fff',
    border: '1px solid #4a4a6a',
    borderRadius: '4px',
    fontSize: '12px',
    marginTop: '3px',
    boxSizing: 'border-box',
  }

  const checkboxRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '12px',
    color: '#ccc',
    cursor: 'pointer',
    flexWrap: 'wrap',
  }

  return (
    <div style={{ opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      {/* Orange Project Location Button */}
      <button
        onClick={() => setShowPopup(true)}
        style={{
          width: '100%', padding: '8px', background: '#e67e22', color: '#fff',
          border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold',
          cursor: 'pointer', marginBottom: '8px'
        }}
      >
        Project Location
      </button>

      {/* IRC values displayed below button after selection */}
      {locationData && (
        <div style={{
          background: '#1a2a1a', border: '1px solid #2a6a2a',
          borderRadius: '4px', padding: '8px', fontSize: '12px'
        }}>
          <div style={{ color: '#6ab04c', fontWeight: 'bold', marginBottom: '4px', fontSize: '11px' }}>
            IRC 6 (2017) Resulting Values:
          </div>
          <div style={{ color: '#6ab04c' }}>Basic Wind Speed: {locationData.wind_speed} m/s</div>
          <div style={{ color: '#6ab04c' }}>Seismic Zone: {locationData.seismic_zone} | Zone Factor: {locationData.zone_factor}</div>
          <div style={{ color: '#6ab04c' }}>Shade Air Temp: Max {locationData.temp_max}°C / Min {locationData.temp_min}°C</div>
        </div>
      )}

      {/* Popup */}
      {showPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#2a2a4a', border: '2px solid #e67e22', borderRadius: '8px',
            padding: '20px', width: '460px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>
              Project Location
            </div>

            {error && (
              <div style={{ color: '#e74c3c', fontSize: '12px', marginBottom: '8px' }}>{error}</div>
            )}

            {/* ── MODE 1: Enter Location Name ── */}
            {/* STEP 2 FIX: checkbox + label + State dropdown all on ONE row */}
            <div style={checkboxRowStyle} onClick={() => handleModeChange('location')}>
              <input
                type="checkbox"
                checked={mode === 'location'}
                onChange={() => handleModeChange('location')}
                style={{ accentColor: '#e67e22', width: '14px', height: '14px', flexShrink: 0 }}
              />
              <span style={{ flexShrink: 0 }}>Enter Location Name</span>

              {/* State dropdown — inline, only shown when mode === 'location' */}
              {mode === 'location' && (
                <select
                  value={selectedState}
                  onChange={e => { e.stopPropagation(); setSelectedState(e.target.value) }}
                  onClick={e => e.stopPropagation()}
                  style={selectStyle}
                  disabled={loadingStates}
                >
                  <option value="">{loadingStates ? 'Loading...' : '-- State --'}</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}

              {/* District dropdown — also inline, shown after state is selected */}
              {mode === 'location' && selectedState && (
                <select
                  value={selectedDistrict}
                  onChange={e => { e.stopPropagation(); setSelectedDistrict(e.target.value) }}
                  onClick={e => e.stopPropagation()}
                  style={selectStyle}
                  disabled={loadingDistricts}
                >
                  <option value="">{loadingDistricts ? 'Loading...' : '-- District --'}</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              )}
            </div>

            {/* Results shown below the inline row — only when data is available */}
            {mode === 'location' && locationData && (
              <div style={{ marginLeft: '22px', marginBottom: '12px' }}>
                {loadingData ? (
                  <div style={{ color: '#aaa', fontSize: '12px' }}>Loading data…</div>
                ) : (
                  <div style={{ background: '#1a2a1a', border: '1px solid #2a6a2a', borderRadius: '4px', padding: '8px' }}>
                    <div style={{ color: '#6ab04c', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                      IRC 6 (2017) Resulting Values:
                    </div>
                    <div style={{ color: '#6ab04c', fontSize: '12px' }}>Basic Wind Speed: {locationData.wind_speed} m/s</div>
                    <div style={{ color: '#6ab04c', fontSize: '12px' }}>Seismic Zone: {locationData.seismic_zone}</div>
                    <div style={{ color: '#6ab04c', fontSize: '12px' }}>Zone Factor: {locationData.zone_factor}</div>
                    <div style={{ color: '#6ab04c', fontSize: '12px' }}>Max Shade Air Temp: {locationData.temp_max}°C</div>
                    <div style={{ color: '#6ab04c', fontSize: '12px' }}>Min Shade Air Temp: {locationData.temp_min}°C</div>
                  </div>
                )}
              </div>
            )}

            {/* ── MODE 2: Tabulate Custom Loading Parameters ── */}
            <div style={checkboxRowStyle} onClick={() => handleModeChange('custom')}>
              <input
                type="checkbox"
                checked={mode === 'custom'}
                onChange={() => handleModeChange('custom')}
                style={{ accentColor: '#e67e22', width: '14px', height: '14px', flexShrink: 0 }}
              />
              <span>Tabulate Custom Loading Parameters</span>
            </div>

            {mode === 'custom' && (
              <div style={{ marginLeft: '22px', marginBottom: '12px' }}>
                {[
                  { label: 'Basic Wind Speed (m/s)', key: 'wind_speed' },
                  { label: 'Seismic Zone (e.g. III)', key: 'seismic_zone' },
                  { label: 'Zone Factor', key: 'zone_factor' },
                  { label: 'Max Shade Air Temp (°C)', key: 'temp_max' },
                  { label: 'Min Shade Air Temp (°C)', key: 'temp_min' },
                ].map(({ label, key }) => (
                  <div key={key} style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#ccc' }}>{label}</div>
                    <input
                      type="text"
                      value={customValues[key]}
                      onChange={e => setCustomValues(prev => ({ ...prev, [key]: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <button
                  onClick={handleCustomSubmit}
                  style={{
                    padding: '6px 16px', background: '#6ab04c', color: '#fff',
                    border: 'none', borderRadius: '4px', fontSize: '12px',
                    cursor: 'pointer', marginTop: '4px'
                  }}
                >
                  Apply
                </button>
              </div>
            )}

            {/* Close */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  padding: '6px 16px', background: '#4a4a6a', color: '#fff',
                  border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectLocation
