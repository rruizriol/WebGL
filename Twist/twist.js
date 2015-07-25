"use strict";

var canvas;
var gl;

var points = [];

var depth = 0;
var angle = 0.0;
var angleLoc;

var redLoc;
var greenLoc;
var blueLoc;

var bufferId;

var drawFilled = false;
var color = "";

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    angleLoc = gl.getUniformLocation(program, "angle");
    
    redLoc   = gl.getUniformLocation(program, "red");
    greenLoc = gl.getUniformLocation(program, "green");
    blueLoc  = gl.getUniformLocation(program, "blue");
    
    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
// this size is wrong; figure it out properly
    // number of triangles is 4^level
    // for lines, need 6 points per triangle
    // for triangle, need 3 points per triangle
    var bufferSize = 6 * Math.pow(4, 10);	// oversized?
    gl.bufferData( gl.ARRAY_BUFFER, bufferSize, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    document.getElementById("depth").onchange = function(event) {
       setDepthValue();
       render();
    };
    
    document.getElementById("angle").onchange = function(event) {
       setAngleValue();
       render();
    };
    
    document.getElementById("color").onchange = function(event) {
       setColor();
       render();
    };
    
    document.getElementById("filled").onchange = function(event) {
       setFillValue();
       render();
    };
    
    setDepthValue();
    setAngleValue();
    setColor();
    setFillValue(); 
    
    
    printValue('depth','depthOutput');
    printValue('angle','angleOutput');

    render();
};

function setDepthValue() {
  var value = document.getElementById("depth").value;
  depth     = parseInt(value);
}

function setAngleValue() {
  var value   = document.getElementById("angle").value;

  var degrees = parseInt(value);
  angle = Math.PI * degrees / 180.0;
}

function setColor() {
   color = document.getElementById("color").value;
}

function setFillValue() {
   drawFilled = document.getElementById("filled").checked;
}

function triangle( a, b, c )
{
   if (drawFilled) {
      points.push( a, b, c );
   }
   else {
     points.push(a, b, b, c, c, a);
   }
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count == 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles

	if (drawFilled) {
		divideTriangle( a, ab, ac, count );
		divideTriangle( c, ac, bc, count );
		divideTriangle( b, bc, ab, count );
		divideTriangle( ab, bc, ac, count );
        }
        else {
		divideTriangle( a, ab, ac, count );
		divideTriangle( c, ac, bc, count );
		divideTriangle( b, bc, ab, count );
		divideTriangle( ab, bc, ac, count );
        }
    }
}

function render()
{
    var vertices = [
        vec2(-Math.sqrt(3) / 2, -.5),
        vec2(0,  1),
        vec2(Math.sqrt(3) / 2, -.5)
    ];
    
    points = [];
    
    divideTriangle( vertices[0], vertices[1], vertices[2],
                    depth);

    var rgb = hexToRgb(color);
    
    gl.uniform1f(angleLoc, angle);
    
    gl.uniform1f(redLoc, rgb.r / 255.0);
    gl.uniform1f(greenLoc, rgb.g / 255.0);
    gl.uniform1f(blueLoc, rgb.b / 255.0);
           
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    gl.clear( gl.COLOR_BUFFER_BIT ); 
    
     
    if (drawFilled){
        gl.drawArrays( gl.TRIANGLES, 0, points.length );
    }
    else {
     	gl.drawArrays( gl.LINES, 0, points.length );
    }
    
    points = [];
}
