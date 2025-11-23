const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');


async function register(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    const [existingEmail, existingUsername] = await Promise.all([
      UserModel.getUserByEmail(email),
      UserModel.getUserByUsername(username),
    ]);

    if (existingEmail) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    if (existingUsername) {
      return res.status(409).json({ message: 'User with this username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.createUser({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'User registered successfully.', userId: newUser.id });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.',
     });
  }

  try {
    const user = await UserModel.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password.'});
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ message: "Login success", token });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function loginSuccess(req, res) {
  try {
    const user = await UserModel.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { id, username, email, role } = user;
    return res.json({ id, username, email, role });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

//logout = delete the token from the front-end React 

module.exports = {
  register,
  login,
  loginSuccess
}
