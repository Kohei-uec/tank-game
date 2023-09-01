import { serve } from 'denohttp/server.ts';
import { serveDir } from 'denohttp/file_server.ts';
import { closeRoom, createNewRoom, newKey, Room } from './room.js';

serve(async (req) => {
    const pathname = new URL(req.url).pathname;

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

    return serveDir(req, {
        fsRoot: 'public',
        urlRoot: '',
        showDirListing: true,
        enableCors: true,
    });
});

const rooms = new Map();
