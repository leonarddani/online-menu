// const express = require("express");
// const router = express.Router();
// const pool = require("../config/db");
// const authMiddleware = require("../middlewares/authmiddleware");

// router.get('/user-waiter', authMiddleware, async (req, res) => {
//   const { page = 1, limit = 20 } = req.query; // default limit 20

//   const pageNum = Math.max(parseInt(page), 1);
//   const limitNum = Math.min(parseInt(limit), 100);
//   const offset = (pageNum - 1) * limitNum;

//   // Total count of all orders
//   const countQuery = `SELECT COUNT(*) FROM orders`;
//   const countResult = await pool.query(countQuery);
//   const totalCount = parseInt(countResult.rows[0].count, 10);
//   const totalPages = Math.ceil(totalCount / limitNum);

//   // Get orders with user info and table_number
//   const dataQuery = `
//     SELECT orders.id,
//            orders.user_id,
//            tables.table_number,
//            orders.total_amount,
//            orders.status,
//            orders.created_at,
//            users.name AS user_name,
//            users.role AS user_role
//     FROM orders
//     JOIN users ON orders.user_id = users.id
//     LEFT JOIN tables ON orders.table_id = tables.id
//     ORDER BY orders.created_at DESC
//     LIMIT $1 OFFSET $2
//   `;

//   const dataResult = await pool.query(dataQuery, [limitNum, offset]);

//   res.json({
//     orders: dataResult.rows,
//     totalPages,
//     totalCount,
//     currentPage: pageNum,
//   });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authmiddleware");

router.get('/user-waiter', authMiddleware, async (req, res) => {
  const { page = 1, limit = 20 } = req.query; // default limit 20

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(parseInt(limit), 100);
  const offset = (pageNum - 1) * limitNum;

  // Total count of all orders
  const countQuery = `SELECT COUNT(*) FROM orders`;
  const countResult = await pool.query(countQuery);
  const totalCount = parseInt(countResult.rows[0].count, 10);
  const totalPages = Math.ceil(totalCount / limitNum);

  // Get orders with user info and table_number from orders table
  const dataQuery = `
    SELECT orders.id,
           orders.user_id,
           orders.table_number,   -- directly from orders table
           orders.total_amount,
           orders.status,
           orders.created_at,
           users.name AS user_name,
           users.role AS user_role
    FROM orders
    JOIN users ON orders.user_id = users.id
    ORDER BY orders.created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const dataResult = await pool.query(dataQuery, [limitNum, offset]);

  res.json({
    orders: dataResult.rows,
    totalPages,
    totalCount,
    currentPage: pageNum,
  });
});


// PUT /orders/:id/cancel
router.put("/:id/cancel", async (req, res) => {
  const orderId = req.params.id;

  try {
    // Update order status to 'cancelled'
    const result = await pool.query(
      `UPDATE orders
       SET status = 'cancelled'
       WHERE id = $1 AND status NOT IN ('cancelled', 'completed')
       RETURNING *`,
      [orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Order not found or already cancelled/completed" });
    }

    res.json({ message: "Order cancelled successfully", order: result.rows[0] });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Failed to cancel order", error: error.message });
  }
});

module.exports = router;

