import FetchIntercept from './../utils/FetchIntercept';
import API from './../config/constants/APIConstants';

export const getDataUsage = () => {
    return (dispatch) => {
        dispatch({type: 'RESET_API_RESPONSE'});
        FetchIntercept(API.DATA_USAGE, {method: 'GET'})
        .then(res => {
            if (res) {
                if (res.status && res.status === 1) {
                    if (res.data) {
                        dispatch({type: 'SET_API_RESPONSE'});
                        dispatch({ type: 'STORE_USAGE_DATA', data: res.data });
                    }
                }
            }
        })
    };
};