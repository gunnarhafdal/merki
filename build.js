require('dotenv').config();
const fs = require('fs');
const mustache = require('mustache');

console.log("Publishing 'bookmarks.csv' to 'public/index.html'.");
const publish = require('./publish');
publish.publish();

console.log("Creating 'bookmarklet.js'.");
let template = fs.readFileSync('bookmarklet.mustache', 'utf8');
let html = mustache.to_html(template, {secret: process.env.SECRET, domain: process.env.DOMAIN });
fs.writeFileSync('bookmarklet.js', html, 'utf8');
console.log("Done.");