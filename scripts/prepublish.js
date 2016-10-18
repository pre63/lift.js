var fs = require('fs');
var exec = require('child_process').exec;

var dir = 'npm';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

fs.createReadStream('src/lift.js').pipe(fs.createWriteStream('npm/lift.js'));

exec('babel src/lift.js -o npm/lift-min.js --minified', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
  }
  console.log(stdout);

  console.log('prebublish done');
});