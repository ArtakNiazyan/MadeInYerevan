(function(exports){

	var  http 		= require('http')
		, _ 	 	= require('underscore')
		, hook 		= {}
		, db
		, util = require('util')
		, formidable = require('formidable');

	exports.run =function(options){
		db = options.db;
	}
	exports.routes = function(app){
	
		app.post("/fileupload",function(req,res){
			res.writeHead(200, {'content-type': 'text/html'});
		    res.end(
		      '<form action="/upload" enctype="multipart/form-data" method="post">'+
		      '<input type="text" name="title"><br>'+
		      '<input type="file" name="upload" multiple="multiple"><br>'+
		      '<input type="submit" value="Upload">'+
		      '</form>'
		    );
		})

		app.post("/upload",function(req,res){(
			var form = new formidable.IncomingForm(),
		        files = [],
		        fields = [];

		    form.uploadDir = '/upload';

		    form
		      .on('field', function(field, value) {
		        console.log(field, value);
		        fields.push([field, value]);
		      })
		      .on('file', function(field, file) {
		        console.log(field, file);
		        files.push([field, file]);
		      })
		      .on('end', function() {
		        console.log('-> upload done');
		        res.writeHead(200, {'content-type': 'text/plain'});
		        res.write('received fields:\n\n '+util.inspect(fields));
		        res.write('\n\n');
		        res.end('received files:\n\n '+util.inspect(files));
		      });
		    form.parse(req);

		)}

		app.get("/count",function(req,res){
			db.count("instance",{},function(err,data){
				res.send("there are "+data+" visitors on the site now.")
			})		
		})

		app.get("/amILoggedIn",function(req,res){
			res.send(_.has(req.session,"p"))	
		})
	return app;
	}

return exports;
})(exports)


// .val().replace(/.+[\\\/]/, "");


