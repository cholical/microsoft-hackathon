var _ = require('lodash');

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

		//Handle data
		if (data.content.toLowerCase().includes('ronald')) {
			//Switch to manual
			currentSession.manual = true;
		}

		//Decision tree needs to populate return content variable
		var returnContent = 'Your message: <' + data.content + '> was received by the server. This is the server responding.';
		if (!currentSession.manual) {
			var newMessage = {
				type: 0,
				who: 'Bot',
				time: new Date(),
				content: returnContent,
				sessionToken: currentSession.sessionToken
			};
			currentSession.messages.push(newMessage);
			admin.emit('admin', newMessage);
			client.emit('chat', newMessage);
		} else {
			var newMessage = {
				type: -1,
				sessionToken: currentSession.sessionToken
			}
			admin.emit('admin', newMessage);
		}
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

var getActiveSessions = function () {
	return activeSessions;
}

module.exports.chat = chat;
module.exports.adminChat = adminChat;
module.exports.getActiveSessions = getActiveSessions;