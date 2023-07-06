
const AdmZip = require('adm-zip');

module.exports = function (zipPath, fileName) {
    return new Promise(function (resolve, reject) {
        const zip = new AdmZip(zipPath);

        // Lấy danh sách các file và thư mục trong file zip
        const zipEntries = zip.getEntries();
        for (let entry of zipEntries) {
            // Kiểm tra entry có phải là một file không
            if (!entry.isDirectory) {
                if (fileName == entry.entryName) {
                    const fileContent = zip.readFile(entry);
                    return resolve(fileContent);
                }
            }
        };
        return reject();
    });
}
