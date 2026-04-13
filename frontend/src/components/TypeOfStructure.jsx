function TypeOfStructure({ value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px' }}>
        Type of Structure
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1, padding: '5px 8px', background: '#2a3a6a',
            color: '#fff', border: '1px solid #3a5a9a',
            borderRadius: '4px', fontSize: '12px'
          }}
        >
          <option value="Highway">Highway</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  )
}
export default TypeOfStructure