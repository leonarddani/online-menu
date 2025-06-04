const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'waiter', 'chef', 'client')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tables table (removed room_id)
    await client.query(`
      CREATE TABLE IF NOT EXISTS tables (
        id SERIAL PRIMARY KEY,
        table_number INTEGER UNIQUE NOT NULL,
        capacity INTEGER NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create menu_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        image_url TEXT,
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        table_id INTEGER REFERENCES tables(id),
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'preparing', 'completed', 'delivered', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create order_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        menu_item_id INTEGER REFERENCES menu_items(id),
        quantity INTEGER NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create ratings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        order_id INTEGER REFERENCES orders(id),
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default users
    const salt = await bcrypt.genSalt(10);
    const managerPassword = await bcrypt.hash("manager123", salt);
    const waiterPassword = await bcrypt.hash("waiter123", salt);
    const chefPassword = await bcrypt.hash("chef123", salt);
    const clientPassword = await bcrypt.hash("client123", salt);

    await client.query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES 
        ('Manager', 'manager@example.com', $1, 'manager'),
        ('Waiter 1', 'waiter1@example.com', $2, 'waiter'),
        ('Chef', 'chef@example.com', $3, 'chef'),
        ('Client', 'client@example.com', $4, 'client')
      ON CONFLICT (email) DO NOTHING
    `,
      [managerPassword, waiterPassword, chefPassword, clientPassword],
    );

    // Insert default tables (removed room_id)
    await client.query(`
      INSERT INTO tables (table_number, capacity, status)
      VALUES 
        (1, 4, 'available'),
        (2, 4, 'available'),
        (3, 6, 'available'),
        (4, 2, 'available'),
        (5, 8, 'available'),
        (6, 4, 'available'),
        (7, 4, 'available'),
        (8, 6, 'available'),
        (9, 10, 'available'),
        (10, 12, 'available')
      ON CONFLICT DO NOTHING
    `);

    // Insert default menu items
    await client.query(`
      INSERT INTO menu_items (name, description, price, category, image_url, is_available)
      VALUES 
        ('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 12.99, 'Pizza', 'https://example.com/margherita.jpg', true),
        ('Pepperoni Pizza', 'Pizza with tomato sauce, mozzarella, and pepperoni', 14.99, 'Pizza', 'https://example.com/pepperoni.jpg', true),
        ('Caesar Salad', 'Romaine lettuce, croutons, parmesan cheese, and Caesar dressing', 8.99, 'Salad', 'https://example.com/caesar.jpg', true),
        ('Greek Salad', 'Tomatoes, cucumbers, olives, feta cheese, and olive oil', 9.99, 'Salad', 'https://example.com/greek.jpg', true),
        ('Spaghetti Bolognese', 'Spaghetti with meat sauce', 13.99, 'Pasta', 'https://example.com/bolognese.jpg', true),
        ('Fettuccine Alfredo', 'Fettuccine with creamy Alfredo sauce', 12.99, 'Pasta', 'https://example.com/alfredo.jpg', true),
        ('Grilled Salmon', 'Grilled salmon with lemon butter sauce', 18.99, 'Main', 'https://example.com/salmon.jpg', true),
        ('Ribeye Steak', '12oz ribeye steak with mashed potatoes and vegetables', 24.99, 'Main', 'https://example.com/steak.jpg', true),
        ('Chocolate Cake', 'Rich chocolate cake with chocolate ganache', 6.99, 'Dessert', 'https://example.com/chocolate-cake.jpg', true),
        ('Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 7.99, 'Dessert', 'https://example.com/tiramisu.jpg', true),
        ('Soda', 'Coca-Cola, Sprite, or Fanta', 2.99, 'Drink', 'https://example.com/soda.jpg', true),
        ('Iced Tea', 'Sweetened or unsweetened iced tea', 2.99, 'Drink', 'https://example.com/iced-tea.jpg', true)
      ON CONFLICT DO NOTHING
    `);

    await client.query("COMMIT");
    console.log("Database initialized successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    client.release();
  }
};

createTables()
  .then(() => {
    console.log("Database setup complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database setup failed:", error);
    process.exit(1);
  });
