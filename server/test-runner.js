import request from "supertest";
import { app } from "./server.js";
import prisma from "./prisma/prisma.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

async function run() {
  console.log("\n=== RESETTING DB ===\n");

  await prisma.testResponse.deleteMany();
  await prisma.test.deleteMany();
  await prisma.auPairFamily.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.question.deleteMany();
  await prisma.user.deleteMany();

  console.log("✔ DB cleaned\n");

  // -------------------------------------------------------------
  // 1. CREATE ADMIN
  // -------------------------------------------------------------
  console.log("=== AUTH: Create admin ===");

  let res = await request(app).post("/auth/register").send({
    email: "admin@test.com",
    password: "ok",
    role: "ADMIN",
  });

  console.log("Admin created:", res.status);

  // LOGIN ADMIN
  console.log("\n=== AUTH: Login admin ===");

  res = await request(app).post("/auth/login").send({
    email: "admin@test.com",
    password: "ok",
  });

  const adminToken = res.body.token;
  console.log("Admin token:", adminToken, "\n");

  // -------------------------------------------------------------
  // 2. PUBLIC ROUTES
  // -------------------------------------------------------------
  console.log("=== PUBLIC ROUTES ===");

  res = await request(app).get("/public/health");
  console.log("GET /public/health →", res.status, res.body);

  res = await request(app).get("/public/info");
  console.log("GET /public/info →", res.status, res.body, "\n");

  // -------------------------------------------------------------
  // 3. ADMIN: CREATE USER
  // -------------------------------------------------------------
  console.log("=== ADMIN: Create test user ===");

  res = await request(app)
    .post("/admin/users")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      email: "user@test.com",
      name: "John",
      lastname: "Doe",
    });

  const userId = res.body.userId;
  console.log("Test user created:", userId, "\n");

  // LOGIN USER
  console.log("=== AUTH: login user ===");
  res = await request(app).post("/auth/login").send({
    email: "user@test.com",
    password: "null", // test-users have no password
  });

  console.log(
    "Expected login failure for test user (normal):",
    res.status,
    "\n"
  );

  // -------------------------------------------------------------
  // 4. ADMIN: CREATE PROFILE
  // -------------------------------------------------------------
  console.log("=== ADMIN: Create Profile ===");

  res = await request(app)
    .post(`/admin/users/${userId}/profile`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      civility: "Mr",
      phone: 123456789,
      level: "A1",
    });

  console.log("Profile created → status:", res.status, "\n");

  // -------------------------------------------------------------
  // 5. ADMIN: CREATE FAMILY (AuPairFamily)
  // -------------------------------------------------------------
  console.log("=== ADMIN: Create AuPairFamily ===");

  res = await request(app)
    .post(`/admin/users/${userId}/family`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      familyname1: "Doe",
      familyname2: "Family",
      email: "family@test.com",
      phone: "0000000000",
      address: "123 Test Street",
    });

  console.log("Family created → status:", res.status, "\n");

  // -------------------------------------------------------------
  // 6. ADMIN: CREATE QUESTION
  // -------------------------------------------------------------
  console.log("=== ADMIN: Create question ===");

  res = await request(app)
    .post("/admin/questions")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      type: "QCM",
      text: "Bonjour = Hello ?",
      correctBool: true,
      points: 1,
      order: 1,
    });

  const questionId = res.body.questionId;
  console.log("Question created:", questionId, "\n");

  // -------------------------------------------------------------
  // 7. ADMIN: LIST QUESTIONS
  // -------------------------------------------------------------
  console.log("=== ADMIN: List questions ===");

  res = await request(app)
    .get("/admin/questions")
    .set("Authorization", `Bearer ${adminToken}`);

  console.log("Questions list status:", res.status, "→", res.body.length, "\n");

  // -------------------------------------------------------------
  // 8. ADMIN: CREATE TEST
  // -------------------------------------------------------------
  console.log("=== ADMIN: Create test ===");

  res = await request(app)
    .post(`/admin/users/${userId}/tests`)
    .set("Authorization", `Bearer ${adminToken}`);

  const testId = res.body.testId;
  console.log("Test created →", testId, "\n");

  // -------------------------------------------------------------
  // 9. ADMIN: SUBMIT TEST ANSWERS
  // -------------------------------------------------------------
  console.log("=== ADMIN: Submit answers ===");

  res = await request(app)
    .put(`/admin/users/${userId}/tests/${testId}`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      answers: [
        {
          questionId,
          answerBool: true,
        },
      ],
    });

  console.log("Submit answers →", res.status, "\n");

  // -------------------------------------------------------------
  // 10. ADMIN: GET SCORE
  // -------------------------------------------------------------
  console.log("=== ADMIN: Get score ===");

  res = await request(app)
    .get(`/admin/users/${userId}/tests/${testId}/score`)
    .set("Authorization", `Bearer ${adminToken}`);

  console.log("Score:", res.body, "\n");

  // -------------------------------------------------------------
  // 11. ADMIN: DELETE QUESTION
  // -------------------------------------------------------------
  console.log("=== ADMIN: Delete question ===");

  res = await request(app)
    .delete(`/admin/questions/${questionId}`)
    .set("Authorization", `Bearer ${adminToken}`);

  console.log("Delete question status:", res.status, "\n");

  // -------------------------------------------------------------
  // 12. ADMIN: DELETE TEST
  // -------------------------------------------------------------
  console.log("=== ADMIN: Delete test ===");

  res = await request(app)
    .delete(`/admin/users/${userId}/tests/${testId}`)
    .set("Authorization", `Bearer ${adminToken}`);

  console.log("Delete test status:", res.status, "\n");

  // -------------------------------------------------------------
  // 13. ADMIN: DELETE USER
  // -------------------------------------------------------------
  console.log("=== ADMIN: Delete user ===");

  res = await request(app)
    .delete(`/admin/users/${userId}`)
    .set("Authorization", `Bearer ${adminToken}`);

  console.log("Delete user status:", res.status, "\n");

  // -------------------------------------------------------------
  // 14. PROFILE ROUTES (user)
  // -------------------------------------------------------------
  console.log("=== PROFILE ROUTES (auth required) ===");
  console.log("(Users created via admin cannot login → skipping)", "\n");

  // -------------------------------------------------------------
  // 15. FAMILY ROUTES (user)
  // -------------------------------------------------------------
  console.log("=== FAMILY ROUTES (auth required) ===");
  console.log("(Same reason: skipping)", "\n");

  // -------------------------------------------------------------
  // FINISH
  // -------------------------------------------------------------
  await prisma.$disconnect();
  console.log("✔ All tests executed.");
}

run();
