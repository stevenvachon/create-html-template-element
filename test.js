"use strict";
const {after, before, it} = require("mocha");
const puppeteer = require("puppeteer");

const runInBrowser = func => () => page.evaluate(func);

let browser, page;



before(async () =>
{
	browser = await puppeteer.launch({ args: ["--no-sandbox"] });
	page = await browser.newPage();

	page.on("console", msg => msg.args().forEach(async arg => console.log(await arg.jsonValue())));

	await Promise.all(
	[
		page.addScriptTag({ path: "node_modules/chai/chai.js" }),
		page.addScriptTag({ path: "temp.js" })/*,

		page.evaluate(() => new Promise(resolve =>
		{
			const iframe = document.createElement("iframe");
			iframe.srcdoc = `<script async src="temp.js"></script>`;
			iframe.onload = () => resolve();
			document.body.appendChild(iframe);
		}))*/
	]);

	// @todo https://github.com/GoogleChrome/puppeteer/issues/4387
	await page.evaluate(() => new Promise(resolve =>
	{
		const iframe = document.createElement("iframe");
		iframe.srcdoc = `<script>window.createHTMLTemplateElement=${window.createHTMLTemplateElement.toString()}</script>`;
		iframe.onload = () => resolve();
		document.body.appendChild(iframe);
	}));

	await page.evaluate(() =>
	{
		window.anotherRealm = document.querySelector("iframe").contentWindow;
		window.expect = chai.expect;
		delete window.chai; // cleanup
	});
});



after(() => browser.close());



it("is a (bundled) function", runInBrowser(() =>
{
	expect(window.createHTMLTemplateElement).to.be.a("function");
}));



it("works as a regular function", runInBrowser(() =>
{
	const result = createHTMLTemplateElement(`<elm attr="val">txt</elm>`);
	expect(result).to.be.an("HTMLTemplateElement");
}));



it("works as a tagged template literal", runInBrowser(() =>
{
	const html = createHTMLTemplateElement;
	const result = html`<elm attr="val">txt</elm>`;
	expect(result).to.be.an("HTMLTemplateElement");
}));



it("works cross-realm with and without importNode", runInBrowser(() =>
{
	const result = anotherRealm.createHTMLTemplateElement(`<elm attr="val">txt</elm>`);
	const imported = document.importNode(result);

	expect(anotherRealm.HTMLTemplateElement).not.to.equal(window.HTMLTemplateElement);

	expect(result).not.to.be.an.instanceOf(window.HTMLTemplateElement);
	expect(result).to.be.an.instanceOf(anotherRealm.HTMLTemplateElement);
	expect(result.ownerDocument).not.to.equal(window.document);
	expect(result.ownerDocument).to.equal(anotherRealm.document);

	expect(imported).to.be.an.instanceOf(window.HTMLTemplateElement);
	expect(imported).not.to.be.an.instanceOf(anotherRealm.HTMLTemplateElement);
	expect(imported.ownerDocument).to.equal(window.document);
	expect(imported.ownerDocument).not.to.equal(anotherRealm.document);

	expect(() => document.body.appendChild(result)).not.to.throw();
	expect(() => document.body.appendChild(imported)).not.to.throw();

	expect(() => document.body.appendChild(result.content.cloneNode(true))).not.to.throw();
	expect(() => document.body.appendChild(imported.content.cloneNode(true))).not.to.throw();
}));
