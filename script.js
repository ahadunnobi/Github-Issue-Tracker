const credential = {
    username: 'admin',
    password: 'admin123'
};
const loginContainer = document.getElementById('login-container');
const mainContent = document.getElementById('main-content');
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');

    if (username === credential.username && password === credential.password) {
        showMainDashboard();
    } else {
        alert('Invalid credentials. Please use the demo credentials provided below.');
    }
});
function showMainDashboard() {
    loginContainer.classList.add('hidden');
    mainContent.classList.remove('hidden');
    // Change body classes for main content
    document.body.classList.remove('justify-center', 'items-center');
    document.body.classList.add('bg-[#0d1117]');

    fetchIssues();
}