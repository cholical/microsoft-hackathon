(function () {

	'use strict';
	var app;

	app = angular.module('chat');
	app.controller('adminCtrl', ['$scope', '$state', 'adminSvc', '$location', '$anchorScroll', function adminCtrl($scope, $state, adminSvc, $location, $anchorScroll){

		// $scope.test = function () {
		// 	adminSvc.test().then(function (data) {
		// 		$scope.result = data;
		// 	});
		// }

		var admin = io.connect('/admin');

		$scope.activeSession;
		$scope.userInput = '';

		var defaultMessage = {
			type: 0,
			who: 'Bot',
			content: ''
		}

		adminSvc.getActiveSessions().then(function (data) {
			$scope.sessions = data;
		});

		admin.on('admin', function (data) {
			console.log(data);
			if (data.type == 0) {
				var found = false;
			    angular.forEach($scope.sessions, function (session) {
			    	if (session.sessionToken == data.sessionToken) {
			    		session.messages.push(data);
			    		found = true;
			    	}
			    });
			    if (!found) {
		    		var newSession = {
		    			sessionToken: data.sessionToken,
						manual: false,
						messages: []
		    		}
		    		newSession.messages.push(data);
		    		$scope.sessions.push(newSession);
		    	}
			    $scope.$apply();
			    $scope.scrollToBottom();
			} else if (data.type == -1) {
				var found = false;
			    angular.forEach($scope.sessions, function (session) {
			    	if (session.sessionToken == data.sessionToken) {
			    		session.manual = true;
			    		found = true;
			    	}
			    });
			    if (!found) {
		    		var newSession = {
		    			sessionToken: data.sessionToken,
						manual: true,
						messages: []
		    		}
		    		$scope.sessions.push(newSession);
		    	}
			    $scope.$apply();
			    $scope.scrollToBottom();
			}
		});

		$scope.scrollToBottom = function () {
			$location.hash('bottom');
			$anchorScroll();
		}

		$scope.makeActive = function (session) {
			console.log("makeActive called");
			$scope.activeSession = session;
			$scope.userInput = '';
		}

		$scope.send = function () {
			var newMessage = angular.copy(defaultMessage);
			newMessage.content = $scope.userInput;
			newMessage.time = new Date();
			newMessage.sessionToken = $scope.activeSession.sessionToken;
			$scope.activeSession.messages.push(newMessage);
			$scope.activeSession.manual = true;
			admin.emit('admin', newMessage);
			$scope.scrollToBottom();
			$scope.userInput = '';
		}


		$scope.scrollToBottom();
	}]);
}());