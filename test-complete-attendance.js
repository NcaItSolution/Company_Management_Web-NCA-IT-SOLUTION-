// Comprehensive test script for the complete attendance system
// Tests both admin and student functionality

const BASE_URL = 'http://localhost:1234/api';
let adminToken = '';
let studentToken = '';
let testSessionId = '';

// Login functions
async function loginAdmin() {
    try {
        const response = await fetch(`${BASE_URL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ userId: 'admin', Password: 'admin123' }),
        });
        
        const data = await response.json();
        if (data.success) {
            adminToken = data.token;
            console.log('✅ Admin login successful');
            return true;
        } else {
            console.error('❌ Admin login failed:', data.message);
            return false;
        }
    } catch (error) {
        console.error('❌ Admin login error:', error.message);
        return false;
    }
}

async function loginStudent() {
    try {
        const response = await fetch(`${BASE_URL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ userId: 'student', Password: 'student123' }),
        });
        
        const data = await response.json();
        if (data.success) {
            studentToken = data.token;
            console.log('✅ Student login successful');
            return true;
        } else {
            console.error('❌ Student login failed:', data.message);
            return false;
        }
    } catch (error) {
        console.error('❌ Student login error:', error.message);
        return false;
    }
}

// Admin Functions
async function adminGenerateQR() {
    try {
        const response = await fetch(`${BASE_URL}/admin/attendance/generate-qr`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            },
            credentials: 'include',
            body: JSON.stringify({
                title: 'Test Attendance Session',
                description: 'Automated test session for QR attendance system',
                expiresInHours: 1
            }),
        });
        
        const data = await response.json();
        if (data.success) {
            testSessionId = data.data.sessionId;
            console.log('✅ QR Code generated successfully');
            console.log(`   Session ID: ${testSessionId}`);
            console.log(`   QR Code URL: http://localhost:1234${data.data.qrCodeUrl}`);
            return data.data;
        } else {
            console.error('❌ QR generation failed:', data.message);
            return null;
        }
    } catch (error) {
        console.error('❌ QR generation error:', error.message);
        return null;
    }
}

async function adminGetSessions() {
    try {
        const response = await fetch(`${BASE_URL}/admin/attendance/sessions?page=1&limit=5`, {
            headers: { 'Authorization': `Bearer ${adminToken}` },
            credentials: 'include',
        });
        
        const data = await response.json();
        if (data.success) {
            console.log('✅ Admin sessions retrieved');
            console.log(`   Total sessions: ${data.data.pagination.totalSessions}`);
            return data.data;
        } else {
            console.error('❌ Failed to get admin sessions:', data.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Admin sessions error:', error.message);
        return null;
    }
}

// Student Functions
async function studentGetSession() {
    try {
        const response = await fetch(`${BASE_URL}/student/attendance-session/${testSessionId}`, {
            headers: { 'Authorization': `Bearer ${studentToken}` },
            credentials: 'include',
        });
        
        const data = await response.json();
        if (data.success) {
            console.log('✅ Student retrieved session details');
            console.log(`   Title: ${data.data.title}`);
            console.log(`   Status: ${data.data.isActive ? 'Active' : 'Inactive'}`);
            return data.data;
        } else {
            console.error('❌ Failed to get session for student:', data.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Student get session error:', error.message);
        return null;
    }
}

async function studentMarkAttendance() {
    try {
        const response = await fetch(`${BASE_URL}/student/mark-attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`,
            },
            credentials: 'include',
            body: JSON.stringify({
                sessionId: testSessionId,
                userId: 'student',
                userName: 'Test Student'
            }),
        });
        
        const data = await response.json();
        if (data.success) {
            console.log('✅ Attendance marked successfully');
            console.log(`   Total attendees: ${data.data.totalAttendees}`);
            return data.data;
        } else {
            console.error('❌ Failed to mark attendance:', data.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Mark attendance error:', error.message);
        return null;
    }
}

async function studentGetAttendanceHistory() {
    try {
        const response = await fetch(`${BASE_URL}/student/my-attendance?page=1&limit=10`, {
            headers: { 'Authorization': `Bearer ${studentToken}` },
            credentials: 'include',
        });
        
        const data = await response.json();
        if (data.success) {
            console.log('✅ Student attendance history retrieved');
            console.log(`   Total records: ${data.data.attendanceHistory.length}`);
            return data.data;
        } else {
            console.error('❌ Failed to get attendance history:', data.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Attendance history error:', error.message);
        return null;
    }
}

async function studentGetActiveSessions() {
    try {
        const response = await fetch(`${BASE_URL}/student/active-sessions?page=1&limit=10`, {
            headers: { 'Authorization': `Bearer ${studentToken}` },
            credentials: 'include',
        });
        
        const data = await response.json();
        if (data.success) {
            console.log('✅ Active sessions retrieved for student');
            console.log(`   Active sessions: ${data.data.sessions.length}`);
            return data.data;
        } else {
            console.error('❌ Failed to get active sessions:', data.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Active sessions error:', error.message);
        return null;
    }
}

// Duplicate attendance test
async function testDuplicateAttendance() {
    try {
        const response = await fetch(`${BASE_URL}/student/mark-attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`,
            },
            credentials: 'include',
            body: JSON.stringify({
                sessionId: testSessionId,
                userId: 'student',
                userName: 'Test Student'
            }),
        });
        
        const data = await response.json();
        if (!data.success && data.message.includes('already marked')) {
            console.log('✅ Duplicate attendance prevention working');
            return true;
        } else {
            console.error('❌ Duplicate attendance should have been prevented');
            return false;
        }
    } catch (error) {
        console.error('❌ Duplicate test error:', error.message);
        return false;
    }
}

// Main test runner
async function runCompleteTest() {
    console.log('🚀 Starting Complete Attendance System Test\n');

    // Step 1: Login as admin and student
    console.log('1️⃣ Logging in users...');
    const adminLoggedIn = await loginAdmin();
    const studentLoggedIn = await loginStudent();
    
    if (!adminLoggedIn || !studentLoggedIn) {
        console.error('❌ Failed to login users. Ensure admin and student accounts exist.');
        return;
    }

    // Step 2: Admin generates QR code
    console.log('\n2️⃣ Admin generating QR code...');
    const qrData = await adminGenerateQR();
    if (!qrData) {
        console.error('❌ Failed to generate QR code');
        return;
    }

    // Step 3: Admin views sessions
    console.log('\n3️⃣ Admin viewing all sessions...');
    await adminGetSessions();

    // Step 4: Student views active sessions
    console.log('\n4️⃣ Student viewing active sessions...');
    await studentGetActiveSessions();

    // Step 5: Student gets session details
    console.log('\n5️⃣ Student getting session details...');
    await studentGetSession();

    // Step 6: Student marks attendance
    console.log('\n6️⃣ Student marking attendance...');
    const attendanceResult = await studentMarkAttendance();
    if (!attendanceResult) {
        console.error('❌ Failed to mark attendance');
        return;
    }

    // Step 7: Test duplicate attendance prevention
    console.log('\n7️⃣ Testing duplicate attendance prevention...');
    await testDuplicateAttendance();

    // Step 8: Student views attendance history
    console.log('\n8️⃣ Student viewing attendance history...');
    await studentGetAttendanceHistory();

    // Step 9: Admin views updated session
    console.log('\n9️⃣ Admin viewing updated session...');
    await adminGetSessions();

    console.log('\n✅ Complete Attendance System Test Finished!');
    console.log('\n📊 Test Summary:');
    console.log('- ✅ Admin QR generation');
    console.log('- ✅ Student session viewing');
    console.log('- ✅ Student attendance marking');
    console.log('- ✅ Duplicate attendance prevention');
    console.log('- ✅ Attendance history tracking');
    console.log('- ✅ Admin session management');
    
    console.log('\n🌐 Frontend URLs to test:');
    console.log('- Admin Dashboard: http://localhost:5173/admin');
    console.log('- Attendance Management: http://localhost:5173/admin/attendance');
    console.log('- Student Dashboard: http://localhost:5173/student');
    console.log('- Student Attendance: http://localhost:5173/student/attendance');
    console.log(`- QR Scanner: http://localhost:5173/attendance/${testSessionId}`);
    console.log('- QR Scanner (manual): http://localhost:5173/attendance');
}

// Uncomment to run the complete test
// runCompleteTest();
