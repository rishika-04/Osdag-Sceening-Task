import { useState } from 'react'

function ModifyGeometryPopup({ carriagewayWidth, onClose }) {
  const overallWidth = (carriagewayWidth || 0) + 5

  const [girderSpacing, setGirderSpacing] = useState('')
  const [noOfGirders,   setNoOfGirders]   = useState('')
  const [deckOverhang,  setDeckOverhang]  = useState('')
  const [error,         setError]         = useState('')

  // ─── Validation ───────────────────────────────────────────────────────────
  // Always called with the three FINAL (already-computed) string values.
  const validate = (s, n, o) => {
    const sf = parseFloat(s)
    const nf = parseInt(n)
    const of = parseFloat(o)
    if (isNaN(sf) || isNaN(nf) || isNaN(of)) return ''           // incomplete – no error yet
    if (of >= overallWidth)
      return `Deck Overhang (${of}) must be less than Overall Width (${overallWidth.toFixed(1)} m).`
    if (sf >= overallWidth)
      return `Girder Spacing (${sf}) must be less than Overall Width (${overallWidth.toFixed(1)} m).`
    if (sf <= 0)
      return 'Girder Spacing must be greater than 0.'
    if (nf <= 0)
      return 'No. of Girders must be greater than 0.'
    const calc = (overallWidth - of) / sf
    if (Math.abs(calc - nf) > 0.05)
      return `Formula mismatch. (${overallWidth.toFixed(1)} − ${of}) ÷ ${sf} = ${calc.toFixed(2)}, not ${nf}.`
    return ''
  }

  // ─── Core: derive the missing field from the two known ones ───────────────
  //
  //   Formula:  (W - O) / S = N
  //   Rearranged:
  //     given S, O  →  N = round((W - O) / S)
  //     given N, O  →  S = (W - O) / N
  //     given S, N  →  O = W - S * N
  //
  // Each handler:
  //   1. Sets its own state with the raw typed value.
  //   2. Reads the TWO siblings that are NOT being changed (safe – same render).
  //   3. If both siblings are valid numbers → derive the field being changed
  //      (this is the "third field" that should auto-update).
  //   4. Calls validate() with all three final values.

  const handleSpacing = (val) => {
    setGirderSpacing(val)

    const s = parseFloat(val)
    // Read siblings – both are from the current (un-mutated) render state
    const n = parseInt(noOfGirders)
    const o = parseFloat(deckOverhang)

    const sOk = !isNaN(s) && s > 0
    const nOk = !isNaN(n) && n > 0
    const oOk = !isNaN(o)

    if (sOk && oOk) {
      // Derive N from S and O
      const derived = Math.round((overallWidth - o) / s)
      setNoOfGirders(String(derived))
      setError(validate(val, String(derived), deckOverhang))
    } else if (sOk && nOk) {
      // Derive O from S and N
      const derived = parseFloat((overallWidth - s * n).toFixed(1))
      setDeckOverhang(String(derived))
      setError(validate(val, noOfGirders, String(derived)))
    } else {
      setError('')
    }
  }

  const handleGirders = (val) => {
    setNoOfGirders(val)

    const n = parseInt(val)
    // Read siblings
    const s = parseFloat(girderSpacing)
    const o = parseFloat(deckOverhang)

    const nOk = !isNaN(n) && n > 0
    const sOk = !isNaN(s) && s > 0
    const oOk = !isNaN(o)

    if (nOk && oOk) {
      // Derive S from N and O
      const derived = parseFloat(((overallWidth - o) / n).toFixed(1))
      setGirderSpacing(String(derived))
      setError(validate(String(derived), val, deckOverhang))
    } else if (nOk && sOk) {
      // Derive O from N and S
      const derived = parseFloat((overallWidth - s * n).toFixed(1))
      setDeckOverhang(String(derived))
      setError(validate(girderSpacing, val, String(derived)))
    } else {
      setError('')
    }
  }

  const handleOverhang = (val) => {
    setDeckOverhang(val)

    const o = parseFloat(val)
    // Read siblings
    const s = parseFloat(girderSpacing)
    const n = parseInt(noOfGirders)

    const oOk = !isNaN(o)
    const sOk = !isNaN(s) && s > 0
    const nOk = !isNaN(n) && n > 0

    if (oOk && sOk) {
      // Derive N from O and S
      const derived = Math.round((overallWidth - o) / s)
      setNoOfGirders(String(derived))
      setError(validate(girderSpacing, String(derived), val))
    } else if (oOk && nOk) {
      // Derive S from O and N
      const derived = parseFloat(((overallWidth - o) / n).toFixed(1))
      setGirderSpacing(String(derived))
      setError(validate(String(derived), noOfGirders, val))
    } else {
      setError('')
    }
  }

  // ─── Styles (unchanged from original) ────────────────────────────────────
  const inp = { width:'100%', padding:'5px 7px', background:'#1a1a3a', color:'#fff', border:'1px solid #4a4a6a', borderRadius:'3px', fontSize:'12px', marginTop:'3px' }
  const lbl = { fontSize:'11px', color:'#ccc' }
  const row = { marginBottom:'10px' }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'#2a2a4a', border:'2px solid #f0a500', borderRadius:'6px', padding:'20px', width:'360px' }}>

        <div style={{ fontSize:'13px', fontWeight:'bold', color:'#fff', marginBottom:'4px' }}>
          Modify Additional Geometry
        </div>
        <div style={{ fontSize:'10px', color:'#aaa', marginBottom:'14px' }}>
          Overall Bridge Width = Carriageway + 5 =&nbsp;
          <span style={{ color:'#6ab04c', fontWeight:'bold' }}>{overallWidth.toFixed(1)} m</span>
        </div>

        <div style={row}>
          <div style={lbl}>Girder Spacing (m):</div>
          <input
            type="number" step="0.1"
            value={girderSpacing}
            onChange={(e) => handleSpacing(e.target.value)}
            style={inp}
          />
        </div>

        <div style={row}>
          <div style={lbl}>No. of Girders:</div>
          <input
            type="number"
            value={noOfGirders}
            onChange={(e) => handleGirders(e.target.value)}
            style={inp}
          />
        </div>

        <div style={row}>
          <div style={lbl}>Deck Overhang Width (m):</div>
          <input
            type="number" step="0.1"
            value={deckOverhang}
            onChange={(e) => handleOverhang(e.target.value)}
            style={inp}
          />
        </div>

        {error && (
          <div style={{ color:'#ff6b6b', fontSize:'11px', background:'#3a1a1a', padding:'7px', borderRadius:'3px', marginBottom:'10px' }}>
            {error}
          </div>
        )}

        <div style={{ fontSize:'10px', color:'#666', marginBottom:'12px' }}>
          Formula: (Overall Width − Overhang) ÷ Spacing = No. of Girders
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding:'5px 16px', background:'#4a4a6a', color:'#fff', border:'none', borderRadius:'3px', fontSize:'11px', cursor:'pointer' }}
          >
            Done
          </button>
        </div>

      </div>
    </div>
  )
}
export default ModifyGeometryPopup
