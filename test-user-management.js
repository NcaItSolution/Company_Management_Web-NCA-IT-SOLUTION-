// User Management API Test Script
// Test the new user management APIs (password update and delete)

const testUserManagementAPIs = async () => {
    console.log('🧪 Testing User Management APIs...\n');

    // Get token
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ No token found. Please login first.');
        return;
    }

    console.log('✅ Token found:', token.substring(0, 20) + '...');

    // Test 1: Get all students (to get a test user)
    console.log('\n1️⃣ Getting test users...');
    try {
        const studentsResponse = await fetch('http://localhost:1234/api/admin/getAllStudent', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (studentsResponse.ok) {
            const studentsData = await studentsResponse.json();
            console.log('✅ Students found:', studentsData.student?.length || 0);
            
            if (studentsData.student && studentsData.student.length > 0) {
                const testUser = studentsData.student[0];
                console.log('   Test user:', testUser.userId);
                
                // Test 2: Get user details
                console.log('\n2️⃣ Testing getUserDetails API...');
                try {
                    const userDetailsResponse = await fetch(`http://localhost:1234/api/admin/user/${testUser.userId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        credentials: 'include',
                    });

                    if (userDetailsResponse.ok) {
                        const userDetails = await userDetailsResponse.json();
                        console.log('✅ User details API working');
                        console.log('   User details:', userDetails.data);
                    } else {
                        console.log('❌ User details API failed:', userDetailsResponse.status);
                    }
                } catch (error) {
                    console.log('❌ User details API error:', error.message);
                }

                // Test 3: Update password API (simulation)
                console.log('\n3️⃣ Testing updateUserPassword API...');
                try {
                    const passwordUpdateResponse = await fetch(`http://localhost:1234/api/admin/user/${testUser.userId}/password`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            newPassword: 'testpass123',
                            confirmPassword: 'testpass123'
                        }),
                    });

                    if (passwordUpdateResponse.ok) {
                        const passwordResult = await passwordUpdateResponse.json();
                        console.log('✅ Password update API working');
                        console.log('   Result:', passwordResult.message);
                    } else {
                        const errorText = await passwordUpdateResponse.text();
                        console.log('❌ Password update API failed:', passwordUpdateResponse.status);
                        console.log('   Error:', errorText);
                    }
                } catch (error) {
                    console.log('❌ Password update API error:', error.message);
                }

                // Test 4: Delete user API (WARNING: This will actually delete the user)
                console.log('\n4️⃣ Testing deleteUser API...');
                console.log('⚠️  WARNING: This test is disabled to prevent accidental deletion');
                console.log('   To test deletion, manually call:');
                console.log(`   DELETE http://localhost:1234/api/admin/user/${testUser.userId}`);
                
                // Uncomment below to test actual deletion (BE CAREFUL!)
                /*
                try {
                    const deleteResponse = await fetch(`http://localhost:1234/api/admin/user/${testUser.userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        credentials: 'include',
                    });

                    if (deleteResponse.ok) {
                        const deleteResult = await deleteResponse.json();
                        console.log('✅ Delete user API working');
                        console.log('   Result:', deleteResult.message);
                    } else {
                        console.log('❌ Delete user API failed:', deleteResponse.status);
                    }
                } catch (error) {
                    console.log('❌ Delete user API error:', error.message);
                }
                */
            } else {
                console.log('⚠️  No students found to test with');
            }
        } else {
            console.log('❌ Could not get students for testing');
        }
    } catch (error) {
        console.log('❌ Error getting test users:', error.message);
    }

    console.log('\n📋 User Management API Test Complete!');
    console.log('Next step: Visit http://localhost:5173/admin/users to test the UI');
};

// Test validation functions
const testValidation = () => {
    console.log('🔍 Testing validation scenarios...\n');

    const testCases = [
        {
            name: 'Empty password',
            data: { newPassword: '', confirmPassword: '' },
            expected: 'Should fail - empty password'
        },
        {
            name: 'Short password',
            data: { newPassword: '123', confirmPassword: '123' },
            expected: 'Should fail - password too short'
        },
        {
            name: 'Mismatched passwords',
            data: { newPassword: 'password123', confirmPassword: 'password456' },
            expected: 'Should fail - passwords do not match'
        },
        {
            name: 'Valid password',
            data: { newPassword: 'password123', confirmPassword: 'password123' },
            expected: 'Should pass - valid password'
        }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`${index + 1}. ${testCase.name}:`);
        console.log('   Data:', testCase.data);
        console.log('   Expected:', testCase.expected);
        console.log('');
    });
};

// Expose functions globally
window.testUserManagementAPIs = testUserManagementAPIs;
window.testValidation = testValidation;

console.log('🛠️ User Management API Test Tools Loaded!');
console.log('📞 Run: testUserManagementAPIs() - Test all APIs');
console.log('🔍 Run: testValidation() - Show validation test cases');
console.log('');
console.log('UI Testing:');
console.log('1. Go to: http://localhost:5173/admin/users');
console.log('2. Try changing a user password');
console.log('3. Try deleting a user (be careful!)');
console.log('4. Check error handling with invalid inputs');
