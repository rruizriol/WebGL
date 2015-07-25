"use strict";

var canvas;
var gl;

var color = vec4(0.0, 0.0, 0.0, 1.0);
var colors = [];
var points = [];

var points_index = 0;
var redraw = false;

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
  
  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  
  canvas.addEventListener("mousedown", function(event) {

    if (!redraw) {
      points.push(computePoint(event, canvas));
      colors.push(color);
      redraw = true;
    }
  });

  canvas.addEventListener("mouseup", function(event) {
    // End line segment
    points.push(computePoint(event, canvas));
    colors.push(color);
    redraw = false;
  });

  // Handle mousemove event
  canvas.addEventListener("mousemove", function(event) {
    if (redraw) {
      // Compute and store new vertex
      points.push(computePoint(event, canvas));
      points.push(computePoint(event, canvas));
      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
      points_index = points.length-1;

      colors.push(color);
      colors.push(color);
      gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
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
  var rect = event.target.getBoundingClientRect();
  
  var x = ((event.clientX - rect.left) - canvas.width/2)/(canvas.width/2);
  var y = (canvas.height/2 - (event.clientY - rect.top))/(canvas.height/2);
  
  return vec2(x,y);
}

function setLineWidth() {
  var lineWidth = document.getElementById("lineWidth").value;
  gl.lineWidth(parseFloat(lineWidth));

}

function setColor() {
  var selectedColor = document.getElementById("color").value;
  
  var rgb = hexToRgb(selectedColor);
  color = vec4(rgb.r/255.0, rgb.g/255.0, rgb.b/255.0, 1.0);
}

function render() {  
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.LINES, 0, points_index);
  window.requestAnimFrame(render);
}

function clearDraw() {
  points = [];
  colors = [];
  points_index = 0;
}
