const fs = require('fs');
const archiver = require('archiver');

module.exports = function (fileList, zipPath, removeAfterZip) {
    console.log('zip', { fileList, zipPath })
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    output.on('close', function () {
        console.log('Zip file done ' + archive.pointer() + ' total bytes');
        if (archive.pointer() && removeAfterZip) {
            for (let file of fileList) {
                try {
                    fs.unlinkSync(`${__dirname}/${file}`);
                }
                catch (err) {
                    console.log('ERROR', err.message);
                }
            }
        }
    });

    output.on('end', function () {
        console.log('Zip file end');
    });

    archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
        } else {
            console.log('ERROR', err.message);
            throw err;
        }
    });

    archive.on('error', function (err) {
        console.log('ERROR', err.message);
        throw err;
    });
    archive.pipe(output);
    for (let file of fileList) {
        archive.file(`${__dirname}/${file}`, { name: file });
    }
    archive.finalize();
}