// const btnUpload = document.getElementById("btnUpload");
// const fileInput = document.getElementById("fileInput");
// // const jobDesc = document.getElementById("jobDesc");
// const jobDesc = document.getElementById("jobDesc");


// const resultBox = document.getElementById("result");

// // Loader
// const loader = document.createElement("div");
// loader.id = "loading";
// loader.style.textAlign = "center";
// loader.style.fontWeight = "bold";
// loader.style.color = "#4f46e5";
// loader.style.margin = "10px 0";
// loader.innerText = "Analyzing Resume... Please wait...";
// resultBox.parentNode.insertBefore(loader, resultBox);

// btnUpload.addEventListener("click", async () => {
//     if (!fileInput.files[0]) return alert("Please select a PDF file");
    
//     const formData = new FormData();
//     formData.append("file", fileInput.files[0]);
//     formData.append("jobDesc", jobDesc.value || "");

//     loader.style.display = "block";
//     resultBox.innerHTML = "";

//     try {
//         const res = await fetch("/upload", { method: "POST", body: formData });
//         const data = await res.json();

//         loader.style.display = "none";

//         if (!data.success) return alert("Error: " + data.message);

//         let ai;
//         try {
//             // Sometimes AI sends JSON wrapped in text, so we extract JSON block
//             // Regex code to find JSON object in the AI response
//             const jsonMatch = data.aiAnalysis.match(/\{[\s\S]*\}/);
//             ai = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
//         } catch {
//             ai = null;
//         }

//         if (ai) {
//             resultBox.innerHTML = `
//                 <div class="card mb-3 p-3">
//                     <h4>Extracted Resume Text</h4>
//                     <pre style="white-space: pre-wrap;">${data.extractedText}</pre>
//                 </div>

//                 <div class="d-flex flex-wrap gap-3 mb-3">
//                     <div class="card p-3 flex-grow-1" style="min-width: 200px;">
//                         <h5>Resume Score</h5>
//                         <p>${ai["Resume Score"] || "N/A"}/100</p>
//                     </div>
//                     <div class="card p-3 flex-grow-1" style="min-width: 200px;">
//                         <h5>ATS Score</h5>
//                         <p>${ai["ATS Score"] || "N/A"}</p>
//                     </div>
//                     <div class="card p-3 flex-grow-1" style="min-width: 200px;">
//                         <h5>Match Percentage</h5>
//                         <p>${ai["Match Percentage"] || "N/A"}%</p>
//                     </div>
//                 </div>

//                 <div class="card mb-3 p-3">
//                     <h5>Missing Skills</h5>
//                     <ul>${(ai["Missing Skills"] || []).map(skill => `<li>${skill}</li>`).join("")}</ul>
//                 </div>

//                 <div class="card mb-3 p-3">
//                     <h5>Suggestions</h5>
//                     <ul>${(ai["Suggestions"] || []).map(s => `<li>${s}</li>`).join("")}</ul>
//                 </div>

//                 <div class="card mb-3 p-3">
//                     <h5>Improved Resume</h5>
//                     <pre style="white-space: pre-wrap;">${ai["Improved Resume Text"] || ""}</pre>
//                 </div>
//             `;
//         } else {
//             // fallback: show raw AI text
//             resultBox.innerHTML = `
//                 <div class="card p-3 mb-3">
//                     <h4>Extracted Resume Text</h4>
//                     <pre style="white-space: pre-wrap;">${data.extractedText}</pre>
//                 </div>
//                 <div class="card p-3">
//                     <h4>AI Analysis (Raw Text)</h4>
//                     <pre style="white-space: pre-wrap;">${data.aiAnalysis}</pre>
//                 </div>
//             `;
//         }

//     } catch (err) {
//         loader.style.display = "none";
//         console.error(err);
//         alert("Error analyzing resume. Check console for details.");
//     }
// });



// // public/script.js
// const btnUpload = document.getElementById("btnUpload");
// const fileInput = document.getElementById("fileInput");
// const jobDesc = document.getElementById("jobDesc");
// const resultBox = document.getElementById("result");
// const loading = document.getElementById("loading");

// const emailInput = document.getElementById("email");
// const passwordInput = document.getElementById("password");
// const btnLogin = document.getElementById("btnLogin");
// const btnRegister = document.getElementById("btnRegister");
// const authStatus = document.getElementById("authStatus");

// function setToken(token) {
//   localStorage.setItem("token", token);
// }
// function getToken() {
//   return localStorage.getItem("token");
// }

// btnRegister.addEventListener("click", async () => {
//   try {
//     const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emailInput.value, password: passwordInput.value }) });
//     const data = await res.json();
//     if (data.token) {
//       setToken(data.token);
//       authStatus.innerText = "Registered & logged in";
//     } else {
//       authStatus.innerText = data.message || "Register failed";
//     }
//   } catch (err) { authStatus.innerText = "Error"; console.error(err); }
// });

// btnLogin.addEventListener("click", async () => {
//   try {
//     const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emailInput.value, password: passwordInput.value }) });
//     const data = await res.json();
//     if (data.token) {
//       setToken(data.token);
//       authStatus.innerText = "Logged in";
//     } else {
//       authStatus.innerText = data.message || "Login failed";
//     }
//   } catch (err) { authStatus.innerText = "Error"; console.error(err); }
// });

// btnUpload.addEventListener("click", async () => {
//   if (!fileInput.files[0]) return alert("Select a PDF file");
//   const token = getToken();
//   if (!token) return alert("Please login first (register/login fields above).");

//   loading.style.display = "block";
//   resultBox.innerHTML = "";

//   const fd = new FormData();
//   fd.append("file", fileInput.files[0]);
//   fd.append("jobDesc", jobDesc.value || "");

//   try {
//     const res = await fetch("/api/resume/analyze", {
//       method: "POST",
//       headers: { Authorization: "Bearer " + token },
//       body: fd
//     });
//     const data = await res.json();
//     loading.style.display = "none";

//     if (!data.success) {
//       resultBox.innerText = "Error: " + (data.message || JSON.stringify(data));
//       return;
//     }

//     const ai = data.analysis;
//     // Show nicely
//     resultBox.innerHTML = `
//       <div class="card">
//         <h4>Resume Score</h4><p>${ai.resumeScore || "N/A"}</p>
//         <h4>ATS Score</h4><p>${ai.atsScore || "N/A"}</p>
//         <h4>Match %</h4><p>${ai.matchPercentage || "N/A"}%</p>
//       </div>
//       <div class="card">
//         <h4>Missing Skills</h4><ul>${(ai.missingSkills || []).map(s => `<li>${s}</li>`).join("")}</ul>
//       </div>
//       <div class="card">
//         <h4>Suggestions</h4><ul>${(ai.suggestions || []).map(s => `<li>${s}</li>`).join("")}</ul>
//       </div>
//       <div class="card">
//         <h4>Improved Resume Text</h4><pre>${ai.improvedText || ""}</pre>
//       </div>
//       <div class="card">
//         <h4>Stored File</h4>
//         <p>${data.saved?.fileUrl ? `<a href="${data.saved.fileUrl}" target="_blank">Open file</a>` : "File not uploaded"}</p>
//       </div>
//     `;
//   } catch (err) {
//     loading.style.display = "none";
//     console.error(err);
//     alert("Upload/analysis failed. See console.");
//   }
// });

// function protectPage() {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     alert("Please login first");
//     window.location.href = "../login.html";
//   }
// }

// function logout() {
//   localStorage.removeItem("token");
//   window.location.href = "../login.html";
// }


// // --------- DOM CACHE -----------
// const $ = (id) => document.getElementById(id);

// const nameInput = $("name");
// const emailInput = $("email");
// const passwordInput = $("password");
// const authStatus = $("authStatus");
// const btnLogin = $("btnLogin");
// const btnRegister = $("btnRegister");

// // ----------- TOKEN MANAGEMENT -----------
// const setToken = (token) => localStorage.setItem("token", token);
// const getToken = () => localStorage.getItem("token");

// // ----------- COMMON API WRAPPER -----------
// async function apiRequest(endpoint, method, bodyObj) {
//   try {
//     const res = await fetch(`/api/auth/${endpoint}`, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(bodyObj)
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Something went wrong");

//     return data;
//   } catch (err) {
//     throw new Error(err.message || "Network error");
//   }
// }

// // ----------- FORM VALIDATOR -----------
// function validateInputs({ nameRequired = false } = {}) {
//   const email = emailInput.value.trim();
//   const password = passwordInput.value.trim();
//   const name = nameInput?.value?.trim();

//   if (nameRequired && !name) return { valid: false, message: "Name is required" };
//   if (!email) return { valid: false, message: "Email is required" };
//   if (!password) return { valid: false, message: "Password is required" };

//   return { valid: true };
// }

// // ----------- REGISTER FUNCTION -----------
// async function registerUser() {
//   const validation = validateInputs({ nameRequired: true });
//   if (!validation.valid) return showMessage(validation.message, true);

//   try {
//     const data = await apiRequest("register", "POST", {
//       name: nameInput.value,
//       email: emailInput.value,
//       password: passwordInput.value,
//     });

//     setToken(data.token);
//     showMessage("Registration successful! Redirecting...");
//     alert("Registration successful! Please login.");
//     redirectToLogin();

//   } catch (err) {
//     showMessage(err.message, true);
//   }
// }

// // ----------- LOGIN FUNCTION -----------
// async function loginUser() {
//   const validation = validateInputs();
//   if (!validation.valid) return showMessage(validation.message, true);

//   try {
//     const data = await apiRequest("login", "POST", {
//       email: emailInput.value,
//       password: passwordInput.value,
//     });

//     setToken(data.token);
//     showMessage("Login successful! Redirecting...");
//     redirectToDashboard();

//   } catch (err) {
//     showMessage(err.message, true);
//   }
// }

// // ----------- UI HELPER -----------
// function showMessage(msg, isError = false) {
//   if (authStatus) {
//     authStatus.innerText = msg;
//     authStatus.style.color = isError ? "red" : "green";
//   } else {
//     alert(msg);
//   }
// }

// // ----------- REDIRECT -----------
// function redirectToDashboard() {
//   setTimeout(() => {
//     window.location.href = "/dashboard";
//   }, 500);
// }

// function redirectToLogin() {
//   setTimeout(() => {
//     window.location.href = "/login";
//   }, 500);
// }

// // ----------- EVENT LISTENERS -----------
// btnRegister?.addEventListener("click", registerUser);
// btnLogin?.addEventListener("click", loginUser);






// // --------- DOM CACHE -----------
// const $ = (id) => document.getElementById(id);

// const nameInput = $("name");
// const emailInput = $("email");
// const passwordInput = $("password");
// const authStatus = $("authStatus");
// const registerForm = $("registerForm");  // ✅ FORM SELECT KARO

// // ----------- TOKEN MANAGEMENT -----------
// const setToken = (token) => localStorage.setItem("token", token);
// const getToken = () => localStorage.getItem("token");

// // ----------- COMMON API WRAPPER -----------
// async function apiRequest(endpoint, method, bodyObj) {
//   try {
//     const res = await fetch(`/api/auth/${endpoint}`, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(bodyObj)
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Something went wrong");

//     return data;
//   } catch (err) {
//     throw new Error(err.message || "Network error");
//   }
// }

// // ----------- FORM VALIDATOR -----------
// function validateInputs({ nameRequired = false } = {}) {
//   const email = emailInput.value.trim();
//   const password = passwordInput.value.trim();
//   const name = nameInput?.value?.trim();

//   if (nameRequired && !name) return { valid: false, message: "Name is required" };
//   if (!email) return { valid: false, message: "Email is required" };
//   if (!password || password.length < 6) return { valid: false, message: "Password must be at least 6 characters" };  // ✅ IMPROVED

//   return { valid: true };
// }

// // ----------- REGISTER FUNCTION -----------
// async function registerUser(e) {  // ✅ EVENT PARAMETER
//   e.preventDefault();  // ✅ FORM SUBMIT BLOCK
  
//   const validation = validateInputs({ nameRequired: true });
//   if (!validation.valid) return showMessage(validation.message, true);

//   try {
//     const data = await apiRequest("register", "POST", {
//       name: nameInput.value,
//       email: emailInput.value,
//       password: passwordInput.value,
//     });

//     setToken(data.token);
//     showMessage("Registration successful! Redirecting...", false);
//     setTimeout(() => {
//       window.location.href = "/login/";
//     }, 1500);

//   } catch (err) {
//     showMessage(err.message, true);
//   }
// }

// // ----------- UI HELPER -----------
// function showMessage(msg, isError = false) {
//   if (authStatus) {
//     authStatus.textContent = msg;  // ✅ textContent use karo
//     authStatus.className = `status-message ${isError ? 'error' : 'success'}`;
//   } else {
//     alert(msg);
//   }
// }

// // ----------- EVENT LISTENER ✅ FIXED --------
// registerForm?.addEventListener("submit", registerUser);  // FORM SUBMIT PE LAGAO


document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Register page loaded');
    
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
    
    // Show toast (same as app)
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
    
    // Validate form
    function validateForm() {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!name) return { valid: false, message: 'Name is required' };
        if (!email || !email.includes('@')) return { valid: false, message: 'Valid email is required' };
        if (password.length < 6) return { valid: false, message: 'Password must be 6+ characters' };
        
        return { valid: true };
    }
    
    // API Request
    async function apiRequest(endpoint, data) {
        try {
            console.log('📡 Sending to:', `/api/auth/${endpoint}`, data);
            const response = await fetch(`/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            console.log('📡 Response status:', response.status);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || `Server error: ${response.status}`);
            }
            
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
        btnRegister.disabled = true;
        btnRegister.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
        
        const validation = validateForm();
        if (!validation.valid) {
            showMessage(validation.message, true);
            showToast('❌ ' + validation.message, 'error');
            btnRegister.disabled = false;
            btnRegister.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
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
            showMessage(error.message, true);
            showToast('❌ ' + error.message, 'error');
        } finally {
            btnRegister.disabled = false;
            btnRegister.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
        }
    }
    
    // Attach event listener
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        console.log('✅ Form submit listener attached');
    } else {
        console.error('❌ registerForm not found!');
    }
});
