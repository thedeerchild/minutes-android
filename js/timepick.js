$(document).on('pageinit', '#home', function(){
	var clockText = $('#home .min-count b');
	$('#time-slider').change(function(){
		clockText.text($(this).val());
	})
});