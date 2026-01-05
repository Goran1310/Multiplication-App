# 📚 Math Learning Center

A collection of interactive educational math apps built with React + Vite. Switch between different learning activities using a dropdown menu!

## 🎮 Available Apps

1. **🎮 Multiplication Master** - Practice times tables with multi-select mode
2. **➕ Addition Trainer** - Master addition with adjustable difficulty
3. **🧮 Math Quiz** - Mixed operations challenge
4. **🃏 Math Flashcards** - Quick recall practice with auto-play

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:3000`

## 📂 Project Structure

```
Multiplication App/
├── src/
│   ├── apps/                      # Individual learning apps
│   │   ├── MultiplicationMaster.jsx
│   │   ├── MultiplicationMaster.css
│   │   ├── AdditionTrainer.jsx
│   │   ├── AdditionTrainer.css
│   │   ├── MathQuiz.jsx
│   │   ├── MathQuiz.css
│   │   ├── Flashcards.jsx
│   │   └── Flashcards.css
│   ├── components/                # Shared components (future)
│   ├── App.jsx                    # Main app with dropdown selector
│   ├── App.css
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── package.json
├── vite.config.js
├── index-new.html                 # HTML template for React
└── README-REACT.md               # This file
```

## ✨ Features

- **App Switcher**: Dropdown menu to switch between different math activities
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Learning**: Immediate feedback with sound effects
- **Multiple Difficulty Levels**: Adjustable challenges for different skill levels
- **Progress Tracking**: Score tracking and streaks
- **Timer Mode**: Optional timed challenges
- **Flashcard System**: Auto-play and shuffle features

## 🎯 How to Add a New App

1. Create a new component in `src/apps/YourApp.jsx`
2. Create corresponding CSS file `src/apps/YourApp.css`
3. Import it in `src/App.jsx`
4. Add it to the `apps` array in `App.jsx`

Example:
```javascript
import YourApp from './apps/YourApp'

const apps = [
  // ... existing apps
  {
    id: 'your-app',
    name: '🎲 Your App',
    component: YourApp,
    description: 'Description of your app'
  }
]
```

## 🛠️ Technologies

- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **CSS3** - Styling with gradients and animations
- **Web Audio API** - Sound effects

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Customization

Each app has its own CSS file for easy customization:
- Colors: Edit gradient values in CSS files
- Fonts: Change `font-family` in `src/index.css`
- Layout: Modify component styles in respective CSS files

## 📝 Notes

- The old vanilla JS version is preserved in `app.js`, `index.html`, and `style.css`
- To use the React version, use `index-new.html` or run `npm run dev`
- For deployment, run `npm run build` and serve the `dist` folder

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The `dist` folder will contain your optimized production build.

Deploy to:
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repo
- **GitHub Pages**: Use `gh-pages` package

## 🤝 Contributing

Feel free to add new math learning apps or improve existing ones!

## 📄 License

MIT License - Feel free to use for educational purposes

---

**Made with React** ⚛️ • **Keep Learning!** 📚
