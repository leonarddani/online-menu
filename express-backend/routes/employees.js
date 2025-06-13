const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authmiddleware");
const { Pool } = require("pg");
const { restrictTo } = require("../middlewares/roleAuth");

const router = express.Router();

// GET endpoint to retrieve all waiters
router.get('/waiters', authMiddleware, restrictTo(['manager']), async (req, res) => {
  try {
    // Query all active waiters
    const query = `
      SELECT id, name, email, role, created_at, updated_at
      FROM users
      WHERE role = $1 AND (status = $2 OR status IS NULL)
    `;
    const result = await pool.query(query, ['waiter', 'active']);

    // Return the list of waiters
    return res.status(200).json({
      message: 'Waiters retrieved successfully',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error retrieving waiters:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE endpoint to remove a waiter
router.delete('/waiters/:id', authMiddleware, restrictTo(['manager']), async (req, res) => {
  const { id } = req.params;

  try {
    // Check if user exists and is a waiter
    const userCheck = await pool.query(
      'SELECT id, role FROM users WHERE id = $1 AND role = $2',
      [id, 'waiter']
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Waiter not found' });
    }

    // Option 1: Soft delete (mark as inactive)
    // Assumes a 'status' or 'is_active' column; if not, modify schema or use hard delete
    await pool.query(
      'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['inactive', id]
    );

    // Option 2: Hard delete (uncomment to use, ensure foreign keys allow it)
    /*
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    */

    return res.status(200).json({ message: 'Waiter deleted successfully' });
  } catch (error) {
    console.error('Error deleting waiter:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;