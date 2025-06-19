const express = require("express");
const pool = require("../config/db"); // PostgreSQL connection
const authMiddleware = require("../middlewares/authmiddleware");
const router = express.Router();

// GET /api/tables - get all tables
router.get("/", authMiddleware, async (req, res) => {
  try {
    const query = `
      SELECT id, table_number, capacity, status, created_at, updated_at
      FROM tables
      ORDER BY table_number ASC
    `;
    const result = await pool.query(query);
    res.json({ tables: result.rows });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/tables/:id/free - free a table and cancel the latest pending order
router.post("/:id/free", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Check if table exists
    const tableResult = await pool.query("SELECT * FROM tables WHERE id = $1", [id]);
    if (tableResult.rows.length === 0) {
      return res.status(404).json({ error: "Table not found" });
    }

    const table = tableResult.rows[0];

    // 2. Check if already available
    if (table.status === "available") {
      return res.status(400).json({ error: "This table is already free" });
    }

    // 3. Set table status to "available"
    await pool.query("UPDATE tables SET status = $1 WHERE id = $2", ["available", id]);

    // 4. Cancel the latest pending order for this table
    await pool.query(`
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = (
        SELECT id FROM orders
        WHERE table_id = $1 AND status = 'pending'
        ORDER BY created_at DESC
        LIMIT 1
      )
    `, [id]);

    res.json({
      message: `Table ${id} is now available`,
      table_status: "available",
    });
  } catch (err) {
    console.error("Error freeing table:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});


// PUT /api/tables/:id/status - update table status
router.put("/:id/status", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["available", "occupied"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    await pool.query("UPDATE tables SET status = $1 WHERE id = $2", [status, id]);
    res.json({ message: `Table ${id} status updated to ${status}` });
  } catch (err) {
    console.error("Error updating table status:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tables/:id/seat - seat guests at table (mark as occupied and create order)
router.post("/:id/seat", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body; // Waiter or user ID seating guests

  if (!user_id) {
    return res.status(400).json({ error: "User ID (waiter) is required" });
  }

  try {
    const tableResult = await pool.query("SELECT * FROM tables WHERE id = $1", [id]);
    if (tableResult.rows.length === 0)
      return res.status(404).json({ error: "Table not found" });

    const table = tableResult.rows[0];
    if (table.status === "occupied")
      return res.status(400).json({ error: "This table is already occupied" });

    await pool.query("UPDATE tables SET status = $1 WHERE id = $2", ["occupied", id]);

    const orderResult = await pool.query(
      "INSERT INTO orders (user_id, table_id, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING id",
      [user_id, id, 0, "pending"]
    );

    res.json({
      message: `Table ${id} is now occupied`,
      order_id: orderResult.rows[0].id,
      table_status: "occupied",
    });
  } catch (err) {
    console.error("Error seating guests:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tables/delete/:id - delete a table
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Delete dependent orders first
    

    // Then delete the table
    await pool.query("DELETE FROM tables WHERE id = $1", [id]);

    res.json({ message: "Table and related orders deleted successfully." });
  } catch (error) {
    console.error("Error deleting table:", error);
    res.status(500).json({ error: "Failed to delete table." });
  }
});

// POST /api/tables/create - create a new table
router.post("/create", authMiddleware, async (req, res) => {
  const { table_number, capacity, status } = req.body;

  if (!table_number || !capacity || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if table_number already exists
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
