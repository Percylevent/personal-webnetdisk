const app = require('express');
const router = app.Router();
const checkuser = require('./func/checkuser.js');
const session = require('express-session')
const path=require('path');

router.use(app.urlencoded({extended: false}));
router.use(app.json());
router.use(session({
    secret :  'secret', // 对session id 相关的cookie 进行签名
    resave : false,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 5, // 设置 session 的有效时间，单位毫秒
    },
}));

//when press login 
router.post('/login', (req, res) => {
   let { username, password } = req.body;
   //console.log( { username, password } );
   checkuser.checkdb(username,password,(s)=>{
		if(s==true)
			{
			req.session.userName = username;  //设置session
 	                req.session.islogin = true;
 	                res.redirect('/choose');
			}
		else
			{
			res.end("wrong password or no such user");
			}
	}
		
   );  
});


module.exports = router;
