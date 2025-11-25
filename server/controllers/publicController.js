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

    // 1. Create user (test user)
    const user = await userModel.createTestUser({
      email: data.email ?? null,
      name: data.name ?? null,
      lastname: data.lastname ?? null,
      aupair: data.aupair ?? false,
    });

    // 2. Create profile
    await profileModel.createProfile(user.id, data);

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

    const responses =
      Array.isArray(req.body) ? req.body : req.body.responses;
    if (!Array.isArray(responses)) {
      return res
        .status(400)
        .json({ message: "Responses must be an array" });
    }

    const test = await testModel.getTestById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const responseIdsAllowed = new Set(
      test.responses.map((r) => r.id)
    );
    const invalid = responses.find(
      (r) => !responseIdsAllowed.has(r.responseId)
    );
    if (invalid) {
      return res
        .status(403)
        .json({ message: "One or more responses do not belong to this test" });
    }

    await testModel.submitAnswers(responses);

    return res.json({ message: "Responses saved" });
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
