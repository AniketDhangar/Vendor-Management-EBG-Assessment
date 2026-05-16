/**
 * Seed an admin user: node -r dotenv/config scripts/seed-admin.js
 * Env: SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { mongoUri } = require('../src/config');
const User = require('../src/modules/auth/auth.model');

const run = async () => {
  await mongoose.connect(mongoUri);
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
  const name = process.env.SEED_ADMIN_NAME || 'Platform Admin';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 12);
  await User.create({ name, email, password: hashed, role: 'admin' });
  console.log('Admin created:', email);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
