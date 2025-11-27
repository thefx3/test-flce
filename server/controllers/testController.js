// controllers/testController.js
import testModel from "../models/testModel.js";
import prisma from "../prisma/prisma.js";

const isAdmin = (role) => role === "ADMIN" || role === "SUPERADMIN";

// POST /tests/create/:userId  (admin)
async function createTest(req, res) {
  try {
    if (!isAdmin(req.user?.role)) {
      return res.status(403).json({ message: "Admin only" });
    }

    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const test = await testModel.createTest(userId);
    res.status(201).json(test);
  } catch (err) {
    console.error("Error creating test:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// GET /tests/:testId  (admin)
async function getTest(req, res) {
  try {
    if (!isAdmin(req.user?.role)) {
      return res.status(403).json({ message: "Admin only" });
    }

    const testId = Number(req.params.testId);
    if (Number.isNaN(testId)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const test = await testModel.getTestAdmin(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    res.json(test);
  } catch (err) {
    console.error("Error fetching test:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// GET /tests  (admin)
async function getAllTests(req, res) {
  try {
    if (!isAdmin(req.user?.role)) {
      return res.status(403).json({ message: "Admin only" });
    }

    const tests = await testModel.getAllTests();
    res.json(tests);
  } catch (err) {
    console.error("Error fetching all tests:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

  async function deleteTest(req, res) {
    try {
      const testId = Number(req.params.testId);
      if (Number.isNaN(testId)) {
        return res.status(400).json({ message: "Invalid testId" });
      }

      await testModel.deleteTest(testId);
      res.json({ message: "Deleted" });
    } catch (err) {
      console.error("Error deleting question:", err);
      res.status(500).json({ message: "Internal error" });
    }
  }

// POST /tests/:testId/responses  (admin-only, pour l’instant)
async function submitResponses(req, res) {
  try {
    if (!isAdmin(req.user?.role)) {
      return res.status(403).json({ message: "Admin only" });
    }

    const testId = Number(req.params.testId);
    if (Number.isNaN(testId)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const responses =
      Array.isArray(req.body) ? req.body : req.body.responses;
    if (!Array.isArray(responses)) {
      return res
        .status(400)
        .json({ message: "responses must be an array" });
    }

    const test = await testModel.getTestAdmin(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const allowedIds = new Set(test.responses.map((r) => r.responseId));
    const invalid = responses.find(
      (r) => !allowedIds.has(r.responseId)
    );
    if (invalid) {
      return res
        .status(403)
        .json({ message: "One or more responses do not belong to this test" });
    }

    await testModel.submitAnswers(responses);

    await prisma.test.update({
      where: { testId },
      data: { status: "AUTO_GRADED" }
    });

    const updated = await testModel.getTestAdmin(testId);
    res.json(updated);
  } catch (err) {
    console.error("Error submitting responses:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// POST /tests/:testId/grade-auto  (admin)
async function gradeAuto(req, res) {
  try {
    if (!isAdmin(req.user?.role)) {
      return res.status(403).json({ message: "Admin only" });
    }

    const testId = Number(req.params.testId);
    if (Number.isNaN(testId)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const test = await testModel.getTestAdmin(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    await testModel.gradeAuto(testId);

    await prisma.test.update({
      where: { testId },
      data: { status: "AUTO_GRADED" }
    });
    
    const updated = await testModel.getTestAdmin(testId);
    res.json(updated);
  } catch (err) {
    console.error("Error auto-grading test:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// POST /tests/:testId/grade-manual  (admin)
async function gradeManual(req, res) {
  try {
    if (!isAdmin(req.user?.role)) {
      return res.status(403).json({ message: "Admin only" });
    }

    const testId = Number(req.params.testId);
    if (Number.isNaN(testId)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const grades =
      Array.isArray(req.body) ? req.body : req.body.grades;
    if (!Array.isArray(grades)) {
      return res
        .status(400)
        .json({ message: "grades must be an array" });
    }

    const test = await testModel.getTestAdmin(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    await testModel.gradeManual(grades);

    await prisma.test.update({
      where: { testId },
      data: { status: "CORRECTED" }
    });

    
    const updated = await testModel.getTestAdmin(testId);
    res.json(updated);
  } catch (err) {
    console.error("Error manual-grading test:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// -------------------------------
// Get score of ONE question
// -------------------------------
async function getScoreOfQuestion(req, res) {
  try {
    const testId = Number(req.params.testId);
    const questionId = Number(req.params.questionId);

    if (isNaN(testId) || isNaN(questionId)) {
      return res.status(400).json({ message: "Invalid ids" });
    }

    const score = await testModel.getScoreOfQuestion(testId, questionId);

    return res.json({ testId, questionId, score });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// -------------------------------
// Get total score of a test
// -------------------------------
async function getScoreOfTest(req, res) {
  try {
    const testId = Number(req.params.testId);

    if (isNaN(testId)) {
      return res.status(400).json({ message: "Invalid testId" });
    }

    const total = await testModel.getScoreOfTest(testId);

    return res.json({ testId, totalScore: total });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal error" });
  }
}


export default {
  createTest,
  getTest,
  submitResponses,
  getAllTests,
  deleteTest,
  gradeAuto,
  gradeManual,
  getScoreOfQuestion,
  getScoreOfTest
};
