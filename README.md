# CLI Adventure Game 🗡️✨

A TypeScript-powered Choose Your Own Adventure game that runs in your terminal. Navigate through the mysterious forest, make crucial decisions, and discover multiple endings based on your choices!

## Features

- 📖 **Interactive Storytelling**: Rich narrative with branching paths
- 🎮 **Choice Consequences**: Your decisions affect stats, inventory, and story outcomes
- 🌈 **Colorful CLI**: Beautiful terminal interface with colors and ASCII art
- 📊 **Character System**: Track health, courage, wisdom, and inventory
- 🔄 **Multiple Endings**: Different paths lead to various conclusions
- 🎯 **TypeScript**: Fully typed codebase for reliability and maintainability

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development
```bash
# Clone or navigate to the project directory
cd cli-adventure

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the project
npm run build

# Run the built version
npm start
```

### Global Installation (Optional)
```bash
# Build the project first
npm run build

# Link globally (from project directory)
npm link

# Now you can run from anywhere
cli-adventure
```

## How to Play

1. **Start the Game**: Run `npm run dev` or `cli-adventure`
2. **Enter Your Name**: Personalize your adventure
3. **Read the Story**: Pay attention to the narrative
4. **Make Choices**: Use arrow keys to select options and press Enter
5. **Watch Consequences**: Your choices affect your stats and story path
6. **Discover Endings**: Multiple paths lead to different conclusions

## Game Mechanics

### Stats
- **Health**: Your life force (0 = game over)
- **Courage**: Affects available brave choices
- **Wisdom**: Unlocks thoughtful options

### Inventory
- Collect items during your adventure
- Some choices require specific items
- Items can be lost through certain decisions

### Choice System
- Some choices are only available with certain stats or items
- Consequences can modify your stats or inventory
- Your path through the story affects available options

## Story Overview

**The Mysterious Forest**: You are a brave adventurer who discovers an enchanted forest. Legend says those who enter either find great treasure or are never seen again. Your choices will determine your fate as you encounter:

- Ancient guardians and forest spirits
- Magical artifacts and mysterious locations
- Moral dilemmas that test your character
- Multiple paths leading to different endings

## Development

### Project Structure
```
src/
├── types/           # TypeScript interfaces and types
├── utils/           # CLI utilities and helpers
├── game/            # Game engine and logic
├── data/            # Story content and data
└── index.ts         # Main entry point
```

### Available Scripts
- `npm run dev`: Run in development mode with tsx
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Run the compiled version
- `npm run watch`: Watch for changes and recompile
- `npm run clean`: Remove build artifacts

### Technologies Used
- **TypeScript**: Type-safe JavaScript
- **Node.js**: Runtime environment
- **Inquirer**: Interactive command-line prompts
- **Chalk**: Terminal string styling
- **Figlet**: ASCII art text generation

## Contributing

This project was created as a learning exercise for JavaScript/TypeScript classes. Feel free to:

1. Add new story branches and endings
2. Implement save/load functionality
3. Add more complex game mechanics
4. Improve the CLI interface
5. Add sound effects or animations

## Educational Value

This project demonstrates:

- **Object-Oriented Programming**: Classes and interfaces
- **Async/Await**: Handling user input and game flow
- **Type Safety**: TypeScript interfaces and type checking
- **Module Organization**: Clean code structure and separation of concerns
- **CLI Development**: Building interactive terminal applications
- **Data Structures**: Managing game state and story trees

## License

ISC License - Feel free to use this project for learning and educational purposes!

---

*Happy adventuring! May your choices lead you to glory! 🌟*