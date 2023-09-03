import { Bullet } from "./player.js";

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
        this.field_width = 256;


        this.fps = 30;

        this.max_speed = 20/this.fps;
        this.accel = 1/this.fps;
        this.resistance = 3/this.fps;

        this.bullet_speed = 100/this.fps;
        this.bullets = room.bullets;
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
        //players
        for(const player of this.players.values()){
            this.update_player(player);
        }
        //bullet
        for(const bullet of this.bullets.values()){
            this.update_bullet(bullet);
        }
        
        this.room.broadcast_model();
        /*
        for(let i=0; i < player.bullets.length; i++){
            const bullet = player.bullets[i];
            const x = bullet.x;
            const z = bullet.z;
            const w = this.field_width;
            if(x < -w || x > w || z < -w || z > w){
                //del bullet
                player.bullets.splice(i,1);
            }
        }
         */
    }

    update_player(player){
        const controller = this.controllers.get(player.id);

        //speed
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

        //angel
        if(controller.rotate > 0){
            player.angle += this.accel;
        }else if(controller.rotate < 0){
            player.angle -= this.accel;
        }

        const v = player.getVelocity()
        player.move(v);
    }

    //update bullet
    update_bullet(bullet){
        const v = bullet.getVelocity(this.bullet_speed);
        bullet.move(v);
    }
    //
    shoot(player){
        if(this.bullets.size > 20){return;}
        const id = player.id + (this.bullets.size +1)*10000;
        this.bullets.set(
            id,
            new Bullet(id, player, this.bullet_speed)
        );
    }

}