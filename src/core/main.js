import { sizes } from './static'
import React from 'react';
import { useRef, useEffect, useState} from 'react'
import Board from './board';
import Control from '../UI/control';


function Main() {

    const ref = useRef()
    const [score, setScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [level, setLevel] = useState(0);


    let board = null;
    useEffect(() => {
        const ctx = ref.current.getContext('2d')
        ctx.canvas.width = sizes.COLS * sizes.BLOCK_SIZE;
        ctx.canvas.height = sizes.ROWS * sizes.BLOCK_SIZE;
        ctx.canvas.style.borderStyle = 'solid';
        ctx.canvas.style.borderColor = 'yellowgreen';
        ctx.canvas.style.backgroundColor='rgba(29, 255, 53, 0.3)';
        ctx.scale(sizes.BLOCK_SIZE, sizes.BLOCK_SIZE);
        board = new Board(ctx, score, setScore, lines, setLines, level, setLevel);
    }, [])

    const onStart = (isStarted) => {
        isStarted ? 
        board.play(isStarted) : board.play();
    }

    const onPause = () => {
        board.pause();
    }

    const onContinue = () => {
        board.continue();
    }

    return (
        <div className='main'>
            <canvas ref={ref} />
            <Control score={score} lines={lines} level={level} onPause={onPause} onStart={onStart} onContinue={onContinue}></Control>
        </div>
    );
  }
  
export default Main;
  