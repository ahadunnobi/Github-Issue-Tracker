const API_BASE_URL = 'https://phi-lab-server.vercel.app/api/v1/lab';
const credential = {
    username: 'admin',
    password: 'admin123'
};

const loginContainer = document.getElementById('login-container');
const mainContent = document.getElementById('main-content');
const loginForm = document.getElementById('login-form');
const allCount = document.getElementById('all-count');
const openCount = document.getElementById('open-count');
const closedCount = document.getElementById('closed-count');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');

    if (username === credential.username && password === credential.password) {
        showMainDashboard();
        loadAllIssues();
    } else {
        alert('Invalid credentials. Please use the demo credentials provided below.');
    }
});

function showMainDashboard() {
    loginContainer.classList.add('hidden');
    mainContent.classList.remove('hidden');
}

const loadAllIssues = () => {
    fetch(`${API_BASE_URL}/issues`)
        .then(res => res.json())
        .then(data => {
            const issues = data.data;
            const openIssues = issues.filter(issue => issue.status.toLowerCase() === 'open');
            const closedIssues = issues.filter(issue => issue.status.toLowerCase() === 'closed');

            allCount.innerText = issues.length;
            openCount.innerText = openIssues.length;
            closedCount.innerText = closedIssues.length;
        });
};

