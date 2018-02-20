import { DatePicker } from './date-picker';

$.fn.datePicker = function(options)
{
	this.each(function(){
		if (options) options.$element = $(this);
		else options = { $element: $(this) };
		this.datePicker = new DatePicker(options);
	});
}

$(document).ready(function(){
	$("[data-datepicker]").datePicker();
});
