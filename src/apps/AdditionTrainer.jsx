import React, { useState, useEffect, useRef } from 'react'
import './AdditionTrainer.css'

const AdditionTrainer = () => {
  const [difficulty, setDifficulty] = useState('easy')
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [result, setResult] = useState({ message: '', type: '' })
  const [streak, setStreak] = useState(0)
  const inputRef = useRef(null)
  const audioContextRef = useRef(null)

  const difficultyLevels = {
    easy: { max: 10, label: '🟢 Easy (1-10)' },
    medium: { max: 50, label: '🟡 Medium (1-50)' },
    hard: { max: 100, label: '🔴 Hard (1-100)' }
  }

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
    }
  }, [])

  useEffect(() => {
    generateQuestion()
  }, [difficulty])

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

  const generateQuestion = () => {
    const max = difficultyLevels[difficulty].max
    setNum1(Math.floor(Math.random() * max) + 1)
    setNum2(Math.floor(Math.random() * max) + 1)
    setUserAnswer('')
    setResult({ message: '', type: '' })
    inputRef.current?.focus()
  }

  const checkAnswer = () => {
    if (userAnswer === '') return

    const correct = num1 + num2
    const answer = Number(userAnswer)

    if (answer === correct) {
      playCorrectSound()
      setScore(score + 1)
      setStreak(streak + 1)
      setResult({ message: '🎉 Correct!', type: 'correct' })
      setTimeout(generateQuestion, 1500)
    } else {
      playWrongSound()
      setStreak(0)
      setResult({ 
        message: `❌ Wrong! The answer was ${correct}`, 
        type: 'wrong' 
      })
    }
  }

  return (
    <div className="addition-container">
      <h1>➕ Addition Trainer - Let's Add!</h1>
      
      <div className="stats">
        <div className="stat-box">
          <h3>Score</h3>
          <p className="stat-value">{score}</p>
        </div>
        <div className="stat-box">
          <h3>Streak 🔥</h3>
          <p className="stat-value">{streak}</p>
        </div>
      </div>

      <div className="difficulty-selector">
        <label>Difficulty:</label>
        {Object.keys(difficultyLevels).map(level => (
          <button
            key={level}
            className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
            onClick={() => {
              setDifficulty(level)
              setScore(0)
              setStreak(0)
            }}
          >
            {difficultyLevels[level].label}
          </button>
        ))}
      </div>

      <div className="question-area">
        <p className="question">{num1} + {num2} = ?</p>
      </div>

      <div className="answer-area">
        <input
          ref={inputRef}
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
          placeholder="Type answer..."
        />
        <button className="check-btn" onClick={checkAnswer}>
          ✓ Check
        </button>
      </div>

      {result.message && (
        <div className={`result ${result.type}`}>
          {result.message}
        </div>
      )}

      <button className="new-game-btn" onClick={() => {
        setScore(0)
        setStreak(0)
        generateQuestion()
      }}>
        🔄 Reset Score
      </button>
    </div>
  )
}

export default AdditionTrainer
