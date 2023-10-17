// const Binance = require('binance-api-node').default;
const WebSocket = require('ws');
const fs = require('fs');
const moment = require('moment');
const zip = require('./zip');
// const client = Binance();

let symbols = ['BTCUSDT', 'ETHUSDT', 'f_BTCUSDT', 'f_ETHUSDT'];
let lines = {};
let block = 1000;
let lastDate = moment().utc(0).format('YYYY-MM-DD');
for (let symbol of symbols) {
    lines[symbol] = [];
}

let ziped = {};
async function main(s) {
    console.log('craw', s, moment().format('YYYY-MM-DD HH:mm:SS'));
    const trade = new WebSocket(`wss://${(s.includes('f_') ? 'f' : '')}stream.binance.com/ws/${s.replace('f_', '')}@trade`);
    trade.on('message', function incoming(data) {
        try {
            data = JSON.parse(data.toString());
            let symbol = data.s;
            let isFuture = data.X ? true : false;
            if (isFuture) symbol = 'f_' + symbol;
            let date = moment(data.E).utc(0).format('YYYY-MM-DD');
            if (date != lastDate && !ziped[lastDate]) {
                console.log({ date, lastDate })
                let _lastDate = lastDate;
                lastDate = date;
                ziped[_lastDate] = true;
                let zipPath = `${__dirname}/data/${_lastDate}.zip`;
                let fileList = symbols.map(item => `${item}_${_lastDate}.txt`);
                for (let _symbol of symbols) {
                    let s = lines[_symbol].join('\n') + '\n';
                    lines[_symbol] = [];
                    fs.appendFileSync(`${__dirname}/${_symbol}_${_lastDate}.txt`, s);
                }
                zip(fileList, zipPath, true);
            }

            let line = JSON.stringify(data);
            lines[symbol].push(line);
            if (lines[symbol].length >= block) {
                let s = lines[symbol].join('\n') + '\n';
                lines[symbol] = [];
                fs.appendFileSync(`${__dirname}/${symbol}_${date}.txt`, s);
            }
        }
        catch (err) {
            console.log('ERROR', err.message)
        }
    });
}
for (let symbol of symbols) {
    main(symbol.toLowerCase());
}
