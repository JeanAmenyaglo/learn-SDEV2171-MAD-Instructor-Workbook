const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const sampleRoutes = require('./routes/sampleRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Gig Economy auth backend is running',
    status: 'ok',
  });
});

app.use('/auth', authRoutes);
app.use('/sample-entries', sampleRoutes);
app.use('/entries', recordRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
