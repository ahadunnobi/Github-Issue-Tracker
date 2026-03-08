const API_BASE_URL = 'https://phi-lab-server.vercel.app/api/v1/lab';
const credential = {
    username: 'admin',
    password: 'admin123'
};

const loginContainer = document.getElementById('login-container');
const mainContent = document.getElementById('main-content');
const loginForm = document.getElementById('login-form');
const issueContainer = document.getElementById('issue-container');
const allCount = document.getElementById('all-count');
const openCount = document.getElementById('open-count');
const closedCount = document.getElementById('closed-count');
const tabButtons = document.querySelectorAll('.tab-btn');

let allIssuesStore = [];

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');

    if (username === credential.username && password === credential.password) {
        showMainDashboard();
        loadInitialData();
    } else {
        alert('Invalid credentials. Please use the demo credentials provided below.');
    }
});

function showMainDashboard() {
    loginContainer.classList.add('hidden');
    mainContent.classList.remove('hidden');
}

const loadInitialData = () => {
    fetch(`${API_BASE_URL}/issues`)
        .then(res => res.json())
        .then(data => {
            allIssuesStore = data.data || [];
            updateTabCounts();
            displayIssues(allIssuesStore);
        })

};

const updateTabCounts = () => {
    const issues = allIssuesStore || [];
    const openCountValue = issues.filter(i => (i.status || '').toLowerCase() === 'open').length;
    const closedCountValue = issues.filter(i => (i.status || '').toLowerCase() === 'closed').length;

    if (allCount) allCount.innerText = issues.length;
    if (openCount) openCount.innerText = openCountValue;
    if (closedCount) closedCount.innerText = closedCountValue;
};


const getLabelConfig = (labelName) => {
    if (!labelName) return { class: 'tag-default', icon: 'fa-tag' };
    const name = labelName.toLowerCase().trim();
    if (name.includes('bug')) return { class: 'tag-bug', icon: 'fa-face-smile-wink' };
    if (name.includes('enhancement')) return { class: 'tag-enhancement', icon: 'fa-wand-magic-sparkles' };
    if (name.includes('help wanted')) return { class: 'tag-help-wanted', icon: 'fa-life-ring' };
    if (name.includes('documentation')) return { class: 'tag-documentation', icon: 'fa-book' };
    return { class: 'tag-default', icon: 'fa-tag' };
};

const displayIssues = (issues = []) => {
    if (!issueContainer) return;
    issueContainer.innerHTML = '';

    if (issues.length === 0) {
        issueContainer.innerHTML = '<div class="text-white text-center py-10 opacity-50">No issues found for this category.</div>';
        return;
    }

    issues.forEach(issue => {
        const card = document.createElement('div');
        const status = (issue.status || 'open').toLowerCase();
        const isClosed = status === 'closed';
        const priority = (issue.priority || 'low').toLowerCase();

        // Fix: API uses 'labels' (array) instead of 'label'
        let labels = [];
        if (issue.labels) {
            labels = Array.isArray(issue.labels) ? issue.labels : issue.labels.split(',').map(l => l.trim());
        } else if (issue.label) {
            labels = Array.isArray(issue.label) ? issue.label : issue.label.split(',').map(l => l.trim());
        }

        const statusClass = isClosed ? 'status-closed' : 'status-open';
        const priorityClass = `priority-${priority}`;
        const statusText = status.toUpperCase();
        const priorityText = priority.toUpperCase();

        const topBorderColor = isClosed ? 'border-t-[#a371f7]' : 'border-t-[#3fb950]';

        card.className = `bg-[#161b22] border-t-4 ${topBorderColor} border-x border-b border-[#30363d] rounded-lg p-4 shadow-sm flex flex-col gap-3`;

        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex flex-col gap-1">
                    <span class="text-[10px] px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1.5 ${statusClass}">
                        <i class="fa-solid ${isClosed ? 'fa-circle-check' : 'fa-circle-dot'} text-[10px]"></i>
                        ${statusText}
                    </span>
                </div>
                <div class="text-right">
                    <p class="text-[11px] text-[#8b949e] font-bold">#${issue.id || '0'}</p>
                    <p class="text-[11px] ${priorityClass}">${priorityText}</p>
                </div>
            </div>
            
            <div class="">
                <h3 class="font-bold text-[#fff9eb] text-[16px] mb-1 line-clamp-2 leading-tight">${issue.title || 'No Title'}</h3>
                <p class="text-[12.5px] text-[#fff9eb] line-clamp-2 leading-relaxed opacity-70 mb-2">${issue.description || 'No description available...'}</p>
            </div>

            <div class="flex flex-wrap gap-1 mb-2">
                ${labels.map(label => {
            const config = getLabelConfig(label);
            return `
                        <span class="text-[10px] px-2 py-[1px] rounded-full ${config.class} font-bold uppercase flex items-center gap-0.5">
                            <i class="fa-solid ${config.icon} text-[10px]"></i>
                            ${label.toUpperCase()}
                        </span>
                    `;
        }).join('')}
            </div>

            <div class="pt-3 border-t border-[#30363d] mt-auto flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="w-5 h-5 rounded-full bg-[#30363d] flex items-center justify-center text-[9px] text-white font-bold uppercase">
                        ${String(issue.author || 'U').charAt(0)}
                    </div>
                    <span class="text-[11.5px] text-[#8b949e]">${issue.author || 'unknown'}</span>
                </div>
                <span class="text-[11.5px] text-[#8b949e]">${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
            </div>
        `;
        issueContainer.appendChild(card);
    });
};

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => {
            b.classList.remove('active');
            b.classList.add('text-[#8b949e]');
        });
        btn.classList.add('active');
        btn.classList.remove('text-[#8b949e]');

        const tab = btn.getAttribute('data-tab');
        if (tab === 'all') {
            displayIssues(allIssuesStore);
        } else {
            const filtered = (allIssuesStore || []).filter(i => (i.status || '').toLowerCase() === tab);
            displayIssues(filtered);
        }
    });
});
