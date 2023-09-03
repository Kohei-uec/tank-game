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

export class Bullet{
    constructor(id,player,speed){
        this.id = id;
        this.x = player.position.x;
        this.z = player.position.z;
        this.angle = player.angle;
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
