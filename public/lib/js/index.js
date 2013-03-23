/**
 * simple client
 */

// so jslint doesn't flip
/*global window */
/*global document */
/*global console */
/*global $ */

window.addEventListener('load', function(event) {
	'use strict';
	var status = document.getElementById('status')
	, url = document.getElementById('url')
	, connect = document.getElementById('connect')
	, disconnect = document.getElementById('disconnect')
	, send = document.getElementById('send')
	, text = document.getElementById('text')
	, message = document.getElementById('message')
	, userName
	, userNameActive = document.getElementById('username')
	, uid
	, uidActive = document.getElementById('uid')
	, passWord
	, passWordActive = document.getElementById('password')
	, deviceID
	, deviceIDActive = document.getElementById('deviceID');
	status.textContent = 'Not Connected';

	disconnect.disabled = true;
	send.disabled = true;
	userNameActive.textContent = 'Not logged in';
	passWordActive.textContent = '********';
	deviceIDActive.textContent = '0000000000000000';

	$('#connectTokoyo').click(function() {
		url.value = "ws://tokoyo.lucidev.info:8080";
	});
	$('#connectLondon').click(function() {
		url.value = "ws://london.lucidev.info:8080";
	});
	$('#connectNewark').click(function() {
		url.value = "ws://newark.lucidev.info:8080";
	});
	$('#connectAtlanta').click(function() {
		url.value = "ws://atlanta.lucidev.info:8080";
	});
	$('#connectDallas').click(function() {
		url.value = "ws://dallas.lucidev.info:8080";
	});
	$('#connectFremont').click(function() {
		url.value = "ws://freemont.lucidev.info:8080";
	});

	$('#connect').click(function() {
		var ws = $.websocket(url.value, {
			open: function() {
				try {
					connect.disabled = true;
					disconnect.disabled = false;
					console.log();
					status.textContent = 'Connected';
					$.get('http://localhost:3000/time', function(time) {
						$('#log').append('<li data-theme="c">' + time + ' - Connected to ' + url.value + '</li>').listview('refresh');
					});
				}
				catch (ex) {
					console.log('Couldn\'t connect to the box. It could be offline.');
					console.log(ex);
				}
			},
			close: function() {
					disconnect.disabled = true;
					connect.disabled = false;
					send.disabled = true;
					status.textContent = 'Disconnected from ' + url.value;
					$('#log').append('<li data-theme="c">Disconnected from ' + url.value + '</li>').listview('refresh');
			},
			events: {
				message: function(e) {
					try {
						var data = JSON.parse(e);
						console.log(data);
						console.log('switch to ' + data.type);
						switch (data.type) {
							case 'welcome' :
								console.log(data.message);
								$('#messages').append('<li data-theme="b">New Message: ' + data.message + '</li>').listview('refresh');
							break;
							case "userSaved":
								uid = data.uid;
								console.log(uid);
								$('#log').append('<li data-theme="c">Response: ' + data.message + '</li>').listview('refresh');
							break;
							case "authRequest":
								$('#log').append('<li data-theme="c">Response: ' + data.message + '</li>').listview('refresh');
							break;
							case "getContacts":
								// hazard @TODO this is lame
								var contacts = eval('(' + data.message + ')')
								, i;
								for (i = 0; i < contacts.length; i++) {
									console.log(contacts[i]);
									var username = contacts[i].userName
									, userID = contacts[i]._id;
									$('#contactList').append('<li data-theme="d">User: ' + username + '</li>');
								}
							break;
							case "newMessage":
								$('#messages').append('<li data-theme="b">New Message: ' + data.message + '</li>').listview('refresh');
							break;
						}
					}
					catch (ex) {
						console.log('There has been an error parsing your JSON.');
						console.log(ex);
					}
				}
			}
	});

	$('#disconnect').click(function() {
		$.get('http://localhost:3000/time', function(time) {
			$('#log').append('<li data-theme="c">' + time + ' - Attempting to disconnect from ' + url.value + '</li>').listview('refresh');
		});
	});

	$('#newUser').click(function() {
		$('#log').append('<li data-theme="c">Attempting to create a dummy user!</li>').listview('refresh');
		userName = generateUserName();
		passWord = generatePassword();
		deviceID = generateDeviceID();
		var authRequestDate = new Date()
		,	authRequestEpoch = authRequestDate.getTime()
		, payload = {
			"type" : "newUser",
			"userName" : userName,
			"password" : passWord,
			"deviceID" : deviceID,
			"authRequestDate" : authRequestEpoch 
		};

		ws.send('newUser', payload);
		payload = JSON.stringify(payload);
		$('#log').append('<li data-theme="c">Sent newUser payload: ' + payload + '</li>');

		userNameActive.textContent = userName;
		passWordActive.textContent = passWord;
		deviceIDActive.textContent = deviceID;
		$('#log').append('<li data-theme="c">Your username is now ' + userName + ', your password is ' + passWord + ' and your deviceID is ' + deviceID + '</li>').listview('refresh');
	});

		$('#authRequest').click(function() {
			$('#log').append('<li data-theme="c">Attempting to request authentication!</li>').listview('refresh');
			var authRequestDate = new Date()
			,	authRequestEpoch = authRequestDate.getTime()
			, payload = {
				type : "authRequest",
				userName : userName,
				password : passWord,
				deviceID : deviceID,
				authRequestDate : authRequestEpoch
			};

			try { 
				console.log(payload);
				ws.send('authRequest', payload);
				status.textContent = 'Authenticated!';
				payload = JSON.stringify(payload);
				$('#log').append('<li data-theme="c">Sent authRequest payload: ' + payload + '</li>');
			} 
			catch (ex)
			{
				status.textContent = 'Authentication failed!';
				$('#log').append('authRequest failed! Error: ' + ex);
				return false;
			}
			return true;
		});

		$('#newMessage').click(function() {
			$('#log').append('<li data-theme="e">Attempting to send a message!</li>').listview('refresh');
			message = generateMessage();
			var messageDate = new Date()
			,	messageEpoch = messageDate.getTime()
			, payload = {
				type : "newMessage",
				userName : userName,
				userID : uid,
				message : message,
				messageDate : messageEpoch
			};
			console.log(payload);
			ws.send('newMessage', payload);
			payload = JSON.stringify(payload);
			$('#log').append('<li>Sent message payload: ' + payload + '</li>').listview('refresh');
		});

		$('#getContacts').click(function() {
			$('#log').append('<li>Attempting to retrieve contacts!</li>').listview('refresh');
			var payload = {
				type : "getContacts",
				userName : userName,
				deviceID : deviceID
			};
			console.log(payload);
			ws.send('getcontacts', payload);
			payload = JSON.stringify(payload);
			$('#log').append('<li data-theme="e">Sent message payload: ' + payload + '</li>').listview('refresh');
		});
	});
});

var myScroll;

function loaded() {
	'use strict';
	setTimeout(function () {
		myScroll = new iScroll('console-wrapper', { fixedScrollbar: true, });
	}, 100);
}

document.addEventListener('DOMContentLoaded', loaded, false);