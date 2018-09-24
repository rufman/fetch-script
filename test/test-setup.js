const { JSDOM } = require('jsdom');

require('whatwg-fetch');
global.fetch = require('jest-fetch-mock');

const jsdom = new JSDOM('<!doctype html><html><head></head><body></body></html>');
const { window } = jsdom;

global.window = window;
global.document = window.document;
global.self = window.self;
global.navigator = {
  userAgent: 'node.js',
};
global.HTMLElement = window.HTMLElement;
