// controllers/publicController.js
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import profileModel from "../models/profileModel.js";
import testModel from "../models/testModel.js";
import questionModel from "../models/questionModel.js";
import prisma from "../prisma/prisma.js";

// Start a new test (public)
async function startTest(req, res) {
  try {
    const data = req.body;

        // 1. Check if user exists
    let user = await userModel.getSingleUserByEmail(data.email);

    if (!user) {
      // Create user
      user = await userModel.createTestUser({
        email: data.email,
        name: data.name ?? null,
        lastname: data.lastname ?? null,
        aupair: data.aupair ?? false,
      });

      // Create profile only on first time
      await profileModel.createProfile(user.userId, data);

      
    } else {
      // Check if profile exists
      const existingProfile = await profileModel.getProfileByUserId(user.userId);
      if (!existingProfile) {
        await profileModel.createProfile(user.userId, data);
      }
    }

    // 3. Create test
    const test = await testModel.createTest(user.userId);

    // 4. Create session token for this test
    const secret = process.env.TEST_SESSION_SECRET;
    if (!secret) {
      console.error("TEST_SESSION_SECRET missing");
      return res
        .status(500)
        .json({ message: "Server misconfiguration (session secret)" });
    }

    const sessionToken = jwt.sign(
      { testId: test.testId, createdAt: Date.now() },
      secret,
      { expiresIn: "2h" }
    );

    return res.status(201).json({
      userId: user.userId,
      testId: test.testId,
      sessionToken,
    });
  } catch (err) {
    console.error("Error starting test:", err);
    return res.status(500).json({ message: "Internal error" });
  }
}

async function submitResponses(req, res) {
  try {
    const testId = Number(req.params.testId);
    if (Number.isNaN(testId)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // Support both formats: [{...}] or { responses: [...] }
    const incoming =
      Array.isArray(req.body) ? req.body : req.body.responses;

    if (!Array.isArray(incoming)) {
      return res
        .status(400)
        .json({ message: "Responses must be an array" });
    }

    // Load the test WITH all TestResponse rows
    const test = await testModel.getTestById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    // Build a map: questionId → responseId
    const mapQtoR = new Map(
      test.responses.map(r => [r.questionId, r.responseId])
    );

    // Convert questionId → responseId
    const converted = [];

    for (const r of incoming) {
      if (!mapQtoR.has(r.questionId)) {
        return res.status(403).json({
          message: `Question ${r.questionId} does not belong to test ${testId}`,
        });
      }

      converted.push({
        responseId: mapQtoR.get(r.questionId),
        answerBool: r.answerBool ?? null,
        answerText: r.answerText ?? "",
      });
    }

    // Save in DB
    await testModel.submitAnswers(converted);

    await prisma.test.update({
      where: { testId },
      data: { status: "SUBMITTED" }
    });

    return res.json({
      message: "Responses saved (via questionId)",
    });
  } catch (err) {
    console.error("Error submitting public responses:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function submitComment(req, res) {
  try {
    const testId = Number(req.params.testId);
    if (Number.isNaN(testId)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const comment = (req.body?.comment || "").trim();
    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    // Find test to get userId
    const test = await prisma.test.findUnique({
      where: { testId },
      select: { userId: true },
    });
    if (!test) return res.status(404).json({ message: "Test not found" });

    await prisma.user.update({
      where: { userId: test.userId },
      data: { comment },
    });

    return res.json({ message: "Comment saved" });
  } catch (err) {
    console.error("Error submitting comment:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

export default {
  startTest,
  submitResponses,
  submitComment,
};
