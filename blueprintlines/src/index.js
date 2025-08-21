/* eslint-disable */
//if (!Detector.webgl) Detector.addGetWebGLMessage();

var camera, controls, scene, renderer;

init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  var container = document.getElementById("container");
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(400, 200, 0);

  // controls

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;

  controls.screenSpacePanning = false;

  controls.minDistance = 100;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;

  // world

  var canv = document.createElement("canvas");
  canv.width = canv.height = 256;
  var ctx = canv.getContext("2d");
  var mrnd = rng => (rng ? (Math.random() * rng) | 0 : Math.random());
  for (var i = 0; i < 100; i++) {
    ctx.fillStyle =
      "rgba(" +
      mrnd(256) +
      "," +
      mrnd(256) +
      "," +
      mrnd(256) +
      "," +
      mrnd() +
      ")";
    ctx.fillRect(mrnd(256), mrnd(256), mrnd(64), mrnd(64));
  }

  var material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    flatShading: true,
    wireframe: true,
    map: new THREE.Texture(canv, { wrapping: THREE.RepeatWrapping })
  });
  material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
  material.map.needsUpdate = true;

  var plane = new THREE.PlaneGeometry(1, 1);

  var mesh = new THREE.Mesh(
    //    new THREE.BoxGeometry(100, 100, 100, 100, 100, 100),
    new THREE.PlaneGeometry(100, 100),
    material
  );

  mesh.rotation.x += Math.PI * 0.5;

  console.log(mesh.geometry.faces.length * 3 * 3);

  scene.add(mesh);
new THREE.FileLoader().load("blueprintlines/geodata.json",function(data){
  data = JSON.parse(data);
  console.log("got data.");
  //ngeom.vertices.length = data.geometry.length*2;
  var vi=0;
  var points = new Array(data.geometry.length*2);
  for(var i=0;i<data.geometry.length;i++){
    var ln = data.geometry[i];
    points[i*2]=new THREE.Vector3(ln[0],0,ln[1]);
    points[(i*2)+1]=new THREE.Vector3(ln[2],0,ln[3]);
  }
  var ngeom = new THREE.BufferGeometry().setFromPoints( points );
  var nmesh = new THREE.LineSegments(ngeom);
  ngeom.computeBoundingBox();
  ngeom.boundingBox.getCenter(nmesh.position);
  //nmesh.rotation.x = Math.PI*0.5;
  nmesh.position.multiplyScalar(-1);
  nmesh.scale.multiplyScalar(1);
  for(var i=0;i<10;i++){
    for(var j=0;j<10;j++){
     var m = nmesh.clone();
     m.position.x+=i*300;
     m.position.z+=j*300;
       scene.add(m);
    }
  }
    console.log(i);
});

  // lights
  /*
  dont need lights....
  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  scene.add(light);

  var light = new THREE.DirectionalLight(0x002288);
  light.position.set(-1, -1, -1);
  scene.add(light);

  var light = new THREE.AmbientLight(0x222222);
  scene.add(light);
*/
  //

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();
}

function render() {
  renderer.render(scene, camera);
}

