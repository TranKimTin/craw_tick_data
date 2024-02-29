const ccxt = require('ccxt');
const fs = require('fs');
const moment = require('moment');

let apikey = {
    'apiKey': '',
    'secret': ''
}//tin-public

let binance = new ccxt.binance(apikey);
// binance.setSandboxMode(true);

async function getOHLCV(coin, time, limit) {
    let result = [];
    let maxCall = 1000;
    let since = undefined;
    let check = {};
    while (limit > 0) {
        if (limit > maxCall) console.log(`getOHLCV pending ${limit}`);
        let data = await binance.fetchOHLCV(coin, time, since, Math.min(limit, maxCall));
        data = data.map(item => ({
            day: moment(item[0]).utc(0).format('YYYY.MM.DD'),
            hour: moment(item[0]).utc(0).format('HH:mm'),
            open: item[1],
            high: item[2],
            low: item[3],
            close: item[4],
            volume: item[5],
            timeInt: item[0],
            color: item[1] > item[4] ? 'RED' : 'GREEN',
            diff: Math.abs(item[4] - item[1]) / item[1]
        })).filter(item => !check[item.timeInt]);
        if (data.length == 0) break;
        data.sort((a, b) => a.timeInt - b.timeInt);
        result.push(...data);
        for (let item of data) {
            check[item.timeInt] = true;
        }
        limit -= Math.min(limit, maxCall);
        since = moment(data[0].timeInt).subtract(Math.min(limit, maxCall) * time.slice(0, time.length - 1), time[time.length - 1]).valueOf();
    }
    result.sort((a, b) => a.timeInt - b.timeInt);

    return result;
}

let symbol = 'BTC/USDT';
let period = '15m';
let PERIOD = 15;
async function main() {
    let oneDay = 1440;
    let limit = oneDay * 365 * 4 / PERIOD;
    let data = await getOHLCV(symbol, period, limit);
    let filename = `${symbol.replace('/', '_')}_${period}.csv`;
    fs.writeFileSync(filename, '');
    let lines = [];
    for (let candle of data) {
        //MT4
        let line = `${candle.day}\t${candle.hour}\t${candle.open}\t${candle.high}\t${candle.low}\t${candle.close}\t${candle.volume}\n`;
        lines.push(line);
        if (lines.length > 10000) {
            console.log(lines);
            fs.appendFileSync(filename, lines.join(''));
            lines = [];
        }
    }
    fs.appendFileSync(filename, lines.join(''));
}
main();