// QR Scanner Test Script
// This will help you test the QR scanner with real data from your backend

console.log('🔍 QR Scanner Debugging Helper');
console.log('==============================\n');

// Test functions for debugging QR scanner issues
const QR_TEST_UTILS = {
    // Test 1: Check if backend is running
    async testBackendConnection() {
        console.log('1️⃣ Testing backend connection...');
        try {
            const response = await fetch('http://localhost:1234/api/user/test', {
                method: 'GET',
            });
            
            if (response.ok) {
                console.log('✅ Backend is running on port 1234');
            } else {
                console.log('⚠️ Backend responded but with error:', response.status);
            }
        } catch (error) {
            console.log('❌ Backend connection failed:', error.message);
            console.log('   Make sure your backend is running: cd backend && npm start');
        }
    },

    // Test 2: Login and get token
    async testLogin(userId = 'admin', password = 'admin123') {
        console.log(`\n2️⃣ Testing login with ${userId}...`);
        try {
            const response = await fetch('http://localhost:1234/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userId, Password: password }),
            });
            
            const data = await response.json();
            if (data.success) {
                console.log('✅ Login successful');
                console.log('   Token:', data.token.substring(0, 20) + '...');
                return data.token;
            } else {
                console.log('❌ Login failed:', data.message);
                return null;
            }
        } catch (error) {
            console.log('❌ Login error:', error.message);
            return null;
        }
    },

    // Test 3: Generate QR code
    async testQRGeneration(token) {
        console.log('\n3️⃣ Testing QR code generation...');
        try {
            const response = await fetch('http://localhost:1234/api/admin/attendance/generate-qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    title: 'Test QR Scanner Session',
                    description: 'This is a test session for debugging QR scanner',
                    expiresInHours: 1
                }),
            });
            
            const data = await response.json();
            if (data.success) {
                console.log('✅ QR code generated successfully');
                console.log('   Session ID:', data.data.sessionId);
                console.log('   QR Code URL:', `http://localhost:1234${data.data.qrCodeUrl}`);
                console.log('   Frontend URL:', `http://localhost:5173/attendance/${data.data.sessionId}`);
                return data.data;
            } else {
                console.log('❌ QR generation failed:', data.message);
                return null;
            }
        } catch (error) {
            console.log('❌ QR generation error:', error.message);
            return null;
        }
    },

    // Test 4: Test session access as student
    async testStudentAccess(sessionId, studentToken) {
        console.log(`\n4️⃣ Testing student access to session ${sessionId}...`);
        try {
            const response = await fetch(`http://localhost:1234/api/student/attendance-session/${sessionId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${studentToken}`,
                },
                credentials: 'include',
            });
            
            const data = await response.json();
            if (data.success) {
                console.log('✅ Student can access session');
                console.log('   Title:', data.data.title);
                console.log('   Status:', data.data.isActive ? 'Active' : 'Inactive');
                console.log('   Attendees:', data.data.attendees?.length || 0);
                return true;
            } else {
                console.log('❌ Student access failed:', data.message);
                console.log('   Status code:', response.status);
                return false;
            }
        } catch (error) {
            console.log('❌ Student access error:', error.message);
            return false;
        }
    },

    // Test 5: Simulate QR data parsing
    testQRDataParsing(qrData) {
        console.log(`\n5️⃣ Testing QR data parsing...`);
        console.log('   QR Data:', qrData);
        
        let extractedSessionId = '';
        
        try {
            // Try to parse as JSON first
            const parsedData = JSON.parse(qrData);
            if (parsedData.sessionId) {
                extractedSessionId = parsedData.sessionId;
                console.log('✅ Parsed as JSON, found sessionId:', extractedSessionId);
            } else if (parsedData.url && parsedData.url.includes('attendance/')) {
                const parts = parsedData.url.split('attendance/');
                extractedSessionId = parts[1];
                console.log('✅ Parsed as JSON, extracted from URL:', extractedSessionId);
            }
        } catch (jsonError) {
            // Not JSON, try other formats
            if (qrData.includes('attendance/')) {
                const parts = qrData.split('attendance/');
                extractedSessionId = parts[1];
                console.log('✅ Extracted from URL string:', extractedSessionId);
            } else {
                extractedSessionId = qrData.trim();
                console.log('✅ Using as direct session ID:', extractedSessionId);
            }
        }
        
        return extractedSessionId;
    },

    // Run complete test
    async runCompleteTest() {
        console.log('🚀 Running complete QR scanner test...\n');
        
        // Test backend connection
        await this.testBackendConnection();
        
        // Login as admin
        const adminToken = await this.testLogin('admin', 'admin123');
        if (!adminToken) {
            console.log('\n❌ Cannot continue without admin login');
            return;
        }
        
        // Generate QR code
        const qrData = await this.testQRGeneration(adminToken);
        if (!qrData) {
            console.log('\n❌ Cannot continue without QR generation');
            return;
        }
        
        // Login as student
        const studentToken = await this.testLogin('student', 'student123');
        if (!studentToken) {
            console.log('\n❌ Cannot test student access without student login');
            return;
        }
        
        // Test student access
        const canAccess = await this.testStudentAccess(qrData.sessionId, studentToken);
        
        // Test QR data parsing
        const mockQRData = JSON.stringify({
            sessionId: qrData.sessionId,
            type: 'attendance',
            url: `http://localhost:5173/attendance/${qrData.sessionId}`
        });
        const parsedSessionId = this.testQRDataParsing(mockQRData);
        
        console.log('\n📋 Test Summary:');
        console.log('===============');
        console.log('✅ Backend connection: Working');
        console.log('✅ Admin login: Working');
        console.log('✅ QR generation: Working');
        console.log(`✅ Student login: Working`);
        console.log(`${canAccess ? '✅' : '❌'} Student access: ${canAccess ? 'Working' : 'Failed'}`);
        console.log(`✅ QR parsing: ${parsedSessionId === qrData.sessionId ? 'Working' : 'Failed'}`);
        
        console.log('\n🔗 Test URLs:');
        console.log(`   QR Image: http://localhost:1234${qrData.qrCodeUrl}`);
        console.log(`   Session URL: http://localhost:5173/attendance/${qrData.sessionId}`);
        console.log(`   QR Scanner: http://localhost:5173/attendance`);
        
        console.log('\n📱 Next Steps:');
        console.log('1. Open the QR Scanner: http://localhost:5173/attendance');
        console.log('2. Download the QR image from the admin panel');
        console.log('3. Upload it using the "Upload Image" option');
        console.log('4. Or manually enter the session ID:', qrData.sessionId);
    }
};

// Expose to global scope for manual testing
window.QR_TEST_UTILS = QR_TEST_UTILS;

console.log('🎯 Available test functions:');
console.log('   QR_TEST_UTILS.runCompleteTest() - Run full test');
console.log('   QR_TEST_UTILS.testBackendConnection() - Test backend');
console.log('   QR_TEST_UTILS.testLogin(userId, password) - Test login');
console.log('\n💡 Open browser console and run: QR_TEST_UTILS.runCompleteTest()');
