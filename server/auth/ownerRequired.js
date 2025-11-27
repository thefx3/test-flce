// auth/ownerRequired.js
export default function ensureIsOwner(req, res, next) {
  if (req.user.role === "ADMIN" || req.user.role === "SUPERADMIN") {
    return next();
  }
  if (Number(req.user.userId) !== Number(req.params.userId)) {
    return res.status(403).json({ message: "Not allowed" });
  }
  next();
}