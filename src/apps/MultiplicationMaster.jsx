import React, { useState, useEffect, useRef } from 'react'
import './MultiplicationMaster.css'

const MultiplicationMaster = () => {
  const [selectedNumbers, setSelectedNumbers] = useState([5])
  const [currentNumber, setCurrentNumber] = useState(5)
  const [secondNumber, setSecondNumber] = useState(1)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isTimerMode, setIsTimerMode] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [result, setResult] = useState({ message: '', type: '' })
  const [hint, setHint] = useState('')
  const [stars, setStars] = useState(0)
  const [isAnswerLocked, setIsAnswerLocked] = useState(false)
  
  const audioContextRef = useRef(null)
  const timerIntervalRef = useRef(null)
  const answerInputRef = useRef(null)

  // Initialize audio context
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    audioContextRef.current = new AudioContext()
    
    // Enable audio on first interaction
    const initAudio = () => {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume()
      }
    }
    document.addEventListener('click', initAudio, { once: true })
    
    return () => {
      document.removeEventListener('click', initAudio)
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  // Generate new question on mount
  useEffect(() => {
    generateQuestion()
  }, [])

  // Auto-focus input whenever it becomes enabled (after each question)
  useEffect(() => {
    if (!isAnswerLocked) {
      answerInputRef.current?.focus()
    }
  }, [isAnswerLocked])

  // Play sounds
  const playCorrectSound = () => {
    try {
      const ctx = audioContextRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.value = 523.25
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
      
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
    } catch (e) {
      console.log('Sound not available')
    }
  }

  const playWrongSound = () => {
    try {
      const ctx = audioContextRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.value = 200
      osc.type = 'sawtooth'
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.3)
    } catch (e) {
      console.log('Sound not available')
    }
  }

  // Generate question
  const generateQuestion = () => {
    const randomNumber = selectedNumbers[Math.floor(Math.random() * selectedNumbers.length)]
    const second = Math.floor(Math.random() * 10) + 1
    
    setCurrentNumber(randomNumber)
    setSecondNumber(second)
    setUserAnswer('')
    setResult({ message: '', type: '' })
    setHint('')
    setIsAnswerLocked(false)
  }

  // Toggle number selection
  const toggleNumber = (num) => {
    if (selectedNumbers.includes(num)) {
      if (selectedNumbers.length > 1) {
        setSelectedNumbers(selectedNumbers.filter(n => n !== num))
      }
    } else {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b))
    }
    generateQuestion()
  }

  // Check answer
  const checkAnswer = () => {
    if (isAnswerLocked || userAnswer === '') return

    const correct = currentNumber * secondNumber
    const answer = Number(userAnswer)

    if (answer === correct) {
      setIsAnswerLocked(true)
      playCorrectSound()
      setResult({ message: '🎉 Correct! Great job!', type: 'correct' })
      
      const newScore = score + 1
      setScore(newScore)
      
      if (newScore % 5 === 0) {
        setStars(Math.floor(newScore / 5))
      }
      
      setTimeout(() => {
        generateQuestion()
      }, 1500)
    } else {
      playWrongSound()
      setResult({ message: '❌ Try again!', type: 'wrong' })
      showHint()
      answerInputRef.current?.focus()
    }
  }

  // Show hint
  const showHint = () => {
    const hintArray = Array(secondNumber).fill(currentNumber)
    const hintText = hintArray.join(' + ')
    const total = hintArray.reduce((sum, num) => sum + num, 0)
    
    setHint(
      `💡 Hint: ${currentNumber} × ${secondNumber} means ${secondNumber} groups of ${currentNumber}\n` +
      `That's: ${hintText} = ${total}`
    )
  }

  // Timer mode
  const toggleTimer = () => {
    if (isTimerMode) {
      stopTimer()
    } else {
      startTimer()
    }
  }

  const startTimer = () => {
    setIsTimerMode(true)
    setTimeLeft(30)
    setScore(0)
    setStars(0)
    generateQuestion()
    
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer()
          setResult({ 
            message: `⏰ Time's up! Final score: ${score} 🎯`, 
            type: 'info' 
          })
          playCorrectSound()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
    setIsTimerMode(false)
    setTimeLeft(30)
  }

  // Reset game
  const resetGame = () => {
    stopTimer()
    setScore(0)
    setStars(0)
    setResult({ message: '', type: '' })
    setHint('')
    generateQuestion()
  }

  return (
    <div className="multiplication-container">
      <h1>🎮 Multiplication Master</h1>
      
      {/* Score and Timer */}
      <div className="stats">
        <div className="score-box">
          <h2>Score: {score}</h2>
          <div className="stars">
            {Array(stars).fill('⭐').join(' ')}
          </div>
        </div>
        {isTimerMode && (
          <div className={`timer-box ${timeLeft <= 10 ? 'warning' : ''}`}>
            <h2>⏱️ {timeLeft}s</h2>
          </div>
        )}
      </div>

      {/* Number Selection */}
      <div className="number-selection">
        <h3>Choose your times table (click multiple!):</h3>
        <div className="number-buttons">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <button
              key={num}
              className={`num-btn ${selectedNumbers.includes(num) ? 'active' : ''}`}
              onClick={() => toggleNumber(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="question-area">
        <p className="question">{currentNumber} × {secondNumber} = ?</p>
      </div>

      {/* Answer Input */}
      <div className="answer-area" onClick={() => answerInputRef.current?.focus()}>
        <input
          ref={answerInputRef}
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.repeat) {
              checkAnswer()
            }
          }}
          placeholder="Type your answer..."
          disabled={isAnswerLocked}
        />
        <button className="check-btn" onClick={checkAnswer} disabled={isAnswerLocked}>
          ✓ Check Answer
        </button>
      </div>

      {/* Feedback */}
      <div className="feedback-area">
        {result.message && (
          <p className={`result ${result.type}`}>{result.message}</p>
        )}
        {hint && <p className="hint">{hint}</p>}
      </div>

      {/* Controls */}
      <div className="controls">
        <button className="control-btn timer-btn" onClick={toggleTimer}>
          {isTimerMode ? '⏸️ Stop Timer' : '⏱️ Timer Mode (30s)'}
        </button>
        <button className="control-btn reset-btn" onClick={resetGame}>
          🔄 New Game
        </button>
      </div>

      {/* Instructions */}
      <div className="instructions">
        <h3>🎯 How to Play:</h3>
        <ul>
          <li>🔢 Pick one or more times tables (click to toggle)</li>
          <li>✏️ Answer the questions</li>
          <li>⭐ Get a star every 5 correct answers!</li>
          <li>⏱️ Try timer mode for extra challenge</li>
        </ul>
      </div>
    </div>
  )
}

export default MultiplicationMaster
