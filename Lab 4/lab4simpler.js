// Name: Matthew Strenk

var gl;
var numVertices;
var numTriangles;
var orthographicIsOn;
var myShaderProgram;
var Ialoc;
var Idloc;
var Isloc;

function initGL(){
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.enable(gl.DEPTH_TEST);
    gl.viewport( 0, 0, 512, 512 );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( myShaderProgram );

    
    numVertices = 2440;
    numTriangles = 4871;
    vertices = getVertices(); // vertices and faces are defined in object.js
    indexList = getFaces();
    
    
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);
    
    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var vertexPosition = gl.getAttribLocation(myShaderProgram,"vertexPosition");
    gl.vertexAttribPointer( vertexPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexPosition );
    
    var faceNormals=getFaceNormals(vertices, indexList, numTriangles);
    var vertexNormals=getVertexNormals(vertices, indexList, faceNormals, numVertices, numTriangles);

    var normalsbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexNormals), gl.STATIC_DRAW);

    var vertexNormalPointer = gl.getAttribLocation(myShaderProgram, "nv");
    gl.vertexAttribPointer(vertexNormalPointer, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexNormalPointer);

    var e = vec3(200, 0, 100);//eye
    var a = vec3(0.0, 0.0, 0.0);//at point
    var vup = vec3(0.0, 1.0, 0.0);//up vector
    var n = normalize( vec3(e[0]-a[0], e[1]-a[1], e[2]-a[2]));
    var u = normalize(cross(vup, n));
    var v = normalize(cross(n, u));
    var modelviewMatrix = [u[0], v[0], n[0], 0.0, 
                        u[1], v[1], n[1], 0.0,
                        u[2], v[2], n[2], 0.0,
                        -u[0]*e[0]-u[1]*e[1]-u[2]*e[2],
                        -v[0]*e[0]-v[1]*e[1]-v[2]*e[2],
                        -n[0]*e[0]-n[1]*e[1]-n[2]*e[2], 1.0];
    var modelviewMatrixInverseTranspose = [u[0], v[0], n[0], e[0],
                                u[1], v[1], n[1], e[1],
                                u[2], v[2], n[2], e[2],
                                0.0, 0.0, 0.0, 1.0];
    var modelviewMatrixLocation = gl.getUniformLocation(myShaderProgram, "M");
    gl.uniformMatrix4fv(modelviewMatrixLocation, false, modelviewMatrix);
    var modelviewMatrixInverseTransposeLocation = gl.getUniformLocation(myShaderProgram, "M_inversetranspose");
    gl.uniformMatrix4fv(modelviewMatrixInverseTransposeLocation, false, modelviewMatrixInverseTranspose);

    //projection matrix
    var left = -50.0;
    var right = 50.0;
    var top = 50.0;
    var bottom = -50.0;
    var near = 50.0;
    var far = 200.0;

    var orthographicProjectionMatrix = [2.0/(right-left), .0, .0, .0,
                                    0, 2.0/(top-bottom), .0, .0,
                                    .0, .0, -2.0/(far-near), .0,
                                    -(left+right)/(right-left), -(top+bottom)/(top-bottom), -(far+near)/(far-near), 1.0];
    var perpectiveProjectionMatrix = [2.0*near/(right-left), .0, .0, .0,
                                0, 2.0*near/(top-bottom), .0, .0,
                                (right+left)/(right-left), (top+bottom)/(top-bottom), -(far+near)/(far-near), -1.0,
                                .0, .0, -2.0*far*near/(far-near), .0];
    var orthographicProjectionMatrixLocation = gl.getUniformLocation(myShaderProgram, "P_orth");
    gl.uniformMatrix4fv(orthographicProjectionMatrixLocation, false, orthographicProjectionMatrix);
    var perpectiveProjectionMatrixLocation = gl.getUniformLocation(myShaderProgram, "P_persp");
    gl.uniformMatrix4fv(perpectiveProjectionMatrixLocation, false, perpectiveProjectionMatrix);

    orthographicIsOn = 1;
    orthographicIsOnLocation = gl.getUniformLocation(myShaderProgram, "orthIsOn");
    gl.uniform1f(orthographicIsOnLocation, orthographicIsOn);

    var kaloc = gl.getUniformLocation(myShaderProgram, "ka");
    var kdloc = gl.getUniformLocation(myShaderProgram, "kd");
    var ksloc = gl.getUniformLocation(myShaderProgram, "ks");
    gl.uniform3f(kaloc, 0.5, 0.5, 0.5);
    gl.uniform3f(kdloc, 0.5, 0.5, 0.5);
    gl.uniform3f(ksloc, 1.0, 1.0, 1.0);
    var alphaloc = gl.getUniformLocation(myShaderProgram, "alpha");
    gl.uniform1f(alphaloc, 4.0);

    var p0loc = gl.getUniformLocation(myShaderProgram, "p0");
    gl.uniform3f(p0loc, 0.0, 0.0, 45.0);
    Ialoc = gl.getUniformLocation(myShaderProgram, "Ia");
    Idloc = gl.getUniformLocation(myShaderProgram, "Id");
    Isloc = gl.getUniformLocation(myShaderProgram, "Is");
    gl.uniform3f(Ialoc, .1, .1, .1);
    gl.uniform3f(Idloc, .8, .8, .5);
    gl.uniform3f(Isloc, .8, .8, .8);


    drawObject();

};


function drawObject() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 );
    requestAnimFrame(drawObject);
}

function getFaceNormals(vertices, indexList, numTriangles){
    var faceNormals=[];
    for (var i = 0; i < numTriangles; i++){
        var p0 = vec3(vertices[indexList[3*i]][0],
                        vertices[indexList[3*i]][1],
                        vertices[indexList[3*i]][2]);
        var p1 = vec3(vertices[indexList[3*i+1]][0],
                        vertices[indexList[3*i+1]][1],
                        vertices[indexList[3*i+1]][2]);
        var p2 = vec3(vertices[indexList[3*i+2]][0],
                        vertices[indexList[3*i+2]][1],
                        vertices[indexList[3*i+2]][2]);
        var p1minusp0 = vec3( p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2]);
        var p2minusp0 = vec3( p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2]);
        var faceNormal = cross(p1minusp0, p2minusp0);
        faceNormal = normalize(faceNormal);
        faceNormals.push(faceNormal);
    }
    return faceNormals;
}//end function getFaceNormals

function getVertexNormals(vertices, indexList, faceNormals, numVertices, numTriangles){
    var vertexNormals=[];
    for (var j=0; j < numVertices; j++){
        var vertexNormal = vec3(0, 0, 0);
        for (var i = 0; i < numTriangles; i++){
            if (indexList[3*i]==j | indexList[3*i+1]==j | indexList[3*i+2]==j){
                vertexNormal[0] = vertexNormal[0] + faceNormals[i][0];
                vertexNormal[1] = vertexNormal[1] + faceNormals[i][1];
                vertexNormal[2] = vertexNormal[2] + faceNormals[i][2];
            }
        }
        vertexNormal = normalize(vertexNormal);
        vertexNormals.push(vertexNormal);
    }
    return vertexNormals;
}//end function getVertexNormals

function showOrthographic(){
    orthographicIsOn = 1;
    orthographicIsOnLocation = gl.getUniformLocation(myShaderProgram, "orthIsOn");
    gl.uniform1f(orthographicIsOnLocation, orthographicIsOn);
    console.log("orth");
}//end function showOrthographic

function showPerspective(){
    orthographicIsOn = 0;
    orthographicIsOnLocation = gl.getUniformLocation(myShaderProgram, "orthIsOn");
    gl.uniform1f(orthographicIsOnLocation, orthographicIsOn);
    console.log("persp");
}//end fucntion showPerspective

function toggleSpec(button){
    if (document.getElementById("1").value=="Specular On"){
        document.getElementById("1").value="Specular Off";
        gl.uniform3f(Isloc, .0, .0, .0); //specular part of incident light
    } 
    else if (document.getElementById("1").value=="Specular Off"){
        if(document.getElementById("2").value=="Point Light On"){
            document.getElementById("1").value="Specular On";
            gl.uniform3f(Isloc, .8, .8, .8); //specular part of incident light
        }
    }
}

function togglePoint(button){
    if (document.getElementById("2").value=="Point Light On"){
        document.getElementById("2").value="Point Light Off";
        gl.uniform3f(Ialoc, .0, .0, .0); //ambient part of incident light
        gl.uniform3f(Idloc, .0, .0, .0); //diffuse part of incident light
        gl.uniform3f(Isloc, .0, .0, .0); //specular part of incident light      
    }
    else if (document.getElementById("2").value=="Point Light Off"){
        document.getElementById("2").value="Point Light On";
        gl.uniform3f(Ialoc, .1, .1, .1); //ambient part of incident light
        gl.uniform3f(Idloc, .8, .8, .5); //diffuse part of incident light
        if (document.getElementById("1").value=="Specular On"){
            gl.uniform3f(Isloc, .8, .8, .8); //specular part of incident light
        }
    }
}
//could not get to work
function toggleSpot(button){
    if (document.getElementById("3").value=="Spotlight On"){
        document.getElementById("3").value="Spotlight Off";
        
    }
    else if (document.getElementById("3").value=="Spotlight Off"){
        document.getElementById("3").value="Spotlight On";
        
    }
}