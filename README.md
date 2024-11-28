# Bill's Developer Bio Game

Hosted on Heroku at https://bill-bishop-d8d977137404.herokuapp.com/

## 🎮 Play the Game

To run the project locally:

1. **Install Dependencies**:
   Make sure you have Node.js installed. Install `http-server` by running:

   ```sh
   npm install http-server
   ```

2. **Run the Server**:
   Use the command:

   ```sh
   npx http-server ./public -p 8080
   ```

3. **Open in Browser**:
   Open [http://localhost:8080](http://localhost:8080) in your favorite browser.

4. **Explore and Enjoy**:
   Navigate the canvas, explore each object, and discover the interactive parts of the game.

## 📖 Overview

The **Developer Bio Game** is an interactive, experimental game created to serve as a unique and engaging way to present the developer's biography. It's a browser-based game using **HTML5 Canvas** and **JavaScript**, where players explore a virtual space representing different aspects of the developer.

### Gameplay Overview

The player controls a character that moves across a canvas and interacts with various game objects:

- **Bio**: Represents the detailed developer bio.
- **GitHub**: Opens the developer's GitHub profile.
- **Mystery**: Adds a surprise element to keep users engaged.
- **PowerUp & Heart**: Special game items that introduce new mechanics to the game.

The game is built to demonstrate an experimental and creative use of the **HTML5 Canvas** and **modern JavaScript**, while also experimenting with **collaborative AI-assisted development**.

## 🛠️ Technical Overview

### Project Structure

The project follows a **modular code structure** with a **Model-View-Controller (MVC)** pattern, allowing for maintainability and scalability. Here is a quick breakdown:

- **Controllers**: Manage user interactions and overall game flow.
- **Models**: Represent the data, such as player attributes and game objects.
- **Views**: Handle rendering of the game onto the HTML5 Canvas.
- **Game Loop**: Managed through a dedicated `GameLoop` class that oversees updates and rendering at each frame.
- **Visual Effects**: Special effects, like fireworks and particle explosions, are modularized into distinct classes.
- **Utilities**: Additional helpers, like color utilities and input handling, are modularized for better code reuse.

### Directory Layout

```
devBioGame/
├── public/
│   ├── index.html                    // Main game HTML
│   ├── bio.html                      // Developer Bio HTML page
│   ├── enhanced_ripple_message_with_assistant.html // Extra message page
│   ├── styles.css                    // Styles for the game
│   └── img/                          // Images used in the project (e.g., background)
├── src/
│   ├── controllers/
│   │   └── game_controller.js        // Game controller for user interactions
│   ├── effects/
│   │   ├── fireworks.js              // Fireworks effect class
│   │   └── particle_explosion.js     // Particle explosion effect class
│   ├── models/
│   │   └── game_model.js             // Model for game data
│   ├── views/
│   │   └── game_view.js              // View for rendering on the canvas
│   ├── utilities/
│   │   ├── game_colors.js            // Color utility for game elements
│   │   ├── input_handler.js          // Handles player input
│   │   ├── event_listener_api.js     // Manages event listeners for user input
│   │   └── update_api.js             // Updates game state during each frame
│   └── game_loop.js                  // Game loop class to control timing
└── README.md                         // This README file
```

## ✨ Notable Features

- **Interactive Objects**: The game contains interactive elements representing the developer's biography, GitHub profile, and more.
- **Visual Effects**: The game includes **particle explosions** and **fireworks**, adding an appealing visual touch for events like collecting items or winning.
- **Power-Ups**: Players can collect power-ups to enhance abilities such as increased speed, adding a fun gameplay dynamic.
- **Canvas Adaptability**: The canvas is scaled to fit the device width and maintains a square aspect ratio for a consistent user experience.

## 💡 The Inspiration and Learning Behind This Game

The project started as an experiment to create a **personal, interactive developer bio page** that would go beyond traditional text-heavy introductions. By making a **game using HTML5 Canvas and JavaScript**, this experiment demonstrates the power of creative web development while making the experience enjoyable for visitors.

### Experimenting with AI Collaboration

This project was also an experiment in collaborating with **ChatGPT-4** to build and refine features, solve issues, and modularize the code:

- **Code Refactoring**: With ChatGPT's guidance, the game was broken down into modular components, making it easy to manage and extend.
- **Feature Suggestions**: Visual effects and special gameplay mechanics were partly inspired by creative suggestions.
- **Debugging and Fixes**: Many iterations involved fixing rendering issues, handling user input correctly, and optimizing game performance.

The entire journey was a testament to how modern AI tools can help developers think creatively, learn, and create something unique.

## 🚀 Future Improvements

Some ideas for future development include:

- **Additional Game Levels**: Adding more interactive elements or turning the bio page into a multi-level experience.
- **Enhanced Mobile Controls**: Further optimizing the user interface and controls for mobile users.
- **Dynamic Content**: Integrating APIs to fetch dynamic data from GitHub or other platforms, making the game content more versatile.

## 📝 License

Feel free to use, modify, and distribute this project. Attribution is appreciated but not required.