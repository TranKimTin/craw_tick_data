var ping = require('ping');
const fs = require('fs');

let hosts = fs.readdirSync('C:\\Users\\DreamStore\\Desktop\\Tin_remote_shortcut');
hosts = hosts.map(item => {
    let dotIndex = item.indexOf('.');
    item = item.slice(dotIndex - 3, dotIndex + 12)
        .split('')
        .filter(item => item == '.' || (item >= '0' && item <= '9'));
    if (item[item.length - 1] == '.') item.pop();
    return item.join('');
});
hosts = [...new Set(hosts)];

async function main() {
    for (let host of hosts) {
        let res = await ping.promise.probe(host);
        console.log(res.host, res.alive);
    }
}
main();