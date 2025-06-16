import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/home.jsx'
import Doctor from './pages/doctor.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <h2 style={{ margin: 0 }}>Long Châu Pharmacy</h2>
          <div>
            <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Trang chủ</Link>
            <Link to="/doctor" style={{ color: 'white' }}>Bác sĩ</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor" element={<Doctor />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
