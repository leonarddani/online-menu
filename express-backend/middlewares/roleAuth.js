// middlewares/roleAuth.js
const restrictTo = (allowedRoles) => (req, res, next) => {
  console.log(" restrictTo middleware — req.user:", req.user);

  if (!req.user || !req.user.role) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Access denied: requires one of [${allowedRoles.join(", ")}] roles`,
    });
  }

  next();
};


module.exports = {
  restrictTo,
};