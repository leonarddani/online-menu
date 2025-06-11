const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const tablesRoutes = require("./routes/tables");
const menuRoutesLeo = require("./routes/menu");
const chiefRoutes = require("./routes/chief");
const ordersRoutesLeo = require("./routes/orders");

const app = express();

// Enable CORS for frontend URL (make sure it's correct)
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tables", tablesRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/", chiefRoutes);
app.use("/api/orders", ordersRoutes);

const PORT = process.env.PORT || 8095;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
