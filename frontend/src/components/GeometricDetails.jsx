import { useState } from 'react'
import ModifyGeometryPopup from './ModifyGeometryPopup'

function GeometricDetails({ disabled, onCarriagewayChange }) {
  const [span, setSpan] = useState('')
  const [carriageway, setCarriageway] = useState('')
  const [footpath, setFootpath] = useState('None')
  const [skew, setSkew] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = (field, val) => {
    const num = parseFloat(val)
    const newErrors = { ...errors }
    if (field === 'span') {
      if (val === '') delete newErrors.span
      else if (num < 20 || num > 45) newErrors.span = 'Outside the software range.'
      else delete newErrors.span
    }
    if (field === 'carriageway') {
      if (val === '') delete newErrors.carriageway
      else if (num < 4.25 || num >= 24) newErrors.carriageway = 'Carriageway must be ≥ 4.25 m and < 24 m.'
      else delete newErrors.carriageway
    }
    if (field === 'skew') {
      if (val === '') delete newErrors.skew
      else if (num > 15 || num < -15) newErrors.skew = 'IRC 24 (2010) requires detailed analysis.'
      else delete newErrors.skew
    }
    setErrors(newErrors)
  }

  const inp = {
    width:'100%', padding:'4px 6px', background:'#2a2a4a', color:'#fff',
    border:'1px solid #4a4a6a', borderRadius:'3px', fontSize:'11px', marginTop:'2px'
  }
  const lbl = { fontSize:'11px', color:'#aaa' }
  const err = { color:'#ff6b6b', fontSize:'10px', marginTop:'2px' }
  const field = { marginBottom:'8px' }

  return (
    <div style={{ opacity:disabled?0.4:1, pointerEvents:disabled?'none':'auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
        <span style={{ fontSize:'12px', color:'#fff', textDecoration:'underline', fontWeight:'bold' }}>
          Geometric Details
        </span>
        <button
          onClick={() => setShowPopup(true)}
          style={{
            padding:'3px 7px', background:'#6ab04c', color:'#fff',
            border:'none', borderRadius:'3px', fontSize:'10px',
            cursor:'pointer', fontWeight:'bold'
          }}
        >
          Modify Additional Geometry
        </button>
      </div>

      <div style={field}>
        <div style={lbl}>Span (m):</div>
        <input type="number" value={span} style={inp} placeholder="20–45"
          onChange={(e) => { setSpan(e.target.value); validate('span', e.target.value) }} />
        {errors.span && <div style={err}>{errors.span}</div>}
      </div>

      <div style={field}>
        <div style={lbl}>Carriageway Width (m):</div>
        <input type="number" value={carriageway} style={inp} placeholder="4.25–24"
          onChange={(e) => {
            setCarriageway(e.target.value)
            validate('carriageway', e.target.value)
            onCarriagewayChange(parseFloat(e.target.value) || 0)
          }} />
        {errors.carriageway && <div style={err}>{errors.carriageway}</div>}
      </div>

      <div style={field}>
        <div style={lbl}>Footpath:</div>
        <select value={footpath} onChange={(e) => setFootpath(e.target.value)} style={inp}>
          <option value="None">None</option>
          <option value="Single-sided">Single-sided</option>
          <option value="Both">Both</option>
        </select>
      </div>

      <div style={field}>
        <div style={lbl}>Skew Angle (degrees):</div>
        <input type="number" value={skew} style={inp} placeholder="-15 to +15"
          onChange={(e) => { setSkew(e.target.value); validate('skew', e.target.value) }} />
        {errors.skew && <div style={err}>{errors.skew}</div>}
      </div>

      {showPopup && (
        <ModifyGeometryPopup
          carriagewayWidth={parseFloat(carriageway) || 0}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  )
}
export default GeometricDetails