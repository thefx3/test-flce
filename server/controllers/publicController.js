// controllers/publicController.js
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import profileModel from "../models/profileModel.js";
import testModel from "../models/testModel.js";
import questionModel from "../models/questionModel.js";

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
      await profileModel.createProfile(user.id, data);

      
    } else {
      // Check if profile exists
      const existingProfile = await profileModel.getProfileByUserId(user.id);
      if (!existingProfile) {
        await profileModel.createProfile(user.id, data);
      }
    }

    // 3. Create test
    const test = await testModel.createTest(user.id);

    // 4. Create session token for this test
    const secret = process.env.TEST_SESSION_SECRET;
    if (!secret) {
      console.error("TEST_SESSION_SECRET missing");
      return res
        .status(500)
        .json({ message: "Server misconfiguration (session secret)" });
    }

    const sessionToken = jwt.sign(
      { testId: test.id, createdAt: Date.now() },
      secret,
      { expiresIn: "2h" }
    );

    return res.status(201).json({
      userId: user.id,
      testId: test.id,
      sessionToken,
    });
  } catch (err) {
    console.error("Error starting test:", err);
    return res.status(500).json({ message: "Internal error" });
  }
}

// Public: get questions (NO corrections)
async function getQuestions(req, res) {
  try {
    const q = await questionModel.getAllPublic();
    res.json(q);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// Public: get single question (NO corrections)
async function getQuestion(req, res) {
  try {
    const id = Number(req.params.questionId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const q = await questionModel.getByIdPublic(id);
    if (!q) return res.status(404).json({ message: "Not found" });
    res.json(q);
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// Public: submit responses for anonymous test (session protected)
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
      test.responses.map(r => [r.questionId, r.id])
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
      where: { id: testId },
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


export default {
  startTest,
  getQuestions,
  getQuestion,
  submitResponses,
};
