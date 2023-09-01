export class Room {
    constructor() {
        this.connectedClients = new Map();
        this.players = new Map();

        this.max_player = 5;
    }

    //playerを追加
    addPlayer(id, player) {
        if(this.players.size >= this.max_player) {
            throw new Error('Over the limit (players)');
        }
        this.players.set(id, player);
    }
    //playerを削除
    delPlayer(id) {
        this.connectedClients.delete(id);
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
}
