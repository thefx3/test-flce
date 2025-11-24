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

export default { startTest };
