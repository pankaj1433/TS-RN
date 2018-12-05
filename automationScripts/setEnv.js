const fs = require('fs');
const AppJson = 'app.json';

const readAppJsonFile = (envData) => {
    return new Promise((resolve, reject) => {
        fs.readFile(AppJson, 'utf-8', (error, data) => {
            if (error) {
                reject(error);
            }
            else if (data) {
                let parsedData = JSON.parse(data);
                parsedData.expo.extra = envData;
                resolve(parsedData);
            }
        });
    });
};

const init = () => {
    return new Promise((resolve, reject) => {
        let env  = process.argv[2];
        if (env) {
            resolve(env.split('=')[1]);
        }
        else {
            reject('No Env Specified');
        }
    });
};

const readEnvFile = (environment) => {
    return new Promise((resolve, reject) => {
        fs.readFile(`./environment/${ environment }.json`, 'utf-8', (error, data) => {
            if (error) {
                reject(error);
            }
            else if (data) {
                resolve(JSON.parse(data));
            }
        });
    });
};

const writeAppJsonFile = (dataToWrite) => {
    fs.writeFile(AppJson, JSON.stringify(dataToWrite, null, 4), (error) => {
        if (error) {
            console.log(error);
        }
    });
};

const handleError = (err) => {
    console.log('Error: ', err);
};

init()
.then(readEnvFile)
.then(readAppJsonFile)
.then(writeAppJsonFile)
.catch(handleError)