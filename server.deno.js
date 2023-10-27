import { serve } from 'denohttp/server.ts';
import { serveDir } from 'denohttp/file_server.ts';
import { closeRoom, createNewRoom, newKey, Room } from './room.js';
import { Player, Bullet } from './player.js';
import { map2stringJSON } from './public/js/util.js';
import { setMyEventListener, switchMyEvent } from './my_event.js';
import { GameManager } from './game_manager.js';
import { Model } from './model.js';

serve(async (req) => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    //room一覧
    if (req.method === 'GET' && pathname === '/getrooms') {
        return new Response(map2stringJSON(rooms));
    }

    console.log(pathname);

    if (req.method === 'GET' && pathname === '/welcome-message') {
        return new Response('jigインターンへようこそ！');
    }

    //roomを作成
    if (req.method === 'POST' && pathname === '/createroom') {
        //部屋が多い
        if (rooms.size > 20) {
            return new Response('部屋を作れません', { status: 403 });
        }

        //既に部屋を立てている
        /*
      if (rooms.has(roomid)){
        return new Response(JSON.stringify({roomid}));
      }*/

        const name = (await req.json()).name;
        //room setting
        const room = createNewRoom(rooms, name);
        //model
        const model = new Model(room);
        model.onupdate = ()=>{room.broadcast_model()};
        room.model = model;
        room.model.initialize();
        room.model.start();
        //game manager
        const GM = new GameManager(room);
        GM.setModel(room.model);
        GM.initialize();
        GM.onUpdateTime = (time)=> {
            room.broadcast_time(time);
        }
        GM.onTimeOver = ()=> {
            room.broadcast_game_over()
            //closeRoom(rooms, room.id);
        }

        console.log('new room id:', room.id);
        const pass = 'pass';
        room.owner_pass = pass;
        return new Response(JSON.stringify({id:room.id, pass:pass}));
    }

    //join room
    //web socket
    if (req.method === 'GET' && pathname === '/join_lobby') {
        const { socket, response } = Deno.upgradeWebSocket(req);
        const user_name = url.searchParams.get('name');
        const room_id = url.searchParams.get('room') - 0;
        const pass = url.searchParams.get('pass');

        //console.log(rooms.has(room_id),room_id,rooms);

        //部屋がない
        if (!rooms.has(room_id)) {
            console.log('no room ->', room_id)
            socket.addEventListener('open', ()=>{
              socket.close(1008, `no room`);
            });
            return response;
        }

        const room = rooms.get(room_id);

        //人数制限
        if (room.isMembersMax()) {
            socket.addEventListener('open', ()=>{
                socket.close(1008, `Over the limit`);
            });
            return response;
        }

        //const isOwner = pass === room.owner_pass;
        const isOwner = true;

        //user追加
        const user_id = newKey(rooms);
        const player = new Player(user_id, user_name);
        player.isOwner = isOwner;
        room.addPlayer(player);
        room.connectedClients.set(user_id, socket);

        //socket listener================================
        socket.onopen = () => {
            room.sendRoomInfo(user_id);
            room.broadcast_players();
            if (isOwner) {
                socket.send(JSON.stringify({ event: 'isOwner' }));
            }
        };
        socket.onmessage = (e) => {
            const json = JSON.parse(e.data);
            //console.log('socket event:', json.event);
            switchMyEvent(json, [room, player]);
        };
        socket.onerror = (e) => {
            console.log('socket errored:', e);
        };
        socket.onclose = () => {
            room.delPlayer(player);

            //auto del room
            if (room.connectedClients.size === 0) {
                closeRoom(rooms, room_id);
                return;
            }

            room.broadcast_players();
        };

        return response;
    }

    return serveDir(req, {
        fsRoot: 'public',
        urlRoot: '',
        showDirListing: true,
        enableCors: true,
    });
});

const rooms = new Map();

setMyEventListener('end', (data, options)=>{
    const [room, player] = options;
    if(player.isOwner){
        closeRoom(rooms, room.id);
    }
})

setMyEventListener('game_start', (data, options)=>{
    const [room, player] = options;
    if(!player.isOwner){return;}
    room.gameStart();
});

setMyEventListener('shoot', (data, options)=>{
    const [room, player] = options;
    room.model.shoot(player);
});
setMyEventListener('control', (data, options)=>{
    const [room, player] = options;
    const control = data.controller;
    const controller = room.controllers.get(player.id);
    //console.log(controller);
    if(control.w){
        controller.move = 1;
    } else if(control.s){
        controller.move = -1;
    } else {
        controller.move = 0;
    }
    if(control.a){
        controller.rotate = -1;
    } else if(control.d){
        controller.rotate = 1;
    } else {
        controller.rotate = 0;
    }
});

setMyEventListener('change_color', (data, options)=>{
    const [room, player] = options;
    const color = data.color;
    player.color = color;
    room.broadcast_players();
});

setMyEventListener('change_speed', (data, options)=>{
    const [room, player] = options;
    const speed = data.speed;
    room.model.changeSpeed(speed);
})