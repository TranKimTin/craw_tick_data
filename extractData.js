const unzip = require('./unzip');
const fs = require('fs');

async function main() {
    const fileList = fs.readdirSync('./data');
    fileList.sort();
    let symbol = 'BTCTUSD';
    for (let fileName of fileList) {
        let zipPath = `./data/${fileName}`;
        let fileTXT = `${symbol}_${fileName}`.replace('zip', 'txt');
        let data = await unzip(zipPath, fileTXT);
        data = data.split('\n').filter(item => item.trim());
        data = data.map(item => JSON.parse(item));
        for (let trade of data) {
            
        }

    }

}

main();