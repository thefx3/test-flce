// adminQuestionController.js
import questionModel from "../models/questionModel.js";


//All the question for the test - all user can access it
async function getQuestions(req, res) {
  try {
    const q = await questionModel.getAll();
    res.json(q);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// All user can access it
async function getQuestion(req, res) {
  try {
    const id = Number(req.params.questionId);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const q = await questionModel.getById(id);
    if (!q) return res.status(404).json({ message: "Not found" });
    res.json(q);
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

//Only admin
async function createQuestion(req, res) {
  try {
    const data = req.body;
    const q = await questionModel.create(data);
    res.status(201).json(q);
  } catch (err) {
    console.error("Error creating question:", err);
    res.status(500).json({ message: "Internal error" });
  }
}


//Only admin
async function updateQuestion(req, res) {
  try {
    const id = Number(req.params.questionId);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
    const data = req.body;

    const q = await questionModel.update(id, data);
    res.json(q);
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(500).json({ message: "Internal error" });
  }
}


//Only admin
async function deleteQuestion(req, res) {
  try {
    const id = Number(req.params.questionId);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    await questionModel.delete(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

export default {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion
};
