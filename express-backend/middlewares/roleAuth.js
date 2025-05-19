// Role arrays based on the schema
const managerRoles = ["manager"];
const waiterRoles = ["waiter"];
const chefRoles = ["chef"];
const clientRoles = ["client"];

// Role-based authorization middleware
const restrictTo = (allowedRoles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: `Access denied: requires one of ${allowedRoles.join(", ")} roles` });
  }
  next();
};

module.exports = { restrictTo, managerRoles, waiterRoles, chefRoles, clientRoles };
//exampleees
// / Manager-only: List all users
// app.get("/api/users", authMiddleware, restrictTo(managerRoles), async (req, res) => {

// });

// // Manager, waiter, chef: List orders
// app.get("/api/orders", authMiddleware, restrictTo([...managerRoles, ...waiterRoles, ...chefRoles]), async (req, res) => {

// });

// // Manager, waiter, client: Create a booking
// app.post("/api/bookings", authMiddleware, restrictTo([...managerRoles, ...waiterRoles, ...clientRoles]), async (req, res) => {
//
// });

// // All roles: List menu items
// app.get("/api/menu-items", authMiddleware, restrictTo([...managerRoles, ...waiterRoles, ...chefRoles, ...clientRoles]), async (req, res) => {
//
// });
