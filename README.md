# Express.js Products API

A RESTful API for managing products built with Express.js, featuring CRUD operations, authentication, validation, filtering, pagination, and search functionality.

## Features

- ✅ Complete CRUD operations for products
- ✅ Custom middleware for logging, authentication, and validation
- ✅ Comprehensive error handling with custom error classes
- ✅ Product filtering by category and stock status
- ✅ Pagination support
- ✅ Search functionality
- ✅ Product statistics endpoint
- ✅ Request/response logging
- ✅ API key authentication for write operations

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your desired configuration

5. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your .env file).

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Authentication
Protected endpoints (POST, PUT, DELETE) require an API key in the request headers:
```
x-api-key: your-secret-api-key-123
```
or
```
Authorization: your-secret-api-key-123
Authorization: Bearer your-secret-api-key-123
```

### Endpoints

#### 1. Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `inStock` (optional): Filter by stock status (true/false)
- `search` (optional): Search in product name and description

**Example Request:**
```bash
curl "http://localhost:3000/api/products?category=electronics&page=1&limit=5"
```

**Example Response:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalProducts": 2,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### 2. Get Product by ID
```http
GET /api/products/:id
```

**Example Request:**
```bash
curl http://localhost:3000/api/products/1
```

**Example Response:**
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
```

#### 3. Create New Product
```http
POST /api/products
```

**Headers Required:**
```
Content-Type: application/json
x-api-key: your-secret-api-key-123
```

**Request Body:**
```json
{
  "name": "Gaming Mouse",
  "description": "RGB gaming mouse with 12000 DPI",
  "price": 79.99,
  "category": "electronics",
  "inStock": true
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key-123" \
  -d '{
    "name": "Gaming Mouse",
    "description": "RGB gaming mouse with 12000 DPI",
    "price": 79.99,
    "category": "electronics",
    "inStock": true
  }'
```

#### 4. Update Product
```http
PUT /api/products/:id
```

**Headers Required:**
```
Content-Type: application/json
x-api-key: your-secret-api-key-123
```

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key-123" \
  -d '{
    "price": 1100,
    "inStock": false
  }'
```

#### 5. Delete Product
```http
DELETE /api/products/:id
```

**Headers Required:**
```
x-api-key: your-secret-api-key-123
```

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "x-api-key: your-secret-api-key-123"
```

#### 6. Search Products
```http
GET /api/products/search?q=laptop
```

**Example Request:**
```bash
curl "http://localhost:3000/api/products/search?q=laptop"
```

**Example Response:**
```json
{
  "query": "laptop",
  "results": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ],
  "count": 1
}
```

#### 7. Get Product Statistics
```http
GET /api/products/stats
```

**Example Request:**
```bash
curl http://localhost:3000/api/products/stats
```

**Example Response:**
```json
{
  "totalProducts": 3,
  "inStockCount": 2,
  "outOfStockCount": 1,
  "categories": {
    "electronics": 2,
    "kitchen": 1
  },
  "averagePrice": 683.33
}
```

## Product Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto-generated | Unique identifier (UUID) |
| name | string | yes | Product name (max 100 chars) |
| description | string | yes | Product description (max 500 chars) |
| price | number | yes | Product price (non-negative) |
| category | string | yes | Product category (max 50 chars) |
| inStock | boolean | no | Stock availability (default: true) |

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid API key)
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Project Structure

```
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── README.md                 # This file
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Global error handler
│   ├── logger.js            # Request logging middleware
│   └── validation.js        # Input validation middleware
└── utils/
    ├── asyncWrapper.js      # Async error wrapper
    └── errors.js            # Custom error classes
```

## Development

### Available Scripts
- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload

### Testing the API

You can test the API using:
- **Postman**: Import the endpoints and test with the UI
- **Insomnia**: Alternative REST client
- **curl**: Command-line testing (examples provided above)
- **Thunder Client**: VS Code extension

### Example Test Sequence

1. **Get all products:**
```bash
curl http://localhost:3000/api/products
```

2. **Create a new product:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key-123" \
  -d '{"name":"Test Product","description":"Test description","price":99.99,"category":"test"}'
```

3. **Update the product:**
```bash
curl -X PUT http://localhost:3000/api/products/[PRODUCT_ID] \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key-123" \
  -d '{"price":89.99}'
```

4. **Search for products:**
```bash
curl "http://localhost:3000/api/products/search?q=test"
```

5. **Get product statistics:**
```bash
curl http://localhost:3000/api/products/stats
```

6. **Delete the product:**
```bash
curl -X DELETE http://localhost:3000/api/products/[PRODUCT_ID] \
  -H "x-api-key: your-secret-api-key-123"
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment mode | development |
| API_KEY | API key for authentication | your-secret-api-key-123 |

## Middleware

### Logger Middleware
- Logs all incoming requests with timestamp, method, URL, IP, and User-Agent
- Calculates and logs response time
- Helps with debugging and monitoring

### Authentication Middleware
- Protects POST, PUT, and DELETE operations
- Validates API key from `x-api-key` header or `Authorization` header
- Supports both direct key and Bearer token formats

### Validation Middleware
- Validates product data for creation and updates
- Ensures required fields are present and properly formatted
- Validates data types, lengths, and ranges
- Provides detailed error messages for validation failures

### Error Handler Middleware
- Catches and processes all application errors
- Provides consistent error response format
- Logs errors for debugging
- Handles different types of errors (validation, authentication, not found, etc.)

## Advanced Features

### Filtering
Filter products by category or stock status:
```bash
# Filter by category
curl "http://localhost:3000/api/products?category=electronics"

# Filter by stock status
curl "http://localhost:3000/api/products?inStock=true"

# Combine filters
curl "http://localhost:3000/api/products?category=electronics&inStock=false"
```

### Pagination
Navigate through large sets of products:
```bash
# Get first page (10 items)
curl "http://localhost:3000/api/products?page=1&limit=10"

# Get second page (5 items)
curl "http://localhost:3000/api/products?page=2&limit=5"
```

### Search
Search products by name or description:
```bash
# Search in product listing
curl "http://localhost:3000/api/products?search=laptop"

# Dedicated search endpoint
curl "http://localhost:3000/api/products/search?q=gaming"
```

## Security Considerations

1. **API Key Authentication**: All write operations require a valid API key
2. **Input Validation**: All input is validated before processing
3. **Error Handling**: Errors don't expose sensitive system information
4. **Rate Limiting**: Consider implementing rate limiting in production
5. **HTTPS**: Use HTTPS in production environments

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication and authorization
- [ ] Rate limiting
- [ ] API versioning
- [ ] Caching
- [ ] File upload for product images
- [ ] Bulk operations
- [ ] Product categories management
- [ ] Inventory tracking
- [ ] Order management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please create an issue in the repository or contact the development team.
