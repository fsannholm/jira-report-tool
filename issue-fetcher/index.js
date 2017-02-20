const request = require('request');
const util = require('util');
const fs = require('fs');
const params = require('../params');
const dotenv = require('dotenv');

dotenv.load()

function getNewSession(params){
	return new Promise(function(resolve, reject){
		var p = {
			uri: params.instance+'rest/auth/1/session',
			body: {"username": params.user, "password": params.pass},
			json: true
		};

		request.post(p, function (error, response, body){
			if(error){
					reject(new Error (error));
			} else {
				s = body.session
				sessionHeader = s.name + "=" + s.value;
				resolve(sessionHeader);
			}
		});

	})
}

function getFilterMeta(sessionHeader){
	return new Promise(function (resolve, reject){
		var p = {
			uri: params.instance+'rest/api/2/filter/10601',
			headers: {cookie: sessionHeader}
		}

		request.get(p, function(error, response, body){
			if(error){
				reject(new Error(error));
			} else{
				resolve(JSON.parse(body).searchUrl);
			}
		})
	});
}

function getFilterTasks(session, filter){
	return new Promise(function(resolve, reject){
		var p = {
			uri: filter+"&maxResults=1000&expand=renderedFields",
			headers: {cookie: session}
		};
		console.log(p.uri)
		request.get(p, function(error, response, body){
			if(error){
				reject(new Error(error));
			} else {
				resolve(JSON.parse(body));
			}
		});
	});
}

if(process.env.REACT_APP_ENVIRONMENT === 'live'){
	getNewSession(params).then(function(sessionHeader, params){
		getFilterMeta(sessionHeader).then(function(url){
			getFilterTasks(sessionHeader, url).then(function(body){
				console.dir(body, {depth: null});
				console.log(body.issues.length);
				fs.writeFile("./mocks/issues.json", JSON.stringify(body));
				return body;
			}, 
			function(err){
				console.log(err);
			})
		},
		function(err){
			console.log(err)
		});
	},
	function(err){
		console.log(err);
	});
} else if(process.env.REACT_APP_ENVIRONMENT === 'offline'){
	console.log('offline mode...');
	try{
		let fd = fs.openSync('./mocks/issues.json', 'r');
		let issues = fs.readFile('./mocks/issues.json', 'utf8', (err, data) =>{
			if(err) {
				throw err;
			} else return data;
		})
	} catch (e){
		console.log(e);
	}
} else {
	console.log('REACT_APP_ENVIRONMENT not set in .env!');
}