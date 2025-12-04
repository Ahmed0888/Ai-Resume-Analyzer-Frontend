class JobTracker {
    constructor() {
        // LIVE BACKEND BASE URL
        this.API_BASE = "https://ai-resume-analyzer-backend-nine.vercel.app/api";

        // Get REAL user ID from JWT token FIRST
        this.userId = this.getUserIdFromToken();
        console.log("👤 AUTHENTICATED USER ID:", this.userId);

        // PROTECT PAGE - BLOCK IF NO VALID USER
        if (!this.userId) {
            console.log("❌ NO VALID TOKEN - REDIRECTING TO LOGIN");
            this.redirectToLogin();
            return;
        }

        this.init();
    }

    // EXTRACT REAL USER ID FROM JWT TOKEN
    getUserIdFromToken() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return null;

            const payload = JSON.parse(atob(token.split(".")[1]));
            const userId = payload.id || payload.userId || payload.sub;

            if (userId) {
                localStorage.setItem("userId", userId);
                return userId;
            }
            return null;
        } catch (e) {
            console.error("❌ Token parse error:", e);
            return null;
        }
    }

    // PROTECT PAGE FUNCTIONALITY RESTORED
    redirectToLogin() {
        document.body.innerHTML = `
            <div style="
                display: flex; flex-direction: column; align-items: center; 
                justify-content: center; height: 100vh; text-align: center;
                background: linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%);
                font-family: -apple-system, sans-serif;
            ">
                <div style="
                    background: white; padding: 3rem; border-radius: 24px; 
                    box-shadow: 0 25px 60px rgba(0,0,0,0.1); max-width: 400px;
                    border: 1px solid #e5e7eb;
                ">
                    <i class="fas fa-lock" style="font-size: 4rem; color: #3b82f6; margin-bottom: 1rem;"></i>
                    <h2 style="color: #1e293b; margin-bottom: 1rem;">Authentication Required</h2>
                    <p style="color: #64748b; margin-bottom: 2rem;">Please login to access your job dashboard</p>
                    <a href="https://ai-resume-analyzer-frontend.vercel.app/login/" style="
                        background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
                        color: white; padding: 1rem 2rem; border-radius: 16px; 
                        text-decoration: none; font-weight: 700; display: inline-block;
                        box-shadow: 0 10px 25px rgba(59,130,246,0.3);
                    ">Go to Login</a>
                </div>
            </div>
        `;
        throw new Error("Authentication required");
    }

    // COMPLETE API CALL WITH PROTECTION
    async apiCall(endpoint, options = {}) {
        const token = localStorage.getItem("token");
        if (!token || !this.userId) {
            this.showToast("Session expired. Please login again", "error");
            setTimeout(() => {
                // login page on Vercel frontend
                window.location.href = "https://ai-resume-analyzer-frontend.vercel.app/login/";
            }, 2000);
            throw new Error("Not authenticated");
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                "X-User-ID": this.userId,          // REAL USER ID
                Authorization: `Bearer ${token}`,  // JWT TOKEN
            },
            ...options,
        };

        try {
            console.log("🔗 API:", `${this.API_BASE}/jobs${endpoint}`, {
                userId: this.userId,
            });
            const response = await fetch(
                `${this.API_BASE}/jobs${endpoint}`,
                config
            );

            const contentType = response.headers.get("content-type");
            if (!contentType?.includes("application/json")) {
                const text = await response.text();
                console.error("❌ HTML RESPONSE:", text.substring(0, 200));
                if (response.status === 401 || response.status === 403) {
                    this.showToast("Session expired. Redirecting...", "error");
                    setTimeout(() => {
                        window.location.href = "https://ai-resume-analyzer-frontend.vercel.app/login/";
                    }, 1500);
                }
                throw new Error(`Server error (${response.status})`);
            }

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    this.showToast("Session expired. Redirecting...", "error");
                    setTimeout(() => {
                        window.location.href = "https://ai-resume-analyzer-frontend.vercel.app/login/";
                    }, 1500);
                }
                throw new Error(data.message || `HTTP ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error("API Error:", error);
            this.showToast("Error: " + error.message, "error");
            throw error;
        }
    }

    // ALL ORIGINAL FEATURES + PROTECTION
    init() {
        console.log("✅ JobTracker initialized for user:", this.userId);

        const appliedDate = document.getElementById("appliedDate");
        if (appliedDate) appliedDate.valueAsDate = new Date();

        const jobForm = document.getElementById("jobForm");
        if (jobForm) jobForm.addEventListener("submit", (e) => this.addJob(e));

        const clearForm = document.getElementById("clearForm");
        if (clearForm) clearForm.addEventListener("click", () => this.clearForm());

        document.querySelectorAll(".filter-btn").forEach((btn) => {
            btn.addEventListener("click", (e) =>
                this.filterJobs(e.target.dataset.status)
            );
        });

        const editForm = document.getElementById("editForm");
        if (editForm) editForm.addEventListener("submit", (e) => this.updateJob(e));

        const deleteJobBtn = document.getElementById("deleteJobBtn");
        if (deleteJobBtn)
            deleteJobBtn.addEventListener("click", () => this.deleteJob());

        const closeModal = document.getElementById("closeModal");
        if (closeModal) closeModal.addEventListener("click", () => this.closeModal());

        this.showUserUI();
        this.loadJobs();
    }

    showUserUI() {
        const loading = document.getElementById("loading");
        const loginPrompt = document.getElementById("loginPrompt");
        const mainContent = document.getElementById("mainContent");

        if (loading) loading.classList.add("hidden");
        if (loginPrompt) loginPrompt.classList.add("hidden");
        if (mainContent) mainContent.classList.remove("hidden");

        console.log("✅ Dashboard loaded for user:", this.userId);
    }

    async loadJobs(statusFilter = "all") {
        this.showLoading(true);
        try {
            console.log("📡 Loading jobs for user:", this.userId);
            const params = statusFilter === "all" ? "" : `?status=${statusFilter}`;
            const data = await this.apiCall(params);

            if (data.success) {
                console.log("✅ Jobs loaded:", data.jobs?.length || 0);
                this.renderJobs(data.jobs || []);
                this.updateStats(data.stats || {});
                this.updateActiveFilter(statusFilter);
            }
        } catch (error) {
            console.error("Load error:", error);
        } finally {
            this.showLoading(false);
        }
    }

    renderJobs(jobs) {
        const tbody = document.getElementById("jobsTableBody");
        if (!tbody) return;

        if (jobs.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-state">
                    <td colspan="6">
                        <i class="fas fa-briefcase"></i>
                        <p>No jobs yet. Add your first application above!</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = jobs
            .map(
                (job) => `
            <tr>
                <td class="font-semibold">${this.escapeHtml(job.company)}</td>
                <td>${this.escapeHtml(job.position)}</td>
                <td><span class="status-badge status-${job.status.toLowerCase()}">${job.status}</span></td>
                <td>${new Date(job.appliedDate).toLocaleDateString()}</td>
                <td>${this.escapeHtml(job.notes || "-")}</td>
                <td>
                    <button class="action-btn" onclick="jobTracker.editJob('${job._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="jobTracker.deleteJob('${job._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
            )
            .join("");
    }

    async addJob(e) {
        e.preventDefault();
        const formData = {
            userId: this.userId,
            company: document.getElementById("company").value.trim(),
            position: document.getElementById("position").value.trim(),
            appliedDate: document.getElementById("appliedDate").value,
            status: document.getElementById("status").value,
            jobDescription: document
                .getElementById("jobDescription")
                .value.trim(),
            notes: document.getElementById("notes").value.trim(),
        };
        if (!formData.company || !formData.position || !formData.status) {
            this.showToast("Please fill required fields", "error");
            return;
        }
        try {
            await this.apiCall("", {
                method: "POST",
                body: JSON.stringify(formData),
            });
            this.showToast("✅ Job added!", "success");
            this.clearForm();
            this.loadJobs();
        } catch (error) {
            console.error("Add error:", error);
        }
    }

    updateStats(stats) {
        const defaultStats = {
            Applied: 0,
            Interviewing: 0,
            Rejected: 0,
            Offered: 0,
        };
        Object.entries({ ...defaultStats, ...stats }).forEach(
            ([status, count]) => {
                const el = document.getElementById(
                    `${status.toLowerCase()}Count`
                );
                if (el) el.textContent = count;
            }
        );
    }

    updateActiveFilter(status) {
        document.querySelectorAll(".filter-btn").forEach((btn) =>
            btn.classList.toggle("active", btn.dataset.status === status)
        );
    }

    clearForm() {
        document.getElementById("jobForm")?.reset();
        document.getElementById("appliedDate").valueAsDate = new Date();
    }

    filterJobs(status) {
        this.loadJobs(status);
    }

    editJob(id) {
        document.getElementById("editJobId").value = id;
        document.getElementById("editModal").classList.remove("hidden");
        document.getElementById("editModal").classList.add("show");
    }

    async updateJob(e) {
        e.preventDefault();
        const id = document.getElementById("editJobId")?.value;
        if (!id) return;
        const formData = {
            status: document.getElementById("editStatus")?.value,
            notes: document.getElementById("editNotes")?.value.trim(),
        };
        try {
            await this.apiCall(`/${id}`, {
                method: "PUT",
                body: JSON.stringify(formData),
            });
            this.showToast("✅ Updated!", "success");
            this.closeModal();
            this.loadJobs();
        } catch (error) {
            console.error("Update error:", error);
        }
    }

    async deleteJob(id = document.getElementById("editJobId")?.value) {
        if (!id || !confirm("Delete this job?")) return;
        try {
            await this.apiCall(`/${id}`, { method: "DELETE" });
            this.showToast("✅ Deleted!", "success");
            this.closeModal();
            this.loadJobs();
        } catch (error) {
            console.error("Delete error:", error);
        }
    }

    closeModal() {
        document.getElementById("editModal").classList.remove("show");
        document.getElementById("editModal").classList.add("hidden");
    }

    showLoading(show = true) {
        document
            .getElementById("loading")
            ?.classList.toggle("hidden", !show);
        document
            .getElementById("mainContent")
            ?.classList.toggle("hidden", show);
    }

    showToast(message, type = "success") {
        const toast = document.getElementById("toast");
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
}

// GLOBAL FUNCTIONS
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        // login page on Vercel frontend
        window.location.href = "https://ai-resume-analyzer-frontend.vercel.app/login/";
    }
}

// COMPLETE INITIALIZATION WITH PROTECTION
document.addEventListener("DOMContentLoaded", () => {
    try {
        const jobTracker = new JobTracker();
        window.jobTracker = jobTracker;
        console.log("✅ JobTracker fully initialized + PROTECTED");
    } catch (error) {
        console.error("❌ JobTracker init failed:", error);
    }
});
