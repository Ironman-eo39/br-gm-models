# Brainrot game models (three.js, procedural)

Run: `npm install && npm start`, open http://localhost:8123/index.html
- Dropdown = asset viewer (orbit with mouse). `?asset=tralalero` direct link. `?scene=road` = portrait road demo.
- Units meters, Y up, models face +Z, origin on ground.
- Each model: `createX(options)` returns `THREE.Group`; animate via `tick(group, t, dt)` from `src/core/util.js`.
- Add asset: write factory, register in `src/registry.js`.
- Screenshots: `npm run shots` (needs playwright + chrome path in `tools/shot.mjs`).

## Done
Characters: tung-tung, tralalero, bombardiro, ballerina, chimpanzini.
Vehicles: moon cars (8 colors), jeep, school bus, supercar.
Obstacles: hammer, axe, slap hand, lava pit, pillar, pipe gate.
Scene: road, hills, trees, pylons, sky.

## Approximations / todo
- Single-image refs: back/side geometry invented.
- Tralalero belly too white, sneaker original (no brand mark).
- Chimpanzini banana flat, needs ridges + peel.
- Supercar reads as open-wheel; needs wedge body.
- Lava face weak. Missing: pink/clown/yellow moon faces, giant muscle wooden man, Ronaldo-style hands wall, rest of roster (pineapple, avocado, watermelon, etc.), squid-bridge scene.
- No physics, no gameplay.
