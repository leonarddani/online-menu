const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // example: { id, status }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

//allow accces based on user roles 
const restrictTo = (allowedRoles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: `Access denied: requires one of ${allowedRoles.join(", ")} roles` });
  }
  next();
};


module.exports = authMiddleware;
