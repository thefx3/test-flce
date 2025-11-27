//server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import prisma from "./prisma/prisma.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import profilRoutes from "./routes/profilRoutes.js";
import familyRoutes from "./routes/familyRoutes.js"
import testRoutes from "./routes/testRoutes.js";
import questionRoutes from "./routes/questionRoutes.js"
import publicRoutes from "./routes/publicRoutes.js"
import authRequired from "./auth/authRequired.js";

// Initialize express app
const app = express();

// ---------------- SECURITY GLOBAL MIDDLEWARES -----------------
app.use(helmet());           // Secure HTTP headers
app.use(cookieParser());     // Parse cookies
app.use(cors());             // CORS
app.use(express.json());     // JSON body


// ---------------- RATE LIMITER -----------------
const publicLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 20,
  message: { message: "Too many requests, slow down." }
});

app.use("/auth", authRoutes);

// PUBLIC
app.use("/public", publicLimiter, publicRoutes);
app.use("/tests", publicLimiter, testRoutes);

// PROTECTED
app.use("/admin", authRequired, adminRoutes);
app.use("/profile", authRequired, profilRoutes);
app.use("/families", authRequired, familyRoutes);
app.use("/questions", authRequired, questionRoutes);




app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// -------------- ERROR HANDLER ------------------------
app.use((err, req, res, next) => {
  console.error("❌ Error middleware:", err);
  const status = err.statusCode || 500;
  res
    .status(status)
    .json({ message: err.message || "Internal server error" });
});

// -------------- SERVER --------------------------------

const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database");

    app.listen(PORT, () => {
      console.log(`✅ App listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }
})();



