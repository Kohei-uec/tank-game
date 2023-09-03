import { map2stringJSON } from "./public/js/util.js";
import { GameManager } from "./game_manager.js";

export class Room {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.owner_pass = "abc";
        this.connectedClients = new Map();
        this.players = new Map();

        this.max_member = 5;
    }

    //playerを追加
    isMembersMax() {
        return this.connectedClients.size >= this.max_member;
    }
    addPlayer(player) {
        this.players.set(player.id, player);
    }
    //playerを削除
    delPlayer(player) {
        this.connectedClients.delete(player.id);
    }

    /*
    //game manager
    setGameManager() {
        this.gameManager = new GameManager(this);
    }
    */

    //broadcast============================
    broadcast(message) {
        for (const client of this.connectedClients.values()) {
            if (client.readyState !== 1) {
                return;
            }
            client.send(message);
        }
    }

    //playerを更新
    broadcast_players() {
        this.broadcast(JSON.stringify({
            event: 'update_players',
            players: map2stringJSON(this.players),
        }));
    }
    //
    sendRoomInfo(user_id) {
        this.broadcast(JSON.stringify({
            event: 'room_info',
            room_id: this.id,
            room_name: this.name,
            max_member: this.max_member,
        }));
    }

    //ルームを閉じる
    close() {
        for (const client of this.connectedClients.values()) {
            client.close(1008, 'close room');
        }
    }
}

export function createNewRoom(rooms, name) {
    const id = newKey(rooms);
    const room = new Room(id, name);
    rooms.set(id, room);
    return room;
}
export function closeRoom(rooms, id) {
    const room = rooms.get(id);
    if (room) {
        console.log('room close', room.id);
        room.close();
        rooms.delete(id);
    }
}

export function newKey(map, d = 4) {
    let r;
    do {
        r = Math.floor(Math.random() * 10 ** d);
    } while (map.has(r));
    return r;
}
