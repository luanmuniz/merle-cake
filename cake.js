// Import Three.js (ES6 module or script tag)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(
	75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 20;

// Create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function createCakeLayer(radiusTop, radiusBottom, height, yPosition, color) {
	const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32);
	const material = new THREE.MeshPhongMaterial({ color });
	const layer = new THREE.Mesh(geometry, material);
	layer.position.y = yPosition;
	return layer;
}

// Base layer
const baseLayer = createCakeLayer(7, 7, 4, 2, 0xffe0bd);
scene.add(baseLayer);

// Middle layer
const middleLayer = createCakeLayer(5, 5, 3, 5.5, 0xffd1dc);
scene.add(middleLayer);

// Top layer
const topLayer = createCakeLayer(3, 3, 2, 8, 0xffc0cb);
scene.add(topLayer);

function createCandle(x, y, z) {
	const candleGroup = new THREE.Group();

	// Candle body
	const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
	const candleMaterial = new THREE.MeshPhongMaterial({ color: 0xffffe0 });
	const candle = new THREE.Mesh(candleGeometry, candleMaterial);
	candle.position.set(x, y, z);

	// Flame
	const flameGeometry = new THREE.ConeGeometry(0.15, 0.3, 16);
	const flameMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
	const flame = new THREE.Mesh(flameGeometry, flameMaterial);
	flame.position.set(x, y + 1.15, z);

	candleGroup.add(candle);
	candleGroup.add(flame);

	return candleGroup;
}

// Add candles to the top layer
const candlePositions = [
	{ x: 0, z: 0 },
	{ x: 1, z: 1 },
	{ x: -1, z: -1 },
	{ x: -1, z: 1 },
	{ x: 1, z: -1 },
];

candlePositions.forEach((pos) => {
const candle = createCandle(pos.x, 10, pos.z);
	scene.add(candle);
});

// Example of applying a texture to a cake layer
// const loader = new THREE.TextureLoader();
// const cakeTexture = loader.load('./cake_texture.jpg');

// const texturedMaterial = new THREE.MeshStandardMaterial({ map: cakeTexture });
// baseLayer.material = texturedMaterial;

// Ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

// Directional light (simulating the candlelight)
const directionalLight = new THREE.DirectionalLight(0xffa500, 2);
directionalLight.position.set(0, 20, 10);
scene.add(directionalLight);

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

// Ensure objects cast and receive shadows
[baseLayer, middleLayer, topLayer].forEach((layer) => {
	layer.castShadow = true;
	layer.receiveShadow = true;
});

// Ground plane
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xe0e0e0 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = 0;
plane.receiveShadow = true;
scene.add(plane);

// Background color
scene.background = new THREE.Color(0xf0e68c);

// Animation function
(function animate() {
	requestAnimationFrame(animate);

	// Flicker effect
	scene.traverse((object) => {
		if (object.isMesh && object.geometry.type === 'ConeGeometry') {
			object.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.05;
		}
	});

	renderer.render(scene, camera);
})();
