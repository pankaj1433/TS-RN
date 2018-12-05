import React from 'react';
import { Platform } from 'react-native';
import { Constants } from 'expo';

import { getLanguages } from 'react-native-i18n'
import store from './../store/index';

const API_ROOT = Constants.manifest.extra.API_ROOT ;

let setHeaders = language => {
    console.log(store.getState()['login']['userToken'], 'from fetch')
    return {
        "X-App-Version": Platform.Version,
        "X-App-Platform": Platform.OS,
        "X-App-Type": "mobile-app",
        "Accept-Language": language,
        "Content-Type": 'application/json',
        "X-Auth-Token": store.getState()['login']['userToken']
    };
};

let xhr = (url, options, localHeaders) => {
    options = options || {};
    options.headers = Object.assign({}, options.headers, localHeaders)
    console.log('url - ', API_ROOT + url)
    console.log('headers', options)
    return fetch(API_ROOT + url, options)
            .then(handleResponse)
            .catch(handleCommonError)
};

let getLanguage = () => {
    let currState = store.getState();
    let language = currState.init.language;
    if ( language === undefined ) {
        return getLanguages();
    }
    return Promise.resolve([language]);
};

let handleResponse = response => {
    console.log('res', response);
    if(response.status === 200) {
        return response.json();
    }
    store.dispatch({ type: 'SHOW_ALERT', showAlert: true, alertType: 'error' });
    return {};
}
let handleCommonError = err => {
    console.log('Common Fetch Error', err);
    store.dispatch({ type: 'SHOW_ALERT', showAlert: true, alertType: 'error' });
};

const fetchIntercept = (url, options) => {
    return getLanguage()
            .then(languages => languages[0])
            .then(setHeaders)
            .then(xhr.bind(null, url, options));
};

export default fetchIntercept;