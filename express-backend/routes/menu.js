const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authmiddleware");

// In-memory carts per tableId (simple solution)
let carts = {};

// --- GET menu items ---
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT id, name, description, price, category, image_url
      FROM menu_items
      WHERE is_available = true
      ORDER BY category, name
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({ message: "Failed to fetch menu" });
  }
});

// --- GET cart for table ---
router.get("/:tableId/cart", (req, res) => {
  const { tableId } = req.params;
  const cart = carts[tableId] || [];
  res.json(cart);
});

// --- POST add item to cart ---
router.post("/:tableId/cart", async (req, res) => {
  const { tableId } = req.params;
  let { itemId, quantity, notes } = req.body;

  const parsedQuantity = parseInt(quantity);
  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT id, name, description, price, category, image_url FROM menu_items WHERE id = $1 AND is_available = true",
      [itemId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Item not found or unavailable" });
    }

    const item = rows[0];
    if (!carts[tableId]) carts[tableId] = [];

    const existing = carts[tableId].find((entry) => entry.item.id === itemId);
    if (existing) {
      existing.quantity += parsedQuantity;
      if (notes && typeof notes === "string") existing.notes = notes;
    } else {
      carts[tableId].push({ item, quantity: parsedQuantity, notes: notes || "" });
    }

    return res.status(200).json({
      message: "Item added to cart",
      cart: carts[tableId],
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    return res.status(500).json({ message: "Failed to add to cart" });
  }
});

// --- DELETE remove item from cart ---
router.delete("/:tableId/cart/:itemId", (req, res) => {
  const { tableId, itemId } = req.params;
  if (!carts[tableId]) return res.status(404).json({ message: "Cart not found" });

  carts[tableId] = carts[tableId].filter((entry) => entry.item.id !== parseInt(itemId));
  res.json({ cart: carts[tableId] });
});

// --- PATCH update item in cart ---
router.patch("/:tableId/cart/:itemId", (req, res) => {
  const { tableId, itemId } = req.params;
  const { quantity, notes } = req.body;

  const cart = carts[tableId];
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const entry = cart.find((item) => item.item.id === parseInt(itemId));
  if (!entry) return res.status(404).json({ message: "Item not in cart" });

  if (quantity !== undefined) {
    entry.quantity = quantity;
    if (quantity <= 0) {
      carts[tableId] = cart.filter((item) => item.item.id !== parseInt(itemId));
    }
  }

  if (notes !== undefined) {
    entry.notes = notes;
  }

  res.json({ cart: carts[tableId] });
});

// --- POST place order ---
router.post("/:tableId/order", authMiddleware, async (req, res) => {
  try {
    const tableNumber = req.params.tableId; // This is table_number
    const { cart, userId } = req.body;

    if (!cart || cart.length === 0)
      return res.status(400).json({ message: "Cart is empty" });
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    // Get table_id from table_number
    const tableRes = await pool.query(
      "SELECT id FROM tables WHERE table_number = $1",
      [tableNumber]
    );
    if (tableRes.rows.length === 0)
      return res.status(400).json({ message: "Invalid table number" });

    const tableId = tableRes.rows[0].id;

    // Calculate total
    const totalAmount = cart.reduce(
      (sum, entry) => sum + entry.item.price * entry.quantity,
      0
    );

    // INSERT order (now includes table_number!)
    const insertOrderQuery = `
      INSERT INTO orders (user_id, table_id, table_number, total_amount, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, 'pending', NOW(), NOW())
      RETURNING id
    `;
    const orderResult = await pool.query(insertOrderQuery, [
      userId,
      tableId,
      tableNumber,
      totalAmount,
    ]);
    const orderId = orderResult.rows[0].id;

    // INSERT order items
    const insertOrderItemQuery = `
      INSERT INTO order_items (order_id, menu_item_id, quantity, notes, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
    `;

    for (const entry of cart) {
      await pool.query(insertOrderItemQuery, [
        orderId,
        entry.item.id,
        entry.quantity,
        entry.notes || "",
      ]);
    }

    // Clear cart
    delete carts[tableNumber];

    res.json({ message: "Order placed successfully", orderId, totalAmount });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
});

// --- GET orders by table ---
router.get("/:tableId/orders", authMiddleware, async (req, res) => {
  const tableNumber = req.params.tableId;

  try {
    const tableRes = await pool.query(
      "SELECT id FROM tables WHERE table_number = $1",
      [tableNumber]
    );

    if (tableRes.rows.length === 0)
      return res.status(400).json({ message: "Invalid table number" });

    const tableId = tableRes.rows[0].id;

    const query = `
      SELECT o.id, o.user_id, o.table_id, o.table_number, o.total_amount, o.status, o.created_at,
             json_agg(json_build_object(
               'menu_item_id', oi.menu_item_id,
               'quantity', oi.quantity,
               'notes', oi.notes
             )) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.table_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    const { rows } = await pool.query(query, [tableId]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

module.exports = router;
