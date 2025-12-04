let currentResume = null;
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    const selectedResume = localStorage.getItem('selectedResume');

    if (!token || !selectedResume) {
        window.location.href = '/resumes/';
        return;
    }

    try {
        currentResume = JSON.parse(selectedResume);
        loadResumeDetails();
    } catch {
        window.location.href = '/resumes/';
    }

    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = '/resumes/';
    });

    document.getElementById('printBtn').addEventListener('click', () => {
        window.print();
    });

    document.getElementById('copyImproved').addEventListener('click', copyImprovedResume);
    document.getElementById('downloadImproved').addEventListener('click', downloadImproved);
});

function loadResumeDetails() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');

    document.getElementById('mainScore').textContent = currentResume.aiScore || 0;
    document.getElementById('aiScore').textContent = currentResume.aiScore || 0;
    document.getElementById('atsScore').textContent = currentResume.atsScore || 0;
    document.getElementById('matchScore').textContent = (currentResume.matchPercentage || 0) + '%';

    document.getElementById('originalResume').textContent = currentResume.originalText || 'No original text available';
    document.getElementById('improvedResume').textContent = currentResume.aiImprovedText || 'No improved text available';

    const jobDesc = currentResume.jobdescription || 'No job description provided';
    document.getElementById('jobDescription').innerHTML = `<p>${jobDesc}</p>`;

    const skillsContainer = document.getElementById('missingSkills');
    skillsContainer.innerHTML = currentResume.missingSkills && currentResume.missingSkills.length > 0
        ? currentResume.missingSkills.map(skill => `<div class="skill-tag"><i class="fas fa-times-circle"></i> ${skill}</div>`).join('')
        : '<p class="text-gray-500">No missing skills detected</p>';

    renderSuggestions();

    if (currentResume.fileUrl) {
        document.getElementById('fileSection').style.display = 'block';
        document.getElementById('fileLink').href = currentResume.fileUrl;
    }
}

function renderSuggestions() {
    const container = document.getElementById('suggestionsList');

    if (!currentResume.suggestions || currentResume.suggestions.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No suggestions available</p>';
        return;
    }

    container.innerHTML = currentResume.suggestions.map((suggestion, index) =>
        `<div class="suggestion-item">
            <h4>${index + 1}. ${suggestion.split('.')[0]}</h4>
            <p>${suggestion}</p>
        </div>`
    ).join('');
}

function copyImprovedResume() {
    const text = currentResume.aiImprovedText || '';
    navigator.clipboard.writeText(text)
        .then(() => showToast('✅ Improved resume copied to clipboard!', 'success'))
        .catch(() => showToast('❌ Failed to copy', 'error'));
}

function downloadImproved() {
    const text = currentResume.aiImprovedText || '';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `improved-resume-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('✅ Improved resume downloaded!', 'success');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

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