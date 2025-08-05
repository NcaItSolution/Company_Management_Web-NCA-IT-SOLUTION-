// Authentication Debug Script
// Run this in the browser console to debug authentication issues

const debugAuth = async () => {
    console.log('🔍 Authentication Debug Tool');
    console.log('==========================\n');

    // Step 1: Check if token exists
    const authToken = localStorage.getItem('authToken');
    const regularToken = localStorage.getItem('token');
    
    console.log('1️⃣ Token Storage Check:');
    console.log('   authToken exists:', !!authToken);
    console.log('   token exists:', !!regularToken);
    
    if (authToken) {
        console.log('   authToken preview:', authToken.substring(0, 20) + '...');
        
        // Try to decode token (basic check - don't do this in production)
        try {
            const tokenParts = authToken.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('   Token payload:', payload);
            console.log('   Token expires:', new Date(payload.exp * 1000));
            console.log('   Token valid until now:', new Date(payload.exp * 1000) > new Date());
        } catch (e) {
            console.log('   Token decode error:', e.message);
        }
    }

    if (regularToken) {
        console.log('   regularToken preview:', regularToken.substring(0, 20) + '...');
    }

    // Step 2: Test API endpoints
    console.log('\n2️⃣ API Endpoint Tests:');
    
    if (!authToken) {
        console.log('❌ No authToken found. Please login first.');
        return;
    }

    // Test admin/students endpoint
    console.log('\n   Testing GET /api/admin/getAllStudent...');
    try {
        const response = await fetch('http://localhost:1234/api/admin/getAllStudent', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        console.log('   Response status:', response.status);
        console.log('   Response headers:', Object.fromEntries(response.headers));
        
        if (response.ok) {
            const data = await response.json();
            console.log('   ✅ Success! Data:', data);
        } else {
            const errorText = await response.text();
            console.log('   ❌ Error response:', errorText);
        }
    } catch (error) {
        console.log('   ❌ Network error:', error.message);
    }

    // Test admin/admins endpoint
    console.log('\n   Testing GET /api/admin/getAllAdmin...');
    try {
        const response = await fetch('http://localhost:1234/api/admin/getAllAdmin', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        console.log('   Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('   ✅ Success! Data:', data);
        } else {
            const errorText = await response.text();
            console.log('   ❌ Error response:', errorText);
        }
    } catch (error) {
        console.log('   ❌ Network error:', error.message);
    }

    // Step 3: Check user info
    console.log('\n3️⃣ User Info Check:');
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        try {
            const parsed = JSON.parse(userInfo);
            console.log('   User info:', parsed);
            console.log('   User role:', parsed.role);
            console.log('   Is admin:', parsed.role === 'admin');
        } catch (e) {
            console.log('   Error parsing user info:', e.message);
        }
    } else {
        console.log('   No user info found');
    }

    console.log('\n📋 Debug Complete!');
    console.log('💡 Tips:');
    console.log('   - Make sure backend is running on port 1234');
    console.log('   - Check if you are logged in as admin');
    console.log('   - Try logging out and back in if token issues persist');
};

// Expose function globally
window.debugAuth = debugAuth;

console.log('🛠️ Authentication Debug Tool Loaded!');
console.log('📞 Run: debugAuth() - Debug authentication issues');
console.log('');
console.log('Quick fixes to try:');
console.log('1. Refresh the page');
console.log('2. Clear localStorage and login again');
console.log('3. Check if backend server is running');
console.log('4. Verify you are logged in as admin user');
