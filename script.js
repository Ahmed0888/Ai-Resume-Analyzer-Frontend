document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Register page loaded');
    
    // API Base URL - Backend Vercel deployment
    const API_BASE = "https://ai-resume-analyzer-backend-nine.vercel.app/api";
    
    // DOM Elements
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const authStatus = document.getElementById('authStatus');
    const btnRegister = document.getElementById('btnRegister');
    
    // Token management
    const setToken = (token) => localStorage.setItem('token', token);
    
    // Show status message
    function showMessage(message, isError = false) {
        console.log('Status:', message, isError ? 'ERROR' : 'SUCCESS');
        if (authStatus) {
            authStatus.textContent = message;
            authStatus.className = `status-message ${isError ? 'error' : 'success'}`;
        }
    }
    
    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : '#ef4444'}; color: white;
            border-radius: 12px; font-weight: 600; z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
    
    // Validate form inputs
    function validateForm() {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!name) return { valid: false, message: 'Name is required' };
        if (!email || !email.includes('@')) return { valid: false, message: 'Valid email is required' };
        if (password.length < 6) return { valid: false, message: 'Password must be 6+ characters' };
        
        return { valid: true };
    }
    
    // API Request with full backend URL + error debugging
    async function apiRequest(endpoint, data) {
        try {
            const url = `${API_BASE}/auth/${endpoint}`;
            console.log('📡 Sending to:', url, data);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            // Debug: Log raw response first
            const responseText = await response.text();
            console.log('📡 Raw response (first 200 chars):', responseText.substring(0, 200));
            console.log('📡 Response status:', response.status);
            
            // Check if response is JSON
            if (!response.ok) {
                let errorMsg = `Server error: ${response.status}`;
                try {
                    const result = JSON.parse(responseText);
                    errorMsg = result.message || result.error || errorMsg;
                } catch (parseError) {
                    console.error('❌ Non-JSON error response:', responseText);
                    errorMsg = `Server error (${response.status}): ${responseText.substring(0, 100)}...`;
                }
                throw new Error(errorMsg);
            }
            
            // Parse JSON response
            const result = JSON.parse(responseText);
            return result;
            
        } catch (error) {
            console.error('❌ API Error:', error);
            throw error;
        }
    }
    
    // Register handler
    async function handleRegister(e) {
        e.preventDefault();
        console.log('🎯 REGISTER BUTTON CLICKED!');
        
        // Button loading state
        if (btnRegister) {
            btnRegister.disabled = true;
            btnRegister.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
        }
        
        const validation = validateForm();
        if (!validation.valid) {
            showMessage(validation.message, true);
            showToast('❌ ' + validation.message, 'error');
            if (btnRegister) {
                btnRegister.disabled = false;
                btnRegister.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
            }
            return;
        }
        
        try {
            const result = await apiRequest('register', {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value.trim()
            });
            
            setToken(result.token);
            showMessage('✅ Account created! Redirecting...', false);
            showToast('✅ Registration successful!', 'success');
            
            setTimeout(() => {
                window.location.href = '/login/';
            }, 1500);
            
        } catch (error) {
            console.error('❌ Registration failed:', error.message);
            showMessage(error.message, true);
            showToast('❌ ' + error.message, 'error');
        } finally {
            if (btnRegister) {
                btnRegister.disabled = false;
                btnRegister.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
            }
        }
    }
    
    // Attach event listener
    if (registerForm && nameInput && emailInput && passwordInput) {
        registerForm.addEventListener('submit', handleRegister);
        console.log('✅ Form submit listener attached');
    } else {
        console.error('❌ Required DOM elements not found!');
        console.log('registerForm:', !!registerForm);
        console.log('nameInput:', !!nameInput);
        console.log('emailInput:', !!emailInput);
        console.log('passwordInput:', !!passwordInput);
    }
});
