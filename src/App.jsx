import React, { useState, useEffect } from 'react'
import './App.css'

// Import all the apps
import MultiplicationMaster from './apps/MultiplicationMaster'
import AdditionTrainer from './apps/AdditionTrainer'
import DeductionTrainer from './apps/DeductionTrainer'
import MathQuiz from './apps/MathQuiz'
import Flashcards from './apps/Flashcards'

// App version for localStorage management
const APP_VERSION = "1.2.0"

const apps = [
  {
    id: 'multiplication',
    name: '🎮 Multiplication Master',
    component: MultiplicationMaster,
    description: 'Practice times tables with multiple selections'
  },
  {
    id: 'addition',
    name: '➕ Addition Trainer',
    component: AdditionTrainer,
    description: 'Master addition with increasing difficulty'
  },
  {
    id: 'deduction',
    name: '➖ Deduction Trainer',
    component: DeductionTrainer,
    description: 'Practice subtraction with helpful hints'
  },
  {
    id: 'quiz',
    name: '🧮 Math Quiz',
    component: MathQuiz,
    description: 'Mixed operations challenge'
  },
  {
    id: 'flashcards',
    name: '🃏 Math Flashcards',
    component: Flashcards,
    description: 'Quick recall practice'
  }
]

function App() {
  const [currentAppId, setCurrentAppId] = useState('multiplication')
  const currentApp = apps.find(app => app.id === currentAppId)
  const CurrentAppComponent = currentApp.component

  // Check and clear old localStorage data when version changes
  useEffect(() => {
    const storedVersion = localStorage.getItem('appVersion')
    
    if (storedVersion !== APP_VERSION) {
      console.log(`App version changed from ${storedVersion || 'none'} to ${APP_VERSION}. Clearing old data...`)
      
      // Clear all localStorage keys except currentAppId preference
      const keysToKeep = ['currentAppId']
      Object.keys(localStorage).forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key)
        }
      })
      
      // Set new version
      localStorage.setItem('appVersion', APP_VERSION)
    }
  }, [])

  return (
    <div className="main-container">
      {/* App Selector Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="main-title">📚 Math Learning Center</h1>
          <div className="app-selector">
            <label htmlFor="app-select">Choose Activity:</label>
            <select 
              id="app-select"
              value={currentAppId}
              onChange={(e) => setCurrentAppId(e.target.value)}
              className="app-dropdown"
            >
              {apps.map(app => (
                <option key={app.id} value={app.id}>
                  {app.name}
                </option>
              ))}
            </select>
            <p className="app-description">{currentApp.description}</p>
          </div>
        </div>
      </header>

      {/* Current App Display */}
      <main className="app-content">
        <CurrentAppComponent />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>🎓 Made with React • Keep practicing! 💪</p>
      </footer>
    </div>
  )
}

export default App
