//import { Player } from "./player.js";
export class GameManager {
    constructor(room) {
        this.players = room.players;
        this.field = new Field();
        this.time = 5 * 60 * 1000;
    }

    initialize() {
        console.log('init game')
        //set players position
        for(const player of this.players.values()) {
            player.setPosition(0,0);
        }

        //init field
        this.field.initialize();

        //set timer
        this.timer = this.startCountdown(0.5);

    }

    //timer
    startCountdown(minutes) {
        this.time = minutes * 60 * 1000;
        const delay = 1000; //millisecond
        return setInterval(()=>{
            this.time -= delay;
            if(this.time <= 0){
                clearInterval(this.timer);
                this.timeOver();
            }
        },delay)
    }
    updateTime() {
        console.log(this.time);
    }

    timeOver() {
        console.log('time over');
    }

}

class Field {
    constructor(width, height){
        this.walls = [];
    }

    initialize(){
        return;
    }
}