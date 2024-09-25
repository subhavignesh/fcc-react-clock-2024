import React, { useEffect, useRef, useState } from 'react';
import { FaArrowUp, FaArrowDown, FaPlay, FaPause, FaRedo } from 'react-icons/fa';

const ClockViewer = () => {
  const [state, setState] = useState({
    breakLength: 5,
    sessionLength: 25,
    playCounter: false,
    sessionTimer: true,
  });

  const { breakLength, sessionLength, playCounter, sessionTimer } = state;
  const [timeLeft, setTimeLeft] = useState(`${String(sessionLength).padStart(2, '0')}:00`);
  const timeLeftRef = useRef(`${String(sessionLength).padStart(2, '0')}:00`);
  const intervalRef = useRef(null); // Use a ref to store the interval ID
  const audioRef = useRef(null);

  // Function to increment break length
  const incrementBreak = () => {
    setState((prev) => ({
      ...prev,
      breakLength: Math.min(prev.breakLength + 1, 60),
    }));
  };

  // Function to decrement break length
  const decrementBreak = () => {
    setState((prev) => ({
      ...prev,
      breakLength: Math.max(prev.breakLength - 1, 1),
    }));
  };

  const incrementSession = () => {
    setState((prev) => ({
      ...prev,
      sessionLength: Math.min(prev.sessionLength + 1, 60),
    }));
  };

  const decrementSession = () => {
    setState((prev) => ({
      ...prev,
      sessionLength: Math.max(prev.sessionLength - 1, 1),
    }));
  };

  // Function to calculate time left
  const calcTimeLeft = () => {
    let [minutes, seconds] = timeLeftRef.current.split(":").map(Number);

    if (seconds !== 0) {
      seconds -= 1;
    } else if (minutes !== 0) {
      seconds = 59;
      minutes -= 1;
    } else {
      // Stop the timer when it reaches 00:00
      clearInterval(intervalRef.current);
      audioRef.current.play(); // Play beep sound
      setState((prevState) => ({
        ...prevState,
        sessionTimer: !prevState.sessionTimer, // Toggle between session and break
      }));
      return;
    }

    const formattedSeconds = String(seconds).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    setTimeLeft(`${formattedMinutes}:${formattedSeconds}`);
    timeLeftRef.current = `${formattedMinutes}:${formattedSeconds}`; // Update ref
  };

  // Function to handle play button
  const handlePlay = () => {
    setState((prevState) => ({
      ...prevState,
      playCounter: !prevState.playCounter,
    }));
  };

  // Manage the timer with useEffect
  useEffect(() => {
    if (playCounter) {
      // Start a new interval and store the ID
      intervalRef.current = setInterval(() => {
        calcTimeLeft();
      }, 1000);
    } else {
      clearInterval(intervalRef.current); // Clear the interval when not playing
    }

    // Cleanup function to clear the interval on unmount or when playCounter changes
    return () => clearInterval(intervalRef.current);
  }, [playCounter, sessionTimer]);

  // Update timer for session or break
  useEffect(() => {
    if (sessionTimer) {
      setTimeLeft(`${String(sessionLength).padStart(2, '0')}:00`);
      timeLeftRef.current = `${String(sessionLength).padStart(2, '0')}:00`;
    } else {
      setTimeLeft(`${String(breakLength).padStart(2, '0')}:00`);
      timeLeftRef.current = `${String(breakLength).padStart(2, '0')}:00`;
    }
  }, [sessionTimer]);

  // Update timeLeft when sessionLength changes
  useEffect(() => {
    setTimeLeft(`${String(sessionLength).padStart(2, '0')}:00`);
    timeLeftRef.current = `${String(sessionLength).padStart(2, '0')}:00`;
  }, [sessionLength]);

  return (
    <div className='screen-max-width h-screen flex-center'>
      <div className='text-center'>
        <div className='font-semibold text-4xl mb-4'>25 + 5 CLOCK</div>
        <div className='flex-center gap-10'>
          <div>
            <div id='break-label' className='font-semibold text-2xl mb-2'>Break Length</div>
            <div className='flex gap-4 items-center justify-center'>
              <button id='break-increment' onClick={incrementBreak}><FaArrowUp size={30} color="white" /></button>
              <p id="break-length" className='text-2xl'>{breakLength}</p>
              <button id='break-decrement' onClick={decrementBreak}><FaArrowDown size={30} color="white" /></button>
            </div>
          </div>

          <div>
            <div id="session-label" className='font-semibold text-2xl mb-2'>Session Length</div>
            <div className='flex gap-4 items-center justify-center'>
              <button id='session-increment' onClick={incrementSession}><FaArrowUp size={30} color="white" /></button>
              <p id="session-length" className='text-2xl'>{sessionLength}</p>
              <button id='session-decrement' onClick={decrementSession}><FaArrowDown size={30} color="white" /></button>
            </div>
          </div>
        </div>

        <div className='my-5'>
          <div className='w-max h-max mx-auto border-4 border-greenishBlue-200 p-10 rounded-full'>
            <div id="timer-label" className='text-2xl font-semibold'>{sessionTimer ? "Session" : "Break"}</div>
            <div id="time-left" className='text-2xl font-semibold'>{timeLeft}</div>
          </div>
        </div>

        <div className='flex-center gap-5'>
          <button id="start_stop" onClick={handlePlay}>
            {playCounter ? <FaPause size={30} color="white" /> : <FaPlay size={30} color="white" />}
          </button>
          <button id="reset" onClick={() => {
            setState({ breakLength: 5, sessionLength: 25, playCounter: false, sessionTimer: true });
            setTimeLeft(`25:00`); // Reset time left
            timeLeftRef.current = `25:00`; // Reset ref
            clearInterval(intervalRef.current);
            audioRef.current.pause(); // Stop the audio
            audioRef.current.currentTime = 0; // Rewind audio to the start
          }}>
            <FaRedo size={30} color="white" />
          </button>
        </div>

        {/* Audio Element for Beep Sound */}
        <audio id='beep' ref={audioRef} loop={false}>
          <source src='https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav' type='audio/mpeg' />
        </audio>
      </div>
    </div>
  );
};

export default ClockViewer;
