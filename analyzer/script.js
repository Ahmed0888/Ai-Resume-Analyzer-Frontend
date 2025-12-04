// ✅ ENHANCED ANALYZER SCRIPT - SAME TOAST SYSTEM
document.addEventListener('DOMContentLoaded', () => {
    const btnUpload = document.getElementById("btnUpload");
    const fileInput = document.getElementById("fileInput");
    const jobDesc = document.getElementById("jobDesc");
    const resultDiv = document.getElementById("result");
    const loading = document.getElementById("loading");

    function getToken() { 
        return localStorage.getItem("token"); 
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    btnUpload.addEventListener("click", async () => {
        if (!fileInput.files[0]) {
            showToast("Please select a PDF file first!", 'error');
            return;
        }

        const token = getToken();
        if (!token) {
            showToast("Please login first!", 'error');
            window.location.href = '/login';
            return;
        }

        const fd = new FormData();
        fd.append("file", fileInput.files[0]);
        fd.append("jobDesc", jobDesc.value || "");

        // Show loading + disable button
        loading.classList.remove('hidden');
        btnUpload.disabled = true;
        btnUpload.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        resultDiv.innerHTML = "";

        try {
            const res = await fetch("/api/resume/analyze", {
                method: "POST",
                headers: { Authorization: "Bearer " + token },
                body: fd
            });

            const data = await res.json();
            loading.classList.add('hidden');

            if (!data.success) {
                resultDiv.innerHTML = `
                    <div class="result-section error-section">
                        <div class="result-card error-card">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h3>Analysis Failed</h3>
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                        </div>
                    </div>
                `;
                showToast("Analysis failed - check console for details", 'error');
                return;
            }

            const ai = data.analysis || {};
            const missingSkills = (ai.missingSkills || []).map(s => `<li><i class="fas fa-times-circle"></i> ${s}</li>`).join("") || 
                                     "<li><i class='fas fa-check-circle'></i> No major missing skills detected</li>";
            const suggestions = (ai.suggestions || []).map(s => `<li><i class='fas fa-lightbulb'></i> ${s}</li>`).join("") || 
                                   "<li><i class='fas fa-check-circle'></i> No additional suggestions</li>";

            resultDiv.innerHTML = `
                <!-- Scores Row -->
                <div class="result-section">
                    <div class="scores-grid">
                        <div class="result-card score-card primary-score">
                            <div class="score-header">
                                <i class="fas fa-star"></i>
                                <h3>Overall Score</h3>
                            </div>
                            <div class="score-display">${ai.resumeScore || "N/A"}</div>
                            <div class="score-label">Out of 100</div>
                        </div>
                        
                        <div class="result-card score-card">
                            <div class="score-header">
                                <i class="fas fa-robot"></i>
                                <h3>ATS Score</h3>
                            </div>
                            <div class="score-display">${ai.atsScore || "N/A"}</div>
                            <div class="score-label">ATS Compatibility</div>
                        </div>
                        
                        <div class="result-card score-card">
                            <div class="score-header">
                                <i class="fas fa-percentage"></i>
                                <h3>Job Match</h3>
                            </div>
                            <div class="score-display">${ai.matchPercentage != null ? ai.matchPercentage + "%" : "N/A"}</div>
                            <div class="score-label">Job Description Match</div>
                        </div>
                    </div>
                </div>

                <!-- Lists Row -->
                <div class="result-section">
                    <div class="lists-grid">
                        <div class="result-card list-card">
                            <div class="card-header">
                                <i class="fas fa-exclamation-triangle"></i>
                                <h3>Missing Skills</h3>
                            </div>
                            <ul class="skills-list">${missingSkills}</ul>
                        </div>
                        
                        <div class="result-card list-card">
                            <div class="card-header">
                                <i class="fas fa-lightbulb"></i>
                                <h3>AI Suggestions</h3>
                            </div>
                            <ul class="skills-list">${suggestions}</ul>
                        </div>
                    </div>
                </div>

                <!-- Improved Resume -->
                <div class="result-section">
                    <div class="result-card improved-card">
                        <div class="card-header improved-header">
                            <div>
                                <i class="fas fa-magic"></i>
                                <h3>AI-Improved Resume</h3>
                                <p>Professional version - ready to use</p>
                            </div>
                            <button id="btnCopyImproved" class="btn-copy">
                                <i class="fas fa-copy"></i> Copy Text
                            </button>
                        </div>
                        <div class="improved-content">
                            <pre class="improved-text">${ai.improvedText || "No improvements generated"}</pre>
                        </div>
                    </div>
                </div>

                <!-- File Info -->
                <div class="result-section">
                    <div class="result-card file-card">
                        <div class="card-header">
                            <i class="fas fa-cloud"></i>
                            <h3>File Storage</h3>
                        </div>
                        <div class="file-info">
                            ${data.saved?.fileUrl 
                                ? `<a href="${data.saved.fileUrl}" target="_blank" class="file-link">
                                    <i class="fas fa-file-pdf"></i> Open Uploaded PDF
                                  </a>`
                                : `<p class="no-file">File not stored or URL unavailable</p>`
                            }
                        </div>
                    </div>
                </div>
            `;

            // Copy button functionality
            const btnCopy = document.getElementById("btnCopyImproved");
            if (btnCopy && ai.improvedText) {
                btnCopy.addEventListener("click", async () => {
                    try {
                        await navigator.clipboard.writeText(ai.improvedText);
                        btnCopy.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        btnCopy.classList.add('copied');
                        showToast('✅ Improved resume copied!', 'success');
                        setTimeout(() => {
                            btnCopy.innerHTML = '<i class="fas fa-copy"></i> Copy Text';
                            btnCopy.classList.remove('copied');
                        }, 2000);
                    } catch {
                        showToast('❌ Copy failed - select manually', 'error');
                    }
                });
            }

            // Reset form
            btnUpload.disabled = false;
            btnUpload.innerHTML = '<i class="fas fa-rocket"></i> Analyze Another';
            showToast('✅ Analysis complete!', 'success');

        } catch (err) {
            loading.classList.add('hidden');
            btnUpload.disabled = false;
            btnUpload.innerHTML = '<i class="fas fa-rocket"></i> Analyze Resume';
            console.error(err);
            resultDiv.innerHTML = `
                <div class="result-section error-section">
                    <div class="result-card error-card">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Upload Failed</h3>
                        <p>Please check console (F12) for details</p>
                    </div>
                </div>
            `;
            showToast('❌ Upload failed', 'error');
        }
    });
});

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = '/login';
    }
}

function protectPage() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "/login";
  }}

  protectPage();