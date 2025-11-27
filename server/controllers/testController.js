// controllers/testController.js
import testModel from "../models/testModel.js";

const isAdmin = (user) =>
  user?.role === "ADMIN" || user?.role === "SUPERADMIN";

function parseId(raw, label, res) {
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    res.status(400).json({ message: `Invalid ${label}` });
    return null;
  }
  return value;
}

async function ensureTestAccess({ testId, userIdParam, req, res }) {
  const test = await testModel.getTestById(testId);
  if (!test) {
    res.status(404).json({ message: "Test not found" });
    return null;
  }

  // If a userId is present in the route, ensure it matches the test owner
  if (
    userIdParam !== undefined &&
    Number(test.userId) !== Number(userIdParam)
  ) {
    res.status(404).json({ message: "Test not found for this user" });
    return null;
  }

  // Regular users can only interact with their own tests
  if (!isAdmin(req.user) && Number(req.user?.userId) !== Number(test.userId)) {
    res.status(403).json({ message: "Not allowed on this test" });
    return null;
  }

  return test;
}

class TestController {

//Public
async getAllTests(req, res, next) {
    try {
      const userId = parseId(req.params.userId, "user id", res);
      if (!userId) return;

      const tests = await testModel.getAllTestsByUserId(userId);

      res.json(tests);
    } catch (err) {
      next(err);
    }
}

async getSingleTest(req, res, next) {
  try {
    const testId = parseId(req.params.testId, "test id", res);
    if (!testId) return;

    const test = await ensureTestAccess({
      testId,
      userIdParam: req.params.userId,
      req,
      res,
    });

    if (!test) return;

    res.json(test);
  } catch (err) {
    next(err);
  }
}

async createTest(req, res, next) {
  try {
    const userId = parseId(req.params.userId, "user id", res);
    if (!userId) return;

    // Owner check is done by middleware; still guard against mismatch if token is present
    if (!isAdmin(req.user) && Number(req.user?.userId) !== userId) {
      return res.status(403).json({ message: "Not allowed to create test" });
    }

    const test = await testModel.createTest(userId);

    res.status(201).json(test);
  } catch (err) {
    next(err);
  }
}

async updateTest(req, res, next) {
  try {
    const testId = parseId(req.params.testId, "test id", res);
    if (!testId) return;
    const data = req.body;

    const test = await ensureTestAccess({
      testId,
      userIdParam: req.params.userId,
      req,
      res,
    });
    if (!test) return;

    const updated = await testModel.updateTest(testId, data);

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async submitResponses(req, res, next) {
  try {
    const testId = parseId(req.params.testId, "test id", res);
    if (!testId) return;

    const answers = req.body.answers;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be an array" });
    }

    const test = await ensureTestAccess({
      testId,
      userIdParam: req.params.userId,
      req,
      res,
    });
    if (!test) return;

    const result = await testModel.submitAnswers(answers);

    // Mark the test as submitted once answers are stored
    await testModel.updateTest(testId, { status: "SUBMITTED" });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

//Admin
async getAllTestsAdmin(req, res, next) {
  try {
    const tests = await testModel.getAllTests();
    res.json(tests);
  } catch (err) {
    next(err);
  }
}

async getTestAdmin(req, res, next) {
  try {
    const testId = parseId(req.params.testId, "test id", res);
    if (!testId) return;

    const test = await testModel.getSingleTestAdmin(testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json(test);
  } catch (err) {
    next(err);
  }
}

async deleteTest(req, res, next) {
  try {
    const testId = parseId(req.params.testId, "test id", res);
    if (!testId) return;

    await testModel.deleteSingleTest(testId);

    res.json({ message: "Test deleted" });
  } catch (err) {
    next(err);
  }
}

async gradeAuto(req, res, next) {
  try {
    const testId = parseId(req.params.testId, "test id", res);
    if (!testId) return;

    const graded = await testModel.gradeAuto(testId);

    res.json(graded);
  } catch (err) {
    next(err);
  }
}

async gradeManual(req, res, next) {
  try {
    const testId = parseId(req.params.testId, "test id", res);
    if (!testId) return;

    const grades = req.body.grades;

    const result = await testModel.gradeManual(grades);

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async getScoreOfTest(req, res, next) {
  try {
    const testId = parseId(req.params.testId, "test id", res);
    if (!testId) return;

    const test = await testModel.getSingleTestAdmin(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });
    if (req.params.userId && Number(req.params.userId) !== Number(test.userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const totalScore = await testModel.getScoreOfTest(testId);

    res.json({ score: totalScore });
  } catch (err) {
    next(err);
  }
}

}

export default new TestController();
