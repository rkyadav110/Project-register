// Backend URL - Render se mila URL yahan dalenge
const API_BASE_URL = 'https://registering-yvxb.onrender.com'; // ✅ YAHAN APNA RENDER URL DALO

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Show loading
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const submitBtn = document.querySelector('.submit-btn');
    
    btnText.textContent = 'Creating Account...';
    btnLoader.style.display = 'block';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value || null
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {  // ✅ Yahan Render URL use hoga
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        // Reset button
        btnText.textContent = 'Create Account';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
        
        // Show message
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = result.message;
        messageDiv.className = result.success ? 'message success' : 'message error';
        messageDiv.style.display = 'block';
        
        if (result.success) {
            // Clear form
            document.getElementById('registerForm').reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
        
    } catch (error) {
        console.error('Error:', error);
        
        // Reset button
        btnText.textContent = 'Create Account';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
        
        // Show error message
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = 'Network error. Please check your connection.';
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
    }
});

// Test backend connection on page load
window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/`);  // ✅ Yahan bhi Render URL
        const data = await response.json();
        console.log('✅ Backend connected:', data.message);
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
    }
});