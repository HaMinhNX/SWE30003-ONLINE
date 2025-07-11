// user.js

// Lớp User đại diện cho một người dùng trong hệ thống
class User {
  constructor(id, name, email, role, isLoggedIn = false, createdAt = new Date()) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.isLoggedIn = isLoggedIn;
    this.createdAt = createdAt;
  }

  // Tạo người dùng từ dữ liệu trong localStorage
  static fromStorage() {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      
      const parsed = JSON.parse(userData);
      return new User(
        parsed.id || parsed.email,
        parsed.name,
        parsed.email,
        parsed.role,
        parsed.isLoggedIn,
        new Date(parsed.createdAt || Date.now())
      );
    } catch (error) {
      console.error('Error loading user from storage:', error);
      return null;
    }
  }

  // Lưu người dùng vào localStorage
  saveToStorage() {
    localStorage.setItem('user', JSON.stringify(this));
  }

  // Kiểm tra quyền của người dùng cho một hành động cụ thể
  hasPermission(action) {
    const permissions = {
      Customer: ['view_products', 'add_to_cart', 'checkout', 'view_orders'],
      Doctor: ['view_products', 'create_prescription', 'view_prescriptions'],
      Pharmacist: ['view_products', 'manage_prescriptions', 'update_inventory', 'view_orders'],
      Manager: ['manage_products', 'manage_stores', 'manage_employees', 'view_reports'],
      Admin: ['*'] // Tất cả quyền
    };

    if (this.role === 'Admin') return true;
    return permissions[this.role]?.includes(action) || false;
  }

  // Lấy khóa giỏ hàng của người dùng
  getCartKey() {
    return `cart_${this.email}`;
  }
}

// Lớp UserManager quản lý các thao tác với người dùng
class UserManager {
  // Tạo người dùng mới
  static createUser(userData) {
    const id = userData.email; // Dùng email làm ID cho đơn giản
    return new User(id, userData.name, userData.email, userData.role, userData.isLoggedIn);
  }

  // Xác thực thông tin đăng nhập của người dùng
  static authenticate(email, password) {
    // Giả lập xác thực - trong ứng dụng thực tế sẽ gọi API
    const mockUsers = [
      { email: 'admin@longchau.com', password: 'admin123', name: 'Admin User', role: 'Admin' },
      { email: 'doctor@longchau.com', password: 'doctor123', name: 'Bác sĩ Nguyễn', role: 'Doctor' },
      { email: 'pharmacist@longchau.com', password: 'pharma123', name: 'Dược sĩ Trần', role: 'Pharmacist' },
      { email: 'manager@longchau.com', password: 'manager123', name: 'Quản lý Lê', role: 'Manager' },
      { email: 'customer@longchau.com', password: 'customer123', name: 'Khách hàng A', role: 'Customer' }
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const user = new User(foundUser.email, foundUser.name, foundUser.email, foundUser.role, true);
      user.saveToStorage();
      return user;
    }
    return null;
  }

  // Đăng xuất người dùng hiện tại
  static logout() {
    localStorage.removeItem('user');
  }
}

export { User, UserManager };
