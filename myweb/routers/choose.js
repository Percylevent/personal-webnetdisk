const app = require('express');
const router = app.Router();
const session = require('express-session');
const path=require('path');



//after login ,to choose the operation
router.get('/choose', (req, res) => {
   if (req.session.islogin == true)
	{
   	res.sendFile(path.resolve(__dirname,"../public/page/choose.html"));
 	}
   else
	{
	res.end("you have not logined in,please login in fisrt");
	}
});




module.exports = router;



