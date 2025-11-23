const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");
const PostModel = require("../models/postModel");

function parseBooleanQuery(value) {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return null;
}

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...publicUser } = user;
  return publicUser;
}

async function listUsers(req, res) {
  try {
    const users = await UserModel.getAllUsers();
    return res.json(users.map(sanitizeUser));
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function getSingleUser(req, res) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  try {
    const user = await UserModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.json(sanitizeUser(user));
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function createUser(req, res) {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email and password are required." });
  }

  try {
    const [existingEmail, existingUsername] = await Promise.all([
      UserModel.getUserByEmail(email),
      UserModel.getUserByUsername(username),
    ]);

    if (existingEmail) {
      return res.status(409).json({ message: "Email already in use." });
    }

    if (existingUsername) {
      return res.status(409).json({ message: "Username already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.createUser({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json(sanitizeUser(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function updateUser(req, res) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  const { username, email, password, role } = req.body;

  if (!username && !email && !password && !role) {
    return res.status(400).json({ message: "No fields provided for update." });
  }

  try {
    const existingUser = await UserModel.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const payload = {};

    if (username && username !== existingUser.username) {
      const usernameTaken = await UserModel.getUserByUsername(username);
      if (usernameTaken && usernameTaken.id !== id) {
        return res.status(409).json({ message: "Username already in use." });
      }
      payload.username = username;
    }

    if (email && email !== existingUser.email) {
      const emailTaken = await UserModel.getUserByEmail(email);
      if (emailTaken && emailTaken.id !== id) {
        return res.status(409).json({ message: "Email already in use." });
      }
      payload.email = email;
    }

    if (password) {
      payload.password = await bcrypt.hash(password, 10);
    }

    if (role) {
      payload.role = role;
    }

    const updatedUser = await UserModel.updateUser(id, payload);
    return res.json(sanitizeUser(updatedUser));
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function deleteUser(req, res) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  try {
    const user = await UserModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await UserModel.deleteUser(id);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function listPostsByUser(req, res) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  try {
    const user = await UserModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const publishedFlag = parseBooleanQuery(req.query.published);
    if (publishedFlag === null) {
      return res.status(400).json({ message: "Invalid published query value. Use true or false." });
    }

    const filters = { authorId: id };
    if (publishedFlag !== undefined) {
      filters.published = publishedFlag;
    }

    const posts = await PostModel.getAllPosts(filters);
    return res.json(posts);
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  listUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  listPostsByUser,
};
