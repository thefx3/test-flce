// controllers/questionController.js
import questionModel from "../models/questionModel.js";
import testModel from "../models/testModel.js";

class QuestionController {
//Public
async getAllQuestionsPublic(req, res, next) {
  try {
    const questions = await questionModel.getAllQuestionsPublic();
    res.json(questions);
  } catch (err) {
    next(err);
  }
}

async getSingleQuestionPublic(req, res, next) {
  try {
    const { questionId } = req.params;

    const question = await questionModel.getSingleQuestionPublic(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    next(err);
  }
}

//Admin
  async getAllQuestionsAdmin(req, res, next) {
    try {
      const questions = await questionModel.getAllQuestionsAdmin();
      res.json(questions);
    } catch (err) {
      next(err);
    }
  }

async getSingleQuestionAdmin(req, res, next) {
  try {
    const { questionId } = req.params;

    const question = await questionModel.getSingleQuestionAdmin(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    next(err);
  }
}

async createQuestion(req, res, next) {
  try {
    const data = req.body;

    const created = await questionModel.createQuestion(data);

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async updateQuestion(req, res, next) {
  try {
    const { questionId } = req.params;
    const data = req.body;

    const updated = await questionModel.updateQuestion(questionId, data);

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async deleteQuestion(req, res, next) {
  try {
    const { questionId } = req.params;

    const deleted = await questionModel.deleteQuestion(questionId);

    res.json({ message: "Question deleted", deleted });
  } catch (err) {
    next(err);
  }
}

async getScoreQuestion(req, res, next) {
  try {
    const { testId, questionId } = req.params;

    const questionScore = await testModel.getScoreOfQuestion(Number(testId), Number(questionId));

    res.json({ points : questionScore })
  } catch (err) {
    next(err);
  }
}

}
export default new QuestionController();
