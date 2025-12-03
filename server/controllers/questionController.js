// controllers/questionController.js
import questionModel from "../models/questionModel.js";
import testModel from "../models/testModel.js";

import fs from "fs";
import path from "path";
import prisma from "../prisma/prisma.js";

function readJson(relativePath) {
  const absolutePath = path.join(process.cwd(), relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}


class QuestionController {
//Public

async getQuestionsQCMPublic(req, res, next) {
  try {
    const questions = await questionModel.getQuestionsQCMPublic();
    return res.json(questions);
  } catch (err) {
    console.error("❌ QCM DB error, fallback JSON:", err.message);
    try {
      const fallback = readJson("server/data/tests/qcm.json");
      return res.json(fallback);
    } catch (jsonErr) {
      return next(jsonErr);
    }
  }
}

async getQuestionsVIDEOPublic(req, res, next) {
  try {
    let questions = await questionModel.getQuestionsVIDEOPublic();

    questions = questions.map((q) => {
      if (!q.video || !q.video.videoId) return q;

      const localUrl = `/videos/video${q.video.videoId}.mp4`;

      return {
        ...q,
        video: {
          ...q.video,
          url: localUrl,
        },
      };
    });

    return res.json(questions);
  } catch (err) {
    console.error("❌ VIDEO DB error, fallback JSON:", err.message);
    try {
      const fallback = readJson("server/data/tests/videos.json");

      const withLocalUrls = fallback.map((q) => {
        if (!q.video || !q.video.videoId) return q;
        return {
          ...q,
          video: {
            ...q.video,
            url: `/videos/video${q.video.videoId}.mp4`,
          },
        };
      });

      return res.json(withLocalUrls);
    } catch (jsonErr) {
      return next(jsonErr);
    }
  }
}

async getQuestionsOPENPublic(req, res, next) {
  try {
    const questions = await questionModel.getQuestionsOPENPublic();
    return res.json(questions);
  } catch (err) {
    console.error("❌ OPEN DB error, fallback JSON:", err.message);
    try {
      const fallback = readJson("server/data/tests/open.json");
      return res.json(fallback);
    } catch (jsonErr) {
      return next(jsonErr);
    }
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
async getQuestionsQCMAdmin(req, res, next) {
try {
  const questions = await questionModel.getQuestionsQCMAdmin();
  res.json(questions);
} catch (err) {
  next(err);
}
}

async getQuestionsVIDEOAdmin(req, res, next) {
try {
  const questions = await questionModel.getQuestionsVIDEOAdmin();
  res.json(questions);
} catch (err) {
  next(err);
}
}

async getQuestionsOPENAdmin(req, res, next) {
try {
  const questions = await questionModel.getQuestionsOPENAdmin();
  res.json(questions);
} catch (err) {
  next(err);
}
}

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

    const validTypes = ["QCM", "OPEN"];
    if (!validTypes.includes(data.type)) {
      return res.status(400).json({ message: "Invalid question type" });
    }
    if (!data.text || typeof data.text !== "string") {
      return res.status(400).json({ message: "Question text is required" });
    }
    if (data.order === undefined || data.order === null) {
      return res.status(400).json({ message: "Question order is required" });
    }

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
