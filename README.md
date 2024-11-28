# Bill's Developer Bio Game

---

## 🎮 Play the Game

Hosted on Heroku at https://bill-bishop-d8d977137404.herokuapp.com/

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

The **Developer Bio Game** is an interactive, experimental project that transforms the developer’s personal bio into a game experience. Built using **HTML5 Canvas** and **JavaScript**, it allows players to navigate through a virtual world representing different aspects of the developer's profile, like:

- **Bio**: A link to the developer's detailed bio.
- **GitHub**: A link to the developer's GitHub profile.
- **Mystery**: An interactive surprise feature that adds an element of curiosity.
- **Special Items**: Power-ups and hearts add fun gameplay mechanics.

### Gameplay Overview

Players control a character that moves around the canvas, interacting with various objects. The character can move using the **arrow keys** or by **tapping and dragging** on mobile devices. The game world is designed with interactive features that represent different aspects of the developer’s profile.

The goal was to create something more engaging than a typical bio page, with a focus on learning and demonstrating **co-collaborative development** with **AI**.

## 🛠️ Technical Overview

### Project Structure

The current project structure, which includes a mix of essential HTML, CSS, JavaScript files, and images, is organized to make the code modular and manageable:

```
billbishop/
├── node_modules/                  // Node dependencies for local server setup
├── public/
│   ├── img/
│   │   ├── bg1.jpg                // Background image 1
│   │   └── bg2.jpg                // Background image 2
│   ├── bio.html                   // Developer Bio HTML page
│   ├── controller.js              // Game controller logic for user interactions
│   ├── enhanced_ripple_message_with_assistant.html // Mystery page
│   ├── event_listener_api.js      // API for event listeners and input handling
│   ├── index.html                 // Main entry point HTML page
│   ├── input_handler.js           // Manages keyboard and touch inputs
│   ├── interaction.js             // Defines interactions within the game
│   ├── model.js                   // Represents game state data
│   ├── styles.css                 // Game and page styling
│   ├── update_api.js              // Updates game logic for each frame
│   └── view.js                    // Rendering game visuals on canvas
├── .gitignore                     // Git ignore file
├── index.js                       // Server setup file for serving the project
├── package-lock.json              // NPM package lock
├── package.json                   // Project metadata and dependencies
└── README.md                      // Documentation (this file)
```

### Notable Technical Solutions Developed Collaboratively

1. **Mobile-Friendly Scaling**:  
   One of the major improvements made during co-collaboration was scaling the canvas to fit different screen sizes while maintaining a consistent gameplay experience. We ensured the game canvas always adapts to the screen width, keeping a **square aspect ratio** to avoid distortion. This involved using a combination of CSS for responsive design and dynamic resizing through JavaScript to handle different resolutions and devices.

2. **Stateless Architecture**:  
   Another key feature is the **stateless architecture** of the game loop and controllers. The goal was to decouple the game’s logic from rendering and input handling, ensuring clear separation between different parts of the codebase. The **controller**, **model**, and **view** are designed to interact independently, with **update logic** managed by `update_api.js`. This modular design simplifies maintenance, testing, and future feature additions.

3. **Custom Input Handling for Cross-Device Compatibility**:  
   We worked together to implement a **unified input handler** for both desktop and mobile. The **`input_handler.js`** and **`event_listener_api.js`** modules manage inputs from **keyboard, mouse, and touch events**. Special consideration was given to handling edge cases like screen scroll during mobile input, ensuring seamless interaction without disrupting gameplay.

4. **GameLoop Refactor**:  
   The game's **loop logic** was moved into a dedicated `GameLoop` class, which controls frame updates and rendering. By separating the game loop from the controller, we were able to improve the readability and reusability of the code. This also allows better control over the game's state transitions, like pausing or stopping the game.

5. **Dynamic Effects and State-Driven Rendering**:  
   The game includes visual effects like **particle explosions** and **fireworks**, which were refactored into separate classes to keep the code modular and easy to expand. These effects are triggered based on certain player actions, and their rendering is dynamically managed by **state-driven logic** within `view.js`. This approach ensures a smoother visual experience and keeps effects independent from core game mechanics.

6. **Modular Event and Update APIs**:  
   The `event_listener_api.js` and `update_api.js` files were essential to abstract out the complexity of input handling and game state updates. This modular approach allows easy updates or enhancements to game logic without affecting other parts of the project. It also allows new developers to understand and modify specific parts of the game's functionality with minimal context.

7. **Server Setup and Deployment with Node.js**:  
   A minimal **Node.js server** using `http-server` is provided (`index.js`) to serve the game locally. This setup is designed for easy deployment, including platforms like **Heroku**, ensuring that the game can be quickly tested and shared without complicated backend infrastructure.

## ✨ Features and Gameplay

- **Interactive Elements**: The canvas includes objects that represent aspects of the developer's life—each interaction leads to a page, such as the biography or GitHub.
- **Visual Effects**: Players experience cool visual effects when certain actions are performed, such as picking up power-ups or interacting with specific elements.
- **Adaptive Controls**: The player can control movement via **keyboard**, **mouse**, or **touch** input—making the game experience consistent on both desktop and mobile devices.
- **Power-Ups and Hearts**: Special game elements add interesting gameplay mechanics that players can discover.

## 💡 Learning and Development Journey

This project was both a technical and creative endeavor, blending traditional coding with AI-assisted ideation. It was an opportunity to:

- **Experiment with AI Collaboration**: From the initial concepts to debugging and final touches, this game was shaped by working with AI in a **co-collaborative** manner, with ChatGPT helping plan the modular architecture, troubleshoot issues, and brainstorm creative gameplay features.
- **Refine Modular Code Design**: Moving from monolithic scripts to a fully modular architecture required iterative refactoring, which emerged as a direct result of collaboration between developer needs and AI suggestions.

## 🚀 Future Improvements

The game already serves as an engaging introduction to the developer’s portfolio, but here are some possible next steps:

- **Additional Levels**: Expanding the game beyond a single screen into multiple levels could add depth.
- **Enhanced Visuals**: Adding more complex visual effects and improving current animations could enrich the player experience.
- **Dynamic Content**: Integrate APIs to bring in dynamic, real-time content, such as recent GitHub commits or achievements.

## 📝 License

This project is open-source, and you are free to modify and distribute it. Attribution is appreciated.

---

This README has been adjusted to reflect the current state of the project, highlighting key technical solutions that emerged through co-collaboration and focusing on the modular design that makes this game both scalable and easy to extend. Let me know if there's anything else you'd like to modify or add!