-- Create categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Create products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Insert sample data
INSERT INTO categories (name, slug, description) VALUES
('Scarfs', 'scarfs' ,'Head accessories and scarfs'),
('Dresses', 'dresses' , 'Hijabs and long dresses'),
('Tops', 'tops', 'All sorts of shirts'),
('Bottoms', 'bottoms','skirts of all sorts and materials');

INSERT INTO products (category_id, name, slug, description, price, stock) VALUES
(2, 'Wearlyn dress', 'wearlyn-dress', 'Our special dress from Wearlyn creations with its premium quality and uniqueness',4900.00, 50),
(2, 'Celina dress', 'celina-dress', 'Comfortable cotton winter and autumn dress ', 4800.00, 40),
(1, 'Chale crepe', 'chale-crepe', 'Premium quality crepe foulard', 1000.00, 100),
(4, 'Satina skirt', 'satina-skirt', 'Classy and elegant slik skirt for your occasions', 3900.00, 30),
(3, 'Lynis cardigan', 'Lynis-cardigan', 'Comfy winter cardigan thats fits with every item', 4000.00, 25);
