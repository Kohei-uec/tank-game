export class Controller {
    constructor() {
        this.w = false;
        this.s = false;
        this.a = false;
        this.d = false;
        this.shoot = false;
        this.onChange = null;
        this.setEventListener();
    }

    setEventListener() {
        //space => 32
        window.addEventListener('keydown', (event) => {
            if (event.isComposing || event.keyCode === 229) {
                return;
            }
            // 何かを行う
            if (event.keyCode === 87) {
                this.w = true;
            } else if (event.keyCode === 65) {
                this.a = true;
            } else if (event.keyCode === 83) {
                this.s = true;
            } else if (event.keyCode === 68) {
                this.d = true;
            } else if (event.keyCode === 32) {
                this.shoot = true;
            }
            this.onChange();
            //console.log(event.keyCode);
        });

        window.addEventListener('keyup', (event) => {
            if (event.isComposing || event.keyCode === 229) {
                return;
            }
            // 何かを行う
            if (event.keyCode === 87) {
                this.w = false;
            } else if (event.keyCode === 65) {
                this.a = false;
            } else if (event.keyCode === 83) {
                this.s = false;
            } else if (event.keyCode === 68) {
                this.d = false;
            } else if (event.keyCode === 32) {
                this.shoot = false;
            }
            this.onChange();
            //console.log(event.keyCode);
        });

        //touch
        const start_pos = {x:0, y:0};
        let is_moved = false;
        const canvas = document.getElementById('myCanvas');
        canvas.addEventListener('touchstart', (event)=>{
            event.preventDefault();
            is_moved = false;
            start_pos.x =  event.touches[0].pageX;
            start_pos.y =  event.touches[0].pageY;
        })
        canvas.addEventListener('touchmove', (event)=>{
            event.preventDefault();
            is_moved = true;
            const pos = {
                x: event.touches[0].pageX,
                y: event.touches[0].pageY,
            };
            const angle = Math.atan2(pos.y-start_pos.y, pos.x - start_pos.x);
            const p8 = Math.PI/8;
            if(angle >= p8 && angle <= p8*7){
                this.s = true;
            }else{
                this.s = false;
            }
            if (angle >= -p8*7 && angle <= -p8){
                this.w = true;
            }else{
                this.w = false;
            }
            if( angle >= -p8*3 && angle <= p8*3){
                this.d = true;
            }else{
                this.d = false;
            }
            if(angle >= p8*5 || angle <= -p8*5){
                this.a = true;
            }else { 
                this.a = false;
            }
            this.onChange();
        });
        canvas.addEventListener('touchend', (event)=>{
            event.preventDefault();
            this.w = this.a = this.s = this.d = false;
            if(!is_moved){
                this.shoot = true;
                this.onChange();
                this.shoot = false;
            }
            this.onChange();
        });
    }

}
