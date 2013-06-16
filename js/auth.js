AUTH = {

	getRequestToken: function() {
		var url = 'http://minutesreader.herokuapp.com/auth/pocket/token.json';
		var params = {
			uri: 'http://localhost:8888/minutes-android/%23auth',
		}

		$.get(url, params, function(data, textStatus, jqXHR) {
			console.log(data);
			AUTH.goToAuthPage(data.request_token, params.uri);
		});
	},

	goToAuthPage: function(request_key, redirect_uri) {
		// var url = 'https://getpocket.com/auth/authorize?request_token='+request_key+'&redirect_uri='+redirect_uri;
		var url = 'https://getpocket.com/auth/authorize?request_token='+request_key+'&redirect_uri='+redirect_uri;
		window.location.href = url;
	},

	getAccessToken: function(request_key) {
		var url = 'http://minutesreader.herokuapp.com/auth/pocket/';
		var params = {
			request_key: request_key,
		}

		$.get(url, params, function(data, textStatus, jqXHR) {
			console.log(data);
		});
	},

};

$(document).on('pageinit', '#signin', function(){
	console.log("Hey");
	$(this).find('.pocket-sign-in-button').click(function(){
		AUTH.getRequestToken();
	});
});