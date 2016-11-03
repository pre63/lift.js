'use strict';

const fs = require('fs');
const exec = require('child_process').exec;

const dir = 'dist';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

exec(`babel src -s -d dist --minified --compact --no-comments`, (error, stdout, stderr) => {
  if (error) {
    console.error(error);
  }
  console.log(stdout);
  console.log(`compile done`);
});