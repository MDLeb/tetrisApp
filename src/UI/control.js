import React from 'react';
import { useRef, useEffect, useState} from 'react'


function Control({score, lines, level, onPause, onStart, onContinue}) {

    const [isPaused, setIsPaused] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    return (
        <div className='control'>
            <h2>tetris</h2>
            <div className='control_info'>
                <p className='control_info__score'>Score: {score}</p>
                <p className='control_info__score'>Lines: {lines}</p>
                <p className='control_info__score'>Level: {level}</p>
            </div>
            <div className='control_UI'>
                <button className='control_UI__start enabled' onClick={() => {
                        onStart(isStarted);
                        setIsPaused(false);
                        setIsStarted(true);
                    }}>{
                        isStarted ? 'restart' : 'start'
                    }</button>
                {!isPaused ? 
                    <button className='control_UI__pause' onClick={() => {
                        onPause();
                        setIsPaused(true);
                    }}>pause</button> :
                    <button className='control_UI__pause' onClick={() => {
                        onContinue();
                        setIsPaused(false);
                    }}>continue</button>
                }
            </div>
        </div>
    );
  }
  
export default Control;
  