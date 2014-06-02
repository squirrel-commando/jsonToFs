jsonToFs
========

Builds a directory and file structure as defined in a json, or generates a json based on an existing directory's contents


## API

### jsonToFs(root, obj, preserveList)

Converts a javascript object into a directory structure

* `root` [String]  - directory within which to create the files and directories, relative to the current working directory. This directory must already exist and will have all its contents deleted before the new contents are generated
* `obj` [Object] - Nested javascript object specifying the files and directories to be created e.g.
    
        {
            'file1.js': 'file1.js will be created with this string as its content',
            'sub': { // creates a subdirectory
            	'file2.js': 'Can you guess what the content of this file will be?'
            }
        }
* `preserveList` [Array]: An array of relative paths not to delete when running the initial clean out of the target directory
        
### fsToJson(root, ignoreList)

Reads the contents of a directory into a javascript object

* `root` [String]  - directory within which to read the files and directories, relative to the current working directory.
* `ignoreList` [Array]: An array of relative paths to ignore when returning the json of teh directory's contents
