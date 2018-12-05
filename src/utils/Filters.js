import moment from 'moment';

import { reg } from './RegEx';
import Localize from '../config/i18n/Localize';

export const dateFilter = (inputDate) => {
    return moment(inputDate).format('DD MMM YYYY'); //01 May 2018
};

export const timeFilter = (inputDateTime) => {
    return moment(inputDateTime).format('LT').toLowerCase(); // 2:00 PM
};

export const camelCase = (name) => {
    return name.trim().split(' ').map(val => val.slice(0, 1).toUpperCase() + val.slice(1)).join(' ');
};

export const dateTimeFilter = (date) => {
    return moment(date).format('DD MMM, LT').toLowerCase();
};

export const dataFilter = (data, unit) => {
    switch (unit) {
        case 'GB':
        case 'gb':
        case 'Gb':
            if (data < 1 && data > 0) {
                data = precisionRound(data, 0);
            }
            else if (data > 1) {
                data = precisionRound(data, 0);
                if (data % 1 === 0) {
                    data = Math.floor(data);
                }
            }
        break;
        case 'MB':
        case 'mb':
        case 'Mb':
            data = Math.floor(data);
        break;
        default: 
            data = Math.floor(data);
    }
    return `${data} ${unit}`
};

export const dataStringFilter = (dataString) => {
    let data = 0;
    let dataUnit = '';
    if (dataString === null || dataString === undefined) {
        return '';
    }
    let dataMatch = dataString.match(reg.extractDigit);
    if ( dataMatch !== null ) {
        data = parseInt(dataMatch[0]);
    }
    let dataUnitMatch = dataString.match(reg.extractChar);
    if ( dataUnitMatch !== null ) {
        dataUnit = dataUnitMatch[0];
    }
    return dataFilter(data, dataUnit);
};

export const priceFilter = (price, currencyCode) => {
    let code = 'INR';
    if (currencyCode) {
        code = currencyCode.toUpperCase();
    }
    code = Localize.t('CURRENCY_CODE.'+code);
    
    return `${code} ${precisionRound(price, 2)}`
};

export const cloudinaryTransform = (url) => {
    let transformationRules = [
        'q_auto:eco'
    ];
    let stringToAppend = `/upload/${transformationRules.join('/')}/`;
    return url.split('/upload/').join(stringToAppend);
};

export const precisionRound = (number, precision) => {
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
};

export const addonsValidityFilter = (validityString) => {
    if(validityString){
        let validity = 0;
        let validityUnit = '';
        let validityMatch = validityString.match(reg.extractDigit);
        let validityUnitMatch = validityString.match(reg.extractChar);
        if (validityMatch !== null) {
            validity = parseInt(validityMatch[0]);
        }
        if(validityUnitMatch !== null)  {
            validityUnit = validityUnitMatch[0].toLowerCase();
        }
        switch (validityUnit) {
            case "day":
            case "days": {
                console.log(validityString,'==',validityUnit)
                if (validity<=31) 
                    return "monthly";
                if(validity >31 && validity <=90)
                    return "quaterly";
                if(validity > 90 && validity <= 180)
                    return "halfYearly";
                else
                    return "yearly";
            }
            break;
            case "month":
            case "months": {
                console.log(validityString,'==',validityUnit)
                if (validity<=1) 
                    return "monthly";
                if(validity >1 && validity <=3)
                    return "quaterly";
                if(validity > 3 && validity <= 6)
                    return "halfYearly";
                else
                    return "yearly";
            }
            break;
            default:
                return null;
        }
        return null;
    }
    
}