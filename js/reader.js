$(function(){

	DOMAIN = 'http://api.minutesreader.com/';

	/*
		Timer stuff
	*/

	var storage = window.localStorage;
	var readingTimer;

	// The timer is null initially
	storage.setItem('timer', null);

	// Set the timer when the user clicks their timer button
	$('body').on('click', '.start-reading-button', function(){
		// Initialize the timer
		initTimer($('#time-slider').val() * 60 * 1000);
		loadArticle();
	});

	var initTimer = function(val) {
		storage.setItem('timer', val);

		$('.article-footer p').text('Your time\'s about up! Have a good day.');
		$('.article-footer .ui-btn-text').text('Finish');

		readingTimer = window.setInterval(function(){
			// Decrement timer
			var val = storage.getItem('timer');
			val = val - 1000;

			// If it's <= zero, set it to 0 and announce it
			if (val <= 0) {
				val = 0;

				timeUpAlert();
				killTimer();
			}

			// Save the value to local storage
			storage.setItem('timer', val);
		}, 1000)
	}

	var timeUpAlert = function() {
		console.log("Time's up!");

		$('.article-footer p').text('You\'ve got more time; go ahead and keep reading!');
		$('.article-footer .ui-btn-text').text('Next');
	}
	var killTimer = function() {
		window.clearInterval(readingTimer);
	}

	var loadArticle = function(reader, save) {
		if (typeof reader === 'undefined') var reader = $('#reader');
		if (typeof save === 'undefined') var save = false;
		if (save === true) articleID = 0;
		else articleID = window.localStorage.getItem('current_article');

		// Delete old content
		reader.find('.article-text').empty();

		// Hide article footer/show loading indicator
		var uiMore = reader.find('.article-footer').hide(0);
		var uiLoading = reader.find('.loading-text').show(0);

		// Ask for new content
		var params = {
			minutes: storage.getItem('timer') / 1000 / 60,
			current: 10,
			token: window.localStorage.getItem('access_token'),
		};
		$.get(DOMAIN+'article.json', params, function(data, textStatus, jqXHR) {
			// console.log(data);
			// console.log("Found an article that's "+data.minutes+" minutes long with "+(storage.getItem('timer') / 1000 / 60)+" minutes left.");

			// Fill in content
			var content = $('#reader .article-text');
			$('<h2 />', {text: data.title}).appendTo(content);
			$(data.content).appendTo(content);

			window.localStorage.setItem('current_article', data.id);

			// Show article footer/hide loading indicator
			uiMore.show(0);
			uiLoading.hide(0);
		});
	}

	var nextArticle = function(skip) {
		var $currentPage = $('#reader');
		var $nextPage = $currentPage.clone().attr('id','').insertAfter($currentPage);

		$.mobile.changePage($nextPage, {
			transition: 'slideup',
		});

		window.setTimeout(function(){
			$currentPage.remove();
		}, 1000);
		$nextPage[0].id = 'reader';

		if (typeof skip === 'undefined') var skip = false;
		loadArticle($nextPage, skip);
	}

	// Click events for next/skip buttons
	$('body').on('click', '.next-article-button', function(e) {
		if (window.localStorage.getItem('timer') > 0) {
			nextArticle();
			e.preventDefault();
		}
		else {
			$.mobile.changePage($('#home'), {transition: 'slide'});
		}
	});
	$('body').on('click', '.skip-article-button', function(e) {
		nextArticle(true);
		e.preventDefault();
	});

	// If the reader is loaded as the initial page, go back to the home screen
	$(document).on('pageinit', '#reader', function(){
		if (window.localStorage.getItem('timer') === null) {
			$.mobile.changePage($('#home'));
		}
	});

	// Set font size CSS on page ready
	$(document).on('pageinit', '#reader', function(){
		var size = $('input[name="textSize"]:checked').val();

		$('#reader').addClass('reader-textsize-'+size);
	});

	// Saving/loading text size choice
	$('input[name="textSize"]').change(function(){
		window.localStorage.setItem('text-size', $(this).val());
	});
	$(document).ready(function(){
		var size = window.localStorage.getItem('text-size');
		if (size !== null) {
			$('input[name="textSize"][value="'+size+'"]').prop('checked', true);
		}
	});

	$(document).on('pageinit', '#home', function(){
		killTimer();
	});


});