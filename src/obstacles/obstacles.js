// Road obstacles from the refs: giant hammer, giant axe, slapping hand, lava pit w/ screaming face, pipe gate, stone pillars.
import * as THREE from 'three';
import { mat, mesh, sphere, cyl, box, limb, lathe, canvasTex, rng, animate, eye } from '../core/util.js';

const wood = () => mat(0x8a5a2b, { roughness: 0.7 });
const steel = () => mat(0x8f979e, { metalness: 0.85, roughness: 0.32 });

/** Giant hammer. Pivot at the handle end; swings down toward +Z road. */
export function createGiantHammer({ length = 9, swing = true } = {}) {
  const g = new THREE.Group(); g.name = 'GiantHammer';
  const arm = new THREE.Group(); g.add(arm);
  arm.add(cyl(0.22, 0.28, length, wood(), { pos: [0, length / 2, 0] }));                   // handle
  arm.add(box(1.8, 1.3, 1.3, steel(), { pos: [0, length, 0] }));                           // head
  for (const s of [-1, 1]) arm.add(box(0.15, 1.35, 1.35, mat(0x5b6168, { metalness: 0.8, roughness: 0.4 }), { pos: [s * 0.9, length, 0] }));
  arm.add(cyl(0.3, 0.3, 0.5, mat(0x2d2d2d), { pos: [0, 0.2, 0] }));                         // grip
  arm.rotation.x = -0.6;
  if (swing) animate(g, t => { arm.rotation.x = -0.15 - (0.5 + 0.5 * Math.sin(t * 2.0)) * 1.1; });
  return g;
}

/** Giant axe: wooden haft + curved steel blade. */
export function createGiantAxe({ length = 9 } = {}) {
  const g = new THREE.Group(); g.name = 'GiantAxe';
  const arm = new THREE.Group(); g.add(arm);
  arm.add(cyl(0.2, 0.26, length, wood(), { pos: [0, length / 2, 0] }));
  const s = new THREE.Shape(); s.moveTo(0, 0); s.quadraticCurveTo(1.6, -0.2, 2.2, -1.5); s.lineTo(2.2, 1.5); s.quadraticCurveTo(1.6, 0.4, 0, 0.55); s.lineTo(0, 0);
  const blade = mesh(new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 3 }), steel(), { pos: [0.2, length - 0.4, -0.1], rot: [0, 0, 0] });
  blade.geometry.translate(0, 0, 0); arm.add(blade);
  arm.add(box(0.5, 1.1, 0.5, steel(), { pos: [0, length - 0.4, 0] }));
  arm.rotation.x = -0.4;
  animate(g, t => { arm.rotation.x = -0.1 - (0.5 + 0.5 * Math.sin(t * 1.8)) * 1.2; });
  return g;
}

/** Giant slapping hand (flat palm, 4 fingers + thumb), skin tone. */
export function createSlapHand({ scale = 1 } = {}) {
  const g = new THREE.Group(); g.name = 'SlapHand';
  const skin = mat(0xe8b896, { roughness: 0.55 });
  const hand = new THREE.Group(); g.add(hand);
  hand.add(mesh(new THREE.CapsuleGeometry(0.9, 1.2, 8, 20), skin, { scale: [1, 1, 0.28], rot: [0, 0, Math.PI / 2], pos: [0, 0, 0] })); // palm
  [-0.78, -0.26, 0.26, 0.78].forEach((x, i) => {
    const len = 2.2 - Math.abs(i - 1.5) * 0.15;
    hand.add(mesh(new THREE.CapsuleGeometry(0.26, len, 6, 12), skin, { pos: [1.7 + len / 2, 0, x * 0.9], rot: [0, 0, Math.PI / 2], scale: [1, 1, 0.55] }));
  });
  hand.add(mesh(new THREE.CapsuleGeometry(0.28, 1.2, 6, 12), skin, { pos: [0.6, 0, -1.55], rot: [0, 0.7, Math.PI / 2], scale: [1, 1, 0.55] }));   // thumb
  hand.add(mesh(new THREE.CapsuleGeometry(0.62, 3, 8, 16), skin, { pos: [-2.8, 0, 0], rot: [0, 0, Math.PI / 2] }));                               // forearm
  g.scale.setScalar(scale);
  animate(g, t => { hand.rotation.z = Math.sin(t * 2.5) * 0.15; hand.position.z = Math.sin(t * 2.5) * 2; });
  return g;
}

/** Lava pit with a giant screaming face rising from it. */
export function createLavaPit({ w = 8, d = 12 } = {}) {
  const g = new THREE.Group(); g.name = 'LavaPit';
  const r = rng(9);
  const tex = canvasTex(512, (c, s) => {
    c.fillStyle = '#c4200b'; c.fillRect(0, 0, s, s);
    c.strokeStyle = '#ffd21a'; c.lineWidth = 7; c.lineCap = 'round';
    for (let i = 0; i < 26; i++) { c.beginPath(); let x = r() * s, y = r() * s; c.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (r() - 0.5) * 120; y += (r() - 0.5) * 120; c.lineTo(x, y); } c.stroke(); }
    c.strokeStyle = '#ff7a0e'; c.lineWidth = 14; c.globalAlpha = 0.35; for (let i = 0; i < 14; i++) { c.beginPath(); c.arc(r() * s, r() * s, 30 + r() * 60, 0, 7); c.stroke(); }
  });
  g.add(mesh(new THREE.BoxGeometry(w, 0.15, d), mat(0xffffff, { map: tex, emissive: 0xff4a00, emissiveMap: tex, emissiveIntensity: 0.6 }), { pos: [0, 0.075, 0] }));
  // face: pale head, big red lips, wide eyes
  const face = new THREE.Group(); face.position.set(0, 0.2, -d * 0.15); g.add(face);
  const skin = mat(0xf2d2c0, { roughness: 0.45 });
  face.add(sphere(w * 0.5, skin, { scale: [1, 0.5, 1.15], pos: [0, 0.3, 0] }));
  for (const s of [-1, 1]) {
    const e = eye(0.8, { pupil: 0.45, look: [0, 0.1] }); e.position.set(s * 1.5, 2.3, -w * 0.05); e.rotation.x = -1.2; face.add(e);
  }
  face.add(mesh(new THREE.TorusGeometry(1.7, 0.6, 12, 28), mat(0xd01030, { roughness: 0.3 }), { pos: [0, 1.2, w * 0.3], rot: [-1.0, 0, 0], scale: [1, 0.6, 1] })); // open mouth ring
  face.add(mesh(new THREE.CircleGeometry(1.7, 28), mat(0x2a0810), { pos: [0, 1.28, w * 0.3], rot: [-1.0, 0, 0], scale: [1, 0.6, 1] }));
  animate(g, t => { face.position.y = 0.2 + Math.sin(t * 2) * 0.12; });
  return g;
}

/** Concrete/stone pillar with wood bands (road gate posts). */
export function createStonePillar() {
  const g = new THREE.Group(); g.name = 'StonePillar';
  const stone = mat(0xa7a7a2, { roughness: 0.95 }), band = mat(0xc08a3e, { roughness: 0.6 });
  const r = rng(4);
  for (let i = 0; i < 4; i++) g.add(box(1.3 + r() * 0.1, 0.62, 1.3 + r() * 0.1, stone, { pos: [0, 0.31 + i * 0.64, 0], rot: [0, r() * 0.15, 0] }));
  g.add(box(1.38, 0.18, 1.38, band, { pos: [0, 1.28, 0] }), box(1.38, 0.18, 1.38, band, { pos: [0, 0.64, 0] }));
  return g;
}

/** Concrete pipe tunnel with a barred gate (ref: cage tunnel under the road). */
export function createPipeGate({ r = 3.2, len = 4 } = {}) {
  const g = new THREE.Group(); g.name = 'PipeGate';
  const con = mat(0xd9d4c4, { roughness: 0.9, side: THREE.DoubleSide });
  g.add(mesh(new THREE.CylinderGeometry(r, r, len, 40, 1, true), con, { rot: [Math.PI / 2, 0, 0], pos: [0, r, 0] }));
  g.add(mesh(new THREE.TorusGeometry(r + 0.12, 0.28, 12, 40), con, { pos: [0, r, len / 2] }));
  const bar = mat(0x4a4a46, { metalness: 0.6, roughness: 0.5 });
  for (let i = -5; i <= 5; i++) { const x = i * r * 0.17, h = Math.sqrt(Math.max(r * r - x * x, 0)) * 2; g.add(cyl(0.05, 0.05, h, bar, { pos: [x, r, len / 2 - 0.1] })); }
  g.add(mesh(new THREE.TorusGeometry(r * 0.99, 0.06, 8, 40), bar, { pos: [0, r, len / 2 - 0.1] }));
  return g;
}
