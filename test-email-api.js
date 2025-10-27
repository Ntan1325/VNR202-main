// Test script để kiểm tra API email notification
// Chạy: node test-email-api.js

const testData = {
  rating: 5,
  feedback: "Test feedback từ script",
  email: "test@example.com",
  language: "vi"
};

async function testEmailAPI() {
  try {
    console.log('🧪 Testing email notification API...');
    
    const response = await fetch('http://localhost:3000/api/send-feedback-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response data:', result);
    
    if (response.ok) {
      console.log('✅ API test successful!');
    } else {
      console.log('❌ API test failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Chỉ chạy nếu đây là file chính
if (require.main === module) {
  testEmailAPI();
}

module.exports = { testEmailAPI };
