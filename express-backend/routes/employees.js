const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authmiddleware");
const { Pool } = require("pg");



const router = express.Router();


// GET endpoint to retrieve active chefs and waiters
router.get('/staff', authMiddleware,  async (req, res) => {
  try {
    const query = `
      SELECT id, name, email, role, created_at, updated_at
      FROM users
      WHERE role = ANY($1)
    `;
    const roles = ['chef', 'waiter','manager'];
    const result = await pool.query(query, [roles]);

    return res.status(200).json({
      message: 'Chefs and waiters retrieved successfully',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error retrieving staff:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



// // DELETE endpoint to remove a waiter
// router.delete('/waiters/:id', authMiddleware, restrictTo(['manager']), async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Check if user exists and is a waiter
//     const userCheck = await pool.query(
//       'SELECT id, role FROM users WHERE id = $1 AND role = $2',
//       [id, 'waiter']
//     );

//     if (userCheck.rows.length === 0) {
//       return res.status(404).json({ error: 'Waiter not found' });
//     }

//     // Option 1: Soft delete (mark as inactive)
//     // Assumes a 'status' or 'is_active' column; if not, modify schema or use hard delete
//     await pool.query(
//       'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
//       ['inactive', id]
//     );

//     // Option 2: Hard delete (uncomment to use, ensure foreign keys allow it)
//     /*
//     await pool.query('DELETE FROM users WHERE id = $1', [id]);
//     */

//     return res.status(200).json({ message: 'Waiter deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting waiter:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// PATCH /api/employees/:id
router.patch('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['waiter', 'chef', 'client'].includes(role)) {
    return res.status(400).json({ error: "Invalid or missing role" });
  }

  try {
    const query = `
      UPDATE users
      SET role = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, name, email, role, created_at, updated_at
    `;
    const result = await pool.query(query, [role, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Staff updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    const employeeId = req.params.id;

    try {
      // Check if employee exists and get role
      const { rows } = await pool.query(
        "SELECT role FROM users WHERE id = $1",
        [employeeId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Employee not found." });
      }

      const employeeRole = rows[0].role;

      if (employeeRole === "manager") {
        return res
          .status(400)
          .json({ message: "Cannot delete employee with role 'manager'." });
      }

      // Delete the employee
      await pool.query("DELETE FROM users WHERE id = $1", [employeeId]);

      return res.json({ message: "Employee deleted successfully." });
    } catch (error) {
      console.error("Error deleting employee:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);



// POST /api/employees
router.post(
  "/create",authMiddleware,
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

     const { name, email, role } = req.body; // ✅

    try {
      // Optional: prevent adding a manager if you want:
      // if (role === "manager") {
      //   return res.status(403).json({ error: "Adding manager role is not allowed." });
      // }

      // Insert new employee
      const insertQuery =
        "INSERT INTO employees (name, email, role) VALUES ($1, $2, $3) RETURNING *";
      const values = [name, email, role];

      const { rows } = await pool.query(insertQuery, values);
      return res.status(201).json({ employee: rows[0] });
    } catch (error) {
      console.error("Error adding employee:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;