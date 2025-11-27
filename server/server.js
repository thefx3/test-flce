//server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import prisma from "./prisma/prisma.js";

//PUBLIC
import authRoutes from "./routes/authRoutes.js";
import publicRoutes from "./routes/publicRoutes.js"

//PROTECTED
import adminRoutes from "./routes/adminRoutes.js";

//ALL ROUTES
import userRoutes from "./routes/userRoutes.js"
import profileRoutes from "./routes/profileRoutes.js";
import familyRoutes from "./routes/familyRoutes.js"
import testRoutes from "./routes/testRoutes.js";
import questionRoutes from "./routes/questionRoutes.js"

import authRequired from "./auth/authRequired.js";
import adminRequired from "./auth/adminRequired.js";

// Initialize express app
const app = express();
export { app }; // exported for testing

// ---------------- SECURITY GLOBAL MIDDLEWARES -----------------
app.use(helmet());           // Secure HTTP headers
app.use(cookieParser());     // Parse cookies
app.use(express.json({ limit: "1mb" }));     // JSON body

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);


// ---------------- RATE LIMITER -----------------
const publicLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 20,
  message: { message: "Too many requests, slow down." }
});

// ---------------- ROUTES -----------------

// PUBLIC
app.use("/auth", authRoutes); //Ok
app.use("/public", publicLimiter, publicRoutes); 

// PROTECTED
app.use("/admin", authRequired, adminRequired, adminRoutes);

// Contains Public and Protected functions
app.use("/accounts", userRoutes); //Ok
app.use("/profiles", profileRoutes);
app.use("/families", familyRoutes);
app.use("/tests", testRoutes);
app.use("/questions", questionRoutes);


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

export async function startServer() {
  await prisma.$connect();
  console.log("✅ Connected to database");

  return app.listen(PORT, () => {
    console.log(`✅ App listening on port ${PORT}`);
  });
}

// Do not start the server when running tests
if (process.env.NODE_ENV !== "test") {
  startServer().catch(err => {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  });
}

