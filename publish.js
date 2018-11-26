require('dotenv').config();
const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const mustache = require('mustache');

function sortByDate(a, b) {
  if (a[0] < b[0]) return 1;
  if (a[0] > b[0]) return -1;
  return 0;
}

function ordinal_suffix_of(i) {
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}

const weekdays = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const publish = () => {

  if(!fs.existsSync('bookmarks.csv')){
    console.log("'bookmarks.csv' does not exists. Not publishing.");
    return
  }

  let bookmarks = fs.readFileSync('bookmarks.csv', 'utf8');
  let parsedData = parse(bookmarks);
  parsedData = parsedData.sort(sortByDate)

  parsedData.forEach(line => {
    let date = new Date(parseInt(line[0]));
    
    let weekday = weekdays[date.getUTCDay()];
    let dayOfMonth = ordinal_suffix_of(date.getUTCDate());
    let month = months[date.getUTCMonth()];
    let year = date.getUTCFullYear();

    let hours = date.getUTCHours();
    hours = hours < 10 ? `0${hours}` : hours;
    let minutes = date.getUTCMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    let dateLine = `${weekday} ${dayOfMonth} of ${month} ${year} @ ${hours}:${minutes}`;

    line.push(dateLine);

    let url = line[1];
    url = url.replace('https://', '');
    url = url.replace('http://', '');
    url = url.split('/')[0];

    line.push(url);
  });

  let template = fs.readFileSync('template.mustache', 'utf8');
  let html = mustache.to_html(template, {context: parsedData, title: process.env.TITLE, description: process.env.DESCRIPTION });
  fs.writeFileSync('public/index.html', html, 'utf8');
}



module.exports = {
  publish: publish
}