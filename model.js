export class Controller{
    constructor(id){
        this.id = id;
        this.move = 0;
        this.rotate = 0;
    }
}

export class Model{
    constructor(room){
        this.room = room;
        this.players = room.players;
        this.controllers = room.controllers;

        this.fps = 30;

        this.max_speed = 20/this.fps;
        this.accel = 1/this.fps;
        this.resistance = 3/this.fps;
    }

    start(){
        console.log('model start')
        const delay = 1000 / this.fps;
        this.interval = setInterval(()=>{
            this.update();
        }, delay);
    }

    stop(){
        clearInterval(this.interval);
    }

    update(){
        for(const player of this.players.values()){
            this.update_player(player);    
        }
        this.room.broadcast_model();
    }

    update_player(player){
        const controller = this.controllers.get(player.id);
        if(controller.move > 0){
            player.speed += this.accel;
            if(player.speed > this.max_speed){
                player.speed = this.max_speed;
            }
        }else if(controller.move < 0){
            player.speed -= this.accel;
            if(player.speed < -this.max_speed){
                player.speed = -this.max_speed;
            }
        } else {
            //無操作で減衰
            if(player.speed > 0){
                player.speed -= this.resistance;
                if(player.speed < 0){
                    player.speed = 0;
                }
            }else if(player.speed < 0){
                player.speed += this.resistance;
                if(player.speed > 0){
                    player.speed = 0;
                }
            }
        }


        console.log(player.speed,controller.move);

        const v = player.getVelocity()
        player.move(v);
    }
}