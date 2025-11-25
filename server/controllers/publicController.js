import userModel from "../models/userModel.js";
import profileModel from "../models/profileModel.js";
import testModel from "../models/testModel.js";

async function startTest(req, res) {
  try {
    const data = req.body;

    // 1. Create user
    const user = await userModel.createTestUser({
      email: data.email ?? null,
      name: data.name,
      lastname: data.lastname,
      aupair: data.aupair
    });

    // 2. Create profile
    await profileModel.createProfile(user.id, data);

    // 3. Create test
    const test = await testModel.createTest(user.id);

    return res.status(201).json({
      userId: user.id,
      testId: test.id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal error" });
  }
}

//All the question for the test - all user can access it
async function getQuestionsPublic(req, res) {
  try {
    const q = await questionModel.getAllPublic();
    res.json(q);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

// All user can access it
async function getQuestionPublic(req, res) {
  try {
    const id = Number(req.params.questionId);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const q = await questionModel.getByIdPublic(id);
    if (!q) return res.status(404).json({ message: "Not found" });
    res.json(q);
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({ message: "Internal error" });
  }
}

export default { 
  getQuestionsPublic,
  getQuestionPublic,
  startTest 
};
