// string generators
function generateUserName() {
	'use strict';
	var text = ''
	, i
	, possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for(i=0; i < 16; i++ ) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function generateDeviceID() {
	'use strict';
	var text = ''
	, i
	, possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for(i=0; i < 16; i++ ) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function generatePassword() {
	'use strict';
	var text = ''
	, i
	, possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for(i=0; i < 8; i++ ) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function generateMessage() {
	'use strict';
	var text = ''
	, i
	, possible = '!@#$%^&*(){}-+=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for(i=0; i < 64; i++ ) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}