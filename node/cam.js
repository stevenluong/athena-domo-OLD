var cv = require('opencv');
var app = require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

var camera = new cv.VideoCapture(0);
var camWidth = 320;
var camHeight = 240;
camera.setWidth(camWidth);
camera.setHeight(camHeight);
var camFps = 5;
var camInterval = 1000 / camFps;
var rectColor = [0, 255, 0];
var rectThickness = 2;


io.on('connection', function(socket){
	console.log("connection");
	setInterval(function() {
		camera.read(function(err, im) {
			if (err) throw err;

			im.detectObject('../node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
				if (err) throw err;

				for (var i = 0; i < faces.length; i++) {
					face = faces[i];
					im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
				}
				//console.log("frame");
				socket.emit('frame', { buffer: im.toBuffer() });
			});
		});
	}, camInterval);

});

/*
   cv.readImage("./1.jpg", function(err, im){
   im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
   for (var i=0;i<faces.length; i++){
   var x = faces[i]
   im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
   }
   im.save('./out1.jpg');
   });
   })
   */
