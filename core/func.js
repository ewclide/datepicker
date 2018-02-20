var DOC = {
	create : function(tag, attr, css)
	{
		var $element = $(document.createElement(tag));
		if (typeof attr == "string") $element.addClass(attr);
		else if (typeof attr == "object") $element.attr(attr);
		if (css) $element.css(css);
		return $element;
	}
}

function wrapCallBack(callback)
{
	if (typeof callback == "string")
		return eval("(function(){ return " + callback + "})()");

	else if (typeof callback == "function")
		return callback;
}

export { DOC, wrapCallBack }