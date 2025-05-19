const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authmiddleware");
const { restrictTo, managerRoles, waiterRoles, clientRoles } = require("../middlewares/roleAuth");
const { Pool } = require("pg");

const router = express.Router();
// GET /api/tables
// Get all tables with optional status filter and pagination
router.get("/",authMiddleware, restrictTo(["manager"]), async (req, res) => {
  try {
    // Validate query parameters
    const { status, limit = 10, offset = 0 } = req.query;

    // Validate status if provided
    const validStatuses = ["available", "occupied", "reserved", "maintenance"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be one of: available, occupied, reserved, maintenance" });
    }

    // Validate limit and offset
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(offset, 10);
    if (isNaN(parsedLimit) || parsedLimit < 1 || isNaN(parsedOffset) || parsedOffset < 0) {
      return res.status(400).json({ message: "Invalid limit or offset. Must be positive integers" });
    }

    // Build query
    let query = "SELECT id, table_number, capacity, status, created_at, updated_at FROM tables";
    const queryParams = [];
    
    if (status) {
      query += " WHERE status = $1";
      queryParams.push(status);
    }

    query += " ORDER BY table_number ASC LIMIT $1 OFFSET $2";
    queryParams.push(parsedLimit, parsedOffset);

    // Execute query
    const result = await pool.query(query, queryParams);

    // Get total count for pagination metadata
    const countQuery = status
      ? "SELECT COUNT(*) FROM tables WHERE status = $1"
      : "SELECT COUNT(*) FROM tables";
    const countParams = status ? [status] : [];
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count, 10);

    // Send response
    res.json({
      tables: result.rows,
      pagination: {
        limit: parsedLimit,
        offset: parsedOffset,
        total
      }
    });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get(
  "/admin-data",authMiddleware, // ✅ Token is verified first
  restrictTo(["admin", "manager"]), // ✅ Then check for roles
  (req, res) => {
    res.json({ message: "Welcome to protected data!" });
  }
);

module.exports = router;