const color_input = document.getElementById('user_color');
//色変更
export function setColorChangedListener(func) {
    color_input.oninput = ()=>{
        const color = color_input.value;
        const color_code = Number('0x' + color.slice(1));
        func(color_code);
    };
}

export function lockLobbyFunc() {
    color_input.disabled = true;
}
export function unlockLobbyFunc() {
    color_input.disabled = false;
}