/**
 * simple client
 */

// so jslint doesn't flip
/*global window */
/*global document */
/*global console */
/*global $ */


// string generators
function generateUserName()
	{
		"use strict";
		var text = ''
		, i
		, possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for(i=0; i < 16; i++ ) {
    		text += possible.charAt(Math.floor(Math.random() * possible.length));
    	}
		return text;
}

function generateDeviceID()
	{
		"use strict";
		var text = ''
		, i
		, possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for(i=0; i < 16; i++ ) {
    		text += possible.charAt(Math.floor(Math.random() * possible.length));
    	}
		return text;
}

function generatePassword()
	{
		"use strict";
		var text = ''
		, i
		, possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for(i=0; i < 8; i++ ) {
    		text += possible.charAt(Math.floor(Math.random() * possible.length));
    	}
		return text;
}

function generateMessage()
	{
		"use strict";
		var text = ''
		, i
		, possible = '!@#$%^&*(){}-+=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for(i=0; i < 64; i++ ) {
    		text += possible.charAt(Math.floor(Math.random() * possible.length));
    	}
		return text;
}

// Initialize everything when the window finishes loading
window.addEventListener("load", function(event) {
	"use strict";
	var status = document.getElementById("status")
	, url = document.getElementById("url")
	, connect = document.getElementById('connect')
	, disconnect = document.getElementById('disconnect')
	, send = document.getElementById("send")
	, text = document.getElementById("text")
	, message = document.getElementById("message")
	, userName
	, userNameActive = document.getElementById("username")
	, uid
	, uidActive = document.getElementById('uid')
	, passWord
	, passWordActive = document.getElementById("password")
	, deviceID
	, deviceIDActive = document.getElementById("deviceID");
	
// intial state	
	status.textContent = "Not Connected";

	disconnect.disabled = true;
	send.disabled = true;
	userNameActive.textContent = 'Not logged in';
	passWordActive.textContent = '********';
	deviceIDActive.textContent = '0000000000000000';
	$('#connectTokoyo').click(function() {
		url.value = "ws://tokoyo.lucidev.info"
	});
	$('#connectLondon').click(function() {
		url.value = "ws://london.lucidev.info"
	});
	$('#connectNewark').click(function() {
		url.value = "ws://newark.lucidev.info"
	});
	$('#connectAtlanta').click(function() {
		url.value = "ws://atlanta.lucidev.info"
	});
	$('#connectDallas').click(function() {
		url.value = "ws://dallas.lucidev.info"
	});
	$('#connectFremont').click(function() {
		url.value = "ws://freemont.lucidev.info"
	});
	
// start ye engines
	$('#connect').click(function() {
		var ws = $.websocket(url.value, {
		    open: function() {
		    	connect.disabled = true;
				disconnect.disabled = false;
		        send.disabled = false;
		        console.log();
		        status.textContent = 'Connected';
		        $('#log').append('<li>Connected to ' + url.value + '</li>');
			},
		    close: function() {
					disconnect.disabled = true;
					connect.disabled = false;
	        		send.disabled = true;
	        		status.textContent = 'Disconnected from ' + url.value;
	        	$('#log').append('<li>Disconnected from ' + url.value + '</li>');
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
					break;

							// newUser        	
	                		case "userSaved":
								uid = data.uid;
								console.log(uid);
								$('#log').append('<li>Response: ' + data.message + '</li>');
							break;
							
	                		case "authRequest":
								$('#log').append('<li>Response: ' + data.message + '</li>');
							break;
							
							case "getContacts":
								// potential hazard
								var contacts = eval('(' + data.message + ')')
								, i;
								
								for (i = 0; i < contacts.length; i++) {
									console.log(contacts[i]);
									var username = contacts[i].userName
									, userID = contacts[i]._id;
								   	
								   	$('#contactList').append('<li>User: ' + username + '</li>');   								
								}		    	 						
								
	   	 					break;

	                		case "newMessage":
								$('#messages').append('<li>New Message: ' + data.message + '</li>');
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
			console.log('Attempting to disconnect from ' + url.value);
		
		});
		
		$('#newUser').click(function() {
        	$('#log').append('<li>Attempting to create a dummy user!</li>');
			
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
			$('#log').append('<li>Sent newUser payload: ' + payload + '</li>');
			
			userNameActive.textContent = userName;
			passWordActive.textContent = passWord;
			deviceIDActive.textContent = deviceID;
			$('#log').append('<li>Your username is now ' + userName + ', your password is ' + passWord + ' and your deviceID is ' + deviceID + '</li>');
		});
		
		$('#authRequest').click(function() {
        	$('#log').append('<li>Attempting to request authentication!</li>');

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
				$('#log').append('<li>Sent authRequest payload: ' + payload + '</li>');					
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
        	$('#log').append('<li>Attempting to send a message!</li>');

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
			
			$('#log').append('<li>Sent message payload: ' + payload + '</li>');
		});

		$('#getContacts').click(function() {
        	$('#log').append('<li>Attempting to retrieve contacts!</li>');

			var payload = {
				type : "getContacts",
				userName : userName,
				deviceID : deviceID
			};
			
			console.log(payload);
			
        	ws.send('getcontacts', payload);
        	payload = JSON.stringify(payload);
			
			$('#log').append('<li>Sent message payload: ' + payload + '</li>');
		});		
	});
});