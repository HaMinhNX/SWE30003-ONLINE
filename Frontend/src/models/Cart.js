// cart.js

// Class đại diện cho một sản phẩm trong giỏ hàng
class CartItem {
  constructor(id, name, price, quantity, image, category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.image = image;
    this.category = category || '';
  }

  // Tính toán tổng giá trị của sản phẩm
  getTotalPrice() {
    return this.price * this.quantity;
  }

  // Tạo một bản sao với số lượng mới
  withQuantity(newQuantity) {
    return new CartItem(this.id, this.name, this.price, newQuantity, this.image, this.category);
  }
}

// Class quản lý giỏ hàng
class ShoppingCart {
  constructor(userEmail) {
    this.userEmail = userEmail;
    this.items = [];
    this.loadFromStorage();
  }

  // Khóa lưu trữ cho giỏ hàng của người dùng
  getStorageKey() {
    return `cart_${this.userEmail}`;
  }

  // Tải dữ liệu giỏ hàng từ localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        const data = JSON.parse(stored);
        this.items = data.map(item => new CartItem(item.id, item.name, item.price, item.quantity, item.image, item.category));
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.items = [];
    }
  }

  // Lưu dữ liệu giỏ hàng vào localStorage
  saveToStorage() {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(this.items));
  }

  // Thêm sản phẩm vào giỏ hàng
  addItem(product, quantity = 1) {
    const existingItemIndex = this.items.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      this.items[existingItemIndex] = this.items[existingItemIndex].withQuantity(
        this.items[existingItemIndex].quantity + quantity
      );
    } else {
      this.items.push(new CartItem(
        product.id,
        product.name,
        product.price,
        quantity,
        product.image,
        product.category
      ));
    }
    
    this.saveToStorage();
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const itemIndex = this.items.findIndex(item => item.id === productId);
    if (itemIndex >= 0) {
      this.items[itemIndex] = this.items[itemIndex].withQuantity(quantity);
      this.saveToStorage();
    }
  }

  // Lấy tất cả các mặt hàng trong giỏ hàng
  getItems() {
    return [...this.items];
  }

  // Lấy tổng số lượng mặt hàng trong giỏ
  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Lấy tổng giá trị của tất cả mặt hàng trong giỏ
  getTotalPrice() {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  // Xóa tất cả mặt hàng trong giỏ
  clear() {
    this.items = [];
    this.saveToStorage();
  }

  // Kiểm tra giỏ hàng có trống không
  isEmpty() {
    return this.items.length === 0;
  }
}

// Class tĩnh hỗ trợ các phương thức dễ sử dụng
class Cart {
  static addItem(userEmail, item) {
    const cart = new ShoppingCart(userEmail);
    cart.addItem(item, item.quantity);
  }

  static getItems(userEmail) {
    const cart = new ShoppingCart(userEmail);
    return cart.getItems();
  }

  static removeItem(userEmail, productId) {
    const cart = new ShoppingCart(userEmail);
    cart.removeItem(productId);
  }

  static updateQuantity(userEmail, productId, quantity) {
    const cart = new ShoppingCart(userEmail);
    cart.updateQuantity(productId, quantity);
  }

  static clear(userEmail) {
    const cart = new ShoppingCart(userEmail);
    cart.clear();
  }

  static getItemCount(userEmail) {
    const cart = new ShoppingCart(userEmail);
    return cart.getItemCount();
  }

  static getTotalPrice(userEmail) {
    const cart = new ShoppingCart(userEmail);
    return cart.getTotalPrice();
  }
}

export { CartItem, ShoppingCart, Cart };
