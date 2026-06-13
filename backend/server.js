require('dotenv').config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 4000;
// this connection should be with env vars later
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// handling connection errors
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Successfully connected to PostgreSQL database");
    release(); // release of the client back to the pool
  }
});

// json and cors as requested
app.use(cors());
app.use(express.json());

// creating the uploads folder for files sotoring
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads folder");
}

//using the uploads folder to serve my static files
app.use("/uploads", express.static(uploadsDir));

// multer for serving files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // add timestamp to filename to make it unique and avoid conflicts
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // only accept image files to prevent users from uploading random stuff
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/* ------------------ API ENDPOINTS ---------------------------*/

// get all categories sorted alphabetically
app.get("/api/categories", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// create a new category
app.post("/api/categories", async (req, res) => {
  const { name, slug, description } = req.body;

  // make sure we have the required fields
  if (!name || !slug) {
    return res.status(400).json({ error: "Name and slug are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *",
      [name, slug, description]
    );
    // status 201 the client's request has
    //  been successfully fulfilled and, as a result,
    //  one or more new resources have been created on the server.
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

// get a single product by its slug (the url friendly name)
app.get("/api/products/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await pool.query("SELECT * FROM products WHERE slug = $1", [
      slug,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// get all products with optional filtering
// this endpoint can filter by multiple categories and price range
app.get("/api/products", async (req, res) => {
  // handle both single category and multiple categories in the url
  // this makes sure categories is always an array
  //  whether the user provides one category or many
  const categories = Array.isArray(req.query.category)
    ? req.query.category
    : req.query.category
    ? [req.query.category]
    : [];

  //this allows filtering by price range , precising the max et min price
  // if not given then default values are taken 0 , 999999
  const minPrice = req.query.minPrice || 0;
  const maxPrice = req.query.maxPrice || 999999;

  // sql query that filters by price
  let query = "SELECT * FROM products WHERE price >= $1 AND price <= $2";
  // two placeholders ($1, $2) for prices min and max
  // 3rd param will be placed in ($3)
  const params = [minPrice, maxPrice];
  let paramCount = 3;

  // if categories are provided, add them to the filter
  // using IN operator so we can filter by multiple categories at once

  if (categories.length > 0) {
    // converting categories ids to number if not already
    // puting them in
    const categoryIds = categories
      .map((cat) => parseInt(cat))
      .filter((cat) => !isNaN(cat));
    if (categoryIds.length > 0) {
      // dynamically building the placeholders like $3,$4,$5 for each category id
      const placeholders = categoryIds
        .map((_, i) => `$${paramCount + i}`)
        .join(",");
      /*.map((_, i) => ...)
      Loops over each category in the array.
     _ means “we don’t care about the actual value,” we just use i (the index).
     For each index, it creates a string like $3, $4, $5… */
/*.join(",") : joins them into a single string separated by commas */
      query += ` AND category_id IN (${placeholders})`;
      params.push(...categoryIds);
      paramCount += categoryIds.length;
    }
  }

  // ordering the results
  query += " ORDER BY created_at DESC";

  try {
    /*pool.query executes the sql on the database

    the result' s rows (products) are sent back as json  */
    const result = await pool.query(query, params);

    // in case i wanted to debug i ve got the query code here
    // and query params array of values that will be substituted
    // into the $1, $2 ,;;; placeholders in the sql query
    console.log("Query:", query, "Params:", params);
    res.json(result.rows);
  } catch (error) {
    // stutus 500 :If something goes wrong (e.g., bad SQL, DB offline)
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});



// creating new product with optional image upload
// teh upload.single('image') handles the image file from the form


app.post('/api/products', upload.single('image'), async (req, res) => {
    const {name, slug, description, price, stock, category_id} = req.body;

    // validate required fields
    if (!name || !slug || !price || !category_id) {
        return res.status(400).json({error: 'Name, slug, price, and category_id are required'});
    }

    // here we re saying 
    // if an image was uploaded :
    // save its url otherwise leave it null
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const result = await pool.query(
            'INSERT INTO products (category_id, name, slug, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [category_id, name, slug, description, price, stock || 0, imageUrl]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({error: 'Failed to create product'});
    }
});


// updating an existing product
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
    const {id} = req.params;
    const {name, slug, description, price, stock, category_id} = req.body;

    try {
        // first get the current product so we can keep the old image if no new one is uploaded
        const currentProduct = await pool.query('SELECT image_url FROM products WHERE id = $1', [id]);
        if (currentProduct.rows.length === 0) {
            return res.status(404).json({error: 'Product not found'});
        }

        // use new image if uploaded, otherwise keep the existing one
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : currentProduct.rows[0].image_url;

        const result = await pool.query(
            'UPDATE products SET name=$1, slug=$2, description=$3, price=$4, stock=$5, image_url=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7 RETURNING *',
            [name, slug, description, price, stock, imageUrl, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({error: 'Failed to update product'});
    }
});


// delete a product by id path param
app.delete('/api/products/:id', async (req, res) => {
    const {id} = req.params;
    try {
        // always we use await bc we need to wait for the sql query
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Product not found'});
        }
        res.json({message: 'Product deleted successfully'});
    } catch (error) {
        // status 500 : ...
        console.error('Error deleting product:', error);
        res.status(500).json({error: 'Failed to delete product'});
    }
});


// get all orders with product details using join tables in sql
// join basically selects lines corresponding to other lines btwn 2 tables
// like when we apply conditions on envolving 2 tables
app.get('/api/orders', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT o.*, p.name as product_name, p.price 
            FROM orders o
            JOIN products p ON o.product_id = p.id
            ORDER BY o.created_at DESC
        `);

        // postgres returns decimals as strings so convert them to actual numbers
        const orders = result.rows.map(order => ({
            ...order,
            total_amount: parseFloat(order.total_amount)
        }));

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({error: 'Failed to fetch orders'});
    }
});


// creating a new order
app.post('/api/orders', async (req, res) => {
    const {product_id, customer_name, customer_email, address, quantity} = req.body;

    // making  sure ofc all required fields are here
    if (!product_id || !customer_name || !customer_email || !address || !quantity) {
        return res.status(400).json({error: 'All fields are required'});
    }

    try {
        // first check if the product exists and has enough stock
        // stock indicates the availibility of the product
        const productResult = await pool.query('SELECT price, stock FROM products WHERE id = $1', [product_id]);

        if (productResult.rows.length === 0) {
            return res.status(404).json({error: 'Product not found'});
        }

        const {price, stock} = productResult.rows[0];

        // don't allow orders if there's not enough stock
        if (stock < quantity) {
            return res.status(400).json({error: 'Not enough stock available'});
        }

        // calculate the total price
        const totalAmount = price * quantity;

        // create the order
        const orderResult = await pool.query(
            'INSERT INTO orders (product_id, customer_name, customer_email, address, quantity, total_amount, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [product_id, customer_name, customer_email, address, quantity, totalAmount, 'pending']
        );

        // decrease the product stock since it's been ordered
        await pool.query(
            'UPDATE products SET stock = stock - $1 WHERE id = $2',
            [quantity, product_id]
        );

        res.status(201).json(orderResult.rows[0]);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({error: 'Failed to create order'});
    }
});




// get a single order by id
app.get('/api/orders/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const result = await pool.query(
            `SELECT o.*, p.name as product_name, p.price 
             FROM orders o
             JOIN products p ON o.product_id = p.id
             WHERE o.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Order not found'});
        }

        // convert total_amount from string to number
        const order = result.rows[0];
        order.total_amount = parseFloat(order.total_amount);

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({error: 'Failed to fetch order'});
    }
});


// update the status of order (marking it delivered)
app.put('/api/orders/:id/status', async (req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    if (!status) {
        return res.status(400).json({error: 'Status is required'});
    }

    try {
        const result = await pool.query(
            'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Order not found'});
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({error: 'Failed to update order status'});
    }
});


// deleting an order by id
app.delete('/api/orders/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Order not found'});
        }

        res.json({message: 'Order deleted successfully'});
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({error: 'Failed to delete order'});
    }
});


//------------------------------------------------------
 

//----------------------------------------------------------------



//-----------------------------------------------------------



// CHECK_STOCK required in the exam pdf s
// check if a product has enough stock for a given quantity
app.get('/api/check-stock/:productId', async (req, res) => {
    const {productId} = req.params;
    const {quantity} = req.query;

    try {
        const result = await pool.query('SELECT stock FROM products WHERE id = $1', [productId]);

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Product not found'});
        }

        const {stock} = result.rows[0];
        const requestedQuantity = parseInt(quantity) || 1;
        const inStock = stock >= requestedQuantity;

        res.json({inStock, availableStock: stock});
    } catch (error) {
        console.error('Error checking stock:', error);
        res.status(500).json({error: 'Failed to check stock'});
    }
});





//------------------------------------------------------------------


//---------------------------------------------------------------


//---------------------------------------------------------------






// individual routes HUNDLE ERRORS BUT
// if some errors were not hundled this is advised :



app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({error: err.message || 'Internal server error'});
});



// server  config

app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});
