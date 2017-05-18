Matthew Strenk(0437546)
4/16/17

Implementation:
The shape of the chair was created by making the different vertices and faces in
a JS file.  That file was used to created the object on the page.  But without a 
light source it is not possible to see the shape.  The light source that was used
to view the shape is a point light source.  The point light source was implemented
using the ambient part, diffuse part and specular parts of incident light.
The starting point for the point light source is 0,0 with an angle of 45 degrees.
The ambient light used the values of .1, .1, .1.  The diffuse light used the values
.8, .8, .5.  The specular light used the values .8, .8, .8.  The other light source
that was planned on being implement was a spotlight light source.  I could not get
this light source to work though, there is still a button for it though.  The eye 
that was used to see the shape had the values of 200, 0, 100, this made it so that 
the shape could be viewed from the side.  The shape was viewed from the origin and 
had an up vector of 0, 1, 0.  The project matrix that was used had the values of
left = -50.0, right = 50.0, top = 50.0, bottom = -50.0, near = 50.0, 
far = 200.0.  These values were used to create the orthographic and perspective
views.  The buttons for the orthographic and perspective views were created in
the body of the html file.  The buttons for toggling the light sources were
created in the body of the html file, functions were made in the JS file to
allow the toggling functionality to work.

1) The look at method was used for setting up the camera.
2) The orthographic and perspective projections were implemented.
3) One of the two light sources was implemented.  The plan was to implement
    a point light source and a spotlight source.  I was able to implement the
    point light source, but I was unabled to get the spotlight source to work.
4) I sucessfully implemented the button that toggles the spectical light on and off.
    The button does not turn on the spectical light if the point light source is
    turned off.  
5) Yes, I did.