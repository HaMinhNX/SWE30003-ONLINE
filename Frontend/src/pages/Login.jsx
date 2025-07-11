import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Eye, EyeOff, User, Stethoscope, Shield, UserCheck, Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Customer'); // Default role for registration

  // Sample accounts with Manager included
  const sampleAccounts = [
    {
      name: 'Nguyễn Văn A',
      email: 'customer@longchau.com',
      password: '123456',
      role: 'Customer',
      icon: User,
      color: 'bg-blue-500'
    },
    {
      name: 'Nguyễn Văn B',
      email: 'doctor@longchau.com',
      password: '123456',
      role: 'Doctor',
      icon: Stethoscope,
      color: 'bg-green-500'
    },
    {
      name: 'Nguyễn Văn C',
      email: 'admin@longchau.com',
      password: '123456',
      role: 'Admin',
      icon: Shield,
      color: 'bg-red-500'
    },
    {
      name: 'Nguyễn Văn D',
      email: 'pharmacist@longchau.com',
      password: '123456',
      role: 'Pharmacist',
      icon: UserCheck,
      color: 'bg-purple-500'
    },
    {
      name: 'Nguyễn Văn E',
      email: 'manager@longchau.com',
      password: '123456',
      role: 'Manager',
      icon: Building,
      color: 'bg-orange-500'
    }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    
    const account = sampleAccounts.find(acc => acc.email === email && acc.password === password);
    
    if (account) {
      // Store user data with user-specific cart initialization
      const userData = {
        name: account.name,
        email: account.email,
        role: account.role,
        isLoggedIn: true
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Initialize user-specific cart if it doesn't exist
      const cartKey = `cart_${account.email}`;
      if (!localStorage.getItem(cartKey)) {
        localStorage.setItem(cartKey, JSON.stringify([]));
      }
      
      console.log(`Đăng nhập thành công với vai trò: ${account.role}`);
      navigate('/');
      window.location.reload();
    } else {
      alert('Email hoặc mật khẩu không đúng!');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    if (!name || !email || !password || !selectedRole) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    
    const newUser = {
      name,
      email,
      role: selectedRole,
      isLoggedIn: true
    };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Initialize user-specific cart
    const cartKey = `cart_${email}`;
    localStorage.setItem(cartKey, JSON.stringify([]));
    
    console.log('Đăng ký thành công!');
    navigate('/');
    window.location.reload();
  };

  const quickLogin = (account) => {
    const userData = {
      name: account.name,
      email: account.email,
      role: account.role,
      isLoggedIn: true
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Initialize user-specific cart if it doesn't exist
    const cartKey = `cart_${account.email}`;
    if (!localStorage.getItem(cartKey)) {
      localStorage.setItem(cartKey, JSON.stringify([]));
    }
    
    console.log(`Đăng nhập nhanh với vai trò: ${account.role}`);
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-primary text-white px-3 py-1 rounded-lg font-bold text-xl">
              LC
            </div>
            <span className="text-2xl font-bold text-gray-900">Long Châu</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại</h1>
          <p className="text-gray-600">Đăng nhập để tiếp tục sử dụng dịch vụ Long Châu</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Accounts */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Tài khoản Demo
                </CardTitle>
                <p className="text-sm text-gray-600">Click để đăng nhập nhanh</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {sampleAccounts.map((account, index) => {
                  const IconComponent = account.icon;
                  return (
                    <div
                      key={index}
                      className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => quickLogin(account)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${account.color} rounded-full flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{account.name}</div>
                          <div className="text-sm text-gray-500">{account.email}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {account.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Login/Register Forms */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                    <TabsTrigger value="register">Đăng ký</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="p-6 space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Nhập email của bạn"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                        Đăng nhập
                      </Button>
                    </form>
                    
                    <div className="text-center">
                      <Link to="/" className="text-sm text-primary hover:underline">
                        ← Quay lại trang chủ
                      </Link>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Thông tin đăng nhập:</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>• Email: customer@longchau.com (Customer)</p>
                        <p>• Email: doctor@longchau.com (Doctor)</p>
                        <p>• Email: admin@longchau.com (Admin)</p>
                        <p>• Email: pharmacist@longchau.com (Pharmacist)</p>
                        <p>• Email: manager@longchau.com (Manager)</p>
                        <p>• Mật khẩu: 123456 (cho tất cả tài khoản)</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="register" className="p-6 space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Nhập họ và tên"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="Nhập email của bạn"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Vai trò</Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Customer">Khách hàng</SelectItem>
                            <SelectItem value="Doctor">Bác sĩ</SelectItem>
                            <SelectItem value="Pharmacist">Dược sĩ</SelectItem>
                            <SelectItem value="Manager">Quản lý</SelectItem>
                            <SelectItem value="Admin">Quản trị viên</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Mật khẩu</Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Nhập mật khẩu"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Nhập lại mật khẩu"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                        Đăng ký
                      </Button>
                    </form>
                    
                    <div className="text-center">
                      <Link to="/" className="text-sm text-primary hover:underline">
                        ← Quay lại trang chủ
                      </Link>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
