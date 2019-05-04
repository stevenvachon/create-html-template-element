# create-html-template-element [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> Create an HTML `<template>` with content.


## Installation

[Node.js](http://nodejs.org/) `>= 10` is required. To install, type this at the command line:
```shell
npm install create-html-template-element
```


## Importing

ES Module:
```js
import createHTMLTemplateElement from 'create-html-template-element';
```

CommonJS Module:
```js
const createHTMLTemplateElement = require('create-html-template-element');
```


## Usage

As a [tagged template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates) (notice the syntax highlighting):
```js
const html = createHTMLTemplateElement;

const TEMPLATE = html`
  <elm attr="val">txt</elm>
`;
//-> HTMLTemplateElement
```

As a regular function:
```js
const TEMPLATE = createHTMLTemplateElement(`<elm attr="val">txt</elm>`);
//-> HTMLTemplateElement
```


[npm-image]: https://img.shields.io/npm/v/create-html-template-element.svg
[npm-url]: https://npmjs.com/package/create-html-template-element
[travis-image]: https://img.shields.io/travis/stevenvachon/create-html-template-element.svg
[travis-url]: https://travis-ci.org/stevenvachon/create-html-template-element
