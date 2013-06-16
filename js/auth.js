AUTH = {

	domain: 'http://minutesreader.herokuapp.com/',
	client: 'http://minutesreader.com/android-dev/,

	getRequestToken: function() {
		var url = 'http://minutesreader.herokuapp.com/auth/pocket/token.json';
		var params = {
			uri: AUTH.client + '%23auth',
		}

		$.get(url, params, function(data, textStatus, jqXHR) {
			window.localStorage.setItem('request_token', data.request_token);
			AUTH.goToAuthPage(data.request_token, params.uri);
		});
	},

	goToAuthPage: function(request_key, redirect_uri) {
		var url = 'https://getpocket.com/auth/authorize?request_token='+request_key+'&redirect_uri='+redirect_uri;
		window.location.href = url;
	},

	getAccessToken: function() {
		var url = 'http://minutesreader.herokuapp.com/auth/pocket/access_token.json';
		var params = {
			token: window.localStorage.getItem('request_token'),
		}

		$.get(url, params, function(data, textStatus, jqXHR) {
			// Save the access token and ditch the request token
			window.localStorage.setItem('access_token', data.access_token);
			window.localStorage.setItem('request_token', null);

			// Tell the user sign-in worked, and redirect to the home page
			$('#auth p').text('Sign in successful!');
			window.setTimeout(function(){
				$.mobile.changePage($('#home'), {transition: 'slideup'})
			}, 1000);
		});
	},

};

// When the front page is loaded, check to see if the user has authenticated
$(document).on('pageinit', '#home', function(){
	// No access token stored (ie, no logged-in user)
	if (window.localStorage.getItem('access_token') === null) {
		$.mobile.changePage($('#signin'), {transition: 'pop'});
	}
});

// When the sign-in page is loaded, attach click events
$(document).on('pageinit', '#signin', function(){
	// If a request token is in place then we're halfway through OAuth
	if (window.localStorage.getItem('request_token') !== null) {
		$.mobile.changePage($('#auth'));
	}

	$(this).find('.pocket-sign-in-button').click(function(){
		AUTH.getRequestToken();
	});
});

// When the authentication page is loaded, try to get an access token
$(document).on('pageinit', '#auth', function(){
	AUTH.getAccessToken();
});