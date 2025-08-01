// Test the Create Admin/Student functionality
// This script demonstrates how the GenerateId component works

const API_BASE_URL = 'http://localhost:1234/api/user';

async function testCreateUser(role, userId, password) {
  const endpoint = role === 'admin' ? '/create-admin' : '/create-student';
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        Password: password,
      }),
    });
    
    const data = await response.json();
    console.log(`Create ${role} response:`, data);
    return data;
  } catch (error) {
    console.error(`Error creating ${role}:`, error);
    throw error;
  }
}

async function runTests() {
  console.log('Testing GenerateId functionality...\n');

  // Test creating admin
  console.log('1. Creating admin user...');
  await testCreateUser('admin', 'admin_test', 'admin123456');

  // Test creating student
  console.log('\n2. Creating student user...');
  await testCreateUser('student', 'student_test', 'student123456');

  // Test duplicate user (should fail)
  console.log('\n3. Testing duplicate user creation (should fail)...');
  await testCreateUser('student', 'student_test', 'different_password');

  console.log('\n=== Test Results ===');
  console.log('Check the responses above to verify:');
  console.log('- Success messages for new users');
  console.log('- Error message for duplicate user');
  console.log('- Proper password hashing (passwords not visible in response)');
}

// Uncomment to run tests
// runTests();
