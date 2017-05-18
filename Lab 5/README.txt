Matthew Strenk
3/5/17
Computer Graphics
Lab3: README

The shape that I chose to render is a right-triangle prism.

Instead of using color on the vertices an image was used to color the faces
of the shape.  The picture uses textures to put the image on the shape.

Each transformation for each direction contains its own matrix that is used.
The Transformations that I used are for the shape to rotate around the x-axis,
y-axis, and z-axis.  Also the shape translates along the positive x-axis and the
positive y-axis.  The shape scales along the x-axis and the y-axis.

The keys that were used to control the transformations of the shape are as follows:
the x, y, and z keys rotate the shape around the x, y, and z axes respectively.
The right arrow translates the shape on the positive x-axis while the up Arrow
translates the shape along the positive y axis.  The q key scales the shape on
the x-axis and the e key scales the shape on the y-axis.

The matrices are composed in a way that the vertex position is accounted for first,
then it is multiplied by the scaling matrices (x first then y), then it is multiplied
by the rotation matrices (x first, then y, then z), and finally multiplied by the
translation matrices (x first then y).
