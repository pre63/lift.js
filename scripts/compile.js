const fs = require('fs');
const exec = require('child_process').exec;

const dir = 'dist';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

exec('babel src -s -d dist ', (error, stdout, stderr) => {
  if (error) {
    console.error(stderr); // eslint-disable-line
  }
  console.log(stdout); // eslint-disable-line
  console.log('compile done'); // eslint-disable-line
});
