//server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./prisma/prisma.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import profilRoutes from "./routes/profilRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import questionRoutes from "./routes/questionRoutes.js"
import publicRoutes from "./routes/publicRoutes.js"
import authRequired from "./auth/authRequired.js";

// Initialize express app
const app = express();

//-------------- MIDDLEWARES --------------------------
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

// PUBLIC
app.use("/public", publicRoutes);
app.use("/tests", testRoutes);

// PROTECTED
app.use("/admin", authRequired, adminRoutes);
app.use("/profile", authRequired, profilRoutes);
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



