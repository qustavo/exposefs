## ExposeFS

[![Build Status](https://travis-ci.org/gchaincl/exposefs.svg)](https://travis-ci.org/gchaincl/exposefs)

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

## Exposed API

| action | verb | operation | note |
|--------|------|-----------|---------|
| List Directory | `GET` | readdir |
| Retrieve file | `GET` | read |
| Stat file | `GET` | stats | must use `?stats` |
| Follow a file | `GET` | follow | must use `?follow` |
| Create File | `POST` | write |
| Create Directory | `POST` | mkdir | file name must finish with `/` |
| Append to File | `PUT` | write |
| Update file timestamps | `PATCH` | utimes |
| Remove a file or directory | `DELETE` | unlink |

## TODO:
* Testing
* Add different backends (dropbox, s3, etc)
