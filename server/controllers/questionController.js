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

    // ---------------------------
    // 1. VALIDATION DU TYPE
    // ---------------------------
    const validTypes = ["QCM", "VIDEO", "OPEN"];
    if (!validTypes.includes(data.type)) {
      return res.status(400).json({ message: "Invalid question type" });
    }

    // ---------------------------
    // 2. VALIDATION LOGIQUE PAR TYPE
    // ---------------------------

    if (data.type === "QCM" || data.type === "VIDEO") {
      // correctBool obligatoire
      if (typeof data.correctBool !== "boolean") {
        return res
          .status(400)
          .json({ message: "correctBool is required for QCM/VIDEO" });
      }

      // correctText interdit
      if (data.correctText !== undefined) {
        return res
          .status(400)
          .json({ message: "correctText must NOT be used for QCM/VIDEO" });
      }
    }

    if (data.type === "OPEN") {
      // OPEN ne doit PAS avoir correctBool
      if (data.correctBool !== undefined) {
        return res
          .status(400)
          .json({ message: "correctBool must NOT be used for OPEN questions" });
      }

      // correctText obligatoire
      if (!data.correctText || typeof data.correctText !== "string") {
        return res
          .status(400)
          .json({ message: "correctText is required for OPEN questions" });
      }
    }

    // ---------------------------
    // 3. GESTION DE L'ORDER
    // ---------------------------

    if (data.order == null) {
      const last = await prisma.question.findFirst({
        orderBy: { order: "desc" },
        select: { order: true }
      });

      data.order = last ? last.order + 1 : 1;
    } else {
      const exists = await prisma.question.findUnique({
        where: { order: data.order }
      });

      if (exists) {
        return res
          .status(400)
          .json({ message: `Order ${data.order} already exists` });
      }
    }

    // ---------------------------
    // 4. CRÉATION DE LA QUESTION
    // ---------------------------
    const q = await questionModel.createQuestion(data);
    return res.status(201).json(q);

  } catch (err) {
    console.error("Error creating question:", err);
    return res.status(500).json({ message: "Internal error" });
  }
}



// Update question - ADMIN ONLY
// Update question - ADMIN ONLY
async function updateQuestion(req, res) {
  try {
    const id = Number(req.params.questionId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const data = req.body;

    // 1. Vérifier que la question existe
    const existing = await questionModel.getByIdAdmin(id);
    if (!existing) {
      return res.status(404).json({ message: "Question not found" });
    }

    // 2. Gestion de order : vérifier unicité si fourni
    if (data.order != null) {
      if (data.order !== existing.order) {  
        // Vérifier seulement si changement réel
        const exists = await prisma.question.findUnique({
          where: { order: data.order }
        });

        if (exists) {
          return res
            .status(400)
            .json({ message: `Order ${data.order} already exists` });
        }
      }
    }

    // 3. Validation logique selon le type
    if (data.type) {
      const validTypes = ["QCM", "VIDEO", "OPEN"];
      if (!validTypes.includes(data.type)) {
        return res.status(400).json({ message: "Invalid question type" });
      }
    }

    const type = data.type ?? existing.type;

    // 4. Types : validations cohérentes
    if (type === "QCM" || type === "VIDEO") {
      if (data.correctText !== undefined) {
        return res
          .status(400)
          .json({ message: "correctText must NOT be used for QCM/VIDEO" });
      }
      if (data.correctBool === undefined && existing.correctBool == null) {
        return res
          .status(400)
          .json({ message: "correctBool is required for QCM/VIDEO" });
      }
    }

    if (type === "OPEN") {
      if (data.correctBool !== undefined) {
        return res
          .status(400)
          .json({ message: "correctBool must NOT be used for OPEN questions" });
      }
      if (data.correctText === undefined && existing.correctText == null) {
        return res
          .status(400)
          .json({ message: "correctText is required for OPEN questions" });
      }
    }

    // 5. Mise à jour réelle via model
    const q = await questionModel.update(id, data);
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
