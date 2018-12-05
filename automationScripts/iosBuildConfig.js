const fs = require('fs');
const xml2js = require('xml2js');

let EXShellPlist = 'ios/tatasky-broadband/Supporting/EXShell.plist';
let env  = process.argv[2];

const readFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (error, data) => {
            if (error) {
                reject(error);
            }
            else if (data) {
                resolve(data);
            }
        });
    });
};

const convertToJson = (xmlData) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xmlData, (error, out) => {
            if (error) {
                reject(error);
            }
            else if (out) {
                resolve(out);
            }
        });
    });
}

const appendEnvVariable = (jsonData) => {
    return new Promise((resolve, reject) => {
        let valArr = jsonData.plist.dict[0]['string'];
        valArr[valArr.length - 1] = env.split('=')[1];
        jsonData.plist.dict[0]['string'] = valArr;
        resolve(jsonData);
    });
};

const convertToXml = (jsonData) => {
    return new Promise((resolve, reject) => {
        let builder = new xml2js.Builder({
            xmldec: { 
                version: "1.0", 
                encoding: "UTF-8" 
            }
        });
        let xml = builder.buildObject(jsonData);
        let xmlArr = xml.split('\n');
        xmlArr.splice(1, 0, '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">');
        console.log(xmlArr);
        let isShell = xmlArr[5];
        let manifestUrl = xmlArr[6];
        let releaseChannel = xmlArr[7];
        let bool1 = xmlArr[8];
        let bool2 = xmlArr[9];
        let string1 = xmlArr[10];
        let string2 = xmlArr[11]; 
        xmlArr[5] = bool1
        xmlArr[6] = isShell
        xmlArr[7] = bool2
        xmlArr[8] = manifestUrl
        xmlArr[9] = string1
        xmlArr[10] = releaseChannel
        xmlArr[11] = string2
        resolve(xmlArr.join("\n"));
    });
};

const writeFile = (fileName, data) => {
    return new Promise ((resolve, reject) => {
        fs.writeFile(fileName, data, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve('Done')
            }
        });
    });
};

readFile(EXShellPlist)
.then(convertToJson)
.then(appendEnvVariable)
.then(convertToXml)
.then(writeFile.bind(this, EXShellPlist))
.then(data => { console.log(JSON.stringify(data)) })
.catch(err => console.error(err));