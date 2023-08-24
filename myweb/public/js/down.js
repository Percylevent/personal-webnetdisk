function download(filename){
	let a = document.createElement('a');
	a.href =  "/download/"+filename;
	document.body.appendChild(a);//创建a标签，模拟点击连接的过程
	a.style.display = 'none'//隐藏
	a.click();//打开对应网页
	document.body.removeChild(a);

};

function delet(filename){
	var cf =confirm("是否删除");
	if(cf){
		var f={file:filename};
		fetch('/delet', {
                	method: 'post',
                	body:JSON.stringify(f),
			headers:{'Content-Type':'application/json'} 
		}).then((res)=>{
				alert("删除成功");
				location.reload();
			})

	}
};
