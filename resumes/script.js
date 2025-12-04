// let resumes = [];
// let currentUserId = null;
// const token = localStorage.getItem('token');

// if (!token) {
//     window.location.href = '/login';
// } else {
//     try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         currentUserId = payload.id;
//     } catch (e) {
//         window.location.href = '/login';
//     }
// }

// document.addEventListener('DOMContentLoaded', () => {
//     loadResumes();
//     const logoutButton = document.querySelector('.btn-logout');
//     if (logoutButton) logoutButton.addEventListener('click', logout);
// });

// async function loadResumes() {
//     const loading = document.getElementById('loading');
//     const resumesList = document.getElementById('resumesList');
//     loading.classList.remove('hidden');
//     resumesList.innerHTML = '';

//     try {
//         const response = await fetch('/api/resume', {
//             headers: { 'Authorization': `Bearer ${token}` }
//         });
//         const data = await response.json();

//         if (data.success) {
//             resumes = data.resumes;
//             renderResumes();
//             renderStats();
//             document.getElementById('noResumes').classList.add('hidden');
//         } else {
//             showNoResumes();
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         showNoResumes();
//     } finally {
//         loading.classList.add('hidden');
//     }
// }


// function renderResumes() {
//     const container = document.getElementById('resumesList');
//     if (resumes.length === 0) {
//         showNoResumes();
//         return;
//     }

//     container.innerHTML = resumes.map(resume => `
//         <div class="resume-card">
//             <div class="resume-header">
//                 <div>
//                     <h3 class="resume-title">${getResumeTitle(resume.originalText)}</h3>
//                     <p class="resume-date">${formatDate(resume.createdAt)}</p>
//                 </div>
//                 ${resume.fileUrl ? `<a href="${resume.fileUrl}" target="_blank" class="file-link" title="View PDF">
//                     <i class="fas fa-external-link-alt"></i>
//                 </a>` : ''}
//             </div>

//             <div class="scores-grid">
//                 <div class="score-item">
//                     <div class="score-circle score-blue">${resume.aiScore || 0}</div>
//                     <div class="score-label">AI Score</div>
//                 </div>
//                 <div class="score-item">
//                     <div class="score-circle score-green">${resume.atsScore || 0}</div>
//                     <div class="score-label">ATS Score</div>
//                 </div>
//                 <div class="score-item">
//                     <div class="score-circle score-purple">${resume.matchPercentage || 0}%</div>
//                     <div class="score-label">Match %</div>
//                 </div>
//             </div>

//             ${resume.jobdescription ? `
//                 <div class="job-section">
//                     <div class="job-label">Job Applied:</div>
//                     <div class="job-text">${resume.jobdescription}</div>
//                 </div>
//             ` : ''}

//             <div class="skills-section">
//                 ${resume.missingSkills.slice(0, 3).map(skill => `
//                     <div class="skill-item">
//                         <i class="fas fa-exclamation-circle"></i>
//                         <span class="skill-text">${skill}</span>
//                     </div>
//                 `).join('')}
//             </div>

//             <div class="action-buttons">
//                 <button class="btn-view" onclick="viewDetails('${resume._id}')" title="View full analysis">
//                     <i class="fas fa-eye"></i> View Details
//                 </button>
//                 <button class="btn-copy" onclick="copyImproved('${btoa(encodeURIComponent(resume.aiImprovedText || ''))}')" title="Copy improved resume">
//                     <i class="fas fa-copy"></i>
//                 </button>
//             </div>
//         </div>
//     `).join('');
// }

// function renderStats() {
//     const total = resumes.length;
//     const scores = resumes.map(r => r.aiScore).filter(Boolean);
//     const avgScore = scores.length ? Math.round(scores.reduce((a,b) => a + b, 0) / scores.length) : 0;
//     const bestScore = Math.max(...scores, 0);

//     document.getElementById('statsGrid').innerHTML = `
//         <div class="stat-card stat-blue">
//             <div class="stat-icon bg-blue-100 text-blue-600"><i class="fas fa-chart-line"></i></div>
//             <div class="stat-content">
//                 <p>Total Resumes</p>
//                 <p class="stat-number">${total}</p>
//             </div>
//         </div>
//         <div class="stat-card stat-green">
//             <div class="stat-icon bg-green-100 text-green-600"><i class="fas fa-star"></i></div>
//             <div class="stat-content">
//                 <p>Avg Score</p>
//                 <p class="stat-number">${avgScore}</p>
//             </div>
//         </div>
//         <div class="stat-card stat-purple">
//             <div class="stat-icon bg-purple-100 text-purple-600"><i class="fas fa-trophy"></i></div>
//             <div class="stat-content">
//                 <p>Best Score</p>
//                 <p class="stat-number">${bestScore}</p>
//             </div>
//         </div>
//     `;
// }

// function getResumeTitle(text) {
//     const lines = text.split('\n');
//     return lines[0]?.substring(0, 60) + (lines[0]?.length > 60 ? '...' : '');
// }

// function formatDate(dateStr) {
//     return new Date(dateStr).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//     });
// }

// function showNoResumes() {
//     document.getElementById('resumesList').innerHTML = '';
//     document.getElementById('noResumes').classList.remove('hidden');
//     document.getElementById('statsGrid').innerHTML = '';
// }

// async function viewDetails(resumeId) {
//     const resume = resumes.find(r => r._id === resumeId);
//     if (resume) {
//         localStorage.setItem('selectedResume', JSON.stringify(resume));
//         window.open('details.html', '_blank');
//     }
// }

// function copyImproved(encodedText) {
//     try {
//         const text = decodeURIComponent(atob(encodedText));
//         navigator.clipboard.writeText(text).then(() => {
//             showToast('Improved resume copied!', 'success');
//         });
//     } catch (e) {
//         console.error('Copy failed:', e);
//     }
// }

// function showToast(message, type = 'success') {
//     const toast = document.createElement('div');
//     toast.className = `toast toast-${type}`;
//     toast.textContent = message;
//     document.body.appendChild(toast);

//     setTimeout(() => {
//         toast.classList.add('show');
//     }, 100);

//     setTimeout(() => {
//         toast.classList.remove('show');
//         setTimeout(() => toast.remove(), 300);
//     }, 3000);
// }

// function logout() {
//     localStorage.clear();
//     window.location.href = '/login';
// }

let resumes = [];
let filteredResumes = [];
let currentUserId = null;
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/login';
} else {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUserId = payload.id;
    } catch (e) {
        window.location.href = '/login';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadResumes();
    setupEventListeners();
});

async function loadResumes() {
    const loading = document.getElementById('loading');
    loading.classList.remove('hidden');
    
    try {
        const response = await fetch('/api/resume', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.success) {
            resumes = data.resumes;
            filteredResumes = [...resumes];
            renderResumes();
            renderStats();
            document.getElementById('emptyState').classList.add('hidden');
        } else {
            showEmptyState();
        }
    } catch (error) {
        console.error('Error:', error);
        showEmptyState();
    } finally {
        loading.classList.add('hidden');
    }
}

function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', debounce(filterResumes, 300));
    
    // Filters
    document.getElementById('scoreFilter').addEventListener('change', filterResumes);
    document.getElementById('sortSelect').addEventListener('change', sortResumes);
    
    // Modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleQuickAction(e.target.dataset.action));
    });
}

function filterResumes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const scoreFilter = document.getElementById('scoreFilter').value;
    
    filteredResumes = resumes.filter(resume => {
        const matchesSearch = !searchTerm || 
            getResumeTitle(resume.originalText).toLowerCase().includes(searchTerm) ||
            (resume.jobdescription && resume.jobdescription.toLowerCase().includes(searchTerm));
        
        const aiScore = resume.aiScore || 0;
        let matchesScore = true;
        
        if (scoreFilter === '90+') matchesScore = aiScore >= 90;
        else if (scoreFilter === '80-89') matchesScore = aiScore >= 80 && aiScore < 90;
        else if (scoreFilter === '70-79') matchesScore = aiScore >= 70 && aiScore < 80;
        else if (scoreFilter === 'below70') matchesScore = aiScore < 70;
        
        return matchesSearch && matchesScore;
    });
    
    sortResumes();
}

function sortResumes() {
    const sortBy = document.getElementById('sortSelect').value;
    
    filteredResumes.sort((a, b) => {
        const scoreA = a.aiScore || 0;
        const scoreB = b.aiScore || 0;
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        
        switch (sortBy) {
            case 'date-desc': return dateB - dateA;
            case 'date-asc': return dateA - dateB;
            case 'score-desc': return scoreB - scoreA;
            case 'score-asc': return scoreA - scoreB;
            default: return dateB - dateA;
        }
    });
    
    renderResumes();
    updateResultsCount();
}

function renderResumes() {
    const container = document.getElementById('resumesList');
    
    if (filteredResumes.length === 0) {
        container.classList.add('hidden');
        document.getElementById('noResumes').classList.remove('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    document.getElementById('noResumes').classList.add('hidden');
    
    container.innerHTML = filteredResumes.map((resume, index) => `
        <div class="resume-card" data-resume-id="${resume._id}">
            <div class="resume-card-header">
                <div>
                    <h3 class="resume-title">${getResumeTitle(resume.originalText)}</h3>
                    <p class="resume-date">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(resume.createdAt)}
                    </p>
                </div>
                ${resume.fileUrl ? `
                    <a href="${resume.fileUrl}" target="_blank" class="file-link" title="View PDF">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                ` : ''}
            </div>

            <div class="scores-grid">
                <div class="score-item">
                    <div class="score-circle score-blue">${resume.aiScore || 0}</div>
                    <div class="score-label">AI Score</div>
                </div>
                <div class="score-item">
                    <div class="score-circle score-green">${resume.atsScore || 0}</div>
                    <div class="score-label">ATS Score</div>
                </div>
                <div class="score-item">
                    <div class="score-circle score-purple">${(resume.matchPercentage || 0).toFixed(0)}%</div>
                    <div class="score-label">Match</div>
                </div>
            </div>

            ${resume.jobdescription ? `
                <div class="job-section">
                    <div class="job-label"><i class="fas fa-briefcase"></i> Job Applied:</div>
                    <div class="job-text">${resume.jobdescription.substring(0, 100)}${resume.jobdescription.length > 100 ? '...' : ''}</div>
                </div>
            ` : ''}

            <div class="skills-section">
                ${resume.missingSkills && resume.missingSkills.slice(0, 3).map(skill => `
                    <div class="skill-item">
                        <i class="fas fa-exclamation-circle"></i>
                        ${skill}
                    </div>
                `).join('') || ''}
            </div>

            <div class="action-overlay">
                <div class="action-btn action-view" title="View Details" data-action="view">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="action-btn action-copy" title="Copy Improved" data-action="copy">
                    <i class="fas fa-copy"></i>
                </div>
                ${resume.fileUrl ? `
                    <div class="action-btn action-download" title="Download PDF" data-action="download">
                        <i class="fas fa-download"></i>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    // Add click listeners
    document.querySelectorAll('.resume-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.action-overlay .action-btn')) return;
            const resumeId = card.dataset.resumeId;
            viewDetails(resumeId);
        });
        
        card.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const resumeId = card.dataset.resumeId;
                const action = btn.dataset.action;
                showQuickModal(resumeId, action);
            });
        });
    });
    
    updateResultsCount();
}

function updateResultsCount() {
    const countEl = document.getElementById('countText');
    const resultsCount = document.getElementById('resultsCount');
    
    if (filteredResumes.length === 0) {
        resultsCount.classList.add('hidden');
    } else {
        countEl.innerHTML = `Showing <strong>${filteredResumes.length}</strong> of ${resumes.length} resumes`;
        resultsCount.classList.remove('hidden');
    }
}

function showQuickModal(resumeId, defaultAction) {
    const resume = resumes.find(r => r._id === resumeId);
    if (!resume) return;
    
    document.getElementById('modalTitle').textContent = `Quick Actions - ${getResumeTitle(resume.originalText)}`;
    document.querySelector('[data-action="view"]').dataset.resumeId = resumeId;
    document.querySelector('[data-action="copy"]').dataset.resumeId = btoa(encodeURIComponent(resume.aiImprovedText || ''));
    document.querySelector('[data-action="download"]').dataset.resumeId = resumeId;
    
    if (defaultAction) {
        handleQuickAction(defaultAction, resumeId);
    } else {
        document.getElementById('quickModal').classList.remove('hidden');
        document.getElementById('quickModal').classList.add('show');
    }
}

function closeModal() {
    document.getElementById('quickModal').classList.remove('show');
    document.getElementById('quickModal').classList.add('hidden');
}

function handleQuickAction(action, data) {
    switch (action) {
        case 'view':
            viewDetails(data);
            closeModal();
            break;
        case 'copy':
            copyImproved(data);
            break;
        case 'download':
            window.open(resumes.find(r => r._id === data)?.fileUrl, '_blank');
            break;
    }
}

// Existing functions (unchanged but improved)
function renderStats() {
    const total = resumes.length;
    const scores = resumes.map(r => r.aiScore).filter(Boolean);
    const avgScore = scores.length ? Math.round(scores.reduce((a,b) => a + b, 0) / scores.length) : 0;
    const bestScore = Math.max(...scores, 0);

    document.getElementById('statsGrid').innerHTML = `
        <div class="stat-card stat-blue">
            <div class="stat-icon"><i class="fas fa-file-alt"></i></div>
            <div class="stat-content">
                <p>Total Resumes</p>
                <div class="stat-number">${total}</div>
            </div>
        </div>
        <div class="stat-card stat-green">
            <div class="stat-icon"><i class="fas fa-star"></i></div>
            <div class="stat-content">
                <p>Avg Score</p>
                <div class="stat-number">${avgScore}</div>
            </div>
        </div>
        <div class="stat-card stat-purple">
            <div class="stat-icon"><i class="fas fa-trophy"></i></div>
            <div class="stat-content">
                <p>Best Score</p>
                <div class="stat-number">${bestScore}</div>
            </div>
        </div>
    `;
}

function getResumeTitle(text) {
    const lines = (text || '').split('\n');
    return lines[0]?.substring(0, 60) + (lines[0]?.length > 60 ? '...' : '') || 'Untitled Resume';
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showEmptyState() {
    document.getElementById('resumesList').classList.add('hidden');
    document.getElementById('noResumes').classList.add('hidden');
    document.getElementById('emptyState').classList.remove('hidden');
    document.getElementById('statsGrid').innerHTML = '';
}

async function viewDetails(resumeId) {
    const resume = resumes.find(r => r._id === resumeId);
    if (resume) {
        localStorage.setItem('selectedResume', JSON.stringify(resume));
        window.open('details.html', '_blank');
    }
}

function copyImproved(encodedText) {
    try {
        const text = decodeURIComponent(atob(encodedText));
        navigator.clipboard.writeText(text).then(() => {
            showToast('✅ Improved resume copied!', 'success');
        });
    } catch (e) {
        console.error('Copy failed:', e);
        showToast('❌ Copy failed', 'error');
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = '/login';
    }
}

// Utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}




function protectPage() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "/login";
  }}

  protectPage();