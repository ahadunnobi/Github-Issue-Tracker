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
        });
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


    const issueHeader = document.getElementById('issue-header');
    if (issueHeader) {
        const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'all';
        let count = issues.length;
        let title = `${count} Issues`;
        let subText = 'Track and manage your project issues';

        if (activeTab === 'open') title = `${count} Open Issues`;
        else if (activeTab === 'closed') title = `${count} Closed Issues`;

        issueHeader.innerHTML = `
            <div class="issue-header-container shadow-sm mb-4 flex-wrap gap-y-4 md:gap-y-0 px-4 md:px-5">
                <div class="flex items-center gap-3 md:gap-4">
                    <div class="header-icon-circle scale-90 md:scale-100">
                         <i class="font-bold text-black fa-solid fa-bug"></i>
                    </div>
                    <div class="flex flex-col">
                        <span class="font-bold text-white text-[18px] md:text-[20px] leading-tight">${title}</span>
                        <span class="text-[#8b949e] text-[12px] md:text-[13px] font-medium">${subText}</span>
                    </div>
                </div>
                <div class="flex items-center gap-4 md:gap-5 text-[12px] md:text-[13px] font-bold text-[#8b949e] w-full md:w-auto border-t md:border-t-0 border-[#30363d] pt-3 md:pt-0">
                    <span class="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
                        <i class="fa-solid fa-circle-dot text-[#3fb950] text-[11px] md:text-[12px]"></i> Open
                    </span>
                    <span class="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
                        <i class="fa-solid fa-circle-check text-[#a371f7] text-[11px] md:text-[12px]"></i> Closed
                    </span>
                </div>
            </div>
        `;
    }

    issueContainer.innerHTML = '';

    if (issues.length === 0) {
        issueContainer.innerHTML = '<div class="text-white text-center py-10 opacity-50 bg-[#161b22] border border-[#30363d] rounded-lg">No issues found.</div>';
        return;
    }

    issues.forEach(issue => {
        const card = document.createElement('div');
        const status = (issue.status || 'open').toLowerCase();
        const isClosed = status === 'closed';
        const priority = (issue.priority || 'low').toLowerCase();

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
        card.addEventListener('click', () => openIssueModal(issue));
        issueContainer.appendChild(card);
    });
};

const openIssueModal = (issue) => {
    const modal = document.getElementById('issue_modal');
    const modalContent = document.getElementById('modal-content');
    const modalBox = modal.querySelector('.modal-box');
    if (!modal || !modalContent || !modalBox) return;

    const status = (issue.status || 'open').toLowerCase();
    const isClosed = status === 'closed';
    const statusText = isClosed ? 'Closed' : 'Opened';
    const statusClass = isClosed ? 'status-closed' : 'status-open';
    const priority = (issue.priority || 'low').toLowerCase();
    const priorityClass = `priority-${priority}`;
    const topBorderColor = isClosed ? 'border-t-[#a371f7]' : 'border-t-[#3fb950]';


    let displayAssignee = (issue.assignee && issue.assignee.toLowerCase() !== 'unassigned')
        ? issue.assignee
        : (issue.author || 'No Assignee');

    let labels = [];
    if (issue.labels) {
        labels = Array.isArray(issue.labels) ? issue.labels : issue.labels.split(',').map(l => l.trim());
    } else if (issue.label) {
        labels = Array.isArray(issue.label) ? issue.label : issue.label.split(',').map(l => l.trim());
    }

    const date = issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: '2-digit', year: 'numeric' }) : 'N/A';

    modalBox.className = `modal-box max-w-2xl bg-[#161b22] text-[#c9d1d9] p-0 border-t-4 ${topBorderColor} border-x border-b border-[#30363d] shadow-2xl`;

    modalContent.innerHTML = `
        <div class="flex justify-between items-start mb-4">
           <h2 class="text-[32px] font-bold text-white leading-tight">${issue.title || 'No Title'}</h2>
           <span class="text-[#8b949e] font-bold text-[14px]">#${issue.id || '0'}</span>
        </div>
        
        <div class="flex items-center gap-2 mb-6 text-[14px] text-[#8b949e]">
            <span class="px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1.5 ${statusClass} text-[11px] uppercase">
                <i class="fa-solid ${isClosed ? 'fa-circle-check' : 'fa-circle-dot'} text-[10px]"></i>
                ${statusText}
            </span>
            <span class="opacity-40 text-[10px]">•</span>
            <span>Opened by <span class="font-bold text-white">${issue.author || 'unknown'}</span></span>
            <span class="opacity-40 text-[10px]">•</span>
            <span>${date}</span>
        </div>

        <div class="flex flex-wrap gap-1 mb-8">
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

        <div class="mb-8">
            <p class="text-[15px] text-[#8b949e] leading-relaxed opacity-90">
                ${issue.description || 'No description available...'}
            </p>
        </div>

        <div class="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 flex justify-between items-center mb-8">
            <div class="flex flex-col gap-0.5">
                <span class="text-[12px] text-[#8b949e] font-bold uppercase tracking-wider opacity-60">Assignee</span>
                <span class="text-[16px] font-bold text-white">${displayAssignee}</span>
            </div>
            <div class="flex flex-col gap-0.5 items-end">
                <span class="text-[12px] text-[#8b949e] font-bold uppercase tracking-wider opacity-60">Priority</span>
                <span class="text-[14px] font-bold ${priorityClass} uppercase tracking-wide">
                    ${priority.toUpperCase()}
                </span>
            </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-[#30363d]">
            <button onclick="document.getElementById('issue_modal').close()" class="px-8 py-2 bg-[#21262d] hover:bg-[#30363d] hover:text-white border border-[#30363d] text-[#c9d1d9] rounded-md font-bold transition-all text-sm shadow-sm active:scale-95">
                Close
            </button>
        </div>
    `;

    modal.showModal();
};

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const clearSearchBtn = document.getElementById('clear-search');

const applyFilters = () => {
    const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'all';
    const query = (searchInput.value || '').toLowerCase().trim();

    const filtered = (allIssuesStore || []).filter(issue => {
        const statusMatch = activeTab === 'all' || (issue.status || '').toLowerCase() === activeTab;
        const searchMatch = !query ||
            (issue.title || '').toLowerCase().includes(query) ||
            (issue.description || '').toLowerCase().includes(query);
        return statusMatch && searchMatch;
    });

    displayIssues(filtered);
};

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => {
            b.classList.remove('active');
            b.classList.add('text-[#8b949e]');
        });
        btn.classList.add('active');
        btn.classList.remove('text-[#8b949e]');

        applyFilters();
    });
});

searchInput.addEventListener('input', () => {
    if (searchInput.value.length > 0) {
        clearSearchBtn.classList.remove('hidden');
    } else {
        clearSearchBtn.classList.add('hidden');
        applyFilters();
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        applyFilters();
    }
});

searchBtn.addEventListener('click', applyFilters);

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    applyFilters();
});
