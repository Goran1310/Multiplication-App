import React, { useState, useEffect, useRef } from 'react'
import './DeductionTrainer.css'

const DeductionTrainer = () => {
  const [difficulty, setDifficulty] = useState('easy')
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [result, setResult] = useState({ message: '', type: '' })
  const [streak, setStreak] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const inputRef = useRef(null)

  const difficultyLevels = {
    easy: { max: 10, label: '🟢 Easy (1-10)' },
    medium: { max: 50, label: '🟡 Medium (1-50)' },
    hard: { max: 100, label: '🔴 Hard (1-100)' }
  }

  useEffect(() => {
    generateQuestion()
  }, [difficulty])

  const generateQuestion = () => {
    const max = difficultyLevels[difficulty].max
    const n1 = Math.floor(Math.random() * max) + 1
    const n2 = Math.floor(Math.random() * n1) // Ensure n2 <= n1 for positive results
    
    setNum1(n1)
    setNum2(n2)
    setUserAnswer('')
    setResult({ message: '', type: '' })
    setShowHint(false)
    inputRef.current?.focus()
  }

  const checkAnswer = () => {
    if (userAnswer === '') return

    const correct = num1 - num2
    const answer = Number(userAnswer)

    if (answer === correct) {
      setScore(score + 1)
      setStreak(streak + 1)
      setResult({ message: '🎉 Correct!', type: 'correct' })
      setTimeout(generateQuestion, 1500)
    } else {
      setStreak(0)
      setResult({ 
        message: `❌ Wrong! The answer was ${correct}`, 
        type: 'wrong' 
      })
      setShowHint(true)
    }
  }

  const getHint = () => {
    const diff = num1 - num2
    return `💡 Hint: Start at ${num1} and count back ${num2} numbers: ${num1} - ${num2} = ${diff}`
  }

  return (
    <div className="deduction-container">
      <h1>➖ Deduction Trainer</h1>
      
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
        <p className="question">{num1} - {num2} = ?</p>
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

      {showHint && (
        <div className="hint-box">
          {getHint()}
        </div>
      )}

      <div className="controls">
        <button className="new-game-btn" onClick={() => {
          setScore(0)
          setStreak(0)
          generateQuestion()
        }}>
          🔄 Reset Score
        </button>
        <button className="hint-btn" onClick={() => setShowHint(!showHint)}>
          💡 {showHint ? 'Hide' : 'Show'} Hint
        </button>
      </div>

      <div className="tips">
        <h3>📚 Subtraction Tips:</h3>
        <ul>
          <li>🔢 Think of subtraction as "taking away"</li>
          <li>↩️ Count backwards from the first number</li>
          <li>➕ Check your answer by adding back: {num2} + ? = {num1}</li>
        </ul>
      </div>
    </div>
  )
}

export default DeductionTrainer
