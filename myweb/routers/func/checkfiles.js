const fs = require('fs'); 

function samename(filename,dirpath){
	filenames = fs.readdirSync(dirpath);
	let result = filenames.includes(filename);
	return result;

}

module.exports ={samename}
