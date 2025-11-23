import path from "node:path";
import "dotenv/config";

console.log("Environment loaded:", process.env.DB_HOST, process.env.DB_DATABASE);

import express from "express";
import cors from "cors";
import prisma from "./prisma/prisma.js";


// Initialize express app
const app = express();

//-------------- MIDDLEWARES --------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


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
