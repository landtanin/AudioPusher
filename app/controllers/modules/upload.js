/**
========================================================================================================
  Imports
========================================================================================================
**/

var path = require('path');
var dir = require('../../../config/dir.js');
var ext = require( path.join(dir.CONFIG, 'ext.js') );
var cons = require( path.join(dir.CONFIG, 'cons.js') );
var roam = require( path.join(dir.CONFIG, 'roam.js') );

/**
========================================================================================================
  Helpers
========================================================================================================
**/

var randomNumber = function (low, high) {
    return ext.math.floor(ext.math.random() * (high - low) + low);
}

/**
========================================================================================================
  Processing
========================================================================================================
**/

module.exports = function (req, res) {
  // create an incoming form object
  var form = new ext.formidable.IncomingForm();

  // specify that we want to al;low the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(dir.ROOT, '/upload');

  // Generate Url & open room when /generate
  var refererPath = ext.url.parse(req.header('Referer')).pathname;
  if (refererPath == '/generate') {
    var roomCode = randomNumber(10000, 99999);
    
    roam.openRoom = roomCode;   //open this room for future clients
  }

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    ext.fs.rename(file.path, path.join(form.uploadDir, String(roomCode)));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end(String(roam.openRoom));
  });

  // parse the incoming request containing the form data
  form.parse(req);
};
