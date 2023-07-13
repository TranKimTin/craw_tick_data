// const Binance = require('binance-api-node').default;
const WebSocket = require('ws');
const fs = require('fs');
const moment = require('moment');
const zip = require('./zip');
// const client = Binance();

let symbols = ['BTCBUSD', 'BTCUSDT', 'BTCTUSD'];
let lines = {};
let block = 1000;
let lastDate = moment().format('YYYY-MM-DD');
for (let symbol of symbols) {
    lines[symbol] = [];
}

async function main(s) {
    console.log('craw', s);
    const trade = new WebSocket(`wss://stream.binance.com:9443/ws/${s}@trade`);
    trade.on('message', function incoming(data) {
        try {
            data = JSON.parse(data.toString());
            let symbol = data.s;
            let date = moment(data.E).format('YYYY-MM-DD');
            if (date != lastDate) {
                let _lastDate = lastDate;
                lastDate = date;
                let fileName = `${_lastDate}.zip`;
                let fileList = symbols.map(item => `${item}_${_lastDate}.txt`);
                for (let _symbol of symbols) {
                    let s = lines[symbol].join('\n') + '\n';
                    lines[_symbol] = [];
                    fs.appendFileSync(`${__dirname}/${_symbol}_${_lastDate}.txt`, s);
                }
                zip(fileList, fileName, true);
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
            console.error(err.message)
        }
    });
}
for (let symbol of symbols) {
    main(symbol.toLowerCase());
}
