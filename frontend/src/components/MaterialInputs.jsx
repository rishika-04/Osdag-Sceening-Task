const STEEL = ['E250','E350','E450']
const CONCRETE = ['M25','M30','M35','M40','M45','M50','M55','M60']
import { useState } from 'react'

function MaterialInputs({ disabled }) {
  const [girder, setGirder] = useState('E250')
  const [bracing, setBracing] = useState('E250')
  const [deck, setDeck] = useState('M25')

  const sel = { width:'100%', padding:'4px 6px', background:'#2a3a6a', color:'#fff', border:'1px solid #3a5a9a', borderRadius:'3px', fontSize:'11px', marginTop:'2px' }
  const lbl = { fontSize:'11px', color:'#aaa' }
  const row = { marginBottom:'8px' }

  return (
    <div style={{ opacity:disabled?0.4:1, pointerEvents:disabled?'none':'auto' }}>
      <div style={{ fontSize:'12px', color:'#fff', textDecoration:'underline', fontWeight:'bold', marginBottom:'8px' }}>
        Material Inputs
      </div>
      <div style={row}>
        <div style={lbl}>Girder</div>
        <select value={girder} onChange={(e)=>setGirder(e.target.value)} style={sel}>
          {STEEL.map(g=><option key={g}>{g}</option>)}
        </select>
      </div>
      <div style={row}>
        <div style={lbl}>Cross Bracing</div>
        <select value={bracing} onChange={(e)=>setBracing(e.target.value)} style={sel}>
          {STEEL.map(g=><option key={g}>{g}</option>)}
        </select>
      </div>
      <div style={row}>
        <div style={lbl}>Deck</div>
        <select value={deck} onChange={(e)=>setDeck(e.target.value)} style={sel}>
          {CONCRETE.map(g=><option key={g}>{g}</option>)}
        </select>
      </div>
    </div>
  )
}
export default MaterialInputs