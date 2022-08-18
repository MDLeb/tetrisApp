import {sizes} from './static'

class Figure {

    constructor(figureType){
        this.matrix = figureType;  
        this.currentX = 4;
        this.currentY = 0;
    }
    
    rotate(board) {
        let result = [];
        let bufMatrix = this.matrix;
        for (let i = this.matrix.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                if (!result[j]) {
                    result[j] = [];
                }
                result[j].push(this.matrix[i][j]);
            }
        }
       
        if(this.checkState(board, 'down', true) && this.checkState(board, 'right', true) && this.checkState(board, 'left', true)
            && this.currentX+result[0].length <= sizes.COLS && this.currentX >= 0) {
            this.clearFigure(board);     
            this.matrix = result;
            this.addMatrix(board);       
        }
    }

    checkState(board, direction = 'down', rotation = false){
        let lastRowN = this.matrix.length - 1;

        if(this.currentY+this.matrix.length > sizes.ROWS-1)
            return false;

        for(let j = 0; j < this.matrix[lastRowN].length; j++) {
            if(this.matrix[lastRowN][j] && board[this.currentY+lastRowN+1][this.currentX+j])
                return false;
        }
        
        for(let i = 0; i < this.matrix.length; i++){
            for(let j = 0; j < this.matrix[i].length; j++) {
                if(this.matrix[i][j] == 0 && i !== 0) {
                    if(board[this.currentY+i][this.currentX+j] && this.matrix[i-1][j])
                        return false;
                }
            }
        }

        if(direction == 'right') {
            if (!rotation && this.currentX+this.matrix[0].length > sizes.COLS-1)
                return false;
            for(let i = 0; i < this.matrix.length; i++) {
                let lastElem = this.matrix[i].length-1;
                if(this.matrix[i][lastElem] && board[this.currentY+i][this.currentX+lastElem+1])
                    return false;
            }
        } 
        
        if(direction == 'left') {
            if (!rotation && this.currentX == 0)
                return false;
            for(let i = 0; i < this.matrix.length; i++) {
                if(this.matrix[i][0] && board[this.currentY+i][this.currentX-1])
                    return false;
            }
        } 

        return true;
    }

    move(direction, board) {
        if(!this.checkState(board, direction)) return;
        this.clearFigure(board);
        switch (direction) {
            case 'right':
                this.currentX++;
                break;
            case 'left':
                this.currentX--;
                break;
        }
        this.addMatrix(board);
    }

    fall(board) {
        if(!this.checkState(board)) return;
        this.clearFigure(board);
        this.currentY++;
        this.addMatrix(board);
    }

    addMatrix(board){
        for(let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                if(board[this.currentY+i][this.currentX+j] === 0 && this.matrix[i][j] !== 0){
                   board[this.currentY+i][this.currentX+j] = this.matrix[i][j];
                } 
            }
        }
    }

    clearFigure(board) {
        for(let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                board[this.currentY+i][this.currentX+j] = 0;
            }
        }  
    }
}

export default Figure;
