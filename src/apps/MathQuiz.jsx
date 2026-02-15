import React, { useState, useEffect, useRef } from 'react'
import './MathQuiz.css'

const MathQuiz = () => {
  const [operation, setOperation] = useState('mixed')
  const [currentOp, setCurrentOp] = useState('+')
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [result, setResult] = useState({ message: '', type: '' })
  const inputRef = useRef(null)
  const audioContextRef = useRef(null)

  const operations = {
    addition: { symbol: '+', label: '➕ Addition' },
    subtraction: { symbol: '-', label: '➖ Subtraction' },
    multiplication: { symbol: '×', label: '✖️ Multiplication' },
    division: { symbol: '÷', label: '➗ Division' },
    mixed: { symbol: 'mix', label: '🎲 Mixed' }
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
  }, [operation])

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
    let op = operation === 'mixed' 
      ? ['+', '-', '×', '÷'][Math.floor(Math.random() * 4)]
      : operations[operation].symbol

    setCurrentOp(op)
    
    let n1, n2
    
    switch (op) {
      case '+':
        n1 = Math.floor(Math.random() * 50) + 1
        n2 = Math.floor(Math.random() * 50) + 1
        break
      case '-':
        n1 = Math.floor(Math.random() * 50) + 20
        n2 = Math.floor(Math.random() * n1)
        break
      case '×':
        n1 = Math.floor(Math.random() * 12) + 1
        n2 = Math.floor(Math.random() * 12) + 1
        break
      case '÷':
        n2 = Math.floor(Math.random() * 12) + 1
        n1 = n2 * (Math.floor(Math.random() * 12) + 1)
        break
    }
    
    setNum1(n1)
    setNum2(n2)
    setUserAnswer('')
    setResult({ message: '', type: '' })
    inputRef.current?.focus()
  }

  const calculateAnswer = () => {
    switch (currentOp) {
      case '+': return num1 + num2
      case '-': return num1 - num2
      case '×': return num1 * num2
      case '÷': return num1 / num2
      default: return 0
    }
  }

  const checkAnswer = () => {
    if (userAnswer === '') return

    const correct = calculateAnswer()
    const answer = Number(userAnswer)
    
    setTotal(total + 1)

    if (Math.abs(answer - correct) < 0.01) {
      playCorrectSound()
      setScore(score + 1)
      setResult({ message: '🎉 Correct!', type: 'correct' })
      setTimeout(generateQuestion, 1500)
    } else {
      playWrongSound()
      setResult({ 
        message: `❌ Wrong! The answer was ${correct}`, 
        type: 'wrong' 
      })
    }
  }

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  return (
    <div className="quiz-container">
      <h1>🧮 Math Quiz</h1>
      
      <div className="stats">
        <div className="stat-box">
          <h3>Score</h3>
          <p className="stat-value">{score}/{total}</p>
        </div>
        <div className="stat-box">
          <h3>Accuracy</h3>
          <p className="stat-value">{percentage}%</p>
        </div>
      </div>

      <div className="operation-selector">
        <label>Operation:</label>
        {Object.keys(operations).map(op => (
          <button
            key={op}
            className={`op-btn ${operation === op ? 'active' : ''}`}
            onClick={() => setOperation(op)}
          >
            {operations[op].label}
          </button>
        ))}
      </div>

      <div className="question-area">
        <p className="question">{num1} {currentOp} {num2} = ?</p>
      </div>

      <div className="answer-area">
        <input
          ref={inputRef}
          type="number"
          step="any"
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

      <button className="reset-btn" onClick={() => {
        setScore(0)
        setTotal(0)
        generateQuestion()
      }}>
        🔄 Reset Quiz
      </button>
    </div>
  )
}

export default MathQuiz
