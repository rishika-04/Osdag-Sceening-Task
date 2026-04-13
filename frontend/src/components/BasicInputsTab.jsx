import { useState } from 'react'
import TypeOfStructure from './TypeOfStructure'
import ProjectLocation from './ProjectLocation'
import GeometricDetails from './GeometricDetails'
import MaterialInputs from './MaterialInputs'

function BasicInputsTab() {
  const [structureType, setStructureType] = useState('Highway')
  const [carriagewayWidth, setCarriagewayWidth] = useState(0)
  const disabled = structureType === 'Other'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      <TypeOfStructure value={structureType} onChange={setStructureType} />

      {disabled && (
        <div style={{
          color: '#ff6b6b', fontSize: '11px', background: '#3a1a1a',
          padding: '6px 8px', borderRadius: '3px', border: '1px solid #ff4444'
        }}>
          Other structures not included.
        </div>
      )}

      <ProjectLocation disabled={disabled} />

      <GeometricDetails
        disabled={disabled}
        onCarriagewayChange={setCarriagewayWidth}
      />

      <MaterialInputs disabled={disabled} />

      {/* Save / Design buttons at bottom */}
      {!disabled && (
        <div style={{
          display: 'flex', gap: '8px', marginTop: '10px',
          paddingTop: '10px', borderTop: '1px solid #3a3a5a'
        }}>
          <button style={{
            flex: 1, padding: '7px', background: '#2a2a4a',
            color: '#fff', border: '1px solid #4a4a6a',
            borderRadius: '3px', fontSize: '12px', cursor: 'pointer'
          }}>
            Save Input
          </button>
          <button style={{
            flex: 1, padding: '7px', background: '#6ab04c',
            color: '#fff', border: 'none',
            borderRadius: '3px', fontSize: '12px',
            cursor: 'pointer', fontWeight: 'bold'
          }}>
            Design
          </button>
        </div>
      )}
    </div>
  )
}
export default BasicInputsTab