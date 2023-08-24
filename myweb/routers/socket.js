const app = require('express');
const router = app.Router();
const path =require('path');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server,{
  cors: {
    origin:"http://sezpc.fit"
  }
});

//io.on只能同时存在一个
/*
io.on("connection", (socket) => {
	console.log("connect socket",socket.id);
	socket.emit("hello","world");
	socket.on("disconnection",()=>{console.log(socket.id,"disconnect");})
});
*/

server.listen(8000);


router.get('/get', function(req, res, next) {
	
	res.sendFile(path.resolve(__dirname,"../public/page/index.html"));
	io.once("connection",(socket)=>{
		console.log(socket.id);
		
	});
});







module.exports = router;

