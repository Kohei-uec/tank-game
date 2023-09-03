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
