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
            allIssuesStore = data.data;
            updateTabCounts();
            displayIssues(allIssuesStore);
        });
};

const updateTabCounts = () => {
    const openCountValue = allIssuesStore.filter(i => i.status.toLowerCase() === 'open').length;
    const closedCountValue = allIssuesStore.filter(i => i.status.toLowerCase() === 'closed').length;

    if (allCount) allCount.innerText = allIssuesStore.length;
    if (openCount) openCount.innerText = openCountValue;
    if (closedCount) closedCount.innerText = closedCountValue;
};

const displayIssues = (issues) => {
    issueContainer.innerHTML = '';
    issues.forEach(issue => {
        const card = document.createElement('div');
        const isClosed = issue.status.toLowerCase() === 'closed';
        const topBorderClass = isClosed ? 'border-closed' : 'border-open';
        const statusIcon = isClosed
            ? '<i class="fa-solid fa-circle-check text-[#a371f7]"></i>'
            : '<i class="fa-solid fa-circle-notch fa-spin text-[#3fb950]"></i>';

        const priorityClass = issue.priority?.toLowerCase() === 'high' ? 'priority-high' : 'priority-low';

        card.className = `bg-[#161b22] border-t-4 ${topBorderClass} border-x border-b border-[#30363d] rounded-lg p-6 shadow-sm flex flex-col gap-4`;

        card.innerHTML = `
            <div class="flex justify-between items-center">
                <div class="w-8 h-8 rounded-full bg-[#f0f6fc] flex items-center justify-center text-sm">
                    ${statusIcon}
                </div>
                <span class="text-[10px] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider ${priorityClass}">${issue.priority || 'LOW'}</span>
            </div>
            
            <div>
                <h3 class="font-bold text-[#fff9eb] text-lg mb-2 line-clamp-2 leading-snug">${issue.title || 'No Title'}</h3>
                <p class="text-sm text-[#fff9eb] line-clamp-2 leading-relaxed h-10">${issue.description || 'No description available...'}</p>
            </div>

            <div class="flex flex-wrap gap-2">
                <span class="text-[11px] px-3 py-1 rounded-full tag-bug flex items-center gap-1.5 font-bold uppercase">
                    <i class="fa-solid fa-face-smile-wink text-[12px]"></i> BUG
                </span>
                <span class="text-[11px] px-3 py-1 rounded-full tag-help flex items-center gap-1.5 font-bold uppercase">
                    <i class="fa-solid fa-life-ring text-[12px]"></i> HELP WANTED
                </span>
            </div>

            <div class="pt-4 border-t border-[#f6f8fa] mt-auto">
                <p class="text-[13px] text-[#636c76] mb-1">#${issue.id || '0'} by <span class="font-medium">${issue.author}</span></p>
                <p class="text-[13px] text-[#636c76]">${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
        `;
        issueContainer.appendChild(card);
    });
};

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Manage active styling
        tabButtons.forEach(b => {
            b.classList.remove('active');
            // Remove text colors and hover states to let CSS handle it
            b.classList.add('text-[#8b949e]');
        });
        btn.classList.add('active');
        btn.classList.remove('text-[#8b949e]');

        const tab = btn.getAttribute('data-tab');
        if (tab === 'all') {
            displayIssues(allIssuesStore);
        } else {
            const filtered = allIssuesStore.filter(i => i.status.toLowerCase() === tab);
            displayIssues(filtered);
        }
    });
});
