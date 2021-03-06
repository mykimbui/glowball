const scene = new THREE.Scene();
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

scene.background = new THREE.Color(0x13003b);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const interaction = new THREE.Interaction(renderer, scene, camera);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xff0000);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

const group = new THREE.Object3D();

const geometry = new THREE.SphereGeometry(1, 32, 32);

const loader = new THREE.TextureLoader();
loader.setCrossOrigin("");
const matcap = loader.load("matcap2.jpg");
const matcaptop = loader.load("matcap-top.png");

const material = new THREE.ShaderMaterial({
  transparent: true,
  side: THREE.DoubleSide,
  uniforms: {
    tMatCap: { type: "t", value: matcap },
    uOpacity: 0.1
  },
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
  flatShading: THREE.SmoothShading
});

const sphere = new THREE.Mesh(geometry, material);

const topgeometry = new THREE.SphereGeometry(1, 32, 32);
const topmaterial = new THREE.ShaderMaterial({
  uniforms: {
    tMatCap: { type: "t", value: matcaptop }
  },
  fragmentShader: document.getElementById("fragmentShader").textContent,
  vertexShader: document.getElementById("vertexShader").textContent,
  transparent: true,
  blending: THREE.AdditiveBlending
});

const topsphere = new THREE.Mesh(topgeometry, topmaterial);
topsphere.material.side = THREE.DoubleSide;

var customMaterial = new THREE.ShaderMaterial({
  uniforms: {
    c: { type: "f", value: 0.3 },
    p: { type: "f", value: 1.3 },
    glowColor: { type: "c", value: new THREE.Color(0xba00c2) },
    viewVector: { type: "v3", value: camera.position }
  },
  vertexShader: document.getElementById("gvertexShader").textContent,
  fragmentShader: document.getElementById("gfragmentShader").textContent,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true
});

var glowMesh = new THREE.Mesh(geometry, customMaterial.clone());
glowMesh.position = sphere.position;
glowMesh.scale.multiplyScalar(1.21);

group.add(sphere);
group.add(topsphere);
group.add(glowMesh);

scene.add(group);

camera.position.z = -5;

topsphere.cursor = "pointer";
sphere.cursor = "pointer";

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
document.addEventListener("mousemove", onDocumentMouseMove, false);

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * 10;
  mouseY = (event.clientY - windowHalfY) * 10;
}

let k = 3;
let a = 0;
let g = 2;

const update = function() {
  const time = performance.now() * 0.001;
  for (let i = 0; i < sphere.geometry.vertices.length; i++) {
    let p = sphere.geometry.vertices[i];
    let d = topsphere.geometry.vertices[i];
    p.normalize().multiplyScalar(
      1 + 0.05 * noise.perlin3(p.x * k + time, p.y * k, p.z * k)
    );
    d.normalize().multiplyScalar(
      1.15 + a + 0.08 * noise.perlin3(p.x * g + time, p.y * g, p.z * g)
    );
  }
};

topsphere.on("click", function() {
  k += 1;
  a += 0.1;
  g += 2;
  console.log(a);
});

const animate = function() {
  requestAnimationFrame(animate);

  update();
  onWindowResize();
  controls.update();

  sphere.geometry.computeVertexNormals();
  sphere.geometry.normalsNeedUpdate = true;
  sphere.geometry.verticesNeedUpdate = true;

  topsphere.geometry.computeVertexNormals();
  topsphere.geometry.normalsNeedUpdate = true;
  topsphere.geometry.verticesNeedUpdate = true;

  sphere.rotation.y += 0.01;
  topsphere.rotation.y += 0.03;

  renderer.render(scene, camera);
};

animate();
