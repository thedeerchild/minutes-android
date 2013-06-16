$(function(){

	DOMAIN = 'http://minutes.herokuapp.com/';

	// Timer stuff

	var storage = window.localStorage;

	// The timer is null initially
	storage.setItem('timer', null);

	// Set the timer when the user clicks their timer button
	$('body').on('click', '.start-reading-button', function(){

	});

	var initTimer = function() {
		
	}

	var loadArticle = function() {
		var params = {
			minutes: 10,
			current: 10,
			token: '08bd1ab3-7915-4b94-72e4-da6ed6',
		};
		$.get(DOMAIN.'article.json', params, function('application/json'){
			console.log(data);
		});
	}

});