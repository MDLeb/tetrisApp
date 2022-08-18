import {sizes, figures, figureTypes, initBoard, colors} from './static'
import Figure from './figure';


class Board { 
   constructor(ctx, score, setScore, lines, setLines, level, setLevel) {
        this.boardMatrix = [...initBoard];
        this.ctx = ctx;
        this.currentFig = null;
        this.isFigureMoving = false;
        this.isKeyDownPressed = false;
        this.isGameOver = false;
        this.timer = 500;
        this.speed = 0;

        this.score = score;
        this.setScore = setScore;

        this.lines = lines;
        this.setLines = setLines;

        this.level = level;
        this.setLevel = setLevel;

        window.addEventListener('keydown', (event) => {
            switch(event.code) {
                case 'ArrowRight': 
                    this.currentFig.move('right', this.boardMatrix);
                    break;
                case 'ArrowLeft': 
                    this.currentFig.move('left', this.boardMatrix);
                    break;
                case 'ArrowDown': 
                    if(!this.isKeyDownPressed) {
                        this.timer = 100;
                        clearInterval(this.interval);
                        this.interval = setInterval(() => this.game(), this.timer);
                        this.isKeyDownPressed = true;
                    }
                    
                    break;
                case 'ArrowUp':
                    this.currentFig.rotate(this.boardMatrix);
                    break;
                };
        });
        window.addEventListener('keyup', (event) => {
            if(event.code === 'ArrowDown'){
                this.timer = 500;
                clearInterval(this.interval);
                this.interval = setInterval(() => this.game(), this.timer - this.speed);
                this.isKeyDownPressed = false;
            }
        });
    }
  
    play(restart = false){
        this.isGameOver = false;
        if(restart) {
            this.score = 0;
            this.setScore(this.score);
            this.level = 0;
            this.setLevel(this.level);
            this.lines = 0;
            this.setLines(this.lines);
            this.clearBoard(this.score);
            this.isFigureMoving = false;
            clearInterval(this.interval);
            this.currentFig = null;
        }
        this.addFigure();
        this.drawBlocks();
        this.interval = setInterval(() => this.game(), this.timer - this.speed);
        
    }

    pause(){
        clearInterval(this.interval);
    }

    continue() {
        this.interval = setInterval(() => this.game(), this.timer - this.speed);
    }

    async game(){
        if(this.isGameOver) return;
        if(this.isFigureMoving && this.currentFig.checkState(this.boardMatrix)){
            this.currentFig.addMatrix(this.boardMatrix);
            await setTimeout(() => this.currentFig.fall(this.boardMatrix), this.timer - this.speed);
            this.isFigureMoving = this.currentFig.checkState(this.boardMatrix);
        } else {
            clearInterval(this.interval);
            this.currentFig = null;
            this.checkBoardState();
            this.play();
        }
    }

    gameOver(){
        this.isGameOver = true;
        
    }
   
    checkBoardState(){ 
        this.boardMatrix[2].forEach((val) => { // проверяем самый верхний ряд доски, есть ли в нем не нулевые элементы
            //какая-то кривая проверка
            if(val) {
                this.pause();
                this.gameOver()
            }
            
        });
        //1 линия — 100 очков, 
        //2 линии — 300 очков, 
        //3 линии — 700 очков, 
        //4 линии ('Тетрис') — 1500 очков
        let coef;
        let rowNumber = this.boardMatrix.filter(row => !row.includes(0)).length;
        switch (rowNumber) {
            case 2:
                coef = 300;
                break;
            case 3:
                coef = 700;
                break;
            case 4:
                coef = 1500;
                break;
            default: coef = 100;
        }
        this.lines += rowNumber;
        this.setLines(this.lines);

        //3 ускорения: после убирания 15 линий, 30, 50
        switch (this.lines) {
            case this.lines > 15:
                this.speed = 100;
                break;
            case this.lines > 30:
                this.speed = 200;
                break;
            case this.lines > 50:
                this.speed = 300;
                break;
            default: this.speed = 0;
        }

        this.boardMatrix.forEach((row, index) => { //если появляется ряд, в котором нет нулевыъ ячеек - убираем его
            if(!row.includes(0)) {
                this.boardMatrix.splice(index, 1);
                let newRow = [];
                for(let i = 0; i < sizes.COLS; i++){
                    newRow.push(0);
                }
                this.score += coef;
                this.setScore(this.score);
                this.boardMatrix.unshift(newRow);
            }
        })
    }

    addFigure = () => {
        let figType = Math.floor(Math.random() * 6);
        let figure = new Figure(figures[figureTypes[figType]]);
        this.currentFig = figure;
        this.isFigureMoving = true;
    }

    drawBlocks = () => {
        for(let i = 0; i < sizes.COLS; i++) {
            for (let j = 0; j < sizes.ROWS; j++) {
                if(this.boardMatrix[j][i] !== 0) {
                    this.ctx.fillStyle = colors[this.boardMatrix[j][i]-1];
                    this.ctx.fillRect(i, j, 1-0.05, 1-0.05);
                } else if(this.boardMatrix[j][i] == 0) {
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillRect(i, j, 1-0.05, 1-0.05);
                }
            }
        } 
        requestAnimationFrame(this.drawBlocks)  
    }
    clearBoard = () => {
        for(let i = 0; i < sizes.COLS; i++) {
            for (let j = 0; j < sizes.ROWS; j++){
                this.boardMatrix[j][i] = 0;
            }
        }
    }
   
}

export default Board;
