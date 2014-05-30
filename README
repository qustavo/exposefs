# ExposeFS
Let's RESTify your filesystem

## Usage

```./bin/expose [path] [port]``` will serve  path (~ by default) at port (8000 by default).

As *exposefs* has been built as an express middleware, you can use it to your existing express application.

```javascript
var express = require('express');
var app = express();

var exposefs = require('exposefs');

app.use('/fs', exposefs({basepath: "/home/"}));

/* your routing definition */

app.listen(8000)
```

The code above will serve your `home` directory under `/fs` url.

## API

### GET (retrieves file(stats) /dir content)
If target is a directory, will return a list of content.
If target is a file, will return the content of the file
To getting the `stat` of a file add `?stat` parameter to the query string.

### POST (create file/dir)
If url ends with a `/` will create a directory.
example: `curl -XPOST http://localhost:8000/pictures/`) will create the `pictures` directory.

Otherwise will create a file using request content as the file content.
example: curl -XPOST --data-binary @/path/to/an/image http://localhost:8000/pictures/me.png

### PUT (append data to file)
Used to append data to an existing file.

#### PATCH (touches a file)
Used to update file timestamps

### DELETE (removes file/dir)
Used to remove a file or directory.

## TODO:
* Testing
* Add different backends (dropbox, s3, etc)
