# Project Description
- Brief intro: "E-commerce backend API built with Express.js and PostgreSQL"
- Main features: product management, categories, orders, image uploads

## Setup Instructions

### Prerequisites
- Node.js (v or higher)
- PostgreSQL (v or higher)
- npm or similar to it

### Installation Steps
1. Clone the repository
2. Navigate to backend folder: `cd backend`
3. Install dependencies: `npm install`
4. Create PostgreSQL database: `createdb ecommerce_db`
5. Run the SQL schema file to create tables
6. Copy `.env.example` to `.env` and fill in your credentials
7. Start the server: `npm start` or `node server.js`


## Environment Variables

Create a `.env` file in the backend folder with:
``DB_USER=postgres
DB_PASSWORD=mysecretpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=my-ecommerce``


## API Endpoints

### Categories
- GET /api/categories - Get all categories
- POST /api/categories - Create new category
- DELETE /api/categories/:id - Delete category

### Products
- GET /api/products - Get all products (with filters:)
- GET /api/products/:slug - Get single product
- POST /api/products - Create product (with image upload)
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product

### Orders
- GET /api/orders - Get all orders
- GET /api/orders/:id - Get single order
- POST /api/orders - Create new order
- PUT /api/orders/:id/status - Update order status
- DELETE /api/orders/:id - Delete order


## API Endpoints not included in express backend
## Check-stock
- GET /api/check-stock/:productId - Check product stock


## Database Schema
## Database Schema

The database consists of 3 main tables:
- **categories**: Stores product categories
- **products**: Stores product information with foreign key to categories
- **orders**: Stores customer orders with foreign key to products 


# Tables
- **categories** (id,name,slug,description,created_at)
- **products**: (id,category_id,name,slug,description,price,stock,image_url,created_at , updated_at)
- **orders**: ( product_id,customer_name,customer_email ,address, quantity , total_amount ,status,created_at,updated_at )

### Tables:
- categories (id, name, slug, description, created_at)
- products (id, category_id, name, slug, price, stock, image_url)
- orders (id, product_id, customer_name, quantity, total_amount, status)