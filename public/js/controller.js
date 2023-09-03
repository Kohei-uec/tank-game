export class Controller {
    constructor() {
        this.w = false;
        this.s = false;
        this.a = false;
        this.d = false;
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
            }
            this.onChange();
            //console.log(event.keyCode);
        });
    }
}
