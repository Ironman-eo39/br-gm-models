// Moon car: cratered sphere with angry glowing eyes, teeth grin and four small wheels.
// Ref: green/red/purple/cyan/yellow/white/black moon cars in the hammer/slap/axe clips.
import * as THREE from 'three';
import { mat, mesh, sphere, box, cyl, rng, animate } from '../core/util.js';

export const MOON_COLORS = {
  green: 0x2fd626, red: 0xd81f26, purple: 0xb21fd6, cyan: 0x22b8c8,
  yellow: 0xe8d22a, white: 0xcfc8b8, black: 0x2a2a2e, brown: 0x8a4a2a,
};

/** Cratered sphere geometry; per-vertex darkening inside craters. */
export function craterSphere(R, { seed = 3, craters = 90, depth = 0.1, faceDir = new THREE.Vector3(0, 0.05, 1) } = {}) {
  const geo = new THREE.SphereGeometry(R, 128, 96);
  const rand = rng(seed);
  const cs = [];
  for (let i = 0; i < craters; i++) {
    const d = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize();
    if (d.dot(faceDir.clone().normalize()) > 0.62) continue; // keep face area clean
    cs.push({ d, r: 0.07 + rand() * 0.2, k: 0.5 + rand() * 0.9 });
  }
  const p = geo.attributes.position, col = new Float32Array(p.count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize();
    let h = 0;
    for (const c of cs) {
      const a = Math.acos(Math.min(1, v.dot(c.d))) / c.r; // 0 center .. 1 rim
      if (a < 1) h -= c.k * (1 - a * a);                    // bowl
      else if (a < 1.3) h += c.k * 0.12 * Math.exp(-Math.pow((a - 1.1) * 5, 2)); // soft rim
    }
    h += 0.025 * Math.sin(v.x * 9 + v.y * 7) * Math.sin(v.z * 8 - v.y * 5); // gentle lumpiness
    h = THREE.MathUtils.clamp(h, -1.1, 0.35);
    v.multiplyScalar(R * (1 + depth * h));
    p.setXYZ(i, v.x, v.y, v.z);
    const shade = THREE.MathUtils.clamp(1 + h * 0.8, 0.28, 1.1);
    col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = shade;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  return geo;
}

function angryFace(R, eyeColor = 0xff4a12) {
  const g = new THREE.Group(); g.name = 'face';
  const dark = mat(0x120808, { roughness: 0.9 });
  const glow = mat(eyeColor, { emissive: eyeColor, emissiveIntensity: 1.2, roughness: 0.3 });
  for (const s of [-1, 1]) {
    const e = new THREE.Group();
    e.add(sphere(R * 0.17, dark, { scale: [1, 0.9, 0.5] }));                       // socket
    e.add(sphere(R * 0.12, glow, { pos: [0, 0, R * 0.035], scale: [1, 1, 0.6] }));  // glowing eye
    e.add(sphere(R * 0.045, mat(0x000000), { pos: [-s * R * 0.01, -R * 0.01, R * 0.085], scale: [1, 1, 0.5] })); // pupil
    e.add(box(R * 0.34, R * 0.07, R * 0.07, dark, { pos: [0, R * 0.17, R * 0.03], rot: [0, 0, s * -0.42] })); // angry brow
    e.position.set(s * R * 0.30, R * 0.20, R * 0.90);
    e.lookAt(e.position.clone().multiplyScalar(2));
    g.add(e);
  }
  // mouth: dark cavity + rows of teeth
  const mouth = new THREE.Group();
  mouth.add(sphere(R * 0.44, dark, { scale: [1, 0.42, 0.3] }));
  const tooth = mat(0xf2efe0, { roughness: 0.35 });
  for (let i = 0; i < 9; i++) {
    const x = (i - 4) * R * 0.09, k = 1 - Math.abs(i - 4) * 0.09;
    mouth.add(box(R * 0.08, R * 0.1 * k, R * 0.05, tooth, { pos: [x, R * 0.085, R * 0.07] }));
    mouth.add(box(R * 0.08, R * 0.09 * k, R * 0.05, tooth, { pos: [x + R * 0.045, -R * 0.075, R * 0.07] }));
  }
  const dir = new THREE.Vector3(0, -0.32, 0.95).normalize().multiplyScalar(R * 0.97);
  mouth.position.copy(dir);
  mouth.lookAt(dir.clone().multiplyScalar(2));
  g.add(mouth);
  return g;
}

export function createMoonCar({ radius = 1, color = 'green', seed = 3, eyeColor } = {}) {
  const R = radius, g = new THREE.Group(); g.name = `MoonCar_${color}`;
  const base = typeof color === 'string' ? MOON_COLORS[color] ?? 0x2fd626 : color;
  const body = mesh(craterSphere(R, { seed }), new THREE.MeshStandardMaterial({ color: base, vertexColors: true, roughness: 0.85 }), { name: 'body' });
  body.position.y = R * 0.92;
  const face = angryFace(R, eyeColor);
  body.add(face);
  g.add(body);

  // wheels
  const tire = mat(0x151515, { roughness: 0.9 }), rim = mat(0x8a8a90, { metalness: 0.6, roughness: 0.4 });
  const wr = R * 0.2, wheels = [];
  for (const [x, z] of [[-0.55, 0.45], [0.55, 0.45], [-0.55, -0.45], [0.55, -0.45]]) {
    const w = new THREE.Group();
    const t = cyl(wr, wr, R * 0.16, tire, { rot: [0, 0, Math.PI / 2] });
    const h = cyl(wr * 0.55, wr * 0.55, R * 0.18, rim, { rot: [0, 0, Math.PI / 2] });
    w.add(t, h);
    w.position.set(x * R, wr, z * R);
    g.add(w); wheels.push(w);
  }
  animate(g, (t, dt) => wheels.forEach(w => w.rotation.x += dt * 6));
  animate(g, t => { body.rotation.z = Math.sin(t * 3) * 0.03; });
  g.userData.radius = R;
  return g;
}
