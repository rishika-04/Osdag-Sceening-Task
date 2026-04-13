import { useState } from 'react'
import BasicInputsTab from './BasicInputsTab'

function LeftPanel() {
  const [activeTab, setActiveTab] = useState('basic')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* Title bar */}
      <div style={{
        background: '#1a1a2e', borderBottom: '1px solid #3a3a5a',
        padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <span style={{ color: '#6ab04c', fontSize: '16px', fontWeight: 'bold' }}>S</span>
        <span style={{ fontSize: '12px', color: '#ccc' }}>Group Design</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#1a1a2e', padding: '4px 4px 0' }}>
        {['basic', 'additional'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '5px 12px', fontSize: '11px', cursor: 'pointer',
              border: 'none', borderRadius: '3px 3px 0 0', marginRight: '2px',
              background: activeTab === tab ? '#6ab04c' : '#2a2a4a',
              color: '#fff', fontWeight: activeTab === tab ? 'bold' : 'normal'
            }}
          >
            {tab === 'basic' ? 'Basic Inputs' : 'Additional Inputs'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{
        flex: 1, overflowY: 'auto', background: '#23233a',
        border: '1px solid #3a3a5a', padding: '10px'
      }}>
        {activeTab === 'basic' && <BasicInputsTab />}
        {activeTab === 'additional' && (
          <div style={{ color: '#666', fontSize: '12px', padding: '20px 0' }}>
            Additional Inputs tab — placeholder only.
          </div>
        )}
      </div>
    </div>
  )
}
export default LeftPanel