export const reg = {
    digit: /^\d+$/g,
    alphaNumeric: /^([A-Za-z]+[0-9]+|[0-9]+[A-Za-z]+)[A-Za-z0-9]*$/g,
    mobileLength: /^\w{10}$/ig,
    onlySpace: /^\s+$/g,
    extractDigit: /\d+/g,
    extractChar: /[a-z]+/ig,
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    landLineLength:  /^\w{9,11}$/ig,
    removeAllSpace: /\s+/g,
    password: /((?=.*\d{1,})(?=.*[a-z]{3,})(?=.*[A-Z]{1,}).{8,15})/g
};