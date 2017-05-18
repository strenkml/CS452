// Matthew Strenk
// 2-6-17
// Lab1: Javascript

var canvas,gl,myShaderProgramTri,myShaderProgramDec,myShaderProgramEll;

function init(){
	canvas=document.getElementById("gl-canvas");
	gl=WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL is not avaliable"); }
	
	gl.viewport(0, 0, 512, 512);
	gl.clearColor(1.0, 0.5, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	myShaderProgramTri = initShaders(gl,"vertex-shader", "fragment-shader-triangle");
	gl.useProgram(myShaderProgramTri);
	drawTriangle();
	
	myShaderProgramDec = initShaders(gl,"vertex-shader", "fragment-shader-decagon");
	gl.useProgram(myShaderProgramDec);
	drawDecagon();
	
	myShaderProgramEll = initShaders(gl,"vertex-shader", "fragment-shader-ellipse");
	gl.useProgram(myShaderProgramEll);
	drawEllipse();
	
}

function drawTriangle() {
	
	var point0 = vec2(.3,0);
	var point1 = vec2(.4,.5);
	var point2 = vec2(.6,0);
	
	var arrayOfPointsForTriangle = [point0, point1, point2];
	
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(arrayOfPointsForTriangle), gl.STATIC_DRAW);
	
	var myPosition = gl.getAttribLocation(myShaderProgramTri, "myPosition");
	gl.vertexAttribPointer(myPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(myPosition);
	
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
}

function drawDecagon() {
	var decagonArray=[];
	var x,y,theta;
	var thetaStart = 0;
	var thetaEnd = 2* Math.PI;
	var n = 10;
	var thetaStep = (thetaEnd - thetaStart)/n;
	
	var myPoint;
	
	for (var i=0; i<n; i++){
		theta = thetaStart + i * thetaStep;
		x = -.3 + Math.cos( theta )/3;
		y = .5 + Math.sin( theta )/3;
		myPoint = vec2( x,y );
		decagonArray.push( myPoint );
	}
	
	var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    
    gl.bufferData( gl.ARRAY_BUFFER, flatten(decagonArray), gl.STATIC_DRAW  );
    
    var myPosition = gl.getAttribLocation( myShaderProgramDec, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );
	
	gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

function drawEllipse(){
	var ellipseArray=[];
	var x,y,theta;
	var thetaStart = 0;
	var thetaEnd = 2* Math.PI;
	var n = 1000;
	var thetaStep = (thetaEnd - thetaStart)/n;
	var a = 3;
	var b = 3;
	var c = 1;
	var d = 1.5;
	
	var myPoint;
	
	for (var i=0; i<n; i++){
		theta = thetaStart + i * thetaStep;
		x = .5 + c * Math.cos( theta ) / a;
		y = .2 + d * Math.sin( theta ) / b;
		myPoint = vec2( x,y );
		ellipseArray.push( myPoint );
	}
	
	var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    
    gl.bufferData( gl.ARRAY_BUFFER, flatten(ellipseArray), gl.STATIC_DRAW  );
    
    var myPosition = gl.getAttribLocation( myShaderProgramEll, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );
	
	gl.drawArrays(gl.LINE_STRIP, 0, n);
}