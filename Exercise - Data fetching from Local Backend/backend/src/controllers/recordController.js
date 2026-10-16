const { readDb, writeDb } = require('../utils/db');
const {
  sanitizeRecordInput,
  validateGigRecordInput,
  validateNumericRouteId,
} = require('../utils/validators');

function generateNumericId(records) {
  const numericIds = records
    .map((record) => Number(record.id))
    .filter((id) => Number.isInteger(id) && id > 0);

  if (numericIds.length === 0) return 1;
  return Math.max(...numericIds) + 1;
}

function toGigRecord(record) {
  return {
    id: record.id,
    userId: record.userId,
    date: record.date,
    title: record.title,
    category: record.category,
    value: record.value,
    rating: record.rating,
    notes: record.notes,
    details: record.details,
  };
}

function isTargetRecord(recordId, targetId) {
  return String(recordId) === String(targetId);
}

function findOwnedRecord(records, recordId, userId) {
  const record = records.find((item) => isTargetRecord(item.id, recordId));

  if (!record) {
    return null;
  }

  if (record.userId !== userId) {
    return null;
  }

  return record;
}

async function getRecords(req, res, next) {
  try {
    const db = await readDb();
    const userRecords = db.entries
      .filter((record) => record.userId === req.auth.userId)
      .map(toGigRecord);

    return res.status(200).json({ records: userRecords });
  } catch (error) {
    return next(error);
  }
}

async function getRecordById(req, res, next) {
  try {
    const routeError = validateNumericRouteId(req.params.id);
    if (routeError) {
      return res.status(400).json({ error: routeError });
    }

    const db = await readDb();
    const record = findOwnedRecord(db.entries, req.params.id, req.auth.userId);

    if (!record) {
      return res.status(404).json({ error: 'Gig record not found' });
    }

    return res.status(200).json({ record: toGigRecord(record) });
  } catch (error) {
    return next(error);
  }
}

async function createRecord(req, res, next) {
  try {
    const validationError = validateGigRecordInput(req.body);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const input = sanitizeRecordInput(req.body);
    const db = await readDb();
    const newRecord = {
      id: generateNumericId(db.entries),
      userId: req.auth.userId,
      ...input,
    };

    db.entries.push(newRecord);
    await writeDb(db);

    return res.status(201).json({
      message: 'Gig record created',
      record: toGigRecord(newRecord),
    });
  } catch (error) {
    return next(error);
  }
}

async function updateRecord(req, res, next) {
  try {
    const routeError = validateNumericRouteId(req.params.id);
    if (routeError) {
      return res.status(400).json({ error: routeError });
    }

    const validationError = validateGigRecordInput(req.body);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const input = sanitizeRecordInput(req.body);
    const db = await readDb();
    const record = findOwnedRecord(db.entries, req.params.id, req.auth.userId);

    if (!record) {
      return res.status(404).json({ error: 'Gig record not found' });
    }

    record.date = input.date;
    record.title = input.title;
    record.category = input.category;
    record.value = input.value;
    record.rating = input.rating;
    record.notes = input.notes;
    record.details = input.details;

    await writeDb(db);

    return res.status(200).json({
      message: 'Gig record updated',
      record: toGigRecord(record),
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteRecord(req, res, next) {
  try {
    const routeError = validateNumericRouteId(req.params.id);
    if (routeError) {
      return res.status(400).json({ error: routeError });
    }

    const db = await readDb();
    const index = db.entries.findIndex((item) => isTargetRecord(item.id, req.params.id));

    if (index === -1 || db.entries[index].userId !== req.auth.userId) {
      return res.status(404).json({ error: 'Gig record not found' });
    }

    const [deletedRecord] = db.entries.splice(index, 1);
    await writeDb(db);

    return res.status(200).json({
      message: 'Gig record deleted',
      record: toGigRecord(deletedRecord),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};
