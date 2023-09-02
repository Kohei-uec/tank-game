import { serve } from 'denohttp/server.ts';
import { serveDir } from 'denohttp/file_server.ts';
import { closeRoom, createNewRoom, newKey, Room } from './room.js';
import { Player } from './player.js';

serve(async (req) => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    //room一覧
    if (req.method === 'GET' && pathname === '/getrooms') {
        const obj = Object.fromEntries(rooms);
        return new Response(JSON.stringify(obj));
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

        const room = createNewRoom(rooms, name);

        return new Response(JSON.stringify(room));
    }

    //join room
    //web socket
    if (req.method === 'GET' && pathname === '/join_lobby') {
        const { socket, response } = Deno.upgradeWebSocket(req);
        const user_name = url.searchParams.get('name');
        const room_id = url.searchParams.get('room') - 0;
        console.log(rooms.has(room_id),room_id,rooms);

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
            console.log('socket event:', json.event);
            if (json.event === 'test') {
                console.log('test');
            } else if (json.event === 'end' && isOwner) {
                console.log('end room');
                closeRoom(room_id);
            }
        };
        socket.onerror = (e) => {
            console.log('socket errored:', e);
        };
        socket.onclose = () => {
            room.connectedClients.delete(user_id);

            //auto del room
            if (room.connectedClients.size === 0) {
                closeRoom(room_id);
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
