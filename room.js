export class Room {
    constructor(id) {
        this.id = id;
        this.connectedClients = new Map();
        this.players = new Map();

        this.max_player = 5;
    }

    //playerを追加
    addPlayer(player) {
        if (this.players.size >= this.max_player) {
            throw new Error('Over the limit (players)');
        }
        this.players.set(player.id, player);
    }
    //playerを削除
    delPlayer(player) {
        this.connectedClients.delete(player.id);
    }

    //broadcast============================
    broadcast(message) {
        for (const client of this.connectedClients.values()) {
            console.log(client);
            if (client.readyState !== 1) {
                return;
            }
            client.send(message);
        }
    }

    //playerを更新
    broadcast_player() {
        this.broadcast(JSON.stringify({
            event: 'update-players',
            players: this.players,
        }));
    }

    //ルームを閉じる
    close() {
        for (const client of this.connectedClients.values()) {
          /*if(client.isOwner) {
            client.send(
              JSON.stringify({
                event: "room-end",
              })
            );
          } else {
            client.close();
          }*/
          client.close();
        }
    }
}

export function createNewRoom(rooms){
    const id = newKey(rooms);
    const room = new Room(id);
    rooms.set(id,room);
    return room;
}
export function closeRoom(rooms, id){
    const room = rooms.get(id);
    if(room){
        console.log("room close",room);
        room.close();
        rooms.delete(id);
    }
}

export  function newKey(map, d=5) {
    let r;
    do {
        r = Math.floor(Math.random() * 10**5);
    } while (map.has(r));
    return r;
}