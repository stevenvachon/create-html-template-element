"use strict";

module.exports = htmlString =>
{
	const element = document.createElement("template");
	element.innerHTML = htmlString;
	return element;
};
