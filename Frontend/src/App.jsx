import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home.jsx';
import Products from './pages/Products.jsx';
import Navbar from './components/navBar.jsx'; // Đảm bảo đường dẫn đúng
import OrderHistory from './pages/OrderHistory.jsx'
import './App.css'; // Nếu có file CSS chính cho toàn ứng dụng

function App() {
  return (
    <Router>
      <div>
        {/* Navbar sticky */}
        <Navbar />

        {/* Nội dung các trang */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/order-history" element={<OrderHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
