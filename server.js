var express = require('express');
var io = require('socket.io');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var schedule = require('node-schedule');
var fs = require('fs');
var crypto = require('crypto');
//var mysqlConfig = JSON.parse(fs.readFileSync('./config/mysqlConfig.json', 'utf8'));
//var sql = mysql.createConnection(mysqlConfig);

var tools = require('./repository/tools.js');
var handlers = require('./repository/handlers.js');

// sql.connect(function (err) {
// 	console.log("Database connection established.");
// 	if (err) {
// 		console.log(err);
// 	}
// });

var app = express();
var server = http.Server(app);
var io = io(server);
io.set('origins', '*:*');
var port = 8080;

var chat = io.of('/chat');
chat.on('connection', function (client) {
	var newMessage = {
		type: 0,
		who: 'Bot',
		time: new Date(),
		content: "Hi! I'm AI Assistant Kenny! What is your name?"
	};
	client.emit('chat', newMessage);
	client.on('chat', function (data) {
		admin.emit('admin', data);
		handlers.chat(client, admin, data);
	});
});

var admin = io.of('/admin');
admin.on('connection', function (adminClient) {
	adminClient.on('admin', function (data) {
		handlers.adminChat(data);
	})
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());

app.get('/getActiveSessions', function (req, res) {
	res.send(handlers.getActiveSessions());
});

app.post('/test', function (req, res) {
	//var postParam = req.body.postParam;
	// var req.get("custom-header-name");
	res.sendStatus(200);
});

app.post('/bot/v3/conversations/:conversationId/activities/:activityId', function (req, res) {
	var data = req.body;
	if (req.body.type == 'message') {
		console.dir(req.body);
		handlers.botChat(admin, req.params.conversationId, req.body.text);
	}
	res.sendStatus(200);
});

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

server.listen(port, function () {
	console.log("Server running on port " + port + ".");
});

