// import { Scene, PerspectiveCamera, WebGLRenderer, Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
// import { Interaction } from 'three.interaction';

// const path = "textures/";
// const format = '.jpg';
// const urls = [
// path + 'px' + format, path + 'nx' + format,
// path + 'py' + format, path + 'ny' + format,
// path + 'pz' + format, path + 'nz' + format
// ];

// const textureCube = new THREE.CubeTextureLoader().load( urls );
// textureCube.format = THREE.RGBFormat;

const scene = new THREE.Scene();
// scene.background = textureCube;

// const interaction = new Interaction(renderer, scene, camera);


var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

scene.background = new THREE.Color(0x13003b);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

const group = new THREE.Object3D();

const geometry = new THREE.SphereGeometry(5, 32, 32);

// const shader = THREE.FresnelShader;
// const uniforms = THREE.UniformsUtils.clone(shader.uniforms);

const loader = new THREE.TextureLoader();
loader.setCrossOrigin("");
const matcap = loader.load("matcap2.jpg");

const material = new THREE.ShaderMaterial({
  transparent: true,
  side: THREE.DoubleSide,
  uniforms: {
    tMatCap: { type: "t", value: matcap }
  },
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
  flatShading: THREE.SmoothShading
});

const sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);

const topgeometry = new THREE.SphereGeometry(7, 32, 32);
const topmaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  transparent: true,
  opacity: 0.2
});

const topsphere = new THREE.Mesh(topgeometry, topmaterial);
// scene.add(topsphere);

topsphere.position.z = 0

// console.log(topsphere)
group.add(sphere)
group.add(topsphere)

scene.add(group);

camera.position.z = -5;

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

const time = performance.now() * 0.01;

const update = function() {
  let k = 2;
  for (let i = 0; i < sphere.geometry.vertices.length; i++) {
    let p = sphere.geometry.vertices[i];
    let d = topsphere.geometry.vertices[i];
    p.normalize().multiplyScalar(
      1 + 0.05 * noise.perlin3(p.x * k + time, p.y * k, p.z * k)
    );
    d.normalize().multiplyScalar(
      1 + 0.05 * noise.perlin3(p.x * k + time, p.y * k, p.z * k)
    );
  }
};


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

  sphere.rotation.y += 0.015;
  // topsphere.rotation.y += 0.015;

  renderer.render(scene, camera);
};

animate();
