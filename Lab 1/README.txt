Matthew Strenk
2/6/17

The lab was to create 3 2D shapes inside a canvas.  One of the shapes had to be an ellipse, one could be 4 or
less vertices, and the other needs to be more than 4 vertices.  I decided to make an elipse, a triangle, and
a decagon.  The triangle was created using 3 points, and was drawn using TRIANGLE_FAN.  The decagon was created
by making a circle with 10 vertices.  The decagon was reduced in size by the factor of 3 and shifted to the left
.3 and shifted up by .5; it was drawn using TRIANGLE_FAN.  The ellipse was created using the formulas:
x=c*Math.cos(theta)/a and y=d*Math.cos(theta)/b.  It was drawn with 1000 vertices to make it smooth, and it was
reduced in size  by a factor of 3.  The shape was shifted to the right .5 and up .2, it was drawn using
LINE_STRIP.  The common files that were used were: webgl-utils.js, initShaders.js, and MV.js.