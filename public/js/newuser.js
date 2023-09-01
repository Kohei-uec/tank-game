/*
document.getElementById('input_file').oninput = (event)=> {
    event.preventDefault();

    const file = document.getElementById('input_file').files[0];
    const img = document.createElement('img');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
        reader.addEventListener('load', (e) => {
            img.src = reader.result;
            img.onload = ()=>{
                ctx.drawImage(img, 0, 0);
            };
        });
    }

};
*/

document.getElementById('save').onclick = (event) => {
    event.preventDefault();

    let name = document.getElementById('input_name').value;
    if (name.length <= 0) {
        name = 'no name';
    }
    localStorage.setItem('username', name);
    location.href = './index.html';
};

window.addEventListener('load', () => {
    let name = localStorage.getItem('username');
    if (name) {
        document.getElementById('input_name').value = name;
    }
});
