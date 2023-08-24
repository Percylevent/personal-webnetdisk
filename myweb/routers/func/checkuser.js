
function checkdb(u,p,callback){
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	         	host     : 'localhost',
                 	user     : 'web',
                	password : '271731727WSAD',
                 	database : 'webuser'
	});
	connection.connect();
	var sql ='SELECT username,password from user where username =? AND password=?';
        connection.query(sql,[u,p], (error, results) => {
		if (error) throw error;
                if (results.length ==0)
                	{
                                  //console.log("log failed");
				  connection.end();
				  callback(false);
                                  
                        }
                else
                        {
                          var res = JSON.parse(JSON.stringify(results));
                                  //console.log("userlogin", res[0]);
				  connection.end();
				  callback(true);
                       		  
                        }
                  });

}



module.exports ={checkdb  }
