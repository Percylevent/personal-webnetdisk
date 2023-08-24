//1.socket连接
const socket = io({reconnectionAttempts:5});                         
//socket.on("connect", () => {console.log(socket.id);});
var bar =document.getElementById("bar");
var msg_bar=document.getElementById("msg_bar");
socket.on('progress',function(msg){
	//console.log(msg);
	bar.value=msg;
	msg_bar.innerHTML="upload progress:"+msg;
});


//2.察看文件大小,基本单位byte
const file =document.getElementById('file');
const msg=document.getElementById("msg_size");
file.onchange = function(){
	bar.value=0;
	msg_bar.innerHTML="";
	
	if(file.files.length==0){
		msg.innerHTML="";	
	}	

	if(file.files[0].size>500*1024*1024){
		alert("file is too large more than 500MB");
		file.value='';
	}
	else{
		msg.innerHTML="size of file："+renamesize(file.files[0].size)+";<br />";
	}
};


//3.上传按钮
const controller = new AbortController();
//设定一个中断标志
const btup = document.getElementById('bt_upload');
btup.onclick =  function(){
	//判断是否为空
	if(file.files.length == 0){
		alert("no file selected");
	}
	else{
		const formdata = new FormData();
        	formdata.append('file', file.files[0]);
		//formdata.append('name',"w.txt");
        	fetch('/upfile', {
			signal : controller.signal,
                	method: 'post',
                	body: formdata
		}).then(response => response.json())
 	  	.then(json => console.log("backend",json))
		.catch((err)=>{
			alert("trans canceled,please refresh this page");
		})
	}
};

//4.停止按钮
const btstop=document.getElementById('bt_abort');
btstop.onclick = function(){
	controller.abort();	





};

//5.上传文本
const bttx=document.getElementById('bt_tx');
const tx=document.getElementById('text1');
bttx.onclick =function(){
	var t =tx.value;
	if(t){
	var data={text:t};
	 
	fetch('/uptext', {
		method: 'post',
		body:JSON.stringify(data) ,
		headers:{'Content-Type':'application/json'}

	}).then((res)=>{tx.value='';count.innerHTML = 0;})
	}
	else{
		alert("请不要发送空白内容");
	};
};


//6.文本字数限制
var el = document.getElementById('text1');
var count=document.getElementById('textCount');
el.addEventListener('input',function () {
	var len =  txtCount(this); //   调用函数 
	count.innerHTML = len;
});


function txtCount(el) {
    var val = el.value; 
    var eLen = val.length; 
    return eLen;
}

function renamesize(size){
	var num = 1024.00; //byte
        if (size < num)
        	return size + "B";
        if (size < Math.pow(num, 2))
        	return (size / num).toFixed(2) + "KB"; //kb
        if (size < Math.pow(num, 3))
        	return (size / Math.pow(num, 2)).toFixed(2) + "MB"; //M
       	if (size < Math.pow(num, 4))
        	return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
        return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}
