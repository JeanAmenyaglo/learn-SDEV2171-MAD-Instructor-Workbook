const { readDb } = require('../utils/db');
const { validateNumericRouteId } = require('../utils/validators');

function toSampleRecord(record) {
  return {
    id: record.id,
    date: record.date,
    title: record.title,
    category: record.category,
    value: record.value,
    rating: record.rating,
    notes: record.notes,
    details: record.details,
  };
}

async function getSampleRecords(req, res, next) {
  try {
    const db = await readDb();
    return res.status(200).json({
      records: db['sample-entries'].map(toSampleRecord),
    });
  } catch (error) {
    return next(error);
  }
}

async function getSampleRecordById(req, res, next) {
  try {
    const routeError = validateNumericRouteId(req.params.id);
    if (routeError) {
      return res.status(400).json({ error: routeError });
    }

    const db = await readDb();
    const record = db['sample-entries'].find(
      (item) => String(item.id) === String(req.params.id)
    );

    if (!record) {
      return res.status(404).json({ error: 'Sample gig record not found' });
    }

    return res.status(200).json({ record: toSampleRecord(record) });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getSampleRecords,
  getSampleRecordById,
};
