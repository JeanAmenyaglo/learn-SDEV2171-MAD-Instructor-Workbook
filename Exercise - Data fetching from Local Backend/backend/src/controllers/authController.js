const bcrypt = require('bcrypt');
const { readDb, writeDb } = require('../utils/db');
const { signAccessToken } = require('../utils/jwt');
const {
  normalizeEmail,
  validateRegistrationInput,
  validateLoginInput,
} = require('../utils/validators');

function toSafeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const validationError = validateRegistrationInput({ name, email, password });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const db = await readDb();
    const normalizedEmail = normalizeEmail(email);

    const existingUser = db.users.find(
      (user) => normalizeEmail(user.email) === normalizedEmail
    );

    if (existingUser) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: generateId('user'),
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    await writeDb(db);

    const token = signAccessToken(newUser);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: toSafeUser(newUser),
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const validationError = validateLoginInput({ email, password });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const db = await readDb();
    const normalizedEmail = normalizeEmail(email);

    const user = db.users.find((item) => normalizeEmail(item.email) === normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signAccessToken(user);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: toSafeUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    const db = await readDb();
    const user = db.users.find((item) => item.id === req.auth.userId);

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    return res.status(200).json({ user: toSafeUser(user) });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  me,
};
