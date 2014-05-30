var path = require('path');
var fs = require('fs');

var deleteFolderRecursive = function(path, notRoot) {

	if(fs.existsSync(path) ) {
		fs.readdirSync(path).forEach(function(file,index){
			var curPath = path + '/' + file;
			if(fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		if (!notRoot) {
			fs.rmdirSync(path);
		}
	}
};

function jsonToFs(root, obj) {
	Object.keys(obj).forEach(function (path) {
		var currPath = root + '/' + path;
		if (typeof obj[path] === 'string') {
			fs.writeFileSync(currPath, obj[path]);
		} else {
			fs.mkdirSync(currPath);
			jsonToFs(currPath, obj[path]);
		}
	});
}

function fsToJson(root) {
	var obj = {};

	fs.readdirSync(root).forEach(function(file){
		var curPath = root + '/' + file;
		if(fs.lstatSync(curPath).isDirectory()) {
			obj[file] = fsToJson(curPath);
		} else {
			obj[file] = fs.readFileSync(curPath, 'utf8');
		}
	});
	return obj;
}

module.exports = {
	jsonToFs: function (root, obj) {

		root = path.join(process.cwd(), root);

		deleteFolderRecursive(root, true);

		jsonToFs(root, obj);
	},
	fsToJson: function (root) {
		root = path.join(process.cwd(), root);
		return fsToJson(root);
	}

};

