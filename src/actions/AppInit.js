import FetchIntercept from "../utils/FetchIntercept";

export const getConfigData = () => {
    return (dispatch) => {
        console.log('config data action')
        FetchIntercept('/public/config', { method: 'GET' })
        .then(data => {
            console.log('config data', data)
            if( data.status === 1 ) {
                dispatch({ type: 'SET_CONFIG', data: data.data })
            }
            else {
                //handle api error
            }
        })
        .catch(err => console.log(new Error(err)));
    };
};

export const setLanguage = (language) => {
    console.log('act', language);
    return {type: 'SET_LANGUAGE',
    language}
};

export const setConfig = (data) => ({
    type: 'SET_CONFIG',
    data
});