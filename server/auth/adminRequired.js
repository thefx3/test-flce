// auth/adminRequired.js
export default function adminRequired(req, res, next) {
    // authRequired doit avoir fait req.user
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
  
    if (req.user.role !== "ADMIN" && req.user.role !== "SUPERADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }
  
    next();
  }
  