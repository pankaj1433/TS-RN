import { reg } from './RegEx';

export const Validation = {
    isEmpty: (input) => {
        return input === '' || input.match(reg.onlySpace) !== null ? true : false;
    },
    isOnlyDigit: (input) => {
        return input.match(reg.digit) !== null ? true : false; 
    },
    isAlphaNumeric: (input) => {
        return input.match(reg.alphaNumeric) !== null ? true : false;
    },
    isMobileNumber: (input) => {
        if ( input.match(reg.mobileLength) !== null && input.match(reg.digit) !== null ){
            return true
        }
        return false;
    },
    isCustomerId: (input) => {
        if (input.match(reg.alphaNumeric) !== null ) {
            return true;
        }
        return false;
    },
    isEmail: (input) => {
        input = input.trim()
        if (input.match(reg.email) !== null ) {
            return true;
        }
        return false;
    },
    isLandLine: (input) => {
        input = input.trim().replace(reg.removeAllSpace,'');
        if (input.match(reg.landLineLength) !== null && input.match(reg.digit) !== null ){
            return true;
        }
        return false;
    }
};