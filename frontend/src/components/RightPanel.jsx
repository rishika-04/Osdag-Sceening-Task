function RightPanel() {
  return (
    <div style={{
      height: '100%', background: '#111122',
      display: 'flex', flexDirection: 'column',
      padding: '10px', position: 'relative'
    }}>
      <div style={{
        background: '#1a3a1a', border: '1px solid #6ab04c',
        padding: '4px 12px', fontSize: '12px', color: '#6ab04c',
        alignSelf: 'flex-start', marginBottom: '10px'
      }}>
        BRIDGE CROSS SECTION (For Nomenclature only)
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <img
          src="/bridge-cross-section.png"
          alt="Bridge Cross Section"
          style={{ maxWidth: '90%', maxHeight: '50%', objectFit: 'contain' }}
          onError={(e) => {
            e.target.style.display = 'none'
            document.getElementById('img-placeholder').style.display = 'flex'
          }}
        />
        <div id="img-placeholder" style={{
          display: 'none', width: '70%', height: '200px',
          border: '1px dashed #4a4a6a', alignItems: 'center',
          justifyContent: 'center', color: '#555', fontSize: '12px'
        }}>
          Bridge cross-section image
        </div>
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#6ab04c', textAlign: 'center' }}>
          Cross-Section of Bridge
        </div>
      </div>

      {/* 3D axis indicator bottom right */}
      <div style={{
        position: 'absolute', bottom: '16px', right: '16px',
        fontSize: '11px', color: '#555'
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40">
          <line x1="20" y1="20" x2="35" y2="30" stroke="#e74c3c" strokeWidth="1.5"/>
          <line x1="20" y1="20" x2="5" y2="30" stroke="#2ecc71" strokeWidth="1.5"/>
          <line x1="20" y1="20" x2="20" y2="5" stroke="#3498db" strokeWidth="1.5"/>
          <text x="36" y="33" fontSize="8" fill="#e74c3c">x</text>
          <text x="1" y="33" fontSize="8" fill="#2ecc71">y</text>
          <text x="18" y="4" fontSize="8" fill="#3498db">z</text>
        </svg>
      </div>
    </div>
  )
}
export default RightPanel