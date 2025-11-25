// controllers/questionController.js
import questionModel from "../models/questionModel.js";

// All questions for the test - ADMIN ONLY (via routes middlewares)
async function getQuestionsAdmin(req, res) {
  try {
    const q = await questionModel.getAllAdmin();
    res.json(q);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// Single question - ADMIN ONLY
async function getQuestionAdmin(req, res) {
  try {
    const id = Number(req.params.questionId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const q = await questionModel.getByIdAdmin(id);
    if (!q) return res.status(404).json({ message: "Not found" });
    res.json(q);
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// Create question - ADMIN ONLY
async function createQuestion(req, res) {
  try {
    const data = req.body;

    // 1. Vérifier si un order est fourni
    if (data.order == null) {
      // 2. Si pas d'ordre → prendre le prochain disponible
      const last = await prisma.question.findFirst({
        orderBy: { order: "desc" },
        select: { order: true }
      });

      data.order = last ? last.order + 1 : 1;
    } else {
      // 3. Si un ordre est fourni → vérifier qu'il n'existe pas déjà
      const exists = await prisma.question.findUnique({
        where: { order: data.order }
      });

      if (exists) {
        return res
          .status(400)
          .json({ message: `Order ${data.order} already exists` });
      }
    }

    // 4. Créer la question
    const q = await questionModel.createQuestion(data);
    res.status(201).json(q);

  } catch (err) {
    console.error("Error creating question:", err);
    res.status(500).json({ message: "Internal error" });
  }
}


// Update question - ADMIN ONLY
async function updateQuestion(req, res) {
  try {
    const id = Number(req.params.questionId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const data = req.body;

    const q = await questionModel.updateQuestion(id, data);
    res.json(q);
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// Delete question - ADMIN ONLY
async function deleteQuestion(req, res) {
  try {
    const id = Number(req.params.questionId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    await questionModel.deleteQuestion(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

export default {
  getQuestionsAdmin,
  getQuestionAdmin,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
