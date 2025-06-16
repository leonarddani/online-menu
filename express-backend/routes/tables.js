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
    const tableResult = await pool.query('SELECT * FROM tables WHERE id = $1', [id]);
    if (tableResult.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    const table = tableResult.rows[0];

    if (table.status === 'available') {
      return res.status(400).json({ error: 'This table is already free' });
    }

    await pool.query('UPDATE tables SET status = $1 WHERE id = $2', ['available', id]);

    // ✅ Use the correct column name (assumed to be 'table_id')
    await pool.query(
      'UPDATE orders SET status = $1 WHERE table_id = $2 AND status = $3',
      ['completed', id, 'pending']
    );

    res.json({
      message: `Table ${id} is now available`,
      table_status: 'available'
    });
  } catch (err) {
    console.error('Error freeing table:', err);
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
  } catch (err) {able_id
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



router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM tables WHERE id = $1", [id]);

    res.json({ message: "Table and related orders deleted successfully." });
  } catch (error) {
    console.error("Error deleting table:", error);
    res.status(500).json({ error: "Failed to delete table." });
  }
});

// POST /api/tables/create
router.post("/create", async (req, res) => {
  const { table_number, capacity, status } = req.body;

  // Validation minimal
  if (!table_number || !capacity || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Kontrollojmë nëse table_number ekziston tashmë (unik)
    const existing = await pool.query("SELECT * FROM tables WHERE table_number = $1", [table_number]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Table number already exists" });
    }

    const result = await pool.query(
      `INSERT INTO tables (table_number, capacity, status, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
      [table_number, capacity, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ message: "Server error while creating table" });
  }
});

module.exports = router;
