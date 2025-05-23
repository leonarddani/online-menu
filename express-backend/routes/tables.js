const express = require("express");
const pool = require("../config/db"); // Assuming you are using PostgreSQL
const router = express.Router();

// GET /api/tables
// Get all tables without pagination or limits
router.get("/", async (req, res) => {
  try {
    // Build query to fetch all tables without any filters or pagination
    const query = "SELECT id, table_number, capacity, status, created_at, updated_at FROM tables ORDER BY table_number ASC";
    
    // Execute the query
    const result = await pool.query(query);

    // Send response with the list of tables
    res.json({
      tables: result.rows,
    });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/:id/free', async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the table exists
    const tableResult = await pool.query('SELECT * FROM tables WHERE id = $1', [id]);
    if (tableResult.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    const table = tableResult.rows[0];

    // If the table is already available, return an error
    if (table.status === 'available') {
      return res.status(400).json({ error: 'This table is already free' });
    }

    // Update the table status to "available"
    await pool.query('UPDATE tables SET status = $1 WHERE id = $2', ['available', id]);

    // Optionally, update the order status to "completed" if the table had an ongoing order
    await pool.query('UPDATE orders SET status = $1 WHERE table_id = $2 AND status = $3', ['completed', id, 'pending']);

    res.json({
      message: `Table ${id} is now available`,
      table_status: 'available'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//Update table status (Free / Occupied)

router.put('/api/tables/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['available', 'occupied'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await pool.query('UPDATE tables SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: `Table ${id} status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/seat', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;  // Assuming the user seating the guests (like a waiter) is passing their ID
  
  if (!user_id) {
    return res.status(400).json({ error: 'User ID (waiter) is required' });
  }

  try {
    // Check if the table exists
    const tableResult = await pool.query('SELECT * FROM tables WHERE id = $1', [id]);
    if (tableResult.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    const table = tableResult.rows[0];

    // If the table is already occupied, we return an error
    if (table.status === 'occupied') {
      return res.status(400).json({ error: 'This table is already occupied' });
    }

    // Update table status to "occupied"
    await pool.query('UPDATE tables SET status = $1 WHERE id = $2', ['occupied', id]);

    // Create an empty order for this table (assuming no items have been added yet)
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, table_id, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [user_id, id, 0, 'pending']
    );

    const orderId = orderResult.rows[0].id;

    res.json({
      message: `Table ${id} is now occupied`,
      order_id: orderId,
      table_status: 'occupied'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get('/menu', (req, res) => {
  res.json(menu);
});



// Add item to cart
router.post('/:id/cart', (req, res) => {
  const { id } = req.params;
  const { itemId, quantity, notes } = req.body;

  // Find the menu item by ID
  const item = menu.find((m) => m.id === itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  // Initialize cart if not already present
  if (!carts[id]) carts[id] = [];

  // Add item to cart or update quantity
  const cartItem = carts[id].find((i) => i.item.id === itemId);
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    carts[id].push({ item, quantity, notes });
  }

  res.json({ message: 'Item added to the cart', cart: carts[id] });
});

// Remove item from cart
router.delete('/:id/cart/:itemId', (req, res) => {
  const { id, itemId } = req.params;
  if (!carts[id]) return res.status(404).json({ message: 'Cart not found' });

  // Remove item from cart
  carts[id] = carts[id].filter((item) => item.item.id !== itemId);

  res.json({ message: 'Item removed from the cart', cart: carts[id] });
});

// Place an order
router.post('/:id/order', (req, res) => {
  const { id } = req.params;
  const { cart } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: 'No items in the cart' });
  }

  // Simulate placing an order (this would normally go to a database)
  const orderId = Math.floor(Math.random() * 10000);  // Just a random order ID for the sake of example
  res.json({ message: 'Order placed successfully', orderId, status: 'pending' });
});

// Update item quantity in cart
router.patch('/:id/cart/:itemId', (req, res) => {
  const { id, itemId } = req.params;
  const { quantity } = req.body;

  if (!carts[id]) return res.status(404).json({ message: 'Cart not found' });

  const cartItem = carts[id].find((item) => item.item.id === itemId);
  if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });

  cartItem.quantity = quantity;
  res.json({ message: 'Item quantity updated', cart: carts[id] });
});



module.exports = router;
