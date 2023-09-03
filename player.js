export class Player {
    constructor(id, name = 'no name') {
        this.id = id;
        this.name = name;

        this.hp = 100;

        this.position = { x: 0, z: 0 };
        this.speed = 0;
        this.angle = 0;
    }

    getVelocity() {
        return {
            x: this.speed * Math.cos(this.angle),
            z: this.speed * Math.sin(this.angle),
        };
    }

    setPosition(x,z) {
        this.position.x = x;
        this.position.z = z;
    }

    move(v){
        this.position.x += v.x;
        this.position.z += v.z;
    }

}
const size = 10;
export class Bullet{
    constructor(id,player,speed){
        this.id = id;
        this.angle = player.angle;
        this.x = player.position.x + size*Math.cos(this.angle);
        this.z = player.position.z + size*Math.sin(this.angle);
        this.speed = speed;
    }
    getVelocity(speed) {
        return {
            x: speed * Math.cos(this.angle),
            z: speed * Math.sin(this.angle),
        };
    }
    move(v){
        this.x += v.x;
        this.z += v.z;
    }
}
