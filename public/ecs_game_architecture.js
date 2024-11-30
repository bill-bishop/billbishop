// Defining a simple Entity-Component-System (ECS) architecture for a video game
const DEBUG = true;

// Entity: A unique identifier for game objects
class Entity {
  constructor(id) {
    this.id = id;
  }
}

// Component: Contains data and properties for entities (e.g., position, velocity, health)
class Component {
  constructor(type) {
    this.type = type;
  }
}

class PositionComponent extends Component {
  constructor(x, y) {
    super();
    this.type = 'position';
    this.x = x;
    this.y = y;
  }
}

class VelocityComponent extends Component {
  constructor(vx, vy) {
    super();
    this.type = 'velocity';
    this.vx = vx;
    this.vy = vy;
  }
}

class HitboxComponent extends Component {
  constructor(width, height) {
    super();
    this.type = 'hitbox';
    this.width = width;
    this.height = height;
  }
}

class ResolutionComponent extends Component {
  constructor(width, height) {
    super();
    this.type = 'resolution';
    this.width = width;
    this.height = height;
  }
}

class ViewModelComponent extends Component {
  constructor(width, height) {
    super();
    this.type = 'viewModel';
    this.width = width;
    this.height = height;
    this.entitiesInView = [];
    this.entityPositionsInView = {};
  }
}

class CanvasTarget extends Component {
  constructor(elementId) {
    super('canvasTarget');
    this.elementId = elementId;
  }
}

class CollisionComponent extends Component {
  constructor() {
    super();
    this.type = 'collision';
    this.collidingWith = [];
  }

  addCollision(entityId) {
    if (!this.collidingWith.includes(entityId)) {
      this.collidingWith.push(entityId);
    }
  }

  clearCollisions() {
    this.collidingWith = [];
  }
}

// System: Performs operations on entities with the required components
class System {
  constructor() {
    this.requiredComponents = [];
  }

  update(entities, entityComponents, globalEntities) {
    entities.forEach(entity => {
        this.process(entity, entityComponents[entity.id], globalEntities, entityComponents);
    });
  }

  // consider bitmap evaluation
  hasRequiredComponents(components) {
    return this.requiredComponents.every(type => type in components);
  }

  process(entity, components, globalEntities, globalEntityComponents) {
    // To be implemented in derived systems
  }
}

class MovementSystem extends System {
  constructor() {
    super();
    this.requiredComponents = ['position', 'velocity'];
  }

  update(entities, entityComponents) {
    super.update(entities, entityComponents);
  }

  process(entity, components) {
    const position = components['position'];
    const velocity = components['velocity'];
    position.x += velocity.vx;
    position.y += velocity.vy;

    DEBUG && console.log(`Entity ${entity.id} moved to position (${position.x}, ${position.y})`);
  }
}

class CollisionSystem extends System {
  constructor() {
    super();
    this.requiredComponents = ['position', 'hitbox'];
    this.dependencies = [MovementSystem];
  }

  // super.update only works for System effects that are independent of other entities
  // consider generating entity-pairs and processing all pairs?
  update(entities, entityComponents) {
    entities.forEach(entity => {
        this.process(entity, entityComponents[entity.id], entities, entityComponents);
    });
  }

  process(entity, components, entities, entityComponents) {
    const position = components['position'];
    const hitbox = components['hitbox'];
    const collisionComponent = components['collision'] || new CollisionComponent();

    // Clear previous collisions
    collisionComponent.clearCollisions();

    // Simple collision detection logic (for demonstration purposes)
    entities.forEach(otherEntity => {
      if (entity.id !== otherEntity.id) {
        const otherComponents = entityComponents[otherEntity.id];
        if ('position' in otherComponents && 'hitbox' in otherComponents) {
          const otherPosition = otherComponents['position'];
          const otherHitbox = otherComponents['hitbox'];

          if (
            position.x < otherPosition.x + otherHitbox.width &&
            position.x + hitbox.width > otherPosition.x &&
            position.y < otherPosition.y + otherHitbox.height &&
            position.y + hitbox.height > otherPosition.y
          ) {
            collisionComponent.addCollision(otherEntity.id);
            DEBUG && console.log(`Collision detected between entity ${entity.id} and entity ${otherEntity.id}`);
          }
        }
      }
    });

    // Update entity's collision component
    entityComponents[entity.id]['collision'] = collisionComponent;
  }
}

// Generates a ViewModel for each Camera
// Todo: 
class ViewSystem extends System {
  constructor() {
    super();
    this.requiredComponents = ['viewModel'];
  }

  // todo: refactor to use super()
  update(entities, entityComponents, globalEntities) {
    // Update entities in each view
    entities.forEach((camera, viewIndex) => {
      const { viewModel, position: cameraPosition } = entityComponents[camera.id];
      viewModel.entitiesInView = []; // Clear previous entities in view
      viewModel.entityPositionsInView = {};

      globalEntities.forEach(entity => {
        if (entity.id !== camera.id) {
          const components = entityComponents[entity.id];
          if ('position' in components) {
            const position = components['position'];
            if (
              position.x >= cameraPosition.x &&
              position.x <= cameraPosition.x + viewModel.width &&
              position.y >= cameraPosition.y &&
              position.y <= cameraPosition.y + viewModel.height
            ) {
              // store the positions in view model relative to that view
              viewModel.entitiesInView.push(entity.id);
              viewModel.entityPositionsInView[entity.id] = {
                x: position.x - cameraPosition.x,
                y: position.y - cameraPosition.y,
              };
            }
          }
        }
        else {
          // is it possible to see myself?
          // DEBUG && console.log('Entity not in view for Camera ' + camera.id + ': ' + entity.id);
        }
      });

      DEBUG && console.log(`ViewModel for Camera ${camera.id} contains entities: ${viewModel.entitiesInView.join(', ')}`);
    });
  }
}

class CanvasRenderSystem extends System {
  constructor() {
    super();
    this.requiredComponents = ['viewModel', 'canvasTarget'];
  }

  process(entity, components, globalEntities, globalEntityComponents) {
    const {
      position,
      viewModel,
      canvasTarget,
    } = components;
    const { width, height, entitiesInView, entityPositionsInView } = viewModel;
    const cameraPosition = position;
    const cameraResolution = { width, height };
    const canvas = document.getElementById(canvasTarget.elementId);
    const ctx = canvas.getContext('2d');

    // clear before redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw text "Player 1" on the screen
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Camera${(entity.id)}, ${cameraResolution.width}x${cameraResolution.height}, Position(${parseInt(cameraPosition.x)},${parseInt(cameraPosition.y)})`, 10, 30);

    // Draw tiny gray* grid markings at game model points (x, y) % 100 === 0,0
    // todo: make this a visible background entity
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // Gray color with 50% transparency
    const gridMarkingSize = 100;
    for (let x = Math.floor(cameraPosition.x / gridMarkingSize) * gridMarkingSize; x < cameraPosition.x + cameraResolution.width; x += gridMarkingSize) {
      for (let y = Math.floor(cameraPosition.y / gridMarkingSize) * gridMarkingSize; y < cameraPosition.y + cameraResolution.height; y += gridMarkingSize) {
        const screenX = x - cameraPosition.x;
        const screenY = y - cameraPosition.y;
        ctx.fillRect(screenX, screenY, 2, 2); // Draw a small dot at each grid point
      }
    }

    entitiesInView.forEach(entityId => {
      const position = entityPositionsInView[entityId];

      if (position) {
        // draw cameras as transparent gray?
        const isCamera = !!globalEntityComponents[entityId]['resolution'];

        ctx.fillStyle = isCamera ? 'gray' : 'black';
        ctx.fillRect(position.x, position.y, 10, 10); // Draw a simple square for each entity within the camera view

        if (isCamera) {
          ctx.font = '15px Arial';
          ctx.fillText(`Camera${entityId}`, position.x, position.y);
        }

        DEBUG && console.log(`Rendering entity ${entityId} at canvas position (${position.x}, ${position.y})`);
      }

      // Draw the hitbox if it exists
      const hitbox = globalEntityComponents[entityId]['hitbox'];
      if (hitbox) {
        const collision = globalEntityComponents[entityId]['collision'];

        if (collision && collision.collidingWith.length > 0) {
          // ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Semi-transparent red
          const alpha = 0.5;
          ctx.fillStyle = `rgba(${(entityId * 50) % 255}, ${(entityId * 80) % 255}, ${(entityId * 120) % 255}, ${alpha})`; // Semi-transparent color based on entity ID
          ctx.fillRect(
            position.x,
            position.y,
            hitbox.width,
            hitbox.height
          );
        }

        ctx.strokeStyle = 'cyan';
        ctx.strokeRect(
          position.x,
          position.y,
          hitbox.width,
          hitbox.height
        ); // Draw the hitbox for each entity in cyan
      }
    });
  }
}

// World: Manages entities, components, and systems
class World {
  constructor() {
    this.entities = [];
    this.systems = [];
    this.entityCounter = 0;
    this.entityComponents = {};
  }

  createEntity() {
    const entity = new Entity(this.entityCounter++);
    this.entities.push(entity);
    this.entityComponents[entity.id] = {};
    return entity;
  }

  addComponent(entity, component) {
    this.entityComponents[entity.id][component.type] = component;
  }

  addSystem(system) {
    this.systems.push(system);
  }

  getEntitiesWithComponents(components) {
    return this.entities.filter(entity => {
      const result = components.every(type => type in this.entityComponents[entity.id]);
      return result;
    });
  }

  update() {
    this.systems.forEach(system => {
      const entities = this.getEntitiesWithComponents(system.requiredComponents);
      system.update(entities, this.entityComponents, this.entities);
    });
  }
}

class SampleGame extends World {
  constructor() {
    super();


    // Create entities and add components

    // player
    const player = this.createEntity();
    this.addComponent(player, new PositionComponent(150, 330));
    this.addComponent(player, new HitboxComponent(55, 55, 0, 0));
    this.addComponent(player, new CollisionComponent());
    this.addComponent(player, new VelocityComponent(.1, .1));

    // player camera
    const playerCamera = this.createEntity();
    this.addComponent(playerCamera, new PositionComponent(150-350, 330-350));
    this.addComponent(playerCamera, new ResolutionComponent(700, 700));
    this.addComponent(playerCamera, new ViewModelComponent(700, 700));
    this.addComponent(playerCamera, new VelocityComponent(.1, .1));
    this.addComponent(playerCamera, new CanvasTarget('gameCanvas'));

    const enemy = this.createEntity();
    this.addComponent(enemy, new PositionComponent(400, 200));
    this.addComponent(enemy, new HitboxComponent(55, 55, 0, 0));
    this.addComponent(enemy, new CollisionComponent());
    this.addComponent(enemy, new VelocityComponent(-.35, 0.5));

    // enemy camera
    const enemyCamera = this.createEntity();
    this.addComponent(enemyCamera, new PositionComponent(400-300, 200-150));
    this.addComponent(enemyCamera, new ResolutionComponent(600, 300));
    this.addComponent(enemyCamera, new ViewModelComponent(600, 300));
    this.addComponent(enemyCamera, new VelocityComponent(-.35, 0.5));
    this.addComponent(enemyCamera, new CanvasTarget('screen2'));

    const stationaryEntity1 = this.createEntity();
    this.addComponent(stationaryEntity1, new PositionComponent(250, 450));
    this.addComponent(stationaryEntity1, new HitboxComponent(25, 25, 0, 0));
    this.addComponent(stationaryEntity1, new CollisionComponent());

    const stationaryCamera = this.createEntity();
    this.addComponent(stationaryCamera, new PositionComponent(250-300, 450-150));
    this.addComponent(stationaryCamera, new ResolutionComponent(600, 300));
    this.addComponent(stationaryCamera, new ViewModelComponent(600, 300));
    this.addComponent(stationaryCamera, new CanvasTarget('screen3'));

    // Add systems
    const movementSystem = new MovementSystem();
    this.addSystem(movementSystem);

    const collisionSystem = new CollisionSystem();
    this.addSystem(collisionSystem);

    const viewSystem = new ViewSystem();
    this.addSystem(viewSystem);

    const canvasRenderSystem = new CanvasRenderSystem();
    this.addSystem(canvasRenderSystem);
  }
}

// Example usage
const world = new SampleGame();

const tickSpeed = 1;
let ticks = 0;

// Game loop for canvas rendering
function canvasGameLoop() {
  ticks = (ticks + 1) % tickSpeed;
  if (ticks === 0) {
      world.update();
      // renderCanvas();
  }
  requestAnimationFrame(canvasGameLoop);
}

// Start the canvas game loop
canvasGameLoop();

// Game loop for terminal rendering
function terminalGameLoop() {
  world.update();
  renderTerminal();
}

// Rendering function for terminal output
function renderTerminal() {
  //console.clear();
  if (world.systems.find(system => system instanceof ViewSystem).views.length > 0) {
    const view = world.systems.find(system => system instanceof ViewSystem).views[0];
    const cameraPosition = view.position;
    const cameraResolution = view.resolution;

    let terminalOutput = '';

    for (let y = 0; y < cameraResolution.height; y++) {
      for (let x = 0; x < cameraResolution.width; x++) {
        const worldX = cameraPosition.x + x;
        const worldY = cameraPosition.y + y;

        // hardcode hitbox offsets -2, -2
        // const offsetX = 4, offsetY = 4;

        const entityInPosition = view.entitiesInView.find(entityId => {
          const position = world.entityComponents[entityId]['position'];
          const hitbox = world.entityComponents[entityId]['hitbox'];

          // center hitbox on point in view
          const offsetX = 0; // parseInt(hitbox.width / 2);
          const offsetY = 0; // parseInt(hitbox.height / 2);

          return (
            position &&
            hitbox &&
            ((worldX === position.x && worldY === position.y) ||
            (worldX + offsetX >= position.x &&
            worldX + offsetX < position.x + hitbox.width &&
            worldY + offsetY >= position.y &&
            worldY + offsetY < position.y + hitbox.height))
          );
        });

        if (typeof entityInPosition !== 'undefined') {
          const position = world.entityComponents[entityInPosition]['position'];
          if (position.x === worldX && position.y === worldY) {
            terminalOutput += 'X'; // Entity origin
          } else {
            terminalOutput += '\x1b[36m.\x1b[0m'; // Yellow color for points within hitbox
          }
        } else {
          terminalOutput += ' ';
        }
      }
      terminalOutput += '\n';
    }

    console.log(terminalOutput);
  }
}

// Start the Terminal game loop
// setInterval(terminalGameLoop, 250);