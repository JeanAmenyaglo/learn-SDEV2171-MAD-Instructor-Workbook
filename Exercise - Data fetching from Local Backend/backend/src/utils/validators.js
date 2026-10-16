const MIN_PASSWORD_LENGTH = 8;

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function validateRegistrationInput({ name, email, password }) {
  if (!name || !email || !password) {
    return 'name, email, and password are required';
  }

  if (!isValidEmail(email)) {
    return 'email format is invalid';
  }

  if (String(password).length < MIN_PASSWORD_LENGTH) {
    return `password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  return null;
}

function validateLoginInput({ email, password }) {
  if (!email || !password) {
    return 'email and password are required';
  }

  if (!isValidEmail(email)) {
    return 'email format is invalid';
  }

  return null;
}

function isValidDate(date) {
  if (typeof date !== 'string') return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function validateNumericRouteId(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return 'A numeric record id is required';
  }

  return null;
}

function validateGigRecordInput({ date, title, category, value, rating, notes, details }) {
  if (
    !date ||
    !title ||
    !category ||
    value === undefined ||
    value === null ||
    value === '' ||
    rating === undefined ||
    rating === null ||
    rating === ''
  ) {
    return 'date, title, category, value, and rating are required';
  }

  if (!isValidDate(date)) {
    return 'date must be in YYYY-MM-DD format';
  }

  if (!String(title).trim()) {
    return 'title is required';
  }

  if (!String(category).trim()) {
    return 'category is required';
  }

  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 'value must be a non-negative number';
  }

  const parsedRating = Number(rating);
  if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return 'rating must be an integer between 1 and 5';
  }

  if (notes !== undefined && notes !== null && typeof notes !== 'string') {
    return 'notes must be a string when provided';
  }

  if (details !== undefined && details !== null && !isPlainObject(details)) {
    return 'details must be an object when provided';
  }

  return null;
}

function sanitizeRecordInput({ date, title, category, value, rating, notes, details }) {
  const normalizedDetails = isPlainObject(details) ? details : {};
  const normalizedNotes = typeof notes === 'string' ? notes.trim() : '';

  return {
    date: String(date).trim(),
    title: String(title).trim(),
    category: String(category).trim(),
    value: Number(value),
    rating: Number(rating),
    notes: normalizedNotes,
    details: normalizedDetails,
  };
}

module.exports = {
  MIN_PASSWORD_LENGTH,
  isValidEmail,
  normalizeEmail,
  validateRegistrationInput,
  validateLoginInput,
  validateNumericRouteId,
  validateGigRecordInput,
  sanitizeRecordInput,
};
