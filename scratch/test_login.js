import api from '../frontend/src/services/api.js';

// Setup browser globals for api.js
global.window = {
  location: {
    origin: 'https://human-resource-management-system-three.vercel.app'
  }
};
global.localStorage = {
  getItem: () => null,
  setItem: () => null,
  removeItem: () => null
};

async function run() {
  console.log('--- TEST 1: HR Admin - Wrong Password ---');
  try {
    const res = await api.login({ email: 'hr@company.com', password: 'wrongpassword' });
    console.log('FAILED: Logged in successfully with wrong password:', res);
  } catch (err) {
    console.log('PASSED: Correctly threw error for wrong password:', err.message);
  }

  console.log('--- TEST 2: HR Admin - Correct Password ---');
  try {
    const res = await api.login({ email: 'hr@company.com', password: 'hr123543' });
    console.log('PASSED: Logged in successfully with correct password:', res.token);
  } catch (err) {
    console.log('FAILED: Threw error for correct password:', err.message);
  }
}

run();
