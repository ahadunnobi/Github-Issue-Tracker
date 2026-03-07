const credential = {
    username: 'admin',
    password: 'admin123'
};
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
    alert('hi ned')
    
}