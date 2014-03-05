/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , _	= require("underscore");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('6397EA6158CA269858155B7B842BF'));
app.use(express.cookieSession());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/project/:id', routes.project);
app.get('/projects', routes.projects);
app.get('/login', routes.login);
app.get('/contact', routes.contact);


var Request = function Request() {	
	this.host			= 'http://5.9.20.212/';
	this.baseUrl		= 'service/service.php';
};
Request.prototype.executeRequest = function(method, parameters, callback) {	
	console.log(this.host+this.baseUrl+method+parameters);

	http.get(this.host+this.baseUrl+method+parameters, function(res) {
		if (res.statusCode && res.statusCode === 200) {
			// console.log(res);
			var chunks	= '';
			res.on('data', function(resultData) {
				chunks	+= resultData;
			});
			res.on('end', function() {
				callback(null, JSON.parse(chunks));
			});
		}
		else {
            callback({code: res.code, message: res.message});
        }
	}).on('error', function(error) {
		callback(error);
	});
};

userLogIn = function(parameters, callback) {
	if( parameters === undefined ) parameters = {};	
	_request = new Request();
	this._request.executeRequest('?section=user&request=auth', parameters, callback);
};

userType = function(parameters, callback) {
	if( parameters === undefined ) parameters = {};	
	_request = new Request();
	
	this._request.executeRequest('?section=user&request=getlevel', parameters, callback);
};

userTypeChange = function(parameters, callback) {
	if( parameters === undefined ) parameters = {};	
	_request = new Request();
	// http://5.9.20.212/service/service.php?section=user&request=changetype&username=CESAR&type=admin&token=

	this._request.executeRequest('?section=user&request=changetype', parameters, callback);
};

userPassChange = function(parameters, callback) {
	if( parameters === undefined ) parameters = {};	
	_request = new Request();
	// http://localhost/Betaville-Web-Service/service.php?section=user&request=changePasswordNew&username=test4&password=test4
	this._request.executeRequest('?section=user&request=changePasswordNew', parameters, callback);
};

userAll = function(parameters, callback) {
	if( parameters === undefined ) parameters = {};	
	_request = new Request();	
	this._request.executeRequest('?section=user', parameters, callback);
};


app.get('/auth/:user/:pass', function(request, response) {
	userLogIn('&username='+request.params.user+'&password='+request.params.pass, function(err, result) {
		if (err) {
	    	console.log("ERROR:", err);
	    	response.send(err);
	    } else {
	    	if(result.authenticationSuccess == true){
	       		
	       		
	       		userType('&username='+request.params.user, function(errType, resultType) {
					if (err) {
				    	console.log("ERROR:", err);
				    	response.send(err);
				    } else {				    	
				    	console.log(resultType.userType);
				    	request.session.userType = resultType.userType;						
				    	request.session.token = result.token;
	       				request.session.userName = request.params.user;	       		
	       				request.session.logged = 'in';
	       				response.send(true)       		
				    }
				});	       		
			}
			else{
				request.session.token = null;
				request.session.logged = 'out';
	       		response.send(false)       		
			}
	    }
	});
});

app.get('/level/:user/', function(request, response) {
	userType('&username='+request.params.user, function(err, result) {
		if (err) {
	    	console.log("ERROR:", err);
	    	response.send(err);
	    } else {	    	
	    	request.session.userType = result.userType;	       		
			response.send(result.userType);
	    }
	});
});

app.get('/user/:userName', routes.userProfile);

app.get('/admin', function(req, res) {	
    // res.send(req.session.userType);
    // req.session.logged === 'in' && req.session.token > 0 && req.session.user > 0 && 
    if (req.session.userType === 'member'){        
        // res.send("loged",req.session.userType);
        app.get('/user/'+req.session.userName+'/dashboard', routes.memberDashboard);        
        res.redirect('/user/'+req.session.userName+'/dashboard');
    }       
    else if (req.session.userType === 'moderator'){        
        // res.send("loged",req.session.userType);
        app.get('/user/'+req.session.userName+'/dashboard', routes.moderatorDashboard);        
        res.redirect('/user/'+req.session.userName+'/dashboard');
    }
	else if (req.session.userType === 'admin'){        			
        app.get('/user/'+req.session.userName+'/dashboard', function(request, response) {			
        	var arr = [];

			userAll('&request=findUserInfo', function(err, result) {
				if (err) {
			    	console.log("ERROR:", err);
			    	response.send(err);
			    } else {					
					response.render(__dirname + '/views/adminDashboard.jade', {
				        locals: [{data: result.users}]					
					});
			    }
			});
		});		
		res.redirect('/user/'+req.session.userName+'/dashboard');
    }
    else {    
        console.log("redirected");
        res.redirect('/login');
    }
});


app.get('/admin/userTypeChange/:user/:userType', function(request, response) {
	var userName = request.params.user,
		userType = request.params.userType,
		userToken = request.session.token;

	// http://5.9.20.212/service/service.php?section=user&request=changetype&username=CESAR&type=admin&token=

	userTypeChange('&username='+userName+'&type='+userType+'&token='+userToken, function(errTypeChange, resultTypeChange) {
		if (errTypeChange) {
	    	console.log("ERROR:", errTypeChange);
	    	response.send(errTypeChange);
	    } else {				    		    	
	    	console.log(resultTypeChange.changetype);	    	
	    	response.send(resultTypeChange.changetype);
	    }
	});		
	// response.send(request.session.token +" "+ request.session.userName +" "+request.session.userType +" --- "+userName+" "+userType);
});


app.get('/admin/userPassChange/:user/:userPass', function(request, response) {
	var userName = request.params.user,
		userPass = request.params.userPass,
		userType = request.session.userType;

	if (userType != 'admin'){
		response.send("unauthorised");
	}
	else{		
		userPassChange('&username='+userName+'&password='+userPass, function(errPassChange, resultPassChange) {
			if (errPassChange) {
		    	console.log("ERROR:", errPassChange);
		    	response.send(errPassChange);
		    } else {				    		    	
		    	console.log(resultPassChange.PassChangedNew);	    	
		    	response.send(resultPassChange.PassChangedNew);
		    }
		});				
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});