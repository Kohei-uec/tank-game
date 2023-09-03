import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { Controller } from './controller.js';
import { connectSocket, setSocketEventListener } from './connect.js';
import { stringJSON2map } from './util.js';
import { setColorChangedListener, lockLobbyFunc, unlockLobbyFunc } from './lobby.js';
import * as View from './view.js';

let player = null;
let bullets = null;
//connection ==============================================
const socket = await connectSocket();
let players = null;
setSocketEventListener('update_players',(data)=>{
    // refresh displayed user list
    players = stringJSON2map(data.players);
    const span = document.getElementById('member');
    let html = '';
    for (const player of players.values()) {
        //add tank
        View.addTank(player);
        
        //change color
        if(player.color){
            View.setMyTankColor(player, player.color);
        }

        html += `<div>[${player.id}]${player.name}</div>`;
    }
    span.innerHTML = html;

    View.delTank(players);
});
setSocketEventListener('update_model',(data)=>{
    players = stringJSON2map(data.players);
    bullets = stringJSON2map(data.bullets);
    for (const player of players.values()) {
        View.setMyTankPos(player);
    }
    View.updateBullets(bullets);
});
setSocketEventListener('update_player', (data)=>{
    const player = data.player;
    players.set(player.id, player);
    //console.log(players);

    //move the tank
    View.setMyTankPos(player);
});
setSocketEventListener('update_time', (data)=>{
    const time = data.time;
    const total_sec = Math.floor(time/1000);
    const min = Math.floor(total_sec / 60);
    const sec = total_sec % 60;
    document.getElementById('time').innerText = pad(min) + ':' + pad(sec);
    function pad(num) {
        return (num < 10) ? "0" + num : num;
    }
});

setSocketEventListener('room_info', (data)=>{
    const room_name = data.room_name;
    const max_member = data.max_member;
    player = data.player;

    document.getElementById('room_name').innerText = room_name;
    document.getElementById('max_member').innerText = max_member;

    //add my tank
    View.addTank(player);

    
    document.getElementById('room_exit').onclick = ()=>{
        socket.close();
    };
});
setSocketEventListener('isOwner', (data)=>{
    isOwner  = true;
    document.getElementById('menu2-btn').style.display = 'flex';
    //ルームを閉じるボタン
    const btn = document.getElementById("room_close");
    btn.disabled = false;
    btn.onclick = ()=>{
        socket.send(
            JSON.stringify({
                event: "end",
            })
        );
    };
    //owner ui
    start_btn.style.display = 'block';
    start_btn.onclick = ()=>{
        socket.send(JSON.stringify({event: 'game_start'}))
        lockLobbyFunc();
        start_btn.style.display = 'none';
    };
});

let isOwner = false;
const start_btn = document.getElementById('game_start');

setSocketEventListener('game_over', (data)=>{
    unlockLobbyFunc();
    if(isOwner){
        start_btn.style.display = 'block';
    }
});



//controller
const controller = new Controller();
controller.onChange = ()=>{
    if(controller.shoot) {
        socket.send(JSON.stringify({
            event: 'shoot',
        }));
    }else {
        socket.send(JSON.stringify({
            event: 'control',
            controller: controller,
        }));
    }
}

//color
setColorChangedListener((color)=>{
    socket.send(JSON.stringify({
        event: 'change_color',
        color: color,
    }))
});


// View =======================
View.initialize();

// 毎フレーム時に実行されるイベント
View.addEventListener( ()=>{
    return;
    if (controller.w) {
        View.myTank.position.x += 0.1;
        View.myTank.position.x %= 128;
    }
    if (controller.s) {
        View.myTank.position.x -= 0.1;
        View.myTank.position.x %= 128;
    }
    if (controller.a) {
        View.myTank.position.z -= 0.1;
    }
    if (controller.d) {
        View.myTank.position.z += 0.1;
    }
});

document.getElementById('wireframe_btn').onclick = () => {
    View.myTank.material.wireframe = !(View.myTank.material.wireframe);
};
/* document.getElementById('shadow_radius').onclick = () => {
    directionalLight.shadow.radius = !(directionalLight.shadow.radius);
}; */
