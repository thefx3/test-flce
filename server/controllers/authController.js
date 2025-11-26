// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const isAdmin = (role) => role === "ADMIN" || role === "SUPERADMIN";

// ====================== ADMIN REGISTER ======================
async function register(req, res) {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const existingEmail = await userModel.getSingleAdminByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.createAdmin({
      email,
      password: hashedPassword,
      role: role && isAdmin(role) ? role : "ADMIN",
    });

    return res.status(201).json({
      message: "User registered successfully.",
      userId: newUser.userId,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

// ====================== ADMIN LOGIN ======================
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await userModel.getSingleAdminByEmail(email);

    if (!user || !isAdmin(user.role) || !user.password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    return res.json({ message: "Login success", token });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

// ====================== ADMIN LOGIN SUCCESS ======================
async function loginSuccess(req, res) {
  try {
    const user = await userModel.getSingleAdminById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { userId, email, role, name, lastname } = user;
    return res.json({ userId, email, role, name, lastname });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

// ====================== USER LOGIN (EMAIL ONLY) ======================
async function loginUser(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await userModel.getSingleUserByEmail(email);

    // user DOES NOT use password
    if (!user || user.role !== "USER") {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a USER token
    const token = jwt.sign(
      { userId: user.userId, role: "USER" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      message: "Login success",
      token,
      userId: user.userId,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export default {
  register,
  login,
  loginUser,   // 👈 ajouté
  loginSuccess,
};
