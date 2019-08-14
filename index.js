// var path = "textures/";
// var format = '.jpg';
// var urls = [
// path + 'px' + format, path + 'nx' + format,
// path + 'py' + format, path + 'ny' + format,
// path + 'pz' + format, path + 'nz' + format
// ];

// var textureCube = new THREE.CubeTextureLoader().load( urls );
// textureCube.format = THREE.RGBFormat;

var scene = new THREE.Scene();
// scene.background = textureCube;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

scene.background = new THREE.Color(0x13003b);

var camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

var geometry = new THREE.SphereGeometry(10, 128, 128);

// var shader = THREE.FresnelShader;
// var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

var loader = new THREE.TextureLoader();
loader.setCrossOrigin("");
var matcap = loader.load("matcap2.jpg");

var material = new THREE.ShaderMaterial({
  transparent: true,
  side: THREE.DoubleSide,
  uniforms: {
    tMatCap: { type: "t", value: matcap }
  },
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
  flatShading: THREE.SmoothShading
});

var sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);

var topgeometry = new THREE.SphereGeometry(10, 128, 128);
var topmaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 1
});

var topsphere = new THREE.Mesh(topgeometry, topmaterial);
scene.add(topsphere);

console.log(topsphere)

camera.position.z = 5;

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

var time = performance.now() * 0.01;

var update = function() {
  var k = 2;
  for (var i = 0; i < sphere.geometry.vertices.length; i++) {
    var p = sphere.geometry.vertices[i];
    p.normalize().multiplyScalar(
      1 + 0.05 * noise.perlin3(p.x * k + time, p.y * k, p.z * k)
    );
  }
};

var animate = function() {
  requestAnimationFrame(animate);

  update();
  onWindowResize();
  controls.update();

  sphere.geometry.computeVertexNormals();
  sphere.geometry.normalsNeedUpdate = true;
  sphere.geometry.verticesNeedUpdate = true;

  sphere.rotation.y += 0.015;

  renderer.render(scene, camera);
};

animate();
