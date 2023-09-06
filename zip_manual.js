const zip = require('./zip');
let symbols = ['BTCBUSD', 'BTCUSDT', 'BTCTUSD'];
let date = '2023-09-03';
let zipPath = `${__dirname}/data/${date}.zip`;
let fileList = symbols.map(item => `${item}_${date}.txt`);
console.log(zipPath, fileList)
zip(fileList, zipPath, false);