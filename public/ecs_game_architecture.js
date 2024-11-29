// Defining a simple Entity-Component-System (ECS) architecture for a video game
const DEBUG = false;

// Entity: A unique identifier for game objects
class Entity {
  constructor(id) {
    this.id = id;
  }
}

// Component: Contains data and properties for entities (e.g., position, velocity, health)
class Component {
  constructor() {
    this.type = null;
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

    // Systems which should update() before this one:
    this.dependencies = [];
  }

  update(entities, entityComponents, dependencies) {
    entities.forEach(entity => {
        this.process(entity, entityComponents[entity.id], dependencies);
    });
  }

  // consider bitmap evaluation
  hasRequiredComponents(components) {
    return this.requiredComponents.every(type => type in components);
  }

  process(entity, components, dependencies) {
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
    this.views = []; // List of views with Position + Resolution components
    this.dependencies = [MovementSystem, CollisionSystem];
  }

  // todo: refactor to use super()
  update(entities, entityComponents) {
    this.views = []; // Clear previous views

    entities.forEach(entity => {
      const components = entityComponents[entity.id];
      if ('position' in components && 'resolution' in components) {
        const position = components['position'];
        const resolution = components['resolution'];
        const view = {
          entityId: entity.id,
          position,
          resolution,
          entitiesInView: []
        };
        this.views.push(view);
      }
    });

    // Update entities in each view
    this.views.forEach((view, viewIndex) => {
      view.entitiesInView = []; // Clear previous entities in view

      entities.forEach(entity => {
        if (entity.id !== view.entityId) {
          const components = entityComponents[entity.id];
          if ('position' in components) {
            const position = components['position'];
            if (
              position.x >= view.position.x &&
              position.x <= view.position.x + view.resolution.width &&
              position.y >= view.position.y &&
              position.y <= view.position.y + view.resolution.height
            ) {
              view.entitiesInView.push(entity.id);
            }
          }
        }
        else {
          DEBUG && console.log('Entity not in view for Camera ' + viewIndex + ': ' + entity.id);
        }
      });

      DEBUG && console.log(`View for entity ${view.entityId} contains entities: ${view.entitiesInView.join(', ')}`);
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
    //     return this.requiredComponents.every(type => type in components);
    return this.entities.filter(entity => {
      const result = components.every(type => type in this.entityComponents[entity.id]);
      return result;
    });
  }

  update() {
    this.systems.forEach(system => {
      const entities = this.getEntitiesWithComponents(system.requiredComponents);
      system.update(entities, this.entityComponents);
    });
  }
}

class SampleGame extends World {
  constructor() {
    super();


    // Create entities and add components
    const player = this.createEntity();

    this.addComponent(player, new PositionComponent(50, 150));
    this.addComponent(player, new HitboxComponent(50, 50, 0, 0));
    this.addComponent(player, new CollisionComponent());

    // player camera
    const playerCamera = this.createEntity();
    this.addComponent(playerCamera, new PositionComponent(50-250, 150-250));
    this.addComponent(playerCamera, new ResolutionComponent(500, 500));

    const enemy = this.createEntity();
    this.addComponent(enemy, new PositionComponent(200, 200));
    this.addComponent(enemy, new HitboxComponent(50, 50, 0, 0));
    this.addComponent(enemy, new CollisionComponent());

    // enemy camera
    const enemyCamera = this.createEntity();
    this.addComponent(enemyCamera, new PositionComponent(200-250, 200-250));
    this.addComponent(enemyCamera, new ResolutionComponent(500, 500));

    // starting speeds
    this.addComponent(player, new VelocityComponent(1, 1));
    this.addComponent(playerCamera, new VelocityComponent(1, 1));
    this.addComponent(enemy, new VelocityComponent(-1, 0.5));
    this.addComponent(enemyCamera, new VelocityComponent(-1, 0.5));

    // Add systems
    const movementSystem = new MovementSystem();
    this.addSystem(movementSystem);

    const collisionSystem = new CollisionSystem();
    this.addSystem(collisionSystem);

    const viewSystem = new ViewSystem();
    this.addSystem(viewSystem);
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
      renderCanvas();
  }
  requestAnimationFrame(canvasGameLoop);
}

// Rendering function using HTML Canvas
function renderCanvas() {
  const screen1 = document.getElementById('gameCanvas');
  const ctx1 = screen1.getContext('2d');
  ctx1.clearRect(0, 0, screen1.width, screen1.height);


  const screen2 = document.getElementById('screen2');
  const ctx2 = screen2.getContext('2d');
  ctx2.clearRect(0, 0, screen2.width, screen2.height);

  const screens = [
    { canvas: screen1, ctx: ctx1 },
    { canvas: screen2, ctx: ctx2 },
  ];

  if (world.systems.find(system => system instanceof ViewSystem).views.length > 0) {
    const { views } = world.systems.find(system => system instanceof ViewSystem);
    // const view = world.systems.find(system => system instanceof ViewSystem).views[0];

    views.forEach((view, viewIndex) => {
      const cameraPosition = view.position;
      const cameraResolution = view.resolution;
      const { canvas, ctx } = screens[viewIndex];

      view.entitiesInView.forEach(entityId => {
        const position = world.entityComponents[entityId]['position'];
        const { collidingWith } = world.entityComponents[entityId]['collision'];

        if (position) {
          ctx.fillRect(position.x - cameraPosition.x, position.y - cameraPosition.y, 10, 10); // Draw a simple square for each entity within the camera view
          DEBUG && console.log(`Rendering entity ${entityId} at canvas position (${position.x - cameraPosition.x}, ${position.y - cameraPosition.y})`);
        }

          // Draw the hitbox if it exists
          const hitbox = world.entityComponents[entityId]['hitbox'];
          if (hitbox) {
            // center hitbox on point in view
            const offsetX = 0; // parseInt(hitbox.width / 2);
            const offsetY = 0; // parseInt(hitbox.height / 2);


            ctx.strokeStyle = 'cyan';
            ctx.strokeRect(
              position.x + offsetX - cameraPosition.x,
              position.y + offsetY - cameraPosition.y,
              hitbox.width,
              hitbox.height
            ); // Draw the hitbox for each entity in cyan
          }
      });
    });
  }
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