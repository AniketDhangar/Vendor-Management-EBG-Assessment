const mongoose = require('mongoose');
const { mongoUri } = require('../config');

const connect = async () => {
  if (!mongoUri) throw new Error('MONGO_URI not set');
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.set('strictQuery', true);
  return mongoose.connection;
};

module.exports = { connect };
