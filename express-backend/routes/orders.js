const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authmiddleware");


// router.get('/user-waiter', async (req, res) => {
//   try {
//     const { page = 1, limit = 10, userId } = req.query;

//     const pageNum = Math.max(parseInt(page), 1);
//     const limitNum = Math.min(parseInt(limit), 50);
//     const offset = (pageNum - 1) * limitNum;

//     let whereClause = `users.role IN ('user', 'waiter')`;
//     const values = [];

//     if (userId) {
//       values.push(userId);
//       whereClause += ` AND users.id = $${values.length}`;
//     }

//     // Get total count
//     const countQuery = `
//       SELECT COUNT(*)
//       FROM orders
//       JOIN users ON orders.user_id = users.id
//       WHERE ${whereClause}
//     `;
//     const countResult = await pool.query(countQuery, values);
//     const totalCount = parseInt(countResult.rows[0].count, 10);
//     const totalPages = Math.ceil(totalCount / limitNum);

//     // Get paginated orders with user info
//     const dataQuery = `
//       SELECT orders.*,
//              users.name AS user_name,
//              users.role AS user_role
//       FROM orders
//       JOIN users ON orders.user_id = users.id
//       WHERE ${whereClause}
//       ORDER BY orders.created_at DESC
//       LIMIT $${values.length + 1} OFFSET $${values.length + 2}
//     `;
//     values.push(limitNum, offset);

//     const dataResult = await pool.query(dataQuery, values);

//     res.json({
//       orders: dataResult.rows,
//       totalPages,
//       totalCount,
//       currentPage: pageNum,
//     });
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.get('/user-waiter', async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(parseInt(limit), 50);
    const offset = (pageNum - 1) * limitNum;

    let whereClause = `users.role IN ('user', 'waiter', 'client')`;
    const values = [];

    if (userId) {
      values.push(userId);
      whereClause += ` AND users.id = $${values.length}`;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*)
      FROM orders
      JOIN users ON orders.user_id = users.id
      WHERE ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values);
    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / limitNum);

    // Get paginated orders with user info
    const dataQuery = `
      SELECT orders.*,
             users.name AS user_name,
             users.role AS user_role
      FROM orders
      JOIN users ON orders.user_id = users.id
      WHERE ${whereClause}
      ORDER BY orders.created_at DESC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;
    values.push(limitNum, offset);

    const dataResult = await pool.query(dataQuery, values);

    res.json({
      orders: dataResult.rows,
      totalPages,
      totalCount,
      currentPage: pageNum,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;

