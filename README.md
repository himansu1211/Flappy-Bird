# Flappy Bird

A modern web-based recreation of the classic Flappy Bird game, featuring SVG-style graphics, parallax scrolling clouds, multiple bird skins, and progressive difficulty.

## Features

- **SVG-Style Graphics**: Smooth, vector-based bird and cloud rendering
- **Multiple Bird Skins**: Choose from Phoenix (red), Blue Jay (blue), or Goldie (yellow)
- **Parallax Background**: Animated clouds for depth and atmosphere
- **Progressive Difficulty**: Speed increases and gaps narrow as your score rises
- **Countdown Timer**: 3-second countdown before each game starts
- **High Score Tracking**: Persistent high score saved locally
- **Particle Effects**: Explosion animation when the game ends
- **Responsive Controls**: Keyboard and mouse support

## How to Play

1. Open `index.html` in your web browser
2. Use arrow keys to select your bird skin in the menu
3. Press Space or click to start the game
4. Tap Space, Up Arrow, or click to make the bird flap
5. Avoid the pipes and try to achieve the highest score!

## Controls

- **Menu Navigation**: Left/Right arrows to switch bird skins
- **Start Game**: Space, Up Arrow, or mouse click
- **Flap**: Space, Up Arrow, or mouse click during gameplay
- **Restart**: Click anywhere after game over

## Technologies Used

- HTML5 Canvas for rendering
- JavaScript for game logic
- CSS for styling
- Local Storage API for high score persistence

## Game Mechanics

- Gravity pulls the bird downward continuously
- Each flap gives an upward velocity boost
- Pipes spawn randomly with varying heights
- Score increases for each pipe successfully passed
- Game speed and pipe gap adjust based on current score
- Collision detection with pipes and screen boundaries

## Browser Compatibility

Works in all modern web browsers that support HTML5 Canvas and ES6 JavaScript features.

## Credits

Inspired by the original Flappy Bird game. Built with vanilla JavaScript for educational and entertainment purposes.
