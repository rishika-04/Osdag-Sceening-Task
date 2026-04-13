import LeftPanel from './components/LeftPanel'
import RightPanel from './components/RightPanel'

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div style={{
        width: '300px', minWidth: '300px', height: '100vh',
        overflowY: 'auto', background: '#23233a',
        borderRight: '1px solid #3a3a5a'
      }}>
        <LeftPanel />
      </div>
      <div style={{ flex: 1, height: '100vh', overflow: 'hidden', background: '#111122' }}>
        <RightPanel />
      </div>
    </div>
  )
}
export default App