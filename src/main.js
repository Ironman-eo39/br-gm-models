import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { REGISTRY } from './registry.js';
import { createRoadScene, setupEnvironment } from './scenes/roadScene.js';
import { tick } from './core/util.js';
import { createMoonCar } from './vehicles/moonCar.js';
import { createGiantHammer, createSlapHand, createStonePillar } from './obstacles/obstacles.js';
import { createTungTungSahur } from './characters/tungTungSahur.js';

const q = new URLSearchParams(location.search);
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 400);
const controls = new OrbitControls(camera, renderer.domElement);
let current = null, spin = true;

function frameObject(obj, dir) {
  const box = new THREE.Box3().setFromObject(obj), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  const dist = Math.max(size.y, size.x / camera.aspect, size.z * 0.6) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.35 + size.z * 0.5;
  camera.position.copy(c).add(new THREE.Vector3(...dir).normalize().multiplyScalar(dist)); controls.target.copy(c); controls.update();
}
function loadAsset(name) {
  if (current) scene.remove(current);
  const def = REGISTRY[name]; if (!def) return;
  scene.background = new THREE.Color(0x1d2230); scene.fog = null;
  current = def.make(); scene.add(current);
  frameObject(current, q.get('view') === 'front' ? [0, 0.15, 1] : [0.55, 0.35, 1]);
}
function loadRoadDemo() {
  const env = setupEnvironment(scene, renderer);
  scene.add(createRoadScene());
  current = new THREE.Group(); scene.add(current);
  const cols = ['purple', 'red', 'green', 'white'];
  cols.forEach((c, i) => { const m = createMoonCar({ color: c, seed: i * 3 + 2, radius: 1.0 + (i === 2 ? 0.5 : 0) }); m.position.set((i % 2 ? 1 : -1) * 1.4, 0, -i * 3.2); current.add(m); });
  const hammer = createGiantHammer(); hammer.position.set(-4.5, 0, -6); current.add(hammer);
  const tt = createTungTungSahur({ height: 6 }); tt.position.set(6.5, 0, -12); tt.rotation.y = -0.5; current.add(tt);
  const hand = createSlapHand({ scale: 1.2 }); hand.position.set(-9, 3, -22); current.add(hand);
  for (const s of [-1, 1]) { const p = createStonePillar(); p.position.set(s * 5.4, 0, -26); current.add(p); }
  camera.position.set(0, 4.6, 13); controls.target.set(0, 2.2, -10); controls.update();
  spin = false;
}

addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });

if (q.get('scene') === 'road') loadRoadDemo(); else {
  scene.add(new THREE.HemisphereLight(0xffffff, 0x445566, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 2.8); key.position.set(4, 8, 6); key.castShadow = true; scene.add(key);
  const rim = new THREE.DirectionalLight(0x88aaff, 1.2); rim.position.set(-5, 3, -6); scene.add(rim);
  renderer.shadowMap.enabled = true;
  scene.add(new THREE.Mesh(new THREE.CircleGeometry(30, 48), new THREE.MeshStandardMaterial({ color: 0x2a3140, roughness: 1 })).rotateX(-Math.PI / 2));
  const sel = document.getElementById('asset');
  for (const k of Object.keys(REGISTRY)) sel.add(new Option(`${REGISTRY[k].group} / ${k}`, k));
  sel.onchange = () => loadAsset(sel.value);
  const name = q.get('asset') || Object.keys(REGISTRY)[0]; sel.value = name; loadAsset(name);
}
if (q.get('ui') === '0') document.getElementById('ui').style.display = 'none';

const clock = new THREE.Clock(); let fixedT = q.has('t') ? parseFloat(q.get('t')) : null;
function frame() {
  const dt = clock.getDelta(), t = fixedT ?? clock.elapsedTime;
  if (current) { tick(current, t, fixedT != null ? 0.016 : dt); if (spin && fixedT == null) current.rotation.y += dt * 0.5; }
  controls.update(); renderer.render(scene, camera);
  window.__frames = (window.__frames || 0) + 1;
  requestAnimationFrame(frame);
}
frame();
