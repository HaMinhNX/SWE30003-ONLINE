import { useEffect, useState } from 'react'
import data from '../assets/data'
import '../style/home.css'

const Home = () => {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    const warehouse = data.centralWarehouse
    setProducts(warehouse.inventory)
  }, [])

  const addToCart = (product) => {
    setShowCart(true)
    setCart((prev) => {
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

  return (
    <div className="home-container">
      <nav className="navbar">
        <div></div>
        <button onClick={() => setShowCart(prev => !prev)} className="cart-toggle">
          {showCart ? 'Ẩn giỏ hàng' : '🛒 Giỏ hàng'}
        </button>
      </nav>

      <div className="main-content">
        <div className="product-section">
          <img
            src="https://nhathuoclongchau.com.vn/hstatic/741/10000741/1/home_slider_image_1.jpg"
            alt="Pharmacy"
            className="banner-image"
          />
          <h3>Danh sách sản phẩm</h3>
          <div className={`product-grid ${showCart ? 'grid-3' : 'grid-5'}`}>
            {products.map((p) => (
              <div className="product-card" key={p.name}>
                <h4>{p.name}</h4>
                <button onClick={() => addToCart(p)}>Thêm vào giỏ</button>
              </div>
            ))}
          </div>
        </div>

        {showCart && (
          <div className="cart-section">
            <h3>🛒 Giỏ hàng</h3>
            {cart.length === 0 ? (
              <p>Chưa có sản phẩm nào</p>
            ) : (
              <ul>
                {cart.map((item) => (
                  <li key={item.name}>
                    <strong>{item.name}</strong> x {item.quantity}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
