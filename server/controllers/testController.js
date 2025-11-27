// controllers/testController.js
import TestModel from "../models/testModel.js";

class TestController {

  /* ====================================================
                    USER (OWNER)
  ==================================================== */

  // GET /tests/user/:userId
  async getAllTests(req, res, next) {
    try {
      const { userId } = req.params;

      const tests = await TestModel.getAllTestsByUserId(Number(userId));

      res.json(tests);
    } catch (err) {
      next(err);
    }
  }

  // GET /tests/user/:userId/test/:testId
  async getSingleTest(req, res, next) {
    try {
      const { testId } = req.params;

      const test = await TestModel.getTestById(Number(testId));

      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }

      res.json(test);
    } catch (err) {
      next(err);
    }
  }

  // POST /tests/user/:userId
  async createTest(req, res, next) {
    try {
      const { userId } = req.params;

      const test = await TestModel.createTest(Number(userId));

      res.status(201).json(test);
    } catch (err) {
      next(err);
    }
  }

  // PUT /tests/user/:userId/test/:testId
  async updateTest(req, res, next) {
    try {
      const { testId } = req.params;
      const data = req.body;

      const updated = await TestModel.updateTest(Number(testId), data);

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  // POST /tests/:testId/responses
  async submitResponses(req, res, next) {
    try {
      const answers = req.body.answers;

      const result = await TestModel.submitAnswers(answers);

      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /* ====================================================
                        ADMIN
  ==================================================== */

  // GET /tests/
  async getAllTestsAdmin(req, res, next) {
    try {
      const tests = await TestModel.getAllTests();
      res.json(tests);
    } catch (err) {
      next(err);
    }
  }

  // GET /tests/:testId
  async getTestAdmin(req, res, next) {
    try {
      const { testId } = req.params;

      const test = await TestModel.getSingleTestAdmin(Number(testId));

      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }

      res.json(test);
    } catch (err) {
      next(err);
    }
  }

  // DELETE /tests/:testId
  async deleteTest(req, res, next) {
    try {
      const { testId } = req.params;

      await TestModel.deleteSingleTest(Number(testId));

      res.json({ message: "Test deleted" });
    } catch (err) {
      next(err);
    }
  }

  // POST /tests/:testId/grade-auto
  async gradeAuto(req, res, next) {
    try {
      const { testId } = req.params;

      const graded = await TestModel.gradeAuto(Number(testId));

      res.json(graded);
    } catch (err) {
      next(err);
    }
  }

  // POST /tests/:testId/grade-manual
  async gradeManual(req, res, next) {
    try {
      const grades = req.body.grades;

      const result = await TestModel.gradeManual(grades);

      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  // GET /tests/:testId/score
  async getScoreOfTest(req, res, next) {
    try {
      const { testId } = req.params;

      const totalScore = await TestModel.getScoreOfTest(Number(testId));

      res.json({ score: totalScore });
    } catch (err) {
      next(err);
    }
  }

}

export default new TestController();
