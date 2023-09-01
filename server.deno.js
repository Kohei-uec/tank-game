import { serve } from 'denohttp/server.ts';
import { serveDir } from 'denohttp/file_server.ts';
import { Room, createNewRoom, closeRoom, newKey } from './room.js';

serve(async (req) => {
    const pathname = new URL(req.url).pathname;
    console.log(pathname);

    if (req.method === 'GET' && pathname === '/welcome-message') {
        return new Response('jigインターンへようこそ！');
    }


    //roomを作成
    if (req.method === "POST" && pathname === "/createroom") {

      //部屋が多い
      if (rooms.length > 20) {
        return new Response("部屋を作れません", { status: 403 });
      }

      //既に部屋を立てている
      if (rooms.has(roomid)){
        return new Response(JSON.stringify({roomid}));
      }
      const room = createNewRoom(roomid, did);

      return new Response(JSON.stringify({roomid}));
    }


    return serveDir(req, {
        fsRoot: 'public',
        urlRoot: '',
        showDirListing: true,
        enableCors: true,
    });
});

const rooms = new Map();