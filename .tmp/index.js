
var ReactDOM = require('react-dom');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

window['_airtableReact'] = React;
window['_airtableReactDOM'] = ReactDOM;
window['_airtableReactDOMServer'] = ReactDOMServer;
window['_airtableBlockCodeVersion'] = '06ef3f44c2666518f32818975209eb0ba9888ed5';
var didRun = false;
window['_airtableRunBlock'] = function runBlock() {
    if (didRun) {
        console.log('Refusing to re-run block');
        return;
    }
    didRun = true;
    
    // Requiring the entry point file runs user code. Be sure to do any setup
    // above this line.
    require("./../views/index.js");
};
