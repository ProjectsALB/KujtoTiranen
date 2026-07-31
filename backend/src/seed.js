const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('./config/db');
const User = require('./models/User');

async function seed() {
  await connectDB();
  const email = (process.env.ADMIN_EMAIL || 'admin@kujtotiranen.al').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';

  if (password.length < 6) {
    console.error('ADMIN_PASSWORD must be at least 6 characters');
    process.exit(1);
  }

  let admin = await User.findOne({ email }).select('+password');
  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email,
      password,
      role: 'admin',
    });
    console.log('Admin created');
  } else {
    admin.password = password;
    admin.role = 'admin';
    await admin.save();
    console.log('Admin password synced from .env / default');
  }
  console.log('  Email   :', email);
  console.log('  Password:', process.env.NODE_ENV === 'production' ? '(hidden)' : password);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
