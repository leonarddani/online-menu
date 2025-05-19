const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload (e.g., id and role)
    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = authMiddleware;

// //allow accces based on user roles 
// const restrictTo = (allowedRoles) => (req, res, next) => {
//   if (!req.user || !req.user.role) {
//     return res.status(401).json({ message: "Authentication required" });
//   }
//   if (!allowedRoles.includes(req.user.role)) {
//     return res.status(403).json({ message: `Access denied: requires one of ${allowedRoles.join(", ")} roles` });
//   }
//   next();
// };
