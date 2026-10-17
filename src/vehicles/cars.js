// Kenney-style low-poly cars: Jeep, School Bus, Supercar. Faces +Z; wheels rest on y=0.
import * as THREE from 'three';
import { mat, mesh, box, cyl, sphere, capsule, animate } from '../core/util.js';

function wheel(r, w, spokes = 5) {
  const g = new THREE.Group();
  g.add(cyl(r, r, w, mat(0x1c1c1c, { roughness: 0.9 }), { rot: [0, 0, Math.PI / 2] }));
  g.add(cyl(r * 0.58, r * 0.58, w * 1.04, mat(0xc9ccd2, { metalness: 0.6, roughness: 0.35 }), { rot: [0, 0, Math.PI / 2] }));
  g.add(cyl(r * 0.2, r * 0.2, w * 1.1, mat(0x555a60), { rot: [0, 0, Math.PI / 2] }));
  g.userData.spin = true; return g;
}
const spinWheels = (car) => animate(car, (t, dt) => car.traverse(o => { if (o.userData.spin) o.rotation.x += dt * 8; }));
const glass = () => mat(0x9fd6ef, { roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.8 });
export function createJeep({ color = 0xf5c400 } = {}) {
  const g = new THREE.Group(); g.name = 'Jeep';
  const body = mat(color, { roughness: 0.35 }), dark = mat(0x2a2a2e), trim = mat(0x3d2a2a);
  g.add(box(1.6, 0.45, 3.2, body, { pos: [0, 0.65, 0] }));                            // lower body
  g.add(box(1.5, 0.1, 1.0, dark, { pos: [0, 0.9, 0.95] }));                           // hood plate
  g.add(box(1.5, 0.75, 1.5, body, { pos: [0, 1.12, -0.45] }));                         // cabin
  g.add(box(1.38, 0.5, 0.05, glass(), { pos: [0, 1.2, 0.33], rot: [-0.25, 0, 0] }));   // windshield
  for (const s of [-1, 1]) g.add(box(0.05, 0.45, 1.1, glass(), { pos: [s * 0.76, 1.2, -0.45] }));
  g.add(box(1.7, 0.12, 0.2, dark, { pos: [0, 0.4, 1.7] }), box(1.7, 0.12, 0.2, dark, { pos: [0, 0.4, -1.7] })); // bumpers
  for (const s of [-1, 1]) g.add(sphere(0.12, mat(0xfff7c8, { emissive: 0xffee99, emissiveIntensity: 0.6 }), { pos: [s * 0.55, 0.72, 1.62] }));
  g.add(cyl(0.34, 0.34, 0.12, dark, { pos: [0, 1.0, -1.72], rot: [Math.PI / 2, 0, 0] }));  // spare tire
  for (const [x, z] of [[-0.85, 1.05], [0.85, 1.05], [-0.85, -1.05], [0.85, -1.05]]) { const w = wheel(0.42, 0.34); w.position.set(x, 0.42, z); g.add(w); }
  spinWheels(g); return g;
}

export function createSchoolBus() {
  const g = new THREE.Group(); g.name = 'SchoolBus';
  const yellow = mat(0xf6b800, { roughness: 0.4 }), black = mat(0x151515), tire = mat(0x1c1c1c);
  g.add(box(2.2, 1.8, 7.0, yellow, { pos: [0, 1.35, 0] }));
  g.add(box(2.0, 1.0, 1.2, yellow, { pos: [0, 0.95, 3.9] }));                           // hood
  for (let i = 0; i < 6; i++) for (const s of [-1, 1]) g.add(box(0.04, 0.55, 0.8, glass(), { pos: [s * 1.11, 1.75, -2.6 + i * 0.95] })); // side windows
  g.add(box(1.9, 0.65, 0.05, glass(), { pos: [0, 1.75, 3.5] }));                         // windshield
  for (const s of [-1, 1]) { g.add(box(0.05, 0.1, 6.6, black, { pos: [s * 1.11, 1.1, -0.1] })); g.add(box(0.05, 0.08, 6.6, black, { pos: [s * 1.11, 1.9 - 0.45, -0.1] })); }
  g.add(box(2.3, 0.2, 0.3, mat(0x333333), { pos: [0, 0.55, 4.5] }), box(2.3, 0.2, 0.3, mat(0x333333), { pos: [0, 0.55, -3.6] }));
  for (const s of [-1, 1]) g.add(sphere(0.14, mat(0xfff4c0, { emissive: 0xffee99, emissiveIntensity: 0.6 }), { pos: [s * 0.7, 0.9, 4.5] }));
  for (const z of [2.4, -1.9]) for (const s of [-1, 1]) { const w = wheel(0.55, 0.42); w.position.set(s * 1.0, 0.55, z); g.add(w); }
  spinWheels(g); return g;
}

export function createSupercar({ color = 0xff5a14 } = {}) {
  const g = new THREE.Group(); g.name = 'Supercar';
  const body = mat(color, { roughness: 0.2, metalness: 0.35 }), dark = mat(0x111214, { roughness: 0.4 });
  g.add(mesh(new THREE.CapsuleGeometry(0.55, 3.0, 10, 24), body, { pos: [0, 0.5, 0], rot: [Math.PI / 2, 0, 0], scale: [1, 1, 0.38] }));  // wedge hull
  g.add(box(1.9, 0.12, 4.0, body, { pos: [0, 0.38, 0], scale: [1, 1, 1] }));
  g.add(mesh(new THREE.SphereGeometry(0.62, 32, 20), glass(), { pos: [0, 0.78, -0.1], scale: [1.0, 0.55, 1.55] }));                            // canopy
  g.add(box(1.7, 0.05, 0.4, dark, { pos: [0, 0.95, -1.95] }), box(0.08, 0.28, 0.2, dark, { pos: [-0.7, 0.8, -1.95] }), box(0.08, 0.28, 0.2, dark, { pos: [0.7, 0.8, -1.95] })); // spoiler
  for (const s of [-1, 1]) {
    g.add(box(0.28, 0.06, 0.12, mat(0xfff7c8, { emissive: 0xffee99, emissiveIntensity: 0.8 }), { pos: [s * 0.6, 0.55, 2.0], rot: [0, s * 0.25, 0] }));
    g.add(box(0.5, 0.04, 0.5, dark, { pos: [s * 0.95, 0.6, 0.5], rot: [0, 0, s * 0.2] })); // side intake
    g.add(box(0.06, 0.4, 1.0, body, { pos: [s * 1.0, 0.9, 0.7], rot: [0.0, 0, s * -0.55] })); // butterfly door (open)
  }
  for (const [x, z] of [[-0.95, 1.25], [0.95, 1.25], [-0.95, -1.2], [0.95, -1.2]]) { const w = wheel(0.4, 0.38); w.position.set(x, 0.4, z); g.add(w); }
  spinWheels(g); return g;
}
