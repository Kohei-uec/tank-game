export class Controller {
    constructor() {
        this.w = false;
        this.s = false;
        this.a = false;
        this.d = false;
        this.setEventListener();
    }

    setEventListener() {
        window.addEventListener('keydown', (event) => {
            if (event.isComposing || event.keyCode === 229) {
                return;
            }
            // 何かを行う
            if (event.keyCode === 87) {
                this.w = true;
                return;
            } else if (event.keyCode === 65) {
                this.a = true;
                return;
            } else if (event.keyCode === 83) {
                this.s = true;
                return;
            } else if (event.keyCode === 68) {
                this.d = true;
                return;
            }

            console.log(event.keyCode);
        });

        window.addEventListener('keyup', (event) => {
            if (event.isComposing || event.keyCode === 229) {
                return;
            }
            // 何かを行う
            if (event.keyCode === 87) {
                this.w = false;
                return;
            } else if (event.keyCode === 65) {
                this.a = false;
                return;
            } else if (event.keyCode === 83) {
                this.s = false;
                return;
            } else if (event.keyCode === 68) {
                this.d = false;
                return;
            }

            console.log(event.keyCode);
        });
    }
}
