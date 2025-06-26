const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const authMiddleware = require("../middlewares/authmiddleware");

// PUT /api/settings
router.put("/", authMiddleware, async (req, res) => {
  const { name, email,  password } = req.body;
  const userId = req.user.id;

  try {
    // Merr përdoruesin aktual
    const userRes = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Përgatit për update
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }

    if (email) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      updates.push(`password = $${paramIndex++}`);
      values.push(hashed);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(userId);
    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramIndex}`;

    await pool.query(query, values);

    res.json({ message: "Settings updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
