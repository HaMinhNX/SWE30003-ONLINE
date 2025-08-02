

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from './ui/dropdown-menu';
import { ShoppingCart, User, LogIn, Menu, X, Home, Package, FileText, Stethoscope, UserCheck, Building, Shield, ChevronDown, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CartHover from './CartHover';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showCartHover, setShowCartHover] = useState(false);

  useEffect(() => {
    // Check login status from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.isLoggedIn) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Update cart count and items - only for customers
    const updateCartData = () => {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) {
        setCartItemCount(0);
        setCartItems([]);
        return;
      }

      try {
        const userData = JSON.parse(savedUser);
        // Only load cart data for customers
        if (userData.isLoggedIn && userData.role === 'Customer') {
          // Use user email as unique identifier for cart
          const cartKey = `cart_${userData.email}`;
          const cart = localStorage.getItem(cartKey);
          if (cart) {
            const cartData = JSON.parse(cart);
            setCartItems(cartData);
            const count = cartData.reduce((total, item) => total + item.quantity, 0);
            setCartItemCount(count);
          } else {
            setCartItemCount(0);
            setCartItems([]);
          }
        } else {
          setCartItemCount(0);
          setCartItems([]);
        }
      } catch (error) {
        setCartItemCount(0);
        setCartItems([]);
      }
    };

    updateCartData();

    // Listen for localStorage changes
    const handleStorageChange = () => {
      updateCartData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    // Clear user-specific cart when logging out
    if (user && user.role === 'Customer') {
      const cartKey = `cart_${user.email}`;
      localStorage.removeItem(cartKey);
    }
    localStorage.removeItem('user');
    setUser(null);
    setCartItems([]);
    setCartItemCount(0);
    console.log('User logged out');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Long Châu</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary transition-colors">
              Sản phẩm
            </Link>

            {user?.isLoggedIn && user.role === 'Customer' && (
              <Link to="/my-prescriptions" className="text-gray-700 hover:text-primary transition-colors">
                Đơn thuốc của tôi
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon with Hover - Only show for customers */}
            {user?.isLoggedIn && user.role === 'Customer' && (
              <div
                className="relative"
                onMouseEnter={() => setShowCartHover(true)}
                onMouseLeave={() => setShowCartHover(false)}
              >
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/cart" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
                <CartHover items={cartItems} isVisible={showCartHover} />
              </div>
            )}

            {/* User Menu */}
            {user?.isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <Badge variant="secondary" className="text-xs w-fit">
                        {user.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {user.role === 'Customer' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/order-history" className="flex items-center">
                          <Package className="w-4 h-4 mr-2" />
                          Lịch sử đơn hàng
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/my-prescriptions" className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Đơn thuốc của tôi
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {(user.role === 'Doctor' || user.role === 'Admin') && (
                    <DropdownMenuItem asChild>
                      <Link to="/prescription" className="flex items-center">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Kê đơn thuốc
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {(user.role === 'Pharmacist' || user.role === 'Admin' || user.role === 'Manager') && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/prescription-management" className="flex items-center">
                          <UserCheck className="w-4 h-4 mr-2" />
                          Quản lý đơn thuốc
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Link to="/manage-orders" className="flex items-center">
                          <Package className="w-4 h-4 mr-2" />
                          Quản lý đơn hàng
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {(user.role === 'Admin' || user.role === 'Manager') && (
                    <DropdownMenuItem asChild>
                      <Link to="/management" className="flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        Quản lý
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/login">Đăng nhập</Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-4">
                  <Link to="/" className="text-gray-700 hover:text-primary">
                    Trang chủ
                  </Link>
                  <Link to="/products" className="text-gray-700 hover:text-primary">
                    Sản phẩm
                  </Link>

                  {user?.isLoggedIn && user.role === 'Customer' && (
                    <>
                      <Link to="/my-prescriptions" className="text-gray-700 hover:text-primary">
                        Đơn thuốc của tôi
                      </Link>
                      <Link to="/order-history" className="text-gray-700 hover:text-primary">
                        Lịch sử đơn hàng
                      </Link>
                    </>
                  )}

                  {user?.isLoggedIn && (user.role === 'Doctor' || user.role === 'Admin') && (
                    <Link to="/prescription" className="text-gray-700 hover:text-primary">
                      Kê đơn thuốc
                    </Link>
                  )}

                  {user?.isLoggedIn && (user.role === 'Pharmacist' || user.role === 'Admin' || user.role === 'Manager') && (
                    <>
                      <Link to="/prescription-management" className="text-gray-700 hover:text-primary">
                        Quản lý đơn thuốc
                      </Link>

                      <Link to="/manage-orders" className="text-gray-700 hover:text-primary">
                        Quản lý đơn hàng
                      </Link>
                    </>
                  )}

                  {user?.isLoggedIn && (user.role === 'Admin' || user.role === 'Manager') && (
                    <Link to="/management" className="text-gray-700 hover:text-primary">
                      Quản lý
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
