;(()=> {
    'use strict'
    const get = (ele) => document.querySelector(ele)
    
    class Drawing {
        constructor() {
            this.$container = get('main')
            this.$file = get('.file')
            this.$editer = get('.editor_wrap')
            this.$canvasWrap = get('.canvas_wrap')
            this.$canvas = get('.canvas')
            this.$width = this.$canvasWrap.clientWidth;
            this.$height = this.$canvasWrap.clientHeight;
            this.ctx = this.$canvas.getContext('2d')
            this.targetCanvas = document.createElement('canvas')
            this.img = new Image()
            this.$fileImage = get('.fileImage')
            this.$fileDrag = get('.file_drag')
            this.$fileInput = get('.file_drag input')
            this.$pen = get('.js-pen')
            this.$size = get('.js-size')
            this.$reset = get('.js-clear')
            this.$save = get('.js-save')
            this.nowImg;
            this.size = this.$size.value;
            this.penSize = this.size;
            this.eragerSize = this.size;
            this.penColor = this.$pen.value;
            this.mouseDown = false;
            // this.eragerColor clearRect 범위 조정해서 ?
            this.events()
            // this.drawEvent()
        }

        events() {

            this.$fileInput.addEventListener('change', (e) => {
                this.setImgFile(e)
            })
            
            /* 펜 */
            this.$pen.addEventListener('change', (e) => {
                this.setPen(e)
            })
            this.$size.addEventListener('change', (e) => {
                this.setPen(e)
            })

            this.$canvas.addEventListener('mousedown', (e) => {
                this.mouseDownHandler(this.$canvas, e)
            })

            this.$canvas.addEventListener('mousemove', (e) => {
                this.mouseMoveHandler(this.$canvas, e)
            })
            
            this.$canvas.addEventListener("mouseup", () => {
                this.mouseUpHandler();
            })

            this.$save.addEventListener('click', (e)=> {
                this.download(e)
            });

            this.$reset.addEventListener('click', () => {
                this.canvasReset();
            })
        }

        setImgFile(e) {
            this.$fileDrag.classList.add('hidden')
            this.$canvas.classList.remove('hidden')
            const imgSrc = URL.createObjectURL(e.target.files[0]) //업로드한 파일의 url을 가져옴
            const img = new Image()
           img.addEventListener('load', () => {
               this.$canvas.width = img.width
               this.$canvas.height = img.height
               this.ctx.drawImage(img, 0, 0, img.width, img.height)
            })
            img.src = imgSrc;
            this.nowImg = img;
        }


        
        setPen(e) { //받는 이벤트의 클래스이름으로 판단하여 해당 값을 변경
            e.target.className === 'js-pen' ?
            this.penColor = e.target.value : this.penSize = e.target.value
        }

        
        getMouse($canvas, e) {
            const paint = $canvas.getBoundingClientRect();
            return {
                x: e.clientX - paint.left,
                y: e.clientY - paint.top
            };
        }

        
        mouseDownHandler($canvas, e) {
            this.mouseDown = true;
            const currentPosition = this.getMouse($canvas, e);
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.penColor;
            this.ctx.lineWidth = this.penSize;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.moveTo(currentPosition.x, currentPosition.y)
        }


        mouseMoveHandler($canvas, e) {
            if (!this.mouseDown) return;
            const currentPosition = this.getMouse($canvas, e);
            this.ctx.lineTo(currentPosition.x, currentPosition.y);
            this.ctx.stroke();
        }

        mouseUpHandler() {
            this.mouseDown = false;
        }

        canvasReset() {
            this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
            this.ctx.beginPath();
            this.ctx.drawImage(this.nowImg, 0, 0, this.nowImg.width, this.nowImg.height)
        }

        download(e) {
            const link = document.createElement('a');
            link.download = 'canvas.png';
            link.href = this.$canvas.toDataURL()
            link.click();
        }
    
    }
    
    new Drawing();

})()