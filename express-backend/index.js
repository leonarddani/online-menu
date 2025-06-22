const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const tablesRoutes = require("./routes/tables");
const menuRoutes = require("./routes/menu");
const chiefRoutes = require("./routes/chief");
const ordersRoutes = require("./routes/orders");
const employeesRoutes = require("./routes/employees");

const app = express();

const allowedOrigins = [
  "https://online-menu-alpha.vercel.app",
  "http://localhost:5173", // for local dev
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow REST clients, Postman, etc.
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("Not allowed by CORS"), false);
    }
    return callback(null, true);
  },
  credentials: true, // if you need cookies/auth
}));


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tables", tablesRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/chef", chiefRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/employees", employeesRoutes);

const PORT = process.env.PORT || 8095;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
