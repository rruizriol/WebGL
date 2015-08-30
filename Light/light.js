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
   
   scene = new THREE.Scene();
   camera = new THREE.PerspectiveCamera(VIEW_ANGLE, WIDTH / HEIGHT, NEAR, FAR);
   
   renderer = new THREE.WebGLRenderer();
   renderer.setSize(WIDTH, HEIGHT );
   renderer.setClearColor(0xcccccc);
   
   container.appendChild(renderer.domElement);
   
   camera.position.z = ZCAM;
   
   addLights();
   
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
  
  addLights();
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

function addLights() {

  var ambLight = new THREE.AmbientLight(0x404040 ); 
  scene.add(ambLight);

  lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[1] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[2] = new THREE.PointLight( 0xffffff, 1, 0 );
     			
  lights[0].position.set( 0, 200, 0 );
  lights[1].position.set( 100, 200, 100 );
  lights[2].position.set( -100, -200, -100 );
     
  scene.add( lights[0] );
  scene.add( lights[1] );
  scene.add( lights[2] );
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
