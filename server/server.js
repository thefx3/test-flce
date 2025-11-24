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
import authRequired from "./auth/authRequired.js";

// Initialize express app
const app = express();

//-------------- MIDDLEWARES --------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);


app.use("/admin", authRequired, adminRoutes);

app.use("/profile", authRequired, profilRoutes);

app.use("/tests", authRequired, testRoutes);

app.use("/questions", authRequired, questionRoutes);


app.get("/debug", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});


// -------------- SERVER --------------------------------
const PORT = process.env.PORT || 3000;
(async () => {
  try {
    app.listen(PORT, () => {
      console.log(`✅ App listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
  }
})();


app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});
