import React, { useState, useEffect } from 'react'
import './Flashcards.css'

const Flashcards = () => {
  const [category, setCategory] = useState('multiplication')
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentCard, setCurrentCard] = useState(null)
  const [cards, setCards] = useState([])
  const [cardIndex, setCardIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  const categories = {
    multiplication: { label: '✖️ Multiplication Tables', cards: generateMultiplicationCards() },
    addition: { label: '➕ Addition Facts', cards: generateAdditionCards() },
    squares: { label: '²️⃣ Perfect Squares', cards: generateSquaresCards() }
  }

  function generateMultiplicationCards() {
    const cards = []
    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 10; j++) {
        cards.push({
          question: `${i} × ${j}`,
          answer: i * j
        })
      }
    }
    return shuffleArray(cards)
  }

  function generateAdditionCards() {
    const cards = []
    for (let i = 1; i <= 20; i++) {
      for (let j = 1; j <= 20; j++) {
        cards.push({
          question: `${i} + ${j}`,
          answer: i + j
        })
      }
    }
    return shuffleArray(cards).slice(0, 100)
  }

  function generateSquaresCards() {
    const cards = []
    for (let i = 1; i <= 20; i++) {
      cards.push({
        question: `${i}²`,
        answer: i * i
      })
    }
    return cards
  }

  function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  useEffect(() => {
    const categoryCards = categories[category].cards
    setCards(categoryCards)
    setCardIndex(0)
    setCurrentCard(categoryCards[0])
    setIsFlipped(false)
  }, [category])

  useEffect(() => {
    if (autoPlay && !isFlipped) {
      const timer = setTimeout(() => {
        nextCard()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, isFlipped, cardIndex])

  const nextCard = () => {
    setIsFlipped(false)
    setTimeout(() => {
      const nextIndex = (cardIndex + 1) % cards.length
      setCardIndex(nextIndex)
      setCurrentCard(cards[nextIndex])
    }, 300)
  }

  const previousCard = () => {
    setIsFlipped(false)
    setTimeout(() => {
      const prevIndex = cardIndex === 0 ? cards.length - 1 : cardIndex - 1
      setCardIndex(prevIndex)
      setCurrentCard(cards[prevIndex])
    }, 300)
  }

  if (!currentCard) return <div>Loading...</div>

  return (
    <div className="flashcards-container">
      <h1>🃏 Math Flashcards</h1>
      
      <div className="controls-top">
        <div className="category-selector">
          {Object.keys(categories).map(cat => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {categories[cat].label}
            </button>
          ))}
        </div>
        
        <div className="autoplay-control">
          <label>
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
            />
            <span>⏯️ Auto-play</span>
          </label>
        </div>
      </div>

      <div className="card-counter">
        Card {cardIndex + 1} of {cards.length}
      </div>

      <div 
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <p className="card-text">{currentCard.question}</p>
            <p className="tap-hint">👆 Tap to reveal answer</p>
          </div>
          <div className="flashcard-back">
            <p className="card-text">{currentCard.answer}</p>
            <p className="tap-hint">👆 Tap to hide answer</p>
          </div>
        </div>
      </div>

      <div className="navigation">
        <button className="nav-btn" onClick={previousCard}>
          ⬅️ Previous
        </button>
        <button className="nav-btn shuffle" onClick={() => {
          const shuffled = shuffleArray(cards)
          setCards(shuffled)
          setCardIndex(0)
          setCurrentCard(shuffled[0])
          setIsFlipped(false)
        }}>
          🔀 Shuffle
        </button>
        <button className="nav-btn" onClick={nextCard}>
          Next ➡️
        </button>
      </div>

      <div className="instructions">
        <p>💡 <strong>Tip:</strong> Click the card to flip it and see the answer. Use auto-play for continuous practice!</p>
      </div>
    </div>
  )
}

export default Flashcards
