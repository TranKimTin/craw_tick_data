const Binance = require('binance-api-node').default;
const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
const zip = require('./zip');
const client = Binance();
const WebSocket = require('ws');

let symbols = ['BTCUSDT', 'BTCTUSD', 'TUSDUSDT'];
let prices = {};
let difMax = 0;
let timestamp = 0;
client.ws.trades(symbols, trade => {
// const trade = new WebSocket(`wss://stream.binance.com:9443/ws/btcusdt@trade`);
// trade.on('message', function incoming(trade) {
//  trade = JSON.parse(trade.toString());
    let volume = trade.quantity * 1;

    console.log(trade)
});
