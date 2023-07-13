const WebSocket = require('ws');
const moment = require('moment');

let symbol = 'btctusd';
const trade = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);
console.log('steam', symbol);
trade.on('message', function incoming(trade) {
    trade = JSON.parse(trade.toString());
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
    };
    console.log(info)
});