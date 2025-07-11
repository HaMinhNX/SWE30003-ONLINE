// /src/utils/validators.js

export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class InputValidator {
  static validateRequired(value, fieldName) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      throw new ValidationError(`${fieldName} không được để trống`, fieldName);
    }
  }

  static validateEmail(email) {
    this.validateRequired(email, 'Email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Email không hợp lệ', 'email');
    }
  }

  static validatePhone(phone) {
    this.validateRequired(phone, 'Số điện thoại');
    const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      throw new ValidationError('Số điện thoại không hợp lệ', 'phone');
    }
  }

  static validatePassword(password) {
    this.validateRequired(password, 'Mật khẩu');
    if (password.length < 6) {
      throw new ValidationError('Mật khẩu phải có ít nhất 6 ký tự', 'password');
    }
  }

  static validateQuantity(quantity) {
    this.validateRequired(quantity, 'Số lượng');
    const num = parseInt(quantity);
    if (isNaN(num) || num <= 0) {
      throw new ValidationError('Số lượng phải là số nguyên dương', 'quantity');
    }
  }

  static validateRole(role) {
    this.validateRequired(role, 'Vai trò');
    const validRoles = ['Customer', 'Doctor', 'Pharmacist', 'Manager', 'Admin'];
    if (!validRoles.includes(role)) {
      throw new ValidationError('Vai trò không hợp lệ', 'role');
    }
  }

  static validatePrescription(data) {
    this.validateRequired(data.patientId, 'Bệnh nhân');
    this.validateRequired(data.items, 'Danh sách thuốc');
    
    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new ValidationError('Đơn thuốc phải có ít nhất một loại thuốc', 'items');
    }

    data.items.forEach((item, index) => {
      this.validateRequired(item.medicine, `Thuốc ${index + 1}`);
      this.validateRequired(item.dosage, `Liều dùng thuốc ${index + 1}`);
      this.validateQuantity(item.quantity);
      this.validateRequired(item.instructions, `Cách dùng thuốc ${index + 1}`);
    });
  }
}
