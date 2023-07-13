const unzip = require('./unzip');
const fs = require('fs');
const moment = require('moment');

let symbol = 'BTCTUSD';
let tick_data_file = `${symbol}_tickdata.csv`;
let lines = [];
let count = 0;
let block = 1000;

function splitBuffer(buffer) {
    // Tách buffer thành các dòng
    let lines = [];
    let currentLine = [];

    for (const byte of buffer) {
        if (byte === 10 || byte === 13) { // Kiểm tra ký tự xuống dòng
            if (currentLine.length > 0) {
                lines.push(Buffer.from(currentLine));
                currentLine = [];
            }
        } else {
            currentLine.push(byte);
        }
    }

    if (currentLine.length > 0) {
        lines.push(Buffer.from(currentLine));
    }

    return lines.map(item => item.toString());
}

function updateData(data) {
    data = splitBuffer(data).map(item => JSON.parse(item));

    for (let trade of data) {
        let info = {
            type: trade.e,
            symbol: trade.s,
            price: trade.p * 1,
            timestamp: moment(trade.E).utc(0).format('YYYY.MM.DD HH:mm:ss.SSS'),
            volume: trade.q * 1,
            isBotTrade: trade.m,
            isMatchedOrder: trade.M,
            idAsk: trade.a,
            idBid: trade.b
        }
        let line = `${info.timestamp}\t${info.price}\t${info.price}\t${info.price}\t${info.volume}\t\n`;
        lines.push(line);
        count++;
        // console.log({ count, timestamp: info.timestamp, price: info.price });
        if (lines.length >= block) {
            console.log(`update ${count}___${info.timestamp}`);
            let s = lines.join('');
            lines = [];
            fs.appendFileSync(tick_data_file, s);
        }
    }
    if (lines.length > 0) {
        console.log(`update ${count}`);
        let s = lines.join('');
        lines = [];
        fs.appendFileSync(tick_data_file, s);
    }
}

async function main() {

    fs.writeFileSync(tick_data_file, '');

    const fileList = fs.readdirSync('./data');
    fileList.sort();

    for (let fileName of fileList) {
        let zipPath = `./data/${fileName}`;
        let fileTXT = `${symbol}_${fileName}`.replace('zip', 'txt');
        let data = await unzip(zipPath, fileTXT);
        // data = data.split('\n').filter(item => item.trim());
        // data = data.map(item => JSON.parse(item));
        console.log('extract', fileName);
        updateData(data);
    }

}

main();