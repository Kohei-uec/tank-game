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
        //listener
        this.onupdate = ()=>{};
        this.onDeath = ()=>{};

        this.players = room.players;
        this.controllers = room.controllers;
        this.field_width = 256;


        this.fps = 30;

        this.max_speed = 20/this.fps;
        this.accel = 1/this.fps;
        this.resistance = 3/this.fps;

        this.bullet_speed = 100/this.fps;
        this.bullets = room.bullets;
        this.bullet_num = 0;
    }
    initialize(){
        this.bullets.clear();
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
        for(const bullet of this.bullets.values()){
            const x = bullet.x;
            const z = bullet.z;
            const w = this.field_width/2;
            if(x < -w || x > w || z < -w || z > w){
                //del bullet
                this.bullets.delete(bullet.id);
            }
        }

        //hit check
        for (const bullet of this.bullets.values()){
            for(const player of this.players.values()){
                const isHit = isHitPoint2Circle(
                    {x:bullet.x, z:bullet.z},
                    player.position,
                    size*0.9,
                );
                if(isHit){
                    //console.log('hit');
                    player.hp -= 10;
                    this.bullets.delete(bullet.id);

                    //死亡判定
                    if(player.hp <= 0){
                        this.onDeath(player);
                    }
                }
            }
        }
        
        this.onupdate();
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
        //範囲内
        if(player.position.x > this.field_width/2){
            player.position.x = this.field_width/2
        }else if(player.position.x < -this.field_width/2){
            player.position.x = -this.field_width/2
        }
        if(player.position.z > this.field_width/2){
            player.position.z = this.field_width/2
        }else if(player.position.z < -this.field_width/2){
            player.position.z = -this.field_width/2
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
        if(this.bullets.size > 100){return;}
        if(player.canShoot){
            player.canShoot = false;
            window.setTimeout(()=>{
                player.canShoot = true;
            },500);
        }else{
            return;
        }
        const id = player.id*10000+ (this.bullet_num++ % 1000);
        this.bullets.set(
            id,
            new Bullet(id, player, this.bullet_speed)
        );
    }

    changeSpeed(speed){
        this.max_speed = speed/this.fps;
    }

}

const size = 10;

function isHitPoint2Circle (point, center, r){
    const distance2 = (point.x - center.x) ** 2 + (point.z - center.z)**2;
    return r**2 >= distance2;
}