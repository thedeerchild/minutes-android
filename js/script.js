function encodeToParagraph(str) {
    return str
        .replace(/\r\n?/g,'\n')
        // normalize newlines - I'm not sure how these
        // are parsed in PC's. In Mac's they're \n's
        .replace(/(^((?!\n)\s)+|((?!\n)\s)+$)/gm,'')
        // trim each line
        .replace(/(?!\n)\s+/g,' ')
        // reduce multiple spaces to 2 (like in "a    b")
        .replace(/^\n+|\n+$/g,'')
        // trim the whole string
        .replace(/[<>&"']/g,function(a) {
        // replace these signs with encoded versions
            switch (a) {
                case '<'    : return '&lt;';
                case '>'    : return '&gt;';
                case '&'    : return '&amp;';
                case '"'    : return '&quot;';
                case '\''   : return '&apos;';
            }
        })
        .replace(/\n{2,}/g,'</p><p>')
        // replace 2 or more consecutive empty lines with these
        .replace(/\n/g,'<br />')
        // replace single newline symbols with the <br /> entity
        .replace(/^(.+?)$/,'<p>$1</p>');
        // wrap all the string into <p> tags
        // if there's at least 1 non-empty character
}

$(function(){

	DOMAIN = 'http://minutesreader.herokuapp.com/';

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
		console.log("Timer set at "+storage.getItem('timer'));

		readingTimer = window.setInterval(function(){
			// Decrement timer
			var val = storage.getItem('timer');
			val = val - 1000;

			// If it's <= zero, set it to 0 and announce it
			if (val <= 0) {
				val = 0;
				timeUpAlert();

				window.clearInterval(readingTimer);
			}

			// Save the value to local storage
			storage.setItem('timer', val);
		}, 1000)
	}

	var timeUpAlert = function() {
		console.log("Time's up!");
	}

	var loadArticle = function(reader) {
		// Find the reader
		if (typeof reader === 'undefined') var reader = $('#reader');

		// Delete old content
		reader.find('.article-text').empty();

		// Ask for new content
		var params = {
			minutes: storage.getItem('timer') / 1000 / 60,
			current: 10,
			token: window.localStorage.getItem('access_token'),
		};
		$.get(DOMAIN+'article.json', params, function(data, textStatus, jqXHR) {
			console.log("Found an article that's "+data.minutes+" minutes long with "+(storage.getItem('timer') / 1000 / 60)+" minutes left.");

			// Fill in content
			var content = $('#reader .article-text');
			$('<h2 />', {text: data.title}).appendTo(content);
			$(data.content).appendTo(content);
		});
	}

	var nextArticle = function() {
		var $currentPage = $('#reader');
		var $nextPage = $currentPage.clone().attr('id','').insertAfter($currentPage);

		$.mobile.changePage($nextPage, {
			transition: 'slideup',
		});

		window.setTimeout(function(){
			$currentPage.remove();
		}, 1000);
		$nextPage[0].id = 'reader';

		loadArticle($nextPage);
	}

	$('body').on('click', '.next-article-button', function(e) {
		nextArticle();
		e.preventDefault();
	});

});