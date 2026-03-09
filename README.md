# Kahit Saan — Decision Engine 🍽️

A beautiful, interactive decision-making app for groups that solves the age-old question: "Where should we eat?" Kahit Saan (Filipino for "Anywhere") guides your group through a fun, fair process to decide on a dining destination.

## ✨ Features

- **Group Management**: Add participants with colorful avatars
- **Cravings Input**: Each member adds up to 3 food preferences
- **Smart Veto System**: Remove options that the group hates
- **Wheel of Fate**: Animated spinning wheel for random selection
- **Google Maps Integration**: One-click search for nearby restaurants
- **Modern UI**: Vibrant "Sunburst" theme with smooth animations
- **Mobile-First Design**: Fully responsive interface

## 🚀 Live Demo

[Try it here!](https://kahit-ano-tau.vercel.app/) – Live application deployed on Vercel

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/dev-adelacruz/kahit-ano.git
cd kahit-ano
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser at `http://localhost:5173`

## 🚦 Usage

### 1. **Lobby Phase**
- Add all group members participating in the decision
- Minimum of 2 participants required
- Each participant gets a unique color identifier

### 2. **Cravings Collection**
- Each member takes turns adding up to 3 food preferences
- Quick suggestions available: Pizza, Samgyup, Coffee, Burgers, Sushi, Wings
- Real-time validation prevents duplicates

### 3. **Veto Round**
- Group collectively removes options they absolutely dislike
- Visual toggle system with clear feedback
- At least one option must remain to proceed

### 4. **The Wheel**
- Animated spinning wheel with all remaining choices
- Physics-based rotation with smooth deceleration
- Randomized selection ensures fairness

### 5. **Result & Next Steps**
- Celebration screen with winning choice
- One-click Google Maps search for nearby restaurants
- Option to start a new round

## 📁 Project Structure

```
kahit-ano/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── eslint.config.js     # ESLint configuration
```

## 📜 Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run lint` – Run ESLint
- `npm run preview` – Preview production build

## 🎨 Design System

The app uses a "Vibrant Sunburst" theme with:

- **Primary Colors**: Orange (`#f97316`) to Rose (`#f43f5e`) gradient
- **Typography**: Plus Jakarta Sans (via Google Fonts)
- **Spacing**: Consistent 8px base unit
- **Shadows**: Multi-layer shadows for depth
- **Animations**: Smooth transitions and micro-interactions

## 🔧 Configuration

### Tailwind CSS
Configured with JIT mode for optimal performance. Custom colors and animations defined in the app component.

### Vite
Optimized for fast development with hot module replacement.

### ESLint
Modern ESLint configuration with React Hooks rules.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Vite](https://vitejs.dev/) for lightning-fast builds
- The Filipino phrase "Kahit Saan" for inspiration

## 📞 Contact

Project Link: [https://github.com/dev-adelacruz/kahit-ano](https://github.com/dev-adelacruz/kahit-ano)

---

Made with ❤️ and 🍜 by [dev-adelacruz](https://github.com/dev-adelacruz)