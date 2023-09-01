export class Player {
    constructor(id, name = 'no name') {
        this.id = id;
        this.name = name;

        this.hp = 100;

        this.position = { x: 0, z: 0 };
        this.speed = 0;
        this.angle = 0;
    }

    get velocity() {
        return {
            x: this.speed * Math.cos(this.angle),
            z: this.speed * Math.sin(this.angle),
        };
    }
}
