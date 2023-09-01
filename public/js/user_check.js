window.addEventListener('load', () => {
    let name = localStorage.getItem('username');
    if (name) {
        document.getElementById('user_name').innerText = name;
    }
});
