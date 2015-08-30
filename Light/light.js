var scene;
var camera;
var renderer;

var container;

var VIEW_ANGLE = 45

var WIDTH  = 800;
var HEIGHT = 600;

var NEAR = 0.1;
var FAR  = 10000;

var ZCAM = 50;

var SPHERE = "sphere";
var CUBE   = "cube"; 
var CONE   = "cone";
var CYLINDER = "cylinder";

var lights = [];

window.onload = function init() {

   printValue('posX','posXOutput');
   printValue('posY','posYOutput');
   printValue('height','heightOutput');
   printValue('radius','radiusOutput');
   printValue('angleX','angleXOutput');   
   printValue('angleY','angleYOutput');  
   
   container = document.getElementById("container");
   
   camera = new THREE.PerspectiveCamera(VIEW_ANGLE, WIDTH / HEIGHT, NEAR, FAR);
   
   renderer = new THREE.WebGLRenderer();
   renderer.setSize(WIDTH, HEIGHT );
   renderer.setClearColor(0x000000);
   
   container.appendChild(renderer.domElement);
   
   camera.position.z = ZCAM;
   
   clearCanvas();
   
   render();
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);     
}

function addFigure() {
  var figure = document.getElementById("figure").value; 
  
  if(figure == SPHERE) {
      addShere();
  }
  else if(figure == CUBE) {
      addCube();
  }
  else if(figure == CONE) {
      addCone();
  }
  else if(figure == CYLINDER) {
      addCylinder();
 }

}

function clearCanvas() {
  scene = new THREE.Scene();
  
  addAllLights();
}

function addShere() {

  var data = getAttributes();
  
  var spheregeometry = new THREE.SphereGeometry(data.radius, 32, 32);
  var spherematerial = new THREE.MeshPhongMaterial({wireframe: data.wired, color: data.color});
  var sphere = new THREE.Mesh(spheregeometry, spherematerial);
  
  sphere.position.set(data.x,data.y,0);  
  
  sphere.rotation.x = THREE.Math.degToRad(data.angleX);
  sphere.rotation.y = THREE.Math.degToRad(data.angleY);
   
  scene.add( sphere );
}

function addCone() {

   var data = getAttributes();

   var conegeometry = new THREE.CylinderGeometry(0, data.radius, data.height, 50, false);
   var conematerial = new THREE.MeshPhongMaterial({wireframe: data.wired, color: data.color});
   
   var cone = new THREE.Mesh(conegeometry, conematerial);
   
   cone.position.set(data.x,data.y,0);
   
   cone.rotation.x = THREE.Math.degToRad(data.angleX);
   cone.rotation.y = THREE.Math.degToRad(data.angleY);
         
   scene.add(cone);
}

function addCube() {
  var data = getAttributes();
  
  var cubegeometry = new THREE.BoxGeometry(data.height,data.height,data.height, 5, 5, 5);
  
  var cubematerial = new THREE.MeshPhongMaterial( {wireframe: data.wired, color: data.color  } );
  var cube = new THREE.Mesh( cubegeometry, cubematerial );
  
  cube.position.set(data.x,data.y,0);
  
  cube.rotation.x = THREE.Math.degToRad(data.angleX);
  cube.rotation.y = THREE.Math.degToRad(data.angleY);
  
  scene.add( cube );
}

function addCylinder(){

   var data = getAttributes();
   
   var cylindergeometry = new THREE.CylinderGeometry(data.radius, data.radius, data.height, 50, false);

   var cylindermaterial = new THREE.MeshPhongMaterial({wireframe: data.wired, color: data.color });
   var cylinder = new THREE.Mesh(cylindergeometry, cylindermaterial);
  
   cylinder.position.set(data.x,data.y,0);
   
   cylinder.rotation.x = THREE.Math.degToRad(data.angleX);
   cylinder.rotation.y = THREE.Math.degToRad(data.angleY);
   
   scene.add(cylinder);
}

function addAllLights() {

  addDefaultLights();
  addLights();
}

function addDefaultLights(){

  /*
  var ambLight = new THREE.AmbientLight(0x404040 ); 
  scene.add(ambLight);
  */

  var hemLight = new THREE.HemisphereLight(0xffffff, 0x404040, 1);
  scene.add(hemLight);  
}

function addLights() {

  addLight("light1", 0, {x: 0, y: 200, z: 0});
  addLight("light2", 1, {x: 100, y: 200, z: 100});
  addLight("light3", 2, {x: -100, y: -200, z: -100});  
}

function addLight(id, index, data) {

   var intensity = document.getElementById(id).checked ? 1: 0;

   lights[index] = new THREE.PointLight( 0xffffff, intensity, 0 );
   lights[index].position.set(data.x, data.y, data.z );     
   scene.add(lights[index]);
}

function changeLight(id, index) {
  var intensity = document.getElementById(id).checked ? 1: 0;
  lights[index].intensity  = intensity;
}

function getAttributes() {

   var xValue = document.getElementById("posX").value;
   var yValue = document.getElementById("posY").value;
   
   var heightValue  = document.getElementById("height").value;
   var radiusValue  = document.getElementById("radius").value;
   
   var angleXValue = document.getElementById("angleX").value;
   var angleYValue = document.getElementById("angleY").value;
   
   var colorValue = document.getElementById("color").value;
   
   var wiredValue = false;
   
   var pos = calculatePosition(parseInt(xValue), parseInt(yValue));
   
   return {
      x: pos.x,
      y: pos.y,
      radius: parseFloat(radiusValue),
      height: parseFloat(heightValue),
      angleX: parseInt(angleXValue),
      angleY: parseInt(angleYValue),
      color: colorValue,
      wired: wiredValue
   };
}

function calculatePosition(x, y) {

  var vector = new THREE.Vector3();
  vector.set(
      ( x / WIDTH ) * 2 - 1,
      - ( y / HEIGHT) * 2 + 1,
      0.5 );
  
  vector.unproject( camera );  
  var dir = vector.sub( camera.position ).normalize();
  var distance = - camera.position.z / dir.z;
  
  var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
  
  return pos;
}
