let express = require('express');
let cors = require('cors');
let finder = require('../issue-fetcher/index');

let app = express()
app.use(cors());

app.get('/issues', (req, res) => {
	let f = finder();
	f.then(function(result){
		console.log('sending result to client')
		res.send(result);
	});
})

app.listen(3001, () =>{
	console.log('Listening on port 3001')
})