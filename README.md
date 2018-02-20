#Date picker
-------------
### Options
- **className** - add user class attribute
- **textButton** - add text to open button
- **textApply** - text to apply button
- **textClear** - text to clear button
- **from** - defines selection dates, have format "31.01.2018"
- **to** - defines selection dates, have format "31.01.2018"
- **onApply** - callback on apply button
- **onClear** - callback on clear button
- **onReady** - callback on ready datepicker, get link to the object as argument
- **lang** - defines language wich will be useing. Support "en" and "ru"
- **yearsCount** - count of years on select list

### How to use

html version:

	just add attribute data-datepicker and use options as "data-" attributes

```html
	<div data-datepicker
		data-from="31.01.2018"
		data-to="01.01.2018"
		data-on-apply="getAction"
		data-class="date-news-filter"
		data-text-button="Choose the date"
		data-text-apply="let go"
		data-text-clear="let clear"
	></div>
```
js version:

```js
	$("#date").datePicker({
		textButton : "Choose the date",
		textApply  : "let go",
		textClear  : "let clear",
		onApply    : function(e)
		{
			// some actions
		}
	});
```

### Result

![result on page](/img/result.jpg)

-------------
Thank's for using.
Developed by Ustinov Maxim - [ewclide](http://vk.com/ewclide)