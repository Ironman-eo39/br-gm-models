import { createMoonCar, MOON_COLORS } from './vehicles/moonCar.js';
import { createJeep, createSchoolBus, createSupercar } from './vehicles/cars.js';
import { createTungTungSahur } from './characters/tungTungSahur.js';
import { createTralaleroTralala } from './characters/tralaleroTralala.js';
import { createBombardiroCrocodilo } from './characters/bombardiroCrocodilo.js';
import { createBallerinaCappuccina } from './characters/ballerinaCappuccina.js';
import { createChimpanziniBananini } from './characters/chimpanziniBananini.js';
import { createGiantHammer, createGiantAxe, createSlapHand, createLavaPit, createStonePillar, createPipeGate } from './obstacles/obstacles.js';

// name -> { make(), group, frame: approx bounding radius for camera framing }
export const REGISTRY = {
  'moon-green':   { group: 'vehicles', make: () => createMoonCar({ color: 'green' }), frame: 2.2 },
  'moon-red':     { group: 'vehicles', make: () => createMoonCar({ color: 'red', seed: 8 }), frame: 2.2 },
  'moon-purple':  { group: 'vehicles', make: () => createMoonCar({ color: 'purple', seed: 5 }), frame: 2.2 },
  'moon-white':   { group: 'vehicles', make: () => createMoonCar({ color: 'white', seed: 12 }), frame: 2.2 },
  jeep:           { group: 'vehicles', make: createJeep, frame: 4 },
  'school-bus':   { group: 'vehicles', make: createSchoolBus, frame: 8 },
  supercar:       { group: 'vehicles', make: createSupercar, frame: 4.5 },
  'tung-tung':    { group: 'characters', make: createTungTungSahur, frame: 2.2 },
  tralalero:      { group: 'characters', make: createTralaleroTralala, frame: 2.4 },
  bombardiro:     { group: 'characters', make: createBombardiroCrocodilo, frame: 4.5 },
  ballerina:      { group: 'characters', make: createBallerinaCappuccina, frame: 2.0 },
  chimpanzini:    { group: 'characters', make: createChimpanziniBananini, frame: 2.2 },
  hammer:         { group: 'obstacles', make: () => createGiantHammer({ swing: false }), frame: 12 },
  axe:            { group: 'obstacles', make: createGiantAxe, frame: 12 },
  'slap-hand':    { group: 'obstacles', make: createSlapHand, frame: 7 },
  'lava-pit':     { group: 'obstacles', make: createLavaPit, frame: 10 },
  pillar:         { group: 'obstacles', make: createStonePillar, frame: 3 },
  'pipe-gate':    { group: 'obstacles', make: createPipeGate, frame: 6 },
};
export { MOON_COLORS };
