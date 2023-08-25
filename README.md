项目名称：个人网盘-网页版

项目简介：作为个人后端开发的练习作品，实现了用户登录，登陆状态保持，文件上传，上传进度显示，文本上传，文件预览，文件下载功能。在此公开源码供大家参考，指导，改进。

项目需要：云服务器（centos7）；域名（doc，ppt，excel等文件类型的预览必须使用域名）。mysql数据库（只储存用户信息，且用户信息只包括“username”和“password”两项），本项目为给出数据库的配置，请自行查找。

使用方法：在myweb文件下，运行命令： node app.js    

技术路线：前端：html，JavaScript，css。后端：nodejs，socket.io，mysql。
										
-------用户登录：使用了session模块和mysql模块。后端接收到用户表单提交的用户名和密码，执行sql命令在数据库里查询用户信息。如果该用户信息正确，使用session为该用户的请求头添加cookie，用以保持登陆状态。登陆后重定向到功能选择页面。

-------文件上传：使用formidable模块。前端选择文件后，点击上传按钮。通过fetch向后端发送FormData类型的文件数据（这里设置的是传输单个文件，若传输多个文件，自行查找相关设置）。后端通过formidable模块接收文件，保存到服务器用户对应路径的文件夹。（可以增加一些判断逻辑，比如重名文件的处理和改变文件名等）。同时，前端设置了中断标志，可以中断文件传输的进程。

-------文本上传：前端通过fetch向后端post一个JSON数据，其中包括文本信息，后端接收到之后保存到一个txt文件中，并在每一段文本后面加上“%#%”，用来分割字符串。

-------上传进度显示：使用socket.io和formidable模块。此功能有两种技术路线，分别是轮询和socket，这里采用第二种。在用户打开上传页面时，前端与后端建立socket连接，并建立用户和socketid对应的map，由于后面向前端推送进度条数据。
当用户点击上传按钮时，后端formidable模块开始接受数据，formidable模块有form.on（‘process’）回调函数，可以在每一个数据块触发一次回调。因此，我们这每一次form.on()的回调中，通过socketio.to（）.emit()像前端推送进度数据。前端根据接收到的数据绘制<progress>。

-------文件预览：使用ejs模板引擎。由于文件数目是动态变化的，所以使用模板引擎动态绘制，先去用户对应的储存路径下遍历文件信息，通过ejs动态绘制页面。(doc ppt excel等文件类型，url需要使用微软的接口来预览，因此需要一个域名，其他类型文件可以直接用文件路径预览)。

-------文件下载：模拟前端<a>标签的点击过程

具体的实现方法请看代码。

项目页面：

```mermaid
graph TD;
    login-->choose;
    choose-->upload(up);
    choose-->download(down);
```






 
