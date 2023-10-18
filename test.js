const WebSocket = require('ws');
const trade = new WebSocket(`wss://fstream.binance.com/ws/btcusdt@trade`);
let cnt = 0;
trade.on('message', function incoming(data) {
    console.log(cnt++, data.toString());
})