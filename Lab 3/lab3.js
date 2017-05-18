// Matthew Strenk
// 3/5/17
// Computer Graphics
// Lab3: Javascript

var gl;
var myShaderProgram;
var alpha, beta, gamma;
var alphaLoc, betaLoc, gammaLoc;
var transX, transY;
var transXLoc, transYLoc;
var scaleX, scaleY;
var scaleXLoc, scaleYLoc;

function init(){
  var canvas = document.getElementById("gl-canvas");
  scaleX = 1;
  scaleY = 1;

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl){
    alert("WebGL is not available");
  }

  gl.viewport(0,0,512,512);
  gl.clearColor(0,0,0,1);

  gl.enable(gl.DEPTH_TEST);

  myShaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(myShaderProgram);

  scaleXLoc = gl.getUniformLocation(myShaderProgram, "scaleX");
  gl.uniform1f(scaleXLoc, scaleX);

  scaleYLoc = gl.getUniformLocation(myShaderProgram, "scaleY");
  gl.uniform1f(scaleYLoc, scaleY);
  drawShape();
}//end function init

function drawShape(){
  alpha = 0;
  beta = 0;
  gamma = 0;
  transX = 0;
  transY = 0;

  var vertices = [vec4(.3, -.3, 0, 1),
                  vec4(.3, .3, 0 , 1),
                  vec4(-.3, -.3, .3, 1),
                  vec4(0, 0, .6, 1)];

  var vertexColors = [vec4(0.0, 1.0, 0.0, 1.0),
                      vec4(1.0, 0.0, 0.0, 1.0),
                      vec4(0.0, 0.0, 1.0, 1.0),
                      vec4(1.0, 1.0, 0.0, 1.0)];

  var indexList = [0, 3, 2,
                 0, 1, 3,
                 3, 1, 2,
                 0, 2, 1];

  var iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indexList), gl.STATIC_DRAW);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

  var vertexColor = gl.getAttribLocation(myShaderProgram, "vertexColor");
  gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexColor);

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vertexPosition = gl.getAttribLocation(myShaderProgram, "vertexPosition");
  gl.vertexAttribPointer(vertexPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  render();
}//end function drawShape

function render(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var numVertices = 12;
  gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);
  requestAnimFrame(render);
}//end function render

function transformShapeKeys(event){
  var theKeyCode = event.keyCode;
  if (theKeyCode == 88){//x
    rotateX();
  } else if (theKeyCode == 89){//y
    rotateY();
  } else if (theKeyCode == 90){//z
    rotateZ();
  } else if (theKeyCode == 39){//Right Arrow
    transOnX();
  } else if (theKeyCode == 38){//Up Arrow
    transOnY();
  } else if (theKeyCode == 81){//q
    scaleOnX();
  } else if (theKeyCode == 69){//e
    scaleOnY();
  }
}//end function transformShapeKeys

function rotateX(){
  alpha += .1;
  alphaLoc = gl.getUniformLocation(myShaderProgram, "alpha");
  gl.uniform1f(alphaLoc, alpha);
}//end function rotateAroundX

function rotateY(){
  beta += .1;
  betaLoc = gl.getUniformLocation(myShaderProgram, "beta");
  gl.uniform1f(betaLoc, beta);
}//end function rotateAroundY

function rotateZ(){
  gamma += .1;
  gammaLoc = gl.getUniformLocation(myShaderProgram, "gamma");
  gl.uniform1f(gammaLoc, gamma);
}//end function rotateAroundZ

function transOnX(){
  transX += .1;
  transXLoc = gl.getUniformLocation(myShaderProgram, "transX");
  gl.uniform1f(transXLoc, transX);
}//end function transOnX

function transOnY(){
  transY += .1;
  transYLoc = gl.getUniformLocation(myShaderProgram, "transY");
  gl.uniform1f(transYLoc, transY);
}//end function transOnY

function scaleOnX(){
  scaleX += .1;
  scaleXLoc = gl.getUniformLocation(myShaderProgram, "scaleX");
  gl.uniform1f(scaleXLoc, scaleX);
}//end function scaleOnX

function scaleOnY(){
  scaleY += .1;
  scaleYLoc = gl.getUniformLocation(myShaderProgram, "scaleY");
  gl.uniform1f(scaleYLoc, scaleY);
}//end funtion scaleOnY
