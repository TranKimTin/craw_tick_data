const Binance = require('binance-api-node').default;
const fs = require('fs');
const moment = require('moment');
const zip = require('./zip');
const client = Binance();

let symbols = ['BTCBUSD', 'BTCUSDT', 'BTCTUSD'];
let lines = {};
let block = 1000;
let lastDate = moment().format('YYYY-MM-DD');
for (let symbol of symbols) {
    lines[symbol] = [];
}

client.ws.trades(symbols, trade => {
    try {
        let symbol = trade.symbol;
        let date = moment(trade.eventTime).format('YYYY-MM-DD');
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
            zip(fileList, fileName);
        }

        let line = JSON.stringify(trade);
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

