//import { Model } from "./model.js";
//import { Player } from "./player.js";

export class GameManager {
    constructor(room) {
        this.players = room.players;

        this.field = new Field();
        this.time = 5 * 60 * 1000;

        this.onTimeOver = null;
        this.onUpdateTime = null;
        
        this.model = null;
    }

    setModel(model){
        this.model = model;
        this.model.onDeath = (player)=>{
            this.reBone(player);
        };
    }

    initialize() {
        console.log('init game')
        //set players position
        this.setPlayersPosition();

        //init field
        this.field.initialize();

        //set timer
        //this.timer = this.startCountdown(0.5);

        //model
        this.model.initialize();
    }
    setPlayersPosition(){
        const field_width = 256;
        for(const player of this.players.values()) {
            const x = Math.floor((Math.random()-0.5)*field_width);
            const y = Math.floor((Math.random()-0.5)*field_width);
            player.setPosition(x,y);
            player.angle = Math.atan2(-y,-x);
            player.hp = 100;
        }
    }

    //timer
    startCountdown(minutes) {
        this.time = minutes * 60 * 1000;
        const delay = 1000; //millisecond
        return setInterval(()=>{
            this.time -= delay;
            this.onUpdateTime(this.time);
            if(this.time <= 0){
                clearInterval(this.timer);
                this.timeOver();
            }
        },delay)
    }

    timeOver() {
        console.log('time over');
        this.model.stop();
        this.onTimeOver();
    }

    //死んだときの処理
    reBone(player){
        const field_width = 256;
        const x = Math.floor((Math.random()-0.5)*field_width);
        const y = Math.floor((Math.random()-0.5)*field_width);
        player.setPosition(x,y);
        player.angle = Math.atan2(-y,-x);
        player.hp = 100;
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