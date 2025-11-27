// controllers/testController.js
import testModel from "../models/testModel.js";

class TestController {

//Public
async getAllTests(req, res, next) {
    try {
      const { userId } = req.params;

      const tests = await testModel.getAllTestsByUserId(Number(userId));

      res.json(tests);
    } catch (err) {
      next(err);
    }
}

async getSingleTest(req, res, next) {
  try {
    const { testId } = req.params;

    const test = await testModel.getTestById(Number(testId));

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json(test);
  } catch (err) {
    next(err);
  }
}

async createTest(req, res, next) {
  try {
    const { userId } = req.params;

    const test = await testModel.createTest(Number(userId));

    res.status(201).json(test);
  } catch (err) {
    next(err);
  }
}

async updateTest(req, res, next) {
  try {
    const { testId } = req.params;
    const data = req.body;

    const updated = await testModel.updateTest(Number(testId), data);

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async submitResponses(req, res, next) {
  try {
    const answers = req.body.answers;

    const result = await testModel.submitAnswers(answers);

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
    const { testId } = req.params;

    const test = await testModel.getSingleTestAdmin(Number(testId));

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
    const { testId } = req.params;

    await testModel.deleteSingleTest(Number(testId));

    res.json({ message: "Test deleted" });
  } catch (err) {
    next(err);
  }
}

async gradeAuto(req, res, next) {
  try {
    const { testId } = req.params;

    const graded = await testModel.gradeAuto(Number(testId));

    res.json(graded);
  } catch (err) {
    next(err);
  }
}

async gradeManual(req, res, next) {
  try {
    const grades = req.body.grades;

    const result = await testModel.gradeManual(grades);

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async getScoreOfTest(req, res, next) {
  try {
    const { userId, testId } = req.params;

    const existing = await testModel.getSingleTestAdmin(Number(userId));
    if (!existing) return res.status(404).json({ message: "Test not found" });

    const totalScore = await testModel.getScoreOfTest(Number(testId));

    res.json({ score: totalScore });
  } catch (err) {
    next(err);
  }
}

}

export default new TestController();
