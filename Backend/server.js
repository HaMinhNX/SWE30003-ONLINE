//server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.js');
const productRoutes = require('./routes/products.js');
const prescriptionRoutes = require('./routes/prescriptions.js');
const storeRoutes = require('./routes/stores.js');
const employeeRoutes = require('./routes/employees.js');


const app = express();
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/employees', employeeRoutes);
// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
