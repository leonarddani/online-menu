// const express = require("express");
// const router = express.Router();
// const pool = require("../config/db");


// // GET /api/chef/orders
// router.get("/chef/orders", async (req, res) => {
//   try {
//     // Fetch orders with status 'pending' or 'in_progress' (you can customize statuses)
//     const ordersResult = await pool.query(
//       `SELECT o.id AS order_id, o.table_id, o.user_id, o.status, o.created_at,
//         json_agg(
//           json_build_object(
//             'menu_item_id', oi.menu_item_id,
//             'name', mi.name,
//             'quantity', oi.quantity,
//             'notes', oi.notes,
//             'price', mi.price
//           )
//         ) AS items
//       FROM orders o
//       JOIN order_items oi ON o.id = oi.order_id
//       JOIN menu_items mi ON oi.menu_item_id = mi.id
//       WHERE o.status IN ('pending', 'in_progress')
//       GROUP BY o.id
//       ORDER BY o.created_at ASC`
//     );

//     res.json(ordersResult.rows);
//   } catch (error) {
//     console.error("Error fetching orders for chef:", error);
//     res.status(500).json({ message: "Failed to fetch orders" });
//   }
// });

// router.patch("/chef/orders/:orderId/status", async (req, res) => {
//   const { orderId } = req.params;
//   const { status } = req.body;

//   console.log("PATCH /chef/orders/:orderId/status", { orderId, status });

//   if (!status) {
//     return res.status(400).json({ message: "Missing status" });
//   }

//   try {
//     const result = await pool.query(
//       `UPDATE orders SET status = $1 WHERE id = $2`,
//       [status, orderId]
//     );

//     console.log("Update result:", result);
//     if (result.rowCount === 0) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json({ message: "Order status updated" });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({ message: "Failed to update order status", error: error.message });
//   }
// });

// module.exports = router;



// PUT /api/orders/:id/status
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { restrictTo } = require("../middlewares/roleAuth");
const authMiddleware = require("../middlewares/authmiddleware");

router.put('/:id/status', authMiddleware,  async (req, res) => {
  const orderId = parseInt(req.params.id);

  try {
    // Check if the order exists and is in 'Pending' status
    const { rows } = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    );

    const order = rows[0];

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only Pending orders can be updated' });
    }

    // Update order status to 'In Progress'
    const updateQuery = `
      UPDATE orders
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const updated = await pool.query(updateQuery, ['In Progress', orderId]);

    res.json({ message: 'Order status updated', order: updated.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



// PUT /api/orders/:id/complete
router.put('/:id/complete', authMiddleware, restrictTo('chief'), async (req, res) => {
  const orderId = parseInt(req.params.id);

  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    const order = rows[0];

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'In Progress')
      return res.status(400).json({ message: 'Only In Progress orders can be marked as Completed' });

    const updated = await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      ['Completed', orderId]
    );

    res.json({ message: 'Order status updated to Completed', order: updated.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


//cancel an order
router.put('/:id/cancel', authMiddleware, restrictTo('chief'), async (req, res) => {
  const orderId = parseInt(req.params.id);

  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    const order = rows[0];

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!['Pending', 'In Progress'].includes(order.status)) {
      return res.status(400).json({ message: 'Only Pending or In Progress orders can be cancelled' });
    }

    const updated = await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      ['Cancelled', orderId]
    );

    res.json({ message: 'Order has been cancelled', order: updated.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;



