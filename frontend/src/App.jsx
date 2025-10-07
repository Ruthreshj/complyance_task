import React from 'react'
import ROICalculator from './components/ROICalculator.jsx'

function App() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 40%, #ecfeff 100%)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 32 }}>
      <div style={{ width: '100%', maxWidth: 1200, background: '#ffffff', padding: 28, borderRadius: 20, boxShadow: '0 20px 60px rgba(15,23,42,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>💰 Invoicing ROI Simulator</h1>
          <div style={{ color: '#64748b', fontSize: 12 }}>Estimate savings from manual → automated invoicing</div>
        </div>
        <ROICalculator />
      </div>
    </div>
  )
}

export default App
