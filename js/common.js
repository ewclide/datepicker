$(document).ready(function(){

	$("#date").datePicker({
		lang 	   : "en",
		textButton : "Choose the date",
		textApply  : "let go",
		textClear  : "let clear",
		onApply    : function(e)
		{
			console.log(e)
		}
	});

});