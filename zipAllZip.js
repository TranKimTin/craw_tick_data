const zip = require('./zip');
const fs = require('fs');

let zipFileName = 'all.zip';

if (fs.existsSync(zipFileName)) {
    fs.unlinkSync(zipFileName);
}

let fileList = fs.readdirSync('./');
fileList = fileList.filter(item => item.includes('.zip'));

zip(fileList, zipFileName, false);
