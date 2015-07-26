"use strict";

var canvas;
var gl;

var color = vec4(0.0, 0.0, 0.0, 1.0);
var colors = [];
var points = [];

var draw = false;
var lineWidth = 2.0
var currentPoints = [];

var vBuffer;
var cBuffer;
var maxPoints = 200000;

// Initialize window
window.onload = function init() {

  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }


  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.9, 0.9, 0.9, 1.0);
  

  //  Load shaders and initialize attribute buffers
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
  
  vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * maxPoints, gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * maxPoints, gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  
  canvas.addEventListener("mousedown", function(event) {
    draw = true;
  });

  canvas.addEventListener("mouseup", function(event) {
    draw = false;
    currentPoints = [];
  });

  // Handle mousemove event
  canvas.addEventListener("mousemove", function(event) {
    if (draw) {
       var point = computePoint(event, canvas);
       currentPoints.push(point);
       
       render();
    }
  });
  
  document.getElementById("color").onchange = function(event) {
      setColor();
  };
      
  document.getElementById("lineWidth").onchange = function(event) {
      setLineWidth();
  };
  
  setLineWidth();
  setColor();
  
  printValue('lineWidth','lineWidthOutput');
  
  render();
}

function computePoint(event, canvas) {
  var x = -1 + 2*event.offsetX/canvas.width;
  var y = -1 + 2*(canvas.height - event.offsetY)/canvas.height;
  
  return vec2(x,y);
}

function setLineWidth() {
  var value = document.getElementById("lineWidth").value;
  lineWidth = parseFloat(value);  
}

function setColor() {
  var selectedColor = document.getElementById("color").value;
  
  var rgb = hexToRgb(selectedColor);
  color = vec4(rgb.r/255.0, rgb.g/255.0, rgb.b/255.0, 1.0);
}

function render() {  
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  if (currentPoints.length == 2) {
  
     var tempPts = buildLine(currentPoints[0], currentPoints[1]);
     
     points.push(tempPts[0], tempPts[1], tempPts[2], tempPts[3]);
  
     for (var i = 0; i < 4; ++i) {
         colors.push(color);
     }
     
     currentPoints.shift();
  }
  
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(colors));
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
  
  for (var i = 0; i < points.length / 4; i++) {
     gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
}

function buildLine(begin, end)
{
    var width = lineWidth * 0.001;
    var beta = (Math.PI/2.0) - Math.atan2(end[1] - begin[1], end[0] - begin[0]);
    var delta_x = Math.cos(beta)*width;
    var delta_y = Math.sin(beta)*width;
    return [vec2(begin[0] - delta_x, begin[1] + delta_y),
            vec2(begin[0] + delta_x, begin[1] - delta_y),
            vec2(end[0] + delta_x, end[1] - delta_y),
            vec2(end[0] - delta_x, end[1] + delta_y)];
}

function clearDraw() {
  points = [];
  colors = [];
  currentPoints = [];
  
  render();
}





