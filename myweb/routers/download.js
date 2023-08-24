const app = require('express');
const router = app.Router();
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const filesize = require('./func/fileresize.js');

router.get('/down', (req, res) => {
	if(req.session.islogin == true){
		var filepath = path.join(path.resolve(__dirname,'../storage/'),req.session.userName);
		var filelist = [];
		//读取文件夹中所有文件名
		var files = fs.readdirSync(filepath);
		//获取每一个文件的信息
		files.forEach((file)=>{
			var state = fs.statSync(filepath+'/'+file);
			var obj = new Object;
            		obj.size = filesize.fileresize(state.size);
            		obj.name = file;
			obj.time = state.mtime;
			obj.ext  = path.extname(file); 
            		obj.path = '/storage/'+req.session.userName+'/'+file;
            		filelist.push(obj);
		});
		//按事件对文件重新排序
		filelist.sort(filesize.sortBy('time',-1));//升序1，降序-1

		//获取文本内容
		var textpath =path.resolve(__dirname,'../textstorage')+'/'+req.session.userName+'.txt';
		var data=fs.readFileSync(textpath);
      		//拆分为数组形式,然后颠倒,莫名其妙出现空字符，用filter去除
		var array = data.toString().split("%#%").filter(item => item != '').reverse();
		//数组长度大于10，删去之前的内容
		if(array.length>10){
			array.length=array.length-(array.length-10);
			//再把数组内容写回txt中
			fs.unlinkSync(textpath);//先清空
			var awrite=array.reverse();
			awrite.forEach((a)=>{
				var tx=a+'%#%';
				fs.writeFileSync(textpath,tx ,{flag: 'a'});
			});
			//重新读一次
			var array = data.toString().split("%#%").filter(item => item != '').reverse();	
		}		
		
		

		res.render('files', {files:filelist,texts:array});	


	}
	else{
		res.end('have not login ,please login first');
	}
});

router.get('/download/:filename', function(req, res){
	if(req.session.islogin == true){ 
		//res.download("/myweb/storage/zpc/zpc.txt");
		//拼出文件所在路径
		var fileName = req.params.filename;
		var filed = path.join(path.resolve(__dirname,'../storage/'),req.session.userName)+'/'+fileName;
		res.download(filed);
	}
	else{
		res.end('have not login ,please login first');

	}
});

router.post('/delet',(req,res,next)=>{
	if(req.session.islogin == true){
		var filed = path.join(path.resolve(__dirname,'../storage/'),req.session.userName)+'/'+req.body.file;
		fs.unlinkSync(filed);
		res.end(); 	
	}
	else{
		res.end('have not login ,please login first');
	}




}); 

module.exports = router;
