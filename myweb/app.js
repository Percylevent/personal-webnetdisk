const express = require('express');
const app = express();
const path=require('path');
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);



//跨域设置
app.use(cors());
//body解析
//app.use(express.json());
//app.use(express.text());
//导入路由模块

app.use('/',require('./routers/mainpage.js'));
app.use('/',require('./routers/login.js'));
app.use('/',require('./routers/choose.js'));
app.use('/',require('./routers/upload.js'));
//app.use('/',require('./routers/socket.js')); 该条是实验js，提供了另一种引入socke的方法
app.use('/',require('./routers/download.js'));

//set static resource
app.use(express.static("public"));
app.use('/storage',express.static("storage"));
app.use(express.static("textstorage"));



// View engine setup.
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

//pass socketio to router
app.set('socketio', io);


//当使用socket时，实际上是通过sever创建的对象，只能用server.listen而不能用app.listen
server.listen(80,()=>{
	console.log("网站监听80端口");
});

