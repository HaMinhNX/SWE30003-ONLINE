// import React, { useState } from 'react';
// import { Button } from '../components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
// import { Input } from '../components/ui/input';
// import { Label } from '../components/ui/label';
// import { Badge } from '../components/ui/badge';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
// import { Textarea } from '../components/ui/textarea';
// import { 
//   Package, 
//   Store, 
//   Users, 
//   BarChart3, 
//   Plus, 
//   Edit, 
//   Trash2, 
//   ArrowLeft,
//   DollarSign,
//   TrendingUp,
//   ShoppingCart,
//   Eye,
//   Upload
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

// const Management = () => {
//   // State for managing data
//   const [products, setProducts] = useState([
//     { 
//       id: 'P001', 
//       name: 'Paracetamol 500mg', 
//       activeIngredient: 'Paracetamol',
//       price: 25000, 
//       stock: 50, 
//       category: 'Thuốc giảm đau',
//       form: 'Viên nén',
//       strength: '500mg',
//       packaging: 'Hộp 10 vỉ x 10 viên',
//       uses: 'Giảm đau, hạ sốt',
//       shortDescription: 'Thuốc giảm đau hiệu quả',
//       detailedDescription: 'Paracetamol 500mg là thuốc giảm đau, hạ sốt thông dụng...',
//       img: 'https://dummyimage.com/200x200/cccccc/000000&text=Paracetamol'
//     },
//     { 
//       id: 'P002', 
//       name: 'Vitamin C 1000mg', 
//       activeIngredient: 'Vitamin C',
//       price: 150000, 
//       stock: 25, 
//       category: 'Thực phẩm chức năng',
//       form: 'Viên sủi',
//       strength: '1000mg',
//       packaging: 'Hộp 2 tuýp x 10 viên',
//       uses: 'Tăng cường sức đề kháng',
//       shortDescription: 'Bổ sung vitamin C',
//       detailedDescription: 'Vitamin C 1000mg giúp tăng cường sức đề kháng...',
//       img: 'https://dummyimage.com/200x200/cccccc/000000&text=VitaminC'
//     }
//   ]);

//   const [stores, setStores] = useState([
//     { id: 1, name: 'Long Châu Quận 1', manager: 'Nguyễn Văn D', address: '123 Đường ABC, Quận 1, TP.HCM', revenue: 50000000 },
//     { id: 2, name: 'Long Châu Quận 2', manager: 'Trần Thị E', address: '456 Đường XYZ, Quận 2, TP.HCM', revenue: 35000000 },
//     { id: 3, name: 'Long Châu Quận 3', manager: 'Lê Văn F', address: '789 Đường DEF, Quận 3, TP.HCM', revenue: 42000000 }
//   ]);

//   const [employees, setEmployees] = useState([
//     { id: 1, name: 'Nguyễn Văn B', role: 'Doctor', store: 'Long Châu Quận 1', email: 'doctor@longchau.com' },
//     { id: 2, name: 'Nguyễn Văn D', role: 'Pharmacist', store: 'Long Châu Quận 1', email: 'pharmacist@longchau.com' },
//     { id: 3, name: 'Trần Thị E', role: 'Pharmacist', store: 'Long Châu Quận 2', email: 'pharmacist2@longchau.com' }
//   ]);

//   // Modal states
//   const [isAddProductOpen, setIsAddProductOpen] = useState(false);
//   const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
//   const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

//   // Enhanced form state for products with all required fields
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     activeIngredient: '',
//     price: '',
//     stock: '',
//     category: '',
//     form: '',
//     strength: '',
//     packaging: '',
//     uses: '',
//     shortDescription: '',
//     detailedDescription: '',
//     img: ''
//   });

//   const [newStore, setNewStore] = useState({
//     name: '',
//     manager: '',
//     address: ''
//   });

//   const [newEmployee, setNewEmployee] = useState({
//     name: '',
//     role: '',
//     store: '',
//     email: ''
//   });

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND'
//     }).format(price);
//   };
//   // Enhanced add product function with validation
//   const handleAddProduct = () => {
//     // Validate required fields
//     const requiredFields = ['name', 'activeIngredient', 'price', 'stock', 'category', 'form', 'strength', 'packaging', 'uses', 'shortDescription', 'detailedDescription'];
//     const missingFields = requiredFields.filter(field => !newProduct[field]);

//     if (missingFields.length > 0) {
//       alert(`Vui lòng điền đầy đủ các trường: ${missingFields.join(', ')}`);
//       return;
//     }

//     // Validate numeric fields
//     const price = parseInt(newProduct.price);
//     const stock = parseInt(newProduct.stock);

//     if (isNaN(price) || price <= 0) {
//       alert('Giá sản phẩm phải là số dương');
//       return;
//     }

//     if (isNaN(stock) || stock < 0) {
//       alert('Số lượng tồn kho phải là số không âm');
//       return;
//     }

//     const product = {
//       id: `P${Date.now()}`,
//       name: newProduct.name,
//       activeIngredient: newProduct.activeIngredient,
//       price: price,
//       stock: stock,
//       category: newProduct.category,
//       form: newProduct.form,
//       strength: newProduct.strength,
//       packaging: newProduct.packaging,
//       uses: newProduct.uses,
//       shortDescription: newProduct.shortDescription,
//       detailedDescription: newProduct.detailedDescription,
//       img: newProduct.img || `https://dummyimage.com/200x200/cccccc/000000&text=${encodeURIComponent(newProduct.name)}`
//     };

//     setProducts([...products, product]);
//     setNewProduct({
//       name: '', activeIngredient: '', price: '', stock: '', category: '',
//       form: '', strength: '', packaging: '', uses: '',
//       shortDescription: '', detailedDescription: '', img: ''
//     });
//     setIsAddProductOpen(false);
//     alert('Đã thêm sản phẩm thành công!');
//   };

//   const handleAddStore = () => {
//     if (newStore.name && newStore.manager && newStore.address) {
//       const store = {
//         id: Date.now(),
//         name: newStore.name,
//         manager: newStore.manager,
//         address: newStore.address,
//         revenue: 0
//       };
//       setStores([...stores, store]);
//       setNewStore({ name: '', manager: '', address: '' });
//       setIsAddStoreOpen(false);
//       alert('Đã thêm cửa hàng thành công!');
//     }
//   };

//   const handleAddEmployee = () => {
//     if (newEmployee.name && newEmployee.role && newEmployee.store && newEmployee.email) {
//       const employee = {
//         id: Date.now(),
//         name: newEmployee.name,
//         role: newEmployee.role,
//         store: newEmployee.store,
//         email: newEmployee.email
//       };
//       setEmployees([...employees, employee]);
//       setNewEmployee({ name: '', role: '', store: '', email: '' });
//       setIsAddEmployeeOpen(false);
//       alert('Đã thêm nhân viên thành công!');
//     }
//   };

//   // Delete functions
//   const deleteProduct = (id) => {
//     if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
//       setProducts(products.filter(p => p.id !== id));
//     }
//   };

//   const deleteEmployee = (id) => {
//     if (confirm('Bạn có chắc muốn xóa nhân viên này?')) {
//       setEmployees(employees.filter(e => e.id !== id));
//     }
//   };

//   const totalRevenue = stores.reduce((sum, store) => sum + store.revenue, 0);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <Button variant="ghost" asChild>
//             <Link to="/">
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Quay lại
//             </Link>
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Quản lý hệ thống</h1>
//             <p className="text-gray-600">Quản lý sản phẩm, cửa hàng và nhân viên</p>
//           </div>
//         </div>

//         {/* Statistics Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <Package className="h-8 w-8 text-blue-600" />
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
//                   <p className="text-2xl font-bold text-gray-900">{products.length}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <Store className="h-8 w-8 text-green-600" />
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">Số cửa hàng</p>
//                   <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <Users className="h-8 w-8 text-purple-600" />
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">Nhân viên</p>
//                   <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <DollarSign className="h-8 w-8 text-yellow-600" />
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">Doanh thu</p>
//                   <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//         <Tabs defaultValue="products" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="products">Sản phẩm</TabsTrigger>
//             <TabsTrigger value="stores">Cửa hàng</TabsTrigger>
//             <TabsTrigger value="employees">Nhân viên</TabsTrigger>
//             <TabsTrigger value="reports">Báo cáo</TabsTrigger>
//           </TabsList>

//           {/* Enhanced Product Management */}
//           <TabsContent value="products">
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="flex items-center gap-2">
//                     <Package className="w-5 h-5" />
//                     Quản lý sản phẩm
//                   </CardTitle>
//                   <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
//                     <DialogTrigger asChild>
//                       <Button className="bg-primary hover:bg-primary/90">
//                         <Plus className="w-4 h-4 mr-2" />
//                         Thêm sản phẩm
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//                       <DialogHeader>
//                         <DialogTitle>Thêm sản phẩm mới</DialogTitle>
//                       </DialogHeader>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <Label htmlFor="productName">Tên sản phẩm *</Label>
//                           <Input
//                             id="productName"
//                             value={newProduct.name}
//                             onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
//                             placeholder="Nhập tên sản phẩm"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="activeIngredient">Hoạt chất *</Label>
//                           <Input
//                             id="activeIngredient"
//                             value={newProduct.activeIngredient}
//                             onChange={(e) => setNewProduct({...newProduct, activeIngredient: e.target.value})}
//                             placeholder="Nhập hoạt chất"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="productPrice">Giá (VND) *</Label>
//                           <Input
//                             id="productPrice"
//                             type="number"
//                             value={newProduct.price}
//                             onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
//                             placeholder="Nhập giá sản phẩm"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="productStock">Số lượng tồn kho *</Label>
//                           <Input
//                             id="productStock"
//                             type="number"
//                             value={newProduct.stock}
//                             onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
//                             placeholder="Nhập số lượng"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="productCategory">Danh mục *</Label>
//                           <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Chọn danh mục" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="Thuốc giảm đau">Thuốc giảm đau</SelectItem>
//                               <SelectItem value="Thực phẩm chức năng">Thực phẩm chức năng</SelectItem>
//                               <SelectItem value="Sản phẩm y tế">Sản phẩm y tế</SelectItem>
//                               <SelectItem value="Thuốc ho">Thuốc ho</SelectItem>
//                               <SelectItem value="Chăm sóc da">Chăm sóc da</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div>
//                           <Label htmlFor="productForm">Dạng bào chế *</Label>
//                           <Input
//                             id="productForm"
//                             value={newProduct.form}
//                             onChange={(e) => setNewProduct({...newProduct, form: e.target.value})}
//                             placeholder="VD: Viên nén, Viên sủi"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="productStrength">Hàm lượng *</Label>
//                           <Input
//                             id="productStrength"
//                             value={newProduct.strength}
//                             onChange={(e) => setNewProduct({...newProduct, strength: e.target.value})}
//                             placeholder="VD: 500mg, 1000mg"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="productPackaging">Quy cách đóng gói *</Label>
//                           <Input
//                             id="productPackaging"
//                             value={newProduct.packaging}
//                             onChange={(e) => setNewProduct({...newProduct, packaging: e.target.value})}
//                             placeholder="VD: Hộp 10 vỉ x 10 viên"
//                           />
//                         </div>
//                         <div className="col-span-2">
//                           <Label htmlFor="productUses">Công dụng *</Label>
//                           <Input
//                             id="productUses"
//                             value={newProduct.uses}
//                             onChange={(e) => setNewProduct({...newProduct, uses: e.target.value})}
//                             placeholder="Nhập công dụng chính"
//                           />
//                         </div>
//                         <div className="col-span-2">
//                           <Label htmlFor="productShortDesc">Mô tả ngắn *</Label>
//                           <Input
//                             id="productShortDesc"
//                             value={newProduct.shortDescription}
//                             onChange={(e) => setNewProduct({...newProduct, shortDescription: e.target.value})}
//                             placeholder="Mô tả ngắn gọn về sản phẩm"
//                           />
//                         </div>
//                         <div className="col-span-2">
//                           <Label htmlFor="productDetailedDesc">Mô tả chi tiết *</Label>
//                           <Textarea
//                             id="productDetailedDesc"
//                             value={newProduct.detailedDescription}
//                             onChange={(e) => setNewProduct({...newProduct, detailedDescription: e.target.value})}
//                             placeholder="Mô tả chi tiết về sản phẩm, cách sử dụng..."
//                             rows={3}
//                           />
//                         </div>
//                         <div className="col-span-2">
//                           <Label htmlFor="productImg">URL hình ảnh</Label>
//                           <Input
//                             id="productImg"
//                             value={newProduct.img}
//                             onChange={(e) => setNewProduct({...newProduct, img: e.target.value})}
//                             placeholder="https://example.com/image.jpg"
//                           />
//                         </div>
//                         <div className="col-span-2">
//                           <Button onClick={handleAddProduct} className="w-full">
//                             Thêm sản phẩm
//                           </Button>
//                         </div>
//                       </div>
//                     </DialogContent>
//                   </Dialog>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {products.map((product) => (
//                     <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
//                       <div className="flex items-center gap-4">
//                         <img 
//                           src={product.img} 
//                           alt={product.name}
//                           className="w-16 h-16 object-cover rounded-lg"
//                           onError={(e) => {
//                             e.currentTarget.src = `https://dummyimage.com/200x200/cccccc/000000&text=${encodeURIComponent(product.name)}`;
//                           }}
//                         />
//                         <div className="flex-1">
//                           <div className="font-medium">{product.name}</div>
//                           <div className="text-sm text-gray-500">{product.activeIngredient} - {product.strength}</div>
//                           <div className="text-sm text-gray-500">{product.category} | {product.form}</div>
//                           <div className="flex items-center gap-4 mt-2">
//                             <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
//                             <Badge variant={product.stock > 20 ? "default" : "destructive"}>
//                               Tồn kho: {product.stock}
//                             </Badge>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm">
//                           <Edit className="w-4 h-4" />
//                         </Button>
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           className="text-red-600 hover:text-red-700"
//                           onClick={() => deleteProduct(product.id)}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="stores">
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="flex items-center gap-2">
//                     <Store className="w-5 h-5" />
//                     Quản lý cửa hàng
//                   </CardTitle>
//                   <Dialog open={isAddStoreOpen} onOpenChange={setIsAddStoreOpen}>
//                     <DialogTrigger asChild>
//                       <Button className="bg-primary hover:bg-primary/90">
//                         <Plus className="w-4 h-4 mr-2" />
//                         Thêm cửa hàng
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                       <DialogHeader>
//                         <DialogTitle>Thêm cửa hàng mới</DialogTitle>
//                       </DialogHeader>
//                       <div className="space-y-4">
//                         <div>
//                           <Label htmlFor="storeName">Tên cửa hàng</Label>
//                           <Input
//                             id="storeName"
//                             value={newStore.name}
//                             onChange={(e) => setNewStore({...newStore, name: e.target.value})}
//                             placeholder="Nhập tên cửa hàng"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="storeManager">Quản lý</Label>
//                           <Input
//                             id="storeManager"
//                             value={newStore.manager}
//                             onChange={(e) => setNewStore({...newStore, manager: e.target.value})}
//                             placeholder="Nhập tên quản lý"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="storeAddress">Địa chỉ</Label>
//                           <Input
//                             id="storeAddress"
//                             value={newStore.address}
//                             onChange={(e) => setNewStore({...newStore, address: e.target.value})}
//                             placeholder="Nhập địa chỉ cửa hàng"
//                           />
//                         </div>
//                         <Button onClick={handleAddStore} className="w-full">
//                           Thêm cửa hàng
//                         </Button>
//                       </div>
//                     </DialogContent>
//                   </Dialog>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {stores.map((store) => (
//                     <div key={store.id} className="p-4 border rounded-lg">
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="font-medium text-lg">{store.name}</h3>
//                         <Badge className="bg-green-100 text-green-800">
//                           {formatPrice(store.revenue)}
//                         </Badge>
//                       </div>
//                       <div className="text-sm text-gray-600 space-y-1">
//                         <p><span className="font-medium">Quản lý:</span> {store.manager}</p>
//                         <p><span className="font-medium">Địa chỉ:</span> {store.address}</p>
//                       </div>
//                       <div className="flex gap-2 mt-3">
//                         <Button variant="outline" size="sm" asChild>
//                           <Link to={`/store-detail/${store.id}`}>
//                             <Eye className="w-4 h-4 mr-1" />
//                             Xem chi tiết
//                           </Link>
//                         </Button>
//                         <Button variant="outline" size="sm">
//                           <Edit className="w-4 h-4 mr-1" />
//                           Sửa
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="employees">
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="w-5 h-5" />
//                     Quản lý nhân viên
//                   </CardTitle>
//                   <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
//                     <DialogTrigger asChild>
//                       <Button className="bg-primary hover:bg-primary/90">
//                         <Plus className="w-4 h-4 mr-2" />
//                         Thêm nhân viên
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                       <DialogHeader>
//                         <DialogTitle>Thêm nhân viên mới</DialogTitle>
//                       </DialogHeader>
//                       <div className="space-y-4">
//                         <div>
//                           <Label htmlFor="employeeName">Tên nhân viên</Label>
//                           <Input
//                             id="employeeName"
//                             value={newEmployee.name}
//                             onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
//                             placeholder="Nhập tên nhân viên"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="employeeRole">Vai trò</Label>
//                           <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee({...newEmployee, role: value})}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Chọn vai trò" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="Doctor">Bác sĩ</SelectItem>
//                               <SelectItem value="Pharmacist">Dược sĩ</SelectItem>
//                               <SelectItem value="Manager">Quản lý</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div>
//                           <Label htmlFor="employeeStore">Cửa hàng</Label>
//                           <Select value={newEmployee.store} onValueChange={(value) => setNewEmployee({...newEmployee, store: value})}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Chọn cửa hàng" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {stores.map((store) => (
//                                 <SelectItem key={store.id} value={store.name}>
//                                   {store.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div>
//                           <Label htmlFor="employeeEmail">Email</Label>
//                           <Input
//                             id="employeeEmail"
//                             type="email"
//                             value={newEmployee.email}
//                             onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
//                             placeholder="Nhập email"
//                           />
//                         </div>
//                         <Button onClick={handleAddEmployee} className="w-full">
//                           Thêm nhân viên
//                         </Button>
//                       </div>
//                     </DialogContent>
//                   </Dialog>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {employees.map((employee) => (
//                     <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
//                       <div className="flex-1">
//                         <div className="font-medium">{employee.name}</div>
//                         <div className="text-sm text-gray-500">{employee.email}</div>
//                         <div className="flex items-center gap-4 mt-2">
//                           <Badge variant="outline">{employee.role}</Badge>
//                           <span className="text-sm text-gray-600">{employee.store}</span>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm">
//                           <Edit className="w-4 h-4" />
//                         </Button>
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           className="text-red-600 hover:text-red-700"
//                           onClick={() => deleteEmployee(employee.id)}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="reports">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <TrendingUp className="w-5 h-5" />
//                     Doanh thu theo cửa hàng
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {stores.map((store) => (
//                       <div key={store.id} className="flex items-center justify-between">
//                         <Link 
//                           to={`/store-detail/${store.id}`}
//                           className="font-medium hover:text-primary cursor-pointer"
//                         >
//                           {store.name}
//                         </Link>
//                         <span className="text-primary font-bold">{formatPrice(store.revenue)}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <BarChart3 className="w-5 h-5" />
//                     Tồn kho sản phẩm
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {products.map((product) => (
//                       <div key={product.id} className="flex items-center justify-between">
//                         <span className="font-medium">{product.name}</span>
//                         <Badge variant={product.stock > 20 ? "default" : "destructive"}>
//                           {product.stock} sản phẩm
//                         </Badge>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Management;


// import React, { useState } from 'react';
// import { Button } from '../components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
// import { Input } from '../components/ui/input';
// import { Label } from '../components/ui/label';
// import { Badge } from '../components/ui/badge';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
// import { Textarea } from '../components/ui/textarea';
// import { 
//   Package, 
//   Store, 
//   Users, 
//   BarChart3, 
//   Plus, 
//   Edit, 
//   Trash2, 
//   ArrowLeft,
//   DollarSign,
//   TrendingUp,
//   ShoppingCart,
//   Eye,
//   Upload
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

// const Management = () => {
//   // State for managing data
//   const [products, setProducts] = useState([
//     { 
//       id: 'P001', 
//       name: 'Paracetamol 500mg', 
//       activeIngredient: 'Paracetamol',
//       price: 25000, 
//       stock: 50, 
//       category: 'Thuốc giảm đau',
//       form: 'Viên nén',
//       strength: '500mg',
//       packaging: 'Hộp 10 vỉ x 10 viên',
//       uses: 'Giảm đau, hạ sốt',
//       shortDescription: 'Thuốc giảm đau hiệu quả',
//       detailedDescription: 'Paracetamol 500mg là thuốc giảm đau, hạ sốt thông dụng...',
//       img: 'https://dummyimage.com/200x200/cccccc/000000&text=Paracetamol'
//     },
//     { 
//       id: 'P002', 
//       name: 'Vitamin C 1000mg', 
//       activeIngredient: 'Vitamin C',
//       price: 150000, 
//       stock: 25, 
//       category: 'Thực phẩm chức năng',
//       form: 'Viên sủi',
//       strength: '1000mg',
//       packaging: 'Hộp 2 tuýp x 10 viên',
//       uses: 'Tăng cường sức đề kháng',
//       shortDescription: 'Bổ sung vitamin C',
//       detailedDescription: 'Vitamin C 1000mg giúp tăng cường sức đề kháng...',
//       img: 'https://dummyimage.com/200x200/cccccc/000000&text=VitaminC'
//     }
//   ]);

//   const [stores, setStores] = useState([
//     { id: 1, name: 'Long Châu Quận 1', manager: 'Nguyễn Văn D', address: '123 Đường ABC, Quận 1, TP.HCM', revenue: 50000000 },
//     { id: 2, name: 'Long Châu Quận 2', manager: 'Trần Thị E', address: '456 Đường XYZ, Quận 2, TP.HCM', revenue: 35000000 },
//     { id: 3, name: 'Long Châu Quận 3', manager: 'Lê Văn F', address: '789 Đường DEF, Quận 3, TP.HCM', revenue: 42000000 }
//   ]);

//   const [employees, setEmployees] = useState([
//     { id: 1, name: 'Nguyễn Văn B', role: 'Doctor', store: 'Long Châu Quận 1', email: 'doctor@longchau.com' },
//     { id: 2, name: 'Nguyễn Văn D', role: 'Pharmacist', store: 'Long Châu Quận 1', email: 'pharmacist@longchau.com' },
//     { id: 3, name: 'Trần Thị E', role: 'Pharmacist', store: 'Long Châu Quận 2', email: 'pharmacist2@longchau.com' }
//   ]);

//   // Modal states
//   const [isAddProductOpen, setIsAddProductOpen] = useState(false);
//   const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
//   const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

//   // Enhanced form state for products with all required fields
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     activeIngredient: '',
//     price: '',
//     stock: '',
//     category: '',
//     form: '',
//     strength: '',
//     packaging: '',
//     uses: '',
//     shortDescription: '',
//     detailedDescription: '',
//     img: ''
//   });

//   const [newStore, setNewStore] = useState({
//     name: '',
//     manager: '',
//     address: ''
//   });

//   const [newEmployee, setNewEmployee] = useState({
//     name: '',
//     role: '',
//     store: '',
//     email: ''
//   });

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND'
//     }).format(price);
//   };
//   // Enhanced add product function with validation
//   const handleAddProduct = () => {
//     // Validate required fields
//     const requiredFields = ['name', 'activeIngredient', 'price', 'stock', 'category', 'form', 'strength', 'packaging', 'uses', 'shortDescription', 'detailedDescription'];
//     const missingFields = requiredFields.filter(field => !newProduct[field]);

//     if (missingFields.length > 0) {
//       alert(`Vui lòng điền đầy đủ các trường: ${missingFields.join(', ')}`);
//       return;
//     }

//     // Validate numeric fields
//     const price = parseInt(newProduct.price);
//     const stock = parseInt(newProduct.stock);

//     if (isNaN(price) || price <= 0) {
//       alert('Giá sản phẩm phải là số dương');
//       return;
//     }

//     if (isNaN(stock) || stock < 0) {
//       alert('Số lượng tồn kho phải là số không âm');
//       return;
//     }

//     const product = {
//       id: `P${Date.now()}`,
//       name: newProduct.name,
//       activeIngredient: newProduct.activeIngredient,
//       price: price,
//       stock: stock,
//       category: newProduct.category,
//       form: newProduct.form,
//       strength: newProduct.strength,
//       packaging: newProduct.packaging,
//       uses: newProduct.uses,
//       shortDescription: newProduct.shortDescription,
//       detailedDescription: newProduct.detailedDescription,
//       img: newProduct.img || `https://dummyimage.com/200x200/cccccc/000000&text=${encodeURIComponent(newProduct.name)}`
//     };

//     setProducts([...products, product]);
//     setNewProduct({
//       name: '', activeIngredient: '', price: '', stock: '', category: '',
//       form: '', strength: '', packaging: '', uses: '',
//       shortDescription: '', detailedDescription: '', img: ''
//     });
//     setIsAddProductOpen(false);
//     alert('Đã thêm sản phẩm thành công!');
//   };

//   const handleAddStore = () => {
//     if (newStore.name && newStore.manager && newStore.address) {
//       const store = {
//         id: Date.now(),
//         name: newStore.name,
//         manager: newStore.manager,
//         address: newStore.address,
//         revenue: 0
//       };
//       setStores([...stores, store]);
//       setNewStore({ name: '', manager: '', address: '' });
//       setIsAddStoreOpen(false);
//       alert('Đã thêm cửa hàng thành công!');
//     }
//   };

//   const handleAddEmployee = () => {
//     if (newEmployee.name && newEmployee.role && newEmployee.store && newEmployee.email) {
//       const employee = {
//         id: Date.now(),
//         name: newEmployee.name,
//         role: newEmployee.role,
//         store: newEmployee.store,
//         email: newEmployee.email
//       };
//       setEmployees([...employees, employee]);
//       setNewEmployee({ name: '', role: '', store: '', email: '' });
//       setIsAddEmployeeOpen(false);
//       alert('Đã thêm nhân viên thành công!');
//     }
//   };

//   // Delete functions
//   const deleteProduct = (id) => {
//     if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
//       setProducts(products.filter(p => p.id !== id));
//     }
//   };

//   const deleteEmployee = (id) => {
//     if (confirm('Bạn có chắc muốn xóa nhân viên này?')) {
//       setEmployees(employees.filter(e => e.id !== id));
//     }
//   };

//   const totalRevenue = stores.reduce((sum, store) => sum + store.revenue, 0);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <Button variant="ghost" asChild>
//             <Link to="/">
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Quay lại
//             </Link>
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Quản lý hệ thống</h1>
//             <p className="text-gray-600">Quản lý sản phẩm, cửa hàng và nhân viên</p>
//           </div>
//         </div>

//         {/* Statistics Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <Package className="h-8 w-8 text-blue-600" />
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
//                   <p className="text-2xl font-bold text-gray-900">{products.length}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <Store className="h-8 w-8 text-green-600" />
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">Số cửa hàng</p>
//                   <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <Users className="h-8 w-8 text-purple-600" />
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">Nhân viên</p>
//                   <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <DollarSign className="h-8 w-8 text-yellow-600" />
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">Doanh thu</p>
//                   <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//         <Tabs defaultValue="products" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="products">Sản phẩm</TabsTrigger>
//             <TabsTrigger value="stores">Cửa hàng</TabsTrigger>
//             <TabsTrigger value="employees">Nhân viên</TabsTrigger>
//             <TabsTrigger value="reports">Báo cáo</TabsTrigger>
//           </TabsList>

//           {/* Enhanced Product Management */}
//           <TabsContent value="products">
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="flex items-center gap-2">
//                     <Package className="w-5 h-5" />
//                     Quản lý sản phẩm
//                   </CardTitle>
//                   <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
//                     <DialogTrigger asChild>
//                       <Button className="bg-primary hover:bg-primary/90">
//                         <Plus className="w-4 h-4 mr-2" />
//                         Thêm sản phẩm
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
//                       <DialogHeader>
//                         <DialogTitle>Thêm sản phẩm mới</DialogTitle>
//                       </DialogHeader>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <Label htmlFor="productName">Tên sản phẩm *</Label>
//                           <Input
//                             id="productName"
//                             value={newProduct.name}
//                             onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
//                             placeholder="Nhập tên sản phẩm"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="activeIngredient">Hoạt chất *</Label>
//                           <Input
//                             id="activeIngredient"
//                             value={newProduct.activeIngredient}
//                             onChange={(e) => setNewProduct({...newProduct, activeIngredient: e.target.value})}
//                             placeholder="Nhập hoạt chất"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="productPrice">Giá (VND) *</Label>
//                           <Input
//                             id="productPrice"
//                             type="number"
//                             value={newProduct.price}
//                             onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
//                             placeholder="Nhập giá sản phẩm"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="productStock">Số lượng tồn kho *</Label>
//                           <Input
//                             id="productStock"
//                             type="number"
//                             value={newProduct.stock}
//                             onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
//                             placeholder="Nhập số lượng"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="productCategory">Danh mục *</Label>
//                           <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Chọn danh mục" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="Thuốc giảm đau">Thuốc giảm đau</SelectItem>
//                               <SelectItem value="Thực phẩm chức năng">Thực phẩm chức năng</SelectItem>
//                               <SelectItem value="Sản phẩm y tế">Sản phẩm y tế</SelectItem>
//                               <SelectItem value="Thuốc ho">Thuốc ho</SelectItem>
//                               <SelectItem value="Chăm sóc da">Chăm sóc da</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div>
//                           <Label htmlFor="productForm">Dạng bào chế *</Label>
//                           <Input
//                             id="productForm"
//                             value={newProduct.form}
//                             onChange={(e) => setNewProduct({...newProduct, form: e.target.value})}
//                             placeholder="VD: Viên nén, Viên sủi"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="productStrength">Hàm lượng *</Label>
//                           <Input
//                             id="productStrength"
//                             value={newProduct.strength}
//                             onChange={(e) => setNewProduct({...newProduct, strength: e.target.value})}
//                             placeholder="VD: 500mg, 1000mg"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="productPackaging">Quy cách đóng gói *</Label>
//                           <Input
//                             id="productPackaging"
//                             value={newProduct.packaging}
//                             onChange={(e) => setNewProduct({...newProduct, packaging: e.target.value})}
//                             placeholder="VD: Hộp 10 vỉ x 10 viên"
//                           />
//                         </div>
//                         <div className="col-span-2">
//                           <Label htmlFor="productUses">Công dụng *</Label>
//                           <Input
//                             id="productUses"
//                             value={newProduct.uses}
//                             onChange={(e) => setNewProduct({...newProduct, uses: e.target.value})}
//                             placeholder="Nhập công dụng chính"
//                           />
//                         </div>
//                         <div className="col-span-2">
//                           <Label htmlFor="productShortDesc">Mô tả ngắn *</Label>
//                           <Input
//                             id="productShortDesc"
//                             value={newProduct.shortDescription}
//                             onChange={(e) => setNewProduct({...newProduct, shortDescription: e.target.value})}
//                             placeholder="Mô tả ngắn gọn về sản phẩm"
//                           />
//                         </div>
//                         <div className="col-span-2">
//                           <Label htmlFor="productDetailedDesc">Mô tả chi tiết *</Label>
//                           <Textarea
//                             id="productDetailedDesc"
//                             value={newProduct.detailedDescription}
//                             onChange={(e) => setNewProduct({...newProduct, detailedDescription: e.target.value})}
//                             placeholder="Mô tả chi tiết về sản phẩm, cách sử dụng..."
//                             rows={3}
//                           />
//                         </div>
//                         <div className="col-span-2">
//                           <Label htmlFor="productImg">URL hình ảnh</Label>
//                           <Input
//                             id="productImg"
//                             value={newProduct.img}
//                             onChange={(e) => setNewProduct({...newProduct, img: e.target.value})}
//                             placeholder="https://example.com/image.jpg"
//                           />
//                         </div>
//                         <div className="col-span-2">
//                           <Button onClick={handleAddProduct} className="w-full">
//                             Thêm sản phẩm
//                           </Button>
//                         </div>
//                       </div>
//                     </DialogContent>
//                   </Dialog>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {products.map((product) => (
//                     <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
//                       <div className="flex items-center gap-4">
//                         <img 
//                           src={product.img} 
//                           alt={product.name}
//                           className="w-16 h-16 object-cover rounded-lg"
//                           onError={(e) => {
//                             e.currentTarget.src = `https://dummyimage.com/200x200/cccccc/000000&text=${encodeURIComponent(product.name)}`;
//                           }}
//                         />
//                         <div className="flex-1">
//                           <div className="font-medium">{product.name}</div>
//                           <div className="text-sm text-gray-500">{product.activeIngredient} - {product.strength}</div>
//                           <div className="text-sm text-gray-500">{product.category} | {product.form}</div>
//                           <div className="flex items-center gap-4 mt-2">
//                             <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
//                             <Badge variant={product.stock > 20 ? "default" : "destructive"}>
//                               Tồn kho: {product.stock}
//                             </Badge>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm">
//                           <Edit className="w-4 h-4" />
//                         </Button>
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           className="text-red-600 hover:text-red-700"
//                           onClick={() => deleteProduct(product.id)}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="stores">
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="flex items-center gap-2 ">
//                     <Store className="w-5 h-5" />
//                     Quản lý cửa hàng
//                   </CardTitle>
//                   <Dialog open={isAddStoreOpen} onOpenChange={setIsAddStoreOpen}>
//                     <DialogTrigger asChild>
//                       <Button className="bg-primary hover:bg-primary/90 ">
//                         <Plus className="w-4 h-4 mr-2" />
//                         Thêm cửa hàng
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="bg-white">
//                       <DialogHeader>
//                         <DialogTitle>Thêm cửa hàng mới</DialogTitle>
//                       </DialogHeader>
//                       <div className="space-y-4">
//                         <div>
//                           <Label htmlFor="storeName">Tên cửa hàng</Label>
//                           <Input
//                             id="storeName"
//                             value={newStore.name}
//                             onChange={(e) => setNewStore({...newStore, name: e.target.value})}
//                             placeholder="Nhập tên cửa hàng"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="storeManager">Quản lý</Label>
//                           <Input
//                             id="storeManager"
//                             value={newStore.manager}
//                             onChange={(e) => setNewStore({...newStore, manager: e.target.value})}
//                             placeholder="Nhập tên quản lý"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="storeAddress">Địa chỉ</Label>
//                           <Input
//                             id="storeAddress"
//                             value={newStore.address}
//                             onChange={(e) => setNewStore({...newStore, address: e.target.value})}
//                             placeholder="Nhập địa chỉ cửa hàng"
//                           />
//                         </div>
//                         <Button onClick={handleAddStore} className="w-full">
//                           Thêm cửa hàng
//                         </Button>
//                       </div>
//                     </DialogContent>
//                   </Dialog>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {stores.map((store) => (
//                     <div key={store.id} className="p-4 border rounded-lg">
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="font-medium text-lg">{store.name}</h3>
//                         <Badge className="bg-green-100 text-green-800">
//                           {formatPrice(store.revenue)}
//                         </Badge>
//                       </div>
//                       <div className="text-sm text-gray-600 space-y-1">
//                         <p><span className="font-medium">Quản lý:</span> {store.manager}</p>
//                         <p><span className="font-medium">Địa chỉ:</span> {store.address}</p>
//                       </div>
//                       <div className="flex gap-2 mt-3">
//                         <Button variant="outline" size="sm" asChild>
//                           <Link to={`/store-detail/${store.id}`}>
//                             <Eye className="w-4 h-4 mr-1" />
//                             Xem chi tiết
//                           </Link>
//                         </Button>
//                         <Button variant="outline" size="sm">
//                           <Edit className="w-4 h-4 mr-1" />
//                           Sửa
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="employees">
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="w-5 h-5" />
//                     Quản lý nhân viên
//                   </CardTitle>
//                   <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
//                     <DialogTrigger asChild>
//                       <Button className="bg-primary hover:bg-primary/90">
//                         <Plus className="w-4 h-4 mr-2" />
//                         Thêm nhân viên
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="bg-white">
//                       <DialogHeader>
//                         <DialogTitle>Thêm nhân viên mới</DialogTitle>
//                       </DialogHeader>
//                       <div className="space-y-4">
//                         <div>
//                           <Label htmlFor="employeeName">Tên nhân viên</Label>
//                           <Input
//                             id="employeeName"
//                             value={newEmployee.name}
//                             onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
//                             placeholder="Nhập tên nhân viên"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="employeeRole">Vai trò</Label>
//                           <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee({...newEmployee, role: value})}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Chọn vai trò" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="Doctor">Bác sĩ</SelectItem>
//                               <SelectItem value="Pharmacist">Dược sĩ</SelectItem>
//                               <SelectItem value="Manager">Quản lý</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div>
//                           <Label htmlFor="employeeStore">Cửa hàng</Label>
//                           <Select value={newEmployee.store} onValueChange={(value) => setNewEmployee({...newEmployee, store: value})}>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Chọn cửa hàng" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {stores.map((store) => (
//                                 <SelectItem key={store.id} value={store.name}>
//                                   {store.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div>
//                           <Label htmlFor="employeeEmail">Email</Label>
//                           <Input
//                             id="employeeEmail"
//                             type="email"
//                             value={newEmployee.email}
//                             onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
//                             placeholder="Nhập email"
//                           />
//                         </div>
//                         <Button onClick={handleAddEmployee} className="w-full">
//                           Thêm nhân viên
//                         </Button>
//                       </div>
//                     </DialogContent>
//                   </Dialog>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {employees.map((employee) => (
//                     <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
//                       <div className="flex-1">
//                         <div className="font-medium">{employee.name}</div>
//                         <div className="text-sm text-gray-500">{employee.email}</div>
//                         <div className="flex items-center gap-4 mt-2">
//                           <Badge variant="outline">{employee.role}</Badge>
//                           <span className="text-sm text-gray-600">{employee.store}</span>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm">
//                           <Edit className="w-4 h-4" />
//                         </Button>
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           className="text-red-600 hover:text-red-700"
//                           onClick={() => deleteEmployee(employee.id)}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="reports">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <TrendingUp className="w-5 h-5" />
//                     Doanh thu theo cửa hàng
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {stores.map((store) => (
//                       <div key={store.id} className="flex items-center justify-between">
//                         <Link 
//                           to={`/store-detail/${store.id}`}
//                           className="font-medium hover:text-primary cursor-pointer"
//                         >
//                           {store.name}
//                         </Link>
//                         <span className="text-primary font-bold">{formatPrice(store.revenue)}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <BarChart3 className="w-5 h-5" />
//                     Tồn kho sản phẩm
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {products.map((product) => (
//                       <div key={product.id} className="flex items-center justify-between">
//                         <span className="font-medium">{product.name}</span>
//                         <Badge variant={product.stock > 20 ? "default" : "destructive"}>
//                           {product.stock} sản phẩm
//                         </Badge>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Management;


import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { 
  Package, 
  Store, 
  Users, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Eye,
  Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Management = () => {
  // State for managing data
  
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [employees, setEmployees] = useState([]);


  useEffect(() => {
    fetch('http://localhost:5000/api/products')
    .then(res => res.json())
    .then(data => setProducts(data))
    .catch(err => {
      console.error('Lỗi tải sản phẩm:', err);
      alert('Không thể tải sản phẩm');
    });

    fetch('http://localhost:5000/api/stores')
    .then(res => res.json())
    .then(data => setStores(data))
    .catch(err => {
      console.error('Lỗi tải cửa hàng:', err);
      alert('Không thể tải cửa hàng');
    });

    fetch('http://localhost:5000/api/employees')
    .then(res => res.json())
    .then(data => setEmployees(data))
    .catch(err => {
      console.error('Lỗi tải nhân viên:', err);
      alert('Không thể tải nhân viên');
    });
  }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  Promise.all([
    fetch('http://localhost:5000/api/products'),
    fetch('http://localhost:5000/api/stores'),
    fetch('http://localhost:5000/api/employees')
  ])
  .then(([productsRes, storesRes, employeesRes]) => Promise.all([productsRes.json(), storesRes.json(), employeesRes.json()]))
  .then(([productsData, storesData, employeesData]) => {
    setProducts(productsData);
    setStores(storesData);
    setEmployees(employeesData);
    setLoading(false);  // Khi dữ liệu đã tải xong, set loading = false
  })
  .catch(err => {
    console.error('Lỗi tải dữ liệu:', err);
    alert('Không thể tải dữ liệu');
    setLoading(false);
  });
}, []);



  // Modal states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isEditStoreOpen, setIsEditStoreOpen] = useState(false);





  // Enhanced form state for products with all required fields
  const [newProduct, setNewProduct] = useState({
    name: '',
    activeIngredient: '',
    price: '',
    stock: '',
    category: '',
    form: '',
    strength: '',
    packaging: '',
    uses: '',
    shortDescription: '',
    detailedDescription: '',
    img: ''
  });

  const [newStore, setNewStore] = useState({
    name: '',
    manager: '',
    address: ''
  });

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    store: '',
    email: ''
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  // Enhanced add product function with validation
  const handleAddProduct = () => {
    // Validate required fields
    const requiredFields = ['name', 'activeIngredient', 'price', 'stock', 'category', 'form', 'strength', 'packaging', 'uses', 'shortDescription', 'detailedDescription'];
    const missingFields = requiredFields.filter(field => !newProduct[field]);

    if (missingFields.length > 0) {
      alert(`Vui lòng điền đầy đủ các trường: ${missingFields.join(', ')}`);
      return;
    }

    // Validate numeric fields
    const price = parseInt(newProduct.price);
    const stock = parseInt(newProduct.stock);

    if (isNaN(price) || price <= 0) {
      alert('Giá sản phẩm phải là số dương');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      alert('Số lượng tồn kho phải là số không âm');
      return;
    }

    const product = {
      id: `P${Date.now()}`,
      name: newProduct.name,
      activeIngredient: newProduct.activeIngredient,
      price: price,
      stock: stock,
      category: newProduct.category,
      form: newProduct.form,
      strength: newProduct.strength,
      packaging: newProduct.packaging,
      uses: newProduct.uses,
      shortDescription: newProduct.shortDescription,
      detailedDescription: newProduct.detailedDescription,
      img: newProduct.img || `https://dummyimage.com/200x200/cccccc/000000&text=${encodeURIComponent(newProduct.name)}`
    };
    fetch('http://localhost:5000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
    })
    .then(res => res.json())
    .then(added => {
    setProducts(prev => [...prev, added]);
    setNewProduct({ name: '', activeIngredient: '', price: '', stock: '', category: '', form: '', strength: '', packaging: '', uses: '', shortDescription: '', detailedDescription: '', img: '' });
    setIsAddProductOpen(false);
    alert('Đã thêm sản phẩm thành công!');
    })
    .catch(() => alert('Không thể thêm sản phẩm'));
  };

  const handleAddStore = () => {
  if (!newStore.name || !newStore.manager || !newStore.address) {
    alert('Vui lòng nhập đầy đủ thông tin cửa hàng');
    return;
  }

  fetch('http://localhost:5000/api/stores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newStore)
  })
  .then(res => res.json())
  .then(added => {
    setStores(prev => [...prev, added]);
    setNewStore({ name: '', manager: '', address: '' });
    setIsAddStoreOpen(false);
    alert('Đã thêm cửa hàng thành công');
  })
  .catch(() => alert('Không thể thêm cửa hàng'));
};


  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.role || !newEmployee.store || !newEmployee.email) {
      alert('Vui lòng nhập đầy đủ thông tin nhân viên');
      return;
    }

    fetch('http://localhost:5000/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee)
    })
    .then(res => res.json())
    .then(added => {
      setEmployees(prev => [...prev, added]);
      setNewEmployee({ name: '', role: '', store: '', email: '' });
      setIsAddEmployeeOpen(false);
      alert('Đã thêm nhân viên thành công');
    })
    .catch(() => alert('Không thể thêm nhân viên'));
  };
  

  // Delete functions
  const deleteProduct = (id) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error();
      setProducts(prev => prev.filter(p => p.id !== id));
    })
    .catch(() => alert('Không thể xoá sản phẩm'));
  };


  const deleteEmployee = (id) => {
    if (!confirm('Bạn có chắc muốn xóa nhân viên này?')) return;
    fetch(`http://localhost:5000/api/employees/${id}`, { method: 'DELETE' })
      .then(() => setEmployees(prev => prev.filter(e => e.id !== id)));
  };


    const deleteStore = (id) => {
    if (!confirm('Bạn có chắc muốn xóa cửa hàng này?')) return;
    fetch(`http://localhost:5000/api/stores/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error();
        setStores(prev => prev.filter(s => s.id !== id));
      })
      .catch(() => alert('Không thể xoá cửa hàng'));
  };

  const updateProduct = (updatedProduct) => {

    if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.stock) {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm');
      return;
    }

    fetch(`http://localhost:5000/api/products/${updatedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    })
      .then(res => res.json())
      .then(() => {
        setProducts(prev =>
          prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        setIsEditProductOpen(false);
        setEditingProduct(null);
        alert('Đã cập nhật sản phẩm');
      })
      .catch(() => alert('Không thể cập nhật sản phẩm'));
  };

  const updateStore = (updatedStore) => {
    fetch(`http://localhost:5000/api/stores/${updatedStore.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedStore),
    })
      .then(res => res.json())
      .then(() => {
        setStores(prev =>
          prev.map(s => (s.id === updatedStore.id ? updatedStore : s))
        );
        setIsEditStoreOpen(false);
        setEditingStore(null);
        alert('Đã cập nhật cửa hàng');
      })
      .catch(() => alert('Không thể cập nhật cửa hàng'));
  };

  const updateEmployee = (updatedEmployee) => {
    fetch(`http://localhost:5000/api/employees/${updatedEmployee.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEmployee),
    })
      .then(res => res.json())
      .then(() => {
        setEmployees(prev =>
          prev.map(e => (e.id === updatedEmployee.id ? updatedEmployee : e))
        );
        setIsEditEmployeeOpen(false);
        setEditingEmployee(null);
        alert('Đã cập nhật nhân viên');
      })
      .catch(() => alert('Không thể cập nhật nhân viên'));
  };



  const totalRevenue = stores.reduce((sum, store) => sum + store.revenue, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý hệ thống</h1>
            <p className="text-gray-600">Quản lý sản phẩm, cửa hàng và nhân viên</p>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Store className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Số cửa hàng</p>
                  <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Nhân viên</p>
                  <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="stores">Cửa hàng</TabsTrigger>
            <TabsTrigger value="employees">Nhân viên</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          </TabsList>

          {/* Enhanced Product Management */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Quản lý sản phẩm
                  </CardTitle>
                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm sản phẩm
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
                      <DialogHeader>
                        <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="productName">Tên sản phẩm *</Label>
                          <Input
                            id="productName"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                            placeholder="Nhập tên sản phẩm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="activeIngredient">Hoạt chất *</Label>
                          <Input
                            id="activeIngredient"
                            value={newProduct.activeIngredient}
                            onChange={(e) => setNewProduct({...newProduct, activeIngredient: e.target.value})}
                            placeholder="Nhập hoạt chất"
                          />
                        </div>
                        <div>
                          <Label htmlFor="productPrice">Giá (VND) *</Label>
                          <Input
                            id="productPrice"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                            placeholder="Nhập giá sản phẩm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="productStock">Số lượng tồn kho *</Label>
                          <Input
                            id="productStock"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                            placeholder="Nhập số lượng"
                          />
                        </div>
                        <div>
                          <Label htmlFor="productCategory">Danh mục *</Label>
                          <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Thuốc giảm đau">Thuốc giảm đau</SelectItem>
                              <SelectItem value="Thực phẩm chức năng">Thực phẩm chức năng</SelectItem>
                              <SelectItem value="Sản phẩm y tế">Sản phẩm y tế</SelectItem>
                              <SelectItem value="Thuốc ho">Thuốc ho</SelectItem>
                              <SelectItem value="Chăm sóc da">Chăm sóc da</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="productForm">Dạng bào chế *</Label>
                          <Input
                            id="productForm"
                            value={newProduct.form}
                            onChange={(e) => setNewProduct({...newProduct, form: e.target.value})}
                            placeholder="VD: Viên nén, Viên sủi"
                          />
                        </div>
                        <div>
                          <Label htmlFor="productStrength">Hàm lượng *</Label>
                          <Input
                            id="productStrength"
                            value={newProduct.strength}
                            onChange={(e) => setNewProduct({...newProduct, strength: e.target.value})}
                            placeholder="VD: 500mg, 1000mg"
                          />
                        </div>
                        <div>
                          <Label htmlFor="productPackaging">Quy cách đóng gói *</Label>
                          <Input
                            id="productPackaging"
                            value={newProduct.packaging}
                            onChange={(e) => setNewProduct({...newProduct, packaging: e.target.value})}
                            placeholder="VD: Hộp 10 vỉ x 10 viên"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="productUses">Công dụng *</Label>
                          <Input
                            id="productUses"
                            value={newProduct.uses}
                            onChange={(e) => setNewProduct({...newProduct, uses: e.target.value})}
                            placeholder="Nhập công dụng chính"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="productShortDesc">Mô tả ngắn *</Label>
                          <Input
                            id="productShortDesc"
                            value={newProduct.shortDescription}
                            onChange={(e) => setNewProduct({...newProduct, shortDescription: e.target.value})}
                            placeholder="Mô tả ngắn gọn về sản phẩm"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="productDetailedDesc">Mô tả chi tiết *</Label>
                          <Textarea
                            id="productDetailedDesc"
                            value={newProduct.detailedDescription}
                            onChange={(e) => setNewProduct({...newProduct, detailedDescription: e.target.value})}
                            placeholder="Mô tả chi tiết về sản phẩm, cách sử dụng..."
                            rows={3}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="productImg">URL hình ảnh</Label>
                          <Input
                            id="productImg"
                            value={newProduct.img}
                            onChange={(e) => setNewProduct({...newProduct, img: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div className="col-span-2">
                          <Button onClick={handleAddProduct} className="w-full">
                            Thêm sản phẩm
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              < >
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://dummyimage.com/200x200/cccccc/000000&text=${encodeURIComponent(product.name)}`;
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.activeIngredient} - {product.strength}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.category} | {product.form}
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-lg font-bold text-primary">
                              {formatPrice(product.price)}
                            </span>
                            <Badge variant={product.stock > 20 ? 'default' : 'destructive'}>
                              Tồn kho: {product.stock}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsEditProductOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Sửa sản phẩm</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={(e) => {
                                e.preventDefault();
                                updateProduct(editingProduct);
                              }}>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="productName">Tên sản phẩm</Label>
                                    <Input
                                      id="productName"
                                      value={editingProduct?.name || ''}
                                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                      placeholder="Nhập tên sản phẩm"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="productPrice">Giá</Label>
                                    <Input
                                      id="productPrice"
                                      type="number"
                                      value={editingProduct?.price || ''}
                                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                      placeholder="Nhập giá sản phẩm"
                                    />
                                  </div>
                                  <Button type="submit" className="w-full">
                                    Cập nhật sản phẩm
                                  </Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </  >
            </Card>
            
          </TabsContent>

          <TabsContent value="stores">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 ">
                    <Store className="w-5 h-5" />
                    Quản lý cửa hàng
                  </CardTitle>
                  <Dialog open={isAddStoreOpen} onOpenChange={setIsAddStoreOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 ">
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm cửa hàng
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Thêm cửa hàng mới</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="storeName">Tên cửa hàng</Label>
                          <Input
                            id="storeName"
                            value={newStore.name}
                            onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                            placeholder="Nhập tên cửa hàng"
                          />
                        </div>
                        <div>
                          <Label htmlFor="storeManager">Quản lý</Label>
                          <Input
                            id="storeManager"
                            value={newStore.manager}
                            onChange={(e) => setNewStore({...newStore, manager: e.target.value})}
                            placeholder="Nhập tên quản lý"
                          />
                        </div>
                        <div>
                          <Label htmlFor="storeAddress">Địa chỉ</Label>
                          <Input
                            id="storeAddress"
                            value={newStore.address}
                            onChange={(e) => setNewStore({...newStore, address: e.target.value})}
                            placeholder="Nhập địa chỉ cửa hàng"
                          />
                        </div>
                        <Button onClick={handleAddStore} className="w-full">
                          Thêm cửa hàng
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stores.map((store) => (
                    <div key={store.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-lg">{store.name}</h3>
                        <Badge className="bg-green-100 text-green-800">
                          {formatPrice(store.revenue)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Quản lý:</span> {store.manager}</p>
                        <p><span className="font-medium">Địa chỉ:</span> {store.address}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {/* Xem chi tiết cửa hàng */}
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/store-detail/${store.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            Xem chi tiết
                          </Link>
                        </Button>
                        
                        {/* Nút sửa cửa hàng */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingStore(store);  // Đặt dữ liệu cửa hàng đang chỉnh sửa
                            setIsEditStoreOpen(true); // Mở Dialog sửa
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Sửa
                        </Button>
                        <Dialog open={isEditStoreOpen} onOpenChange={setIsEditStoreOpen}>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Sửa cửa hàng</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={(e) => {
                                e.preventDefault();
                                updateStore(editingStore); // Gọi hàm updateStore khi submit form sửa
                              }}>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="storeName">Tên cửa hàng</Label>
                                    <Input
                                      id="storeName"
                                      value={editingStore?.name || ''}
                                      onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
                                      placeholder="Nhập tên cửa hàng"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="storeManager">Quản lý cửa hàng</Label>
                                    <Input
                                      id="storeManager"
                                      value={editingStore?.manager || ''}
                                      onChange={(e) => setEditingStore({ ...editingStore, manager: e.target.value })}
                                      placeholder="Nhập tên quản lý"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="storeAddress">Địa chỉ cửa hàng</Label>
                                    <Input
                                      id="storeAddress"
                                      value={editingStore?.address || ''}
                                      onChange={(e) => setEditingStore({ ...editingStore, address: e.target.value })}
                                      placeholder="Nhập địa chỉ cửa hàng"
                                    />
                                  </div>
                                  <Button type="submit" className="w-full">
                                    Cập nhật cửa hàng
                                  </Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                        {/* Nút xoá cửa hàng */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteStore(store.id)} // Gọi hàm xoá
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xoá
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

            </Card>
            
          </TabsContent>

          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Quản lý nhân viên
                  </CardTitle>
                  <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm nhân viên
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Thêm nhân viên mới</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="employeeName">Tên nhân viên</Label>
                          <Input
                            id="employeeName"
                            value={newEmployee.name}
                            onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                            placeholder="Nhập tên nhân viên"
                          />
                        </div>
                        <div>
                          <Label htmlFor="employeeRole">Vai trò</Label>
                          <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee({...newEmployee, role: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent bg>
                              <SelectItem value="Doctor">Bác sĩ</SelectItem>
                              <SelectItem value="Pharmacist">Dược sĩ</SelectItem>
                              <SelectItem value="Manager">Quản lý</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="employeeStore">Cửa hàng</Label>
                          <Select value={newEmployee.store} onValueChange={(value) => setNewEmployee({...newEmployee, store: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn cửa hàng" />
                            </SelectTrigger>
                            <SelectContent>
                              {stores.map((store) => (
                                <SelectItem key={store.id} value={store.name}>
                                  {store.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="employeeEmail">Email</Label>
                          <Input
                            id="employeeEmail"
                            type="email"
                            value={newEmployee.email}
                            onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                            placeholder="Nhập email"
                          />
                        </div>
                        <Button onClick={handleAddEmployee} className="w-full">
                          Thêm nhân viên
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline">{employee.role}</Badge>
                          <span className="text-sm text-gray-600">{employee.store}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingEmployee(employee);
                            setIsEditEmployeeOpen(true);
                          }}
                        ></Button>
                        <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Sửa nhân viên</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={(e) => {
                              e.preventDefault();
                              updateEmployee(editingEmployee);
                            }}>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="employeeName">Tên nhân viên</Label>
                                  <Input
                                    id="employeeName"
                                    value={editingEmployee?.name || ''}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                                    placeholder="Nhập tên nhân viên"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="employeeRole">Vai trò</Label>
                                  <Select
                                    value={editingEmployee?.role || ''}
                                    onValueChange={(value) => setEditingEmployee({ ...editingEmployee, role: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Chọn vai trò" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Doctor">Bác sĩ</SelectItem>
                                      <SelectItem value="Pharmacist">Dược sĩ</SelectItem>
                                      <SelectItem value="Manager">Quản lý</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="employeeStore">Cửa hàng</Label>
                                  <Select
                                    value={editingEmployee?.store || ''}
                                    onValueChange={(value) => setEditingEmployee({ ...editingEmployee, store: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Chọn cửa hàng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {stores.map((store) => (
                                        <SelectItem key={store.id} value={store.name}>
                                          {store.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="employeeEmail">Email</Label>
                                  <Input
                                    id="employeeEmail"
                                    type="email"
                                    value={editingEmployee?.email || ''}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                                    placeholder="Nhập email"
                                  />
                                </div>
                                <Button type="submit" className="w-full">
                                  Cập nhật nhân viên
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteEmployee(employee.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Xoá
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Doanh thu theo cửa hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stores.map((store) => (
                      <div key={store.id} className="flex items-center justify-between">
                        <Link 
                          to={`/store-detail/${store.id}`}
                          className="font-medium hover:text-primary cursor-pointer"
                        >
                          {store.name}
                        </Link>
                        <span className="text-primary font-bold">{formatPrice(store.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Tồn kho sản phẩm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <span className="font-medium">{product.name}</span>
                        <Badge variant={product.stock > 20 ? "default" : "destructive"}>
                          {product.stock} sản phẩm
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Management;
