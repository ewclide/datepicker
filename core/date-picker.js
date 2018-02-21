import { DOC, wrapCallBack } from './func';
import { Calendar } from './calendar';

export class DatePicker
{
	constructor(options)
	{
		var self = this,
		date = new Date(),
		$element = options.$element;

		this.settings = {
			className  : options.className  || $element.attr("data-class") || "",
			textButton : options.textButton || $element.attr("data-text-button")|| "pick date",
			textApply  : options.textApply  || $element.attr("data-text-apply") || "apply",
			textClear  : options.textClear  || $element.attr("data-text-clear") || "clear",
			from       : options.from       || $element.attr("data-from"),
			to         : options.to         || $element.attr("data-to"),
			onApply    : options.onApply    || $element.attr("data-on-apply"),
			onClear    : options.onClear    || $element.attr("data-on-clear"),
			onReady    : options.onReady    || $element.attr("data-on-ready"),
			lang       : options.lang       || $element.attr("data-lang")       || "ru",
			yearsCount : options.yearsCount || $element.attr("data-years-count")|| 10
		}

		this.active = false;

		this.state = {
			year  : date.getFullYear(),
			month : date.getMonth(),
			from  : this._getDateFromText(this.settings.from),
			to    : this._getDateFromText(this.settings.to)
		}

		this.calendar = new Calendar(date, this.settings);

		this.monthes = {
			ru : ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
			en : ["January", "February", "Mart", "April", "May", "June", "Jule", "August", "September", "October", "November", "December"]
		}

		this.$elements = {
			main    : $element.addClass("datepicker " + this.settings.className),
			label 	: DOC.create("span", "label"),
			wrapper : DOC.create("div", "wrapper").hide()
		}

		this._create();
		this.choose(this.state.year, this.state.month);
		this.apply(this.state.from, this.state.to);
	}

	_create()
	{
		var self = this,
		$elements = this.$elements,
		settings = this.settings;

		// prepare callbacks
		settings.onApply = wrapCallBack(settings.onApply);
		settings.onClear = wrapCallBack(settings.onClear);
		settings.onReady = wrapCallBack(settings.onReady);

		// monthes list
		$elements.monthes = this._createSelect(this.monthes[settings.lang], "monthes");
		$elements.monthes.change(function(){
			self.state.month = $(this).val();
			self.calendar.render(self.state);
		});

		// years list
		var current = new Date().getFullYear(),
			years = [];

		for (var i = current; i >= current - settings.yearsCount; i--)
			years.push(i);

		$elements.years = this._createSelect(years, "years");
		$elements.years.change(function(){
			self.state.year = $(this).val();
			self.calendar.render(self.state);
		});

		// buttons
		$elements.clear  = DOC.create("button", "clear").text(settings.textClear);
		$elements.apply  = DOC.create("button", "apply").text(settings.textApply);
		$elements.button = DOC.create("button", "button").text(settings.textButton);

		// append elements
		$elements.wrapper.append($elements.monthes, $elements.years, this.calendar.$element);
		$elements.wrapper.append( $("<div class='buttons'></div>").append($elements.clear, $elements.apply) );
		$elements.main.append(
			$("<div class='button-wrapper'></div>").append($elements.button, $elements.label),
			$elements.wrapper
			);

		// listen events
		$elements.button.click(function(){
			self.toogle();
		});
		$elements.apply.click(function(e){
			self.apply(self.state.from, self.state.to, true);
		});
		$elements.clear.click(function(e){
			self.clear();
		});
		this.calendar.$element.click(function(e){
			var day = parseInt(e.target.innerText);
			if (day) self.pick(day);
		});

		if (settings.onReady) settings.onReady(this);
	}

	clear()
	{
		this.state.from = null;
		this.state.to = null;

		this.calendar.render(this.state);

		if (this.settings.onClear) this.settings.onClear();
	}

	apply(from, to, call)
	{
		var ev;

		if (from && to)
		{
			var fromText = this._getTextFromDate(from),
				toText = this._getTextFromDate(to);

			this.$elements.button.text(fromText + " - " + toText);

			ev = {
				from : this._parseDate(from),
				to : this._parseDate(to),
				fromText : fromText,
				toText : toText
			}
		}
		else
		{
			this.$elements.button.text(this.settings.textButton);
			ev = {};
		}

		if (call && this.settings.onApply)
			this.settings.onApply(ev);

		this.close();
	}

	choose(year, month)
	{
		if (typeof year == "number")
		{
			this.$elements.years.val(year);
			this.state.year = year;
		}

		if (typeof month == "number")
		{
			this.$elements.monthes.val(month);
			this.state.month = month;
		}

		this.calendar.render(this.state);
	}

	pick(day)
	{
		var state = this.state,
		current = +new Date(state.year, state.month, day);

		if (!state.from) state.from = current;
		else if (!state.to)
		{
			state.to = current;
			this.calendar.render(state);
		}
		else
		{
			var center = (state.to - state.from) / 2;

			if (current - state.from < center) state.from = current;
			else state.to = current;

			this.calendar.render(state);
		}
	}

	_createSelect(list, className)
	{
		var self = this,
		result = "<select class='" + className +"' >";

		list.forEach(function(item, i){
			var value = i;
			if (typeof item == "number") value = item;
			result += '<option value="' + value + '" >' + item + '</option>';
		});

		result += "</select>";

		return $(result);
	}

	_getTextFromDate(date)
	{
		var result;

		date = this._parseDate(date);

		result  = date.day + ".";
		result += date.month + ".";
		result += date.year;

		return result;
	}

	_getDateFromText(date)
	{
		if (date)
		{
			date = date.split(".");
			return +new Date(date[2], date[1], date[0]);
		}
	}

	_parseDate(date)
	{
		date = new Date(date);

		return {
			day   : date.getDate(),
			month : date.getMonth(),
			year  : date.getFullYear()
		}
	}

	open()
	{
		this.$elements.wrapper.show(250);
		this.$elements.button.addClass("active");
		this.$elements.label.addClass("active");
		this.active = true;
	}

	close()
	{
		this.$elements.wrapper.hide(250);
		this.$elements.button.removeClass("active");
		this.$elements.label.removeClass("active");
		this.active = false;
	}

	toogle()
	{
		if (this.active) this.close();
		else this.open();
	}
}