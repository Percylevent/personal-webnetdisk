const app = require('express');
const router = app.Router();
const path=require('path');



router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname,"../public/page/login.html"));
});


module.exports = router;
