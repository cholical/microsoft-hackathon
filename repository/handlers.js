var _ = require('lodash');
var http = require('http');
var request = require('request');

var activeSessions = [];
var clientDirectory = {};

var chat = function (client, admin, data) {
	console.log("From user session: " + data.sessionToken);
	console.log(data.content);
	var found = false;
	var currentSession;
	_.forEach(activeSessions, function (session) {
		if (session.sessionToken == data.sessionToken) {
			currentSession = session;
			currentSession.messages.push(data);
			found = true;
		}
	});
	if (!found) {
		clientDirectory[data.sessionToken] = client;
		var newSession = {
			sessionToken: data.sessionToken,
			manual: false,
			messages: []
		}
		newSession.messages.push(data);
		currentSession = newSession;
		activeSessions.push(newSession);
	}
	if (!currentSession.manual) {
		//Handle data
		//HTTP Post to bot framework

		var url = 'http://localhost:3978/api/messages';
		var options = {
			url: url,
			headers: {
				'Content-Type': 'application/json',
			},
			json: {
				"channelData": {
					"clientActivityId": "1532475144182.44206654315925875.0"
				},
				"channelId": "emulator",
				"conversation": {
					"id": data.sessionToken
				},
				"entities": [
				{
				  "requiresBotState": true,
				  "supportsListening": true,
				  "supportsTts": true,
				  "type": "ClientCapabilities"
				}],
				"from": {
					"id": "default-user",
					"name": "User"
				},
				"id": data.sessionToken,
				"localTimestamp": "2018-07-24T18:32:38-05:00",
				"locale": "en-US",
				"recipient": {
				"id": "bfbaae90-8f6d-11e8-97fb-2b5e021336b5",
				"name": "Bot",
				"role": "bot"
				},
				"serviceUrl": "http://localhost:8080/bot",
				"text": data.content,
				"textFormat": "plain",
				"timestamp": data.time,
				"type": "message"
			}
		}

		request.post(options, function (err, res, body) {
			if (err) {
				console.log(err);
			}
		});

		// //Handle data
		// if (data.content.toLowerCase().includes('1234')) {
		// 	//Switch to manual
		// 	currentSession.manual = true;
		// }

		// //Decision tree needs to populate return content variable
		// var returnContent = 'Your message: <' + data.content + '> was received by the server. This is the server responding.';
		// if (!currentSession.manual) {
		// 	var newMessage = {
		// 		type: 0,
		// 		who: 'Bot',
		// 		time: new Date(),
		// 		content: returnContent,
		// 		sessionToken: currentSession.sessionToken
		// 	};
		// 	currentSession.messages.push(newMessage);
		// 	admin.emit('admin', newMessage);
		// 	client.emit('chat', newMessage);
		// } else {
		// 	var newMessage = {
		// 		type: -1,
		// 		sessionToken: currentSession.sessionToken
		// 	}
		// 	admin.emit('admin', newMessage);
		// }
	}
}

var adminChat = function (data) {
	var client = clientDirectory[data.sessionToken];
	_.forEach(activeSessions, function (session) {
		if (session.sessionToken == data.sessionToken) {
			session.messages.push(data);
			session.manual = true;
		}
	});
	client.emit('chat', data);
}

var botChat = function (admin, sessionToken, text) {
	var client = clientDirectory[sessionToken];
	var data = {
		type: 0,
		who: 'Bot',
		time: new Date(),
		content: text,
		sessionToken: sessionToken
	};
	var currentSession;
	_.forEach(activeSessions, function (session) {
		if (session.sessionToken == data.sessionToken) {
			currentSession = session;
			currentSession.messages.push(data);
			found = true;
		}
	});
	if (!found) {
		clientDirectory[data.sessionToken] = client;
		var newSession = {
			sessionToken: data.sessionToken,
			manual: false,
			messages: []
		}
		newSession.messages.push(data);
		currentSession = newSession;
		activeSessions.push(newSession);
	}
	admin.emit('admin', data);
	client.emit('chat', data);
}

var getActiveSessions = function () {
	return activeSessions;
}

module.exports.chat = chat;
module.exports.adminChat = adminChat;
module.exports.botChat = botChat;
module.exports.getActiveSessions = getActiveSessions;