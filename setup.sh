#!/bin/bash

# Project name
PROJECT_NAME="whatsapp-facebook-pos-system"
FRONTEND_DIR="${PROJECT_NAME}/frontend"
BACKEND_DIR="${PROJECT_NAME}/backend"

# Create main project directory
mkdir -p $PROJECT_NAME

# Create frontend directory and initialize React Native app
echo "Creating frontend with React Native..."
npx react-native init $FRONTEND_DIR --template react-native-template-typescript

# Navigate to frontend directory
cd $FRONTEND_DIR

# Install React Native dependencies for POS functionalities
echo "Installing frontend dependencies..."
npm install react-navigation react-native-elements axios redux react-redux stripe react-native-paypal

# Install testing libraries
npm install --save-dev jest @testing-library/react-native

# Return to project root
cd ../..

# Create backend directory
mkdir -p $BACKEND_DIR

# Initialize backend Node.js with Express.js/NestJS and MongoDB
echo "Setting up backend with Node.js and Express.js..."
cd $BACKEND_DIR
npm init -y
npm install express mongoose body-parser cors dotenv bcryptjs jsonwebtoken stripe paypal-rest-sdk twilio facebook-chat-api

# Create necessary backend directories and files
echo "Generating backend directories and files..."

mkdir -p controllers routes models config utils

# Create server.js
cat <<EOL > server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
    })
    .catch(err => console.log(err));
EOL

# Create example environment file
cat <<EOL > .env
MONGO_URI=mongodb://localhost:27017/possystem
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token
EOL

# Create basic product model
cat <<EOL > models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    imageUrl: { type: String },
    stock: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);
EOL

# Create basic order model
cat <<EOL > models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
EOL

# Create basic customer model
cat <<EOL > models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    loyaltyPoints: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
EOL

# Create basic product routes
cat <<EOL > routes/productRoutes.js
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Add new product
router.post('/', async (req, res) => {
    const { name, price, description, imageUrl, stock } = req.body;
    try {
        const product = new Product({ name, price, description, imageUrl, stock });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error creating product' });
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});

module.exports = router;
EOL

# Create order routes
cat <<EOL > routes/orderRoutes.js
const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
    const { customer, products, totalPrice } = req.body;
    try {
        const order = new Order({ customer, products, totalPrice });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error creating order' });
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('products.product');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

module.exports = router;
EOL

# Return to the project root
cd ..

# Install MongoDB and start service
echo "Installing MongoDB..."
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb

echo "Setup complete!"
