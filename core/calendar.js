import { DOC, wrapCallBack } from './func';

export class Calendar
{
	constructor(date, settings)
	{
		var self = this;

		this.$element = DOC.create("div", "calendar");
		this.lang = settings.lang;
		this.now = {
			year  : date.getFullYear(),
			month : date.getMonth(),
			day   : date.getDate()
		}
		this.header = {
			ru : ["пн", "вт", "ср", "чт", "пт", "сб", "вс" ],
			en : ["mon", "tu", "wed", "th", "fr", "sa", "sun" ]
		}

		this.$element[0].onselectstart = function(){ return false; };

		this.render(this.now);
	}

	render(data)
	{
		var list = this._getDaysList(data.year, data.month, data.from, data.to),

		result =  "<div class='days-header'>";
		this.header[this.lang].forEach(function(day){ result += "<div>" + day + "</div>" });
		result += "</div>";
		result += "<div class='days-table'>";

		list.forEach(function(item){
			var cls = "";

			if (item.today) cls = "today";

			if (item.selected) cls += " selected";
			else if (item.edge) cls += " edge";

			if (cls) result += "<div class='" + cls +"'>" + item.day + "</div>";
			else if (item) result += "<div>" + item + "</div>";
			else result += "<div class='empty'></div>";
		});

		result += "</div>";

		this.$element.empty();
		this.$element.append(result);
	}

	_getDaysList(year, month, from, to)
	{
		var date = new Date(year, month),
		list = [];

		for (var i = 0; i < this._getDay(date); i++) list.push("");

			while (date.getMonth() == month)
			{
				var info = {},
				have = 0,
				day = date.getDate();

				if (year == this.now.year && month == this.now.month && day == this.now.day)
				{
					have++;
					info.today = true;
				}

				if (from && to)
				{
					var current = +new Date(year, month, day);

					(current > from && current < to) ? (have++, info.selected = true) :
					(current == from || current == to) && (have++, info.edge = true);
				}

				if (have) info.day = day;
				else info = day;

				list.push(info);

				date.setDate(day + 1);
			}

		if (this._getDay(date) != 0)
			for (var i = this._getDay(date); i < 7; i++) list.push("");

		return list;
	}

	_getDay(date)
	{
		var day = date.getDay();
		if (day == 0) day = 7;
		return day - 1;
	}
}