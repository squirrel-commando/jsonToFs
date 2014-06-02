var path = require('path');
var fs = require('fs');

var absolutePath = function (relativePath) {
	return path.join(process.cwd(), relativePath);
};

var deleteFolderRecursive = function(path, preserveList) {
	if(fs.existsSync(path) ) {
		fs.readdirSync(path).forEach(function(file,index){
			if (preserveList.indexOf(absolutePath(file)) < 0) {
				var curPath = path + '/' + file;
				if(fs.lstatSync(curPath).isDirectory()) { // recurse
					deleteFolderRecursive(curPath, preserveList);
					fs.rmdirSync(curPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			}
		});
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

function fsToJson(root, ignoreList) {
	var obj = {};

	fs.readdirSync(root).forEach(function(file){
		if (ignoreList.indexOf(absolutePath(file))  < 0) {
			var curPath = root + '/' + file;
			if(fs.lstatSync(curPath).isDirectory()) {
				obj[file] = fsToJson(curPath, ignoreList);
			} else {
				obj[file] = fs.readFileSync(curPath, 'utf8');
			}
		}
	});
	return obj;
}

module.exports = {
	jsonToFs: function (root, obj, preserveList) {
		preserveList = preserveList || [];

		preserveList = preserveList.map(absolutePath);
		root = absolutePath(root);

		deleteFolderRecursive(root, preserveList);

		jsonToFs(root, obj);
	},
	fsToJson: function (root, ignoreList) {
		ignoreList = ignoreList || [];

		ignoreList = ignoreList.map(absolutePath);
		root = absolutePath(root);
		return fsToJson(root, ignoreList);
	}

};

