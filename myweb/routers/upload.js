const app = require('express');
const router = app.Router();
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const formidable = require("formidable");
const checkfiles = require('./func/checkfiles.js');

router.use(app.json());
router.use(app.urlencoded({ extended: false }));
var percent;//进度值
var trans;//传输状态
var socid= new Map();//保存socketid和sessionname对应的map
//当打开up页面时
router.get('/up', function(req, res){
  	//判断cookie是否登录
  	if(req.session.islogin == true)
		{
			//如果登录，打开up.html
			res.sendFile(path.resolve(__dirname , '../public/page/up.html'));
			//设置文件保存目录为storage/username。
			//uploadpath=path.join(path.resolve(__dirname,'../storage/'),req.session.userName);
			//--后来发现的问题，不能用变量upload path保存路径，多用户会弄混。只能用的时候在从session生成
			//建立socket连接
			var io = req.app.get('socketio');
			io.once('connection', (socket) => {
 				//console.log(req.session.userName,'connected');
				socid.set(req.session.userName,socket.id);
			
				//console.log(req.session.userName,socid.get(req.session.userName));
				//console.log(socid);
			});
			
		}	
	else{
			res.end('have not login ,please login first');
	}
});

//当在up页面上点击上传按钮
router.post('/upfile',(req,res,next)=>{
	if(req.session.islogin == true){
		var step=0;//进度的上传间隔
		var io = req.app.get('socketio');
   		//1.创建实例 
		const form = formidable({
			multiples: true,
			encoding: 'utf-8',
			allowEmptyFiles: false,
			uploadDir: path.join(path.resolve(__dirname,'../storage/'),req.session.userName),
			maxFileSize :500*1024*1024,    
			// Use it to control newFilename.              
			filename: (name, ext, part, form) => {
				return part.originalFilename; // Will be joined with options.uploadDir.
			}
		}); 

		//2.检测传输开始
		form.on('fileBegin', (formname, file) => {
  			trans="begin";	
			//const io = req.app.get('socketio');
		});
	
		//3.检测传输结束	
		form.on('end', () => {
  			trans="end";
		});
		
		//4.监测传输过程，所有检测过程必须要在parse的时候才能执行。
		form.on('progress', function(bytesReceived, bytesExpected) {	//formidable事件
			percent = (bytesReceived*100/bytesExpected).toFixed(2);
			//超过100MB的文件，每隔10个数据段汇报一次进度
			if(bytesExpected>=100*1024*1024){
				step+=1;
				if(step==10){
					io.to(socid.get(req.session.userName)).emit("progress",percent);	
					step=0;
				}
			}
			else{
				io.to(socid.get(req.session.userName)).emit("progress",percent);	
			}
		});
		    		



		 //5.解析request发送过来的数据
		form.parse(req, function (err, fields, files) {
		    if (err) {
			res.json({"upstate":"fail"});
			}
		    else{
		    //	console.log(files);
			res.json({"upstate":"success"});
			//console.log(fields);
		    } 
		});	
	}
	else{
		res.end('have not login ,please login first');
	}

});





//传输文本
router.post('/uptext',(req,res,next)=>{
        if(req.session.islogin == true){
		var text_path=path.resolve(__dirname,'../textstorage/')+'/'+req.session.userName+'.txt';
		var text_data=String(req.body.text)+'%#%';
		fs.writeFile(text_path, text_data,{flag: 'a'}, function (err) {});
				
		res.end();


	} 
	else{
		res.end('have not login ,please login first');
	}
});
module.exports = router;

