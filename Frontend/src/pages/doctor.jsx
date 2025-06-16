import { useEffect, useState } from 'react'
import data from '../assets/data.json'
import '../style/doctor.css'

const Doctor = () => {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState([])
  const [prescription, setPrescription] = useState([])
  const [patientName, setPatientName] = useState('')
  const [showPrescription, setShowPrescription] = useState(false)

  useEffect(() => {
    const warehouse = data.centralWarehouse
    setProducts(warehouse.inventory)
    setFiltered(warehouse.inventory)
  }, [])

  const handleSearch = (value) => {
    setSearch(value)
    const filteredResults = products.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    )
    setFiltered(filteredResults)
  }

  const addToPrescription = (product) => {
    setShowPrescription(true)
    setPrescription((prev) => {
      const exist = prev.find((p) => p.name === product.name)
      if (exist) {
        return prev.map((p) =>
          p.name === product.name ? { ...p, quantity: p.quantity + 1 } : p
        )
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  const handleSubmit = () => {
    if (!patientName.trim()) {
      alert('Vui lòng nhập tên bệnh nhân.')
      return
    }
    if (prescription.length === 0) {
      alert('Đơn thuốc đang trống.')
      return
    }

    console.log('Gửi đơn thuốc cho:', patientName)
    console.log('Danh sách thuốc:', prescription)
    alert('Đã gửi đơn thuốc thành công!')

    setPrescription([])
    setPatientName('')
    setShowPrescription(false)
  }

  return (
    <div className="doctor-container">
  <nav className="navbar">
    <div></div>
    <button onClick={() => setShowPrescription(prev => !prev)} className="cart-toggle">
      {showPrescription ? 'Ẩn đơn thuốc' : '📝 Đơn thuốc'}
    </button>
  </nav>

  <div className="main-content">
    {/* LEFT: thuốc */}
    <div className="product-section">
      <h3>Danh sách thuốc (từ kho tổng)</h3>
      <input
        type="text"
        placeholder="Tìm thuốc..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input"
      />
      <div className={`product-grid ${showPrescription ? 'grid-3' : 'grid-5'}`}>
        {filtered.map((p) => (
          <div className="product-card" key={p.name}>
            <h4>{p.name}</h4>
            <p>Sẵn có: {p.quantity}</p>
            <button onClick={() => addToPrescription(p)}>Cho vào đơn</button>
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT: đơn thuốc */}
    {showPrescription && (
      <div className="cart-section">
        <h3>📝 Đơn thuốc</h3>
        <input
          type="text"
          placeholder="Nhập tên bệnh nhân"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="patient-input"
        />
        {prescription.length === 0 ? (
          <p>Chưa có thuốc nào trong đơn</p>
        ) : (
          <ul>
            {prescription.map((item) => (
              <li key={item.name}>
                <strong>{item.name}</strong> x {item.quantity}
              </li>
            ))}
          </ul>
        )}
        <button onClick={handleSubmit} className="submit-button">
          Gửi đơn thuốc
        </button>
      </div>
    )}
  </div>
</div>
  )
}

export default Doctor
