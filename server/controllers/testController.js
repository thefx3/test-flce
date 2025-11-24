// testController.js
import testModel from "../models/testModel.js";

const isAdmin = (role) => role === "ADMIN" || role === "SUPERADMIN";

const formatTest = (test) => {
  if (!test) return null;
  const { testresponse, ...rest } = test;
  return { ...rest, responses: testresponse ?? [] };
};

async function createTest(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const test = await testModel.createTest(userId);
    res.status(201).json(formatTest(test));
  } catch (err) {
    console.error("Error creating test:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function getTests(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const tests = await testModel.getTestByUserId(userId);
    res.json(tests.map(formatTest));
  } catch (err) {
    console.error("Error fetching tests:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function getTest(req, res) {
  try {
    const testId = Number(req.params.testId);
    if (Number.isNaN(testId)) return res.status(400).json({ message: "Invalid id" });

    const test = await testModel.getTestById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });
    if (test.userId !== req.user?.userId && !isAdmin(req.user?.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(formatTest(test));
  } catch (err) {
    console.error("Error fetching test:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function submitResponses(req, res) {
  try {
    const testId = Number(req.params.testId);
    if (Number.isNaN(testId)) return res.status(400).json({ message: "Invalid id" });
    const responses = Array.isArray(req.body) ? req.body : req.body.responses;
    if (!Array.isArray(responses)) return res.status(400).json({ message: "responses must be an array" });

    const test = await testModel.getTestById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });
    if (test.userId !== req.user?.userId && !isAdmin(req.user?.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await testModel.submitResponses(testId, responses);
    const updated = await testModel.getTestById(testId);
    res.json(formatTest(updated));
  } catch (err) {
    console.error("Error submitting responses:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function gradeAuto(req, res) {
  try {
    const testId = Number(req.params.id);
    if (Number.isNaN(testId)) return res.status(400).json({ message: "Invalid id" });

    const test = await testModel.getTestById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });
    if (test.userId !== req.user?.userId && !isAdmin(req.user?.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const graded = await testModel.gradeAuto(testId);
    res.json(formatTest(graded));
  } catch (err) {
    console.error("Error auto-grading test:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

async function gradeManual(req, res) {
  try {
    if (!isAdmin(req.user?.role)) {
      return res.status(403).json({ message: "Admin only" });
    }

    const testId = Number(req.params.id);
    if (Number.isNaN(testId)) return res.status(400).json({ message: "Invalid id" });
    const grades = Array.isArray(req.body) ? req.body : req.body.grades;
    if (!Array.isArray(grades)) return res.status(400).json({ message: "grades must be an array" });

    const test = await testModel.getTestById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const graded = await testModel.gradeManual(testId, grades);
    res.json(formatTest(graded));
  } catch (err) {
    console.error("Error manual-grading test:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

export default {
  createTest,
  getTests,
  getTest,
  submitResponses,
  gradeAuto,
  gradeManual,
};
