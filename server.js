// server.js - Complete Express server for Week 2 assignment
// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Import custom modules
const { NotFoundError, ValidationError, AuthenticationError } = require('./utils/errors');
const { loggerMiddleware } = require('./middleware/logger');
const { authMiddleware } = require('./middleware/auth');
const { validateProduct, validateProductUpdate } = require('./middleware/validation');
const { errorHandler } = require('./middleware/errorHandler');
const { asyncWrapper } = require('./utils/asyncWrapper');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(loggerMiddleware);

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// GET /api/products - Get all products with filtering, pagination, and search
app.get('/api/products', asyncWrapper((req, res) => {
  let filteredProducts = [...products];
  
  // Search functionality
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by category
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(product =>
      product.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }
  
  // Filter by stock status
  if (req.query.inStock !== undefined) {
    const inStockFilter = req.query.inStock === 'true';
    filteredProducts = filteredProducts.filter(product =>
      product.inStock === inStockFilter
    );
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    products: paginatedProducts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredProducts.length / limit),
      totalProducts: filteredProducts.length,
      hasNext: endIndex < filteredProducts.length,
      hasPrev: page > 1
    }
  });
}));

// GET /api/products/search - Search products by name
app.get('/api/products/search', asyncWrapper((req, res) => {
  const { q } = req.query;
  
  if (!q) {
    throw new ValidationError('Search query parameter "q" is required');
  }
  
  const searchResults = products.filter(product =>
    product.name.toLowerCase().includes(q.toLowerCase()) ||
    product.description.toLowerCase().includes(q.toLowerCase())
  );
  
  res.json({
    query: q,
    results: searchResults,
    count: searchResults.length
  });
}));

// GET /api/products/stats - Get product statistics
app.get('/api/products/stats', asyncWrapper((req, res) => {
  const stats = {
    totalProducts: products.length,
    inStockCount: products.filter(p => p.inStock).length,
    outOfStockCount: products.filter(p => !p.inStock).length,
    categories: {},
    averagePrice: 0
  };
  
  // Calculate category counts
  products.forEach(product => {
    stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;
  });
  
  // Calculate average price
  if (products.length > 0) {
    const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
    stats.averagePrice = Math.round((totalPrice / products.length) * 100) / 100;
  }
  
  res.json(stats);
}));

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', asyncWrapper((req, res) => {
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  
  res.json(product);
}));

// POST /api/products - Create a new product
app.post('/api/products', authMiddleware, validateProduct, asyncWrapper((req, res) => {
  const newProduct = {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    inStock: req.body.inStock !== undefined ? req.body.inStock : true
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
}));

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', authMiddleware, validateProductUpdate, asyncWrapper((req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    throw new NotFoundError('Product not found');
  }
  
  const updatedProduct = {
    ...products[productIndex],
    ...req.body,
    id: req.params.id // Ensure ID doesn't change
  };
  
  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
}));

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', authMiddleware, asyncWrapper((req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    throw new NotFoundError('Product not found');
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  res.json({ message: 'Product deleted successfully', product: deletedProduct });
}));

// Handle 404 for unmatched routes
app.use('*', (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Global error handling middleware (must be last)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
