import FetchIntercept from "../utils/FetchIntercept";
import API from './../config/constants/APIConstants';
import { showLoader, hideLoader } from './Loader';

export const getSupportApi = () => {
    return (dispatch) => {
        dispatch({type: 'UNSET_SUPPORT_API_FLAG'})
        FetchIntercept(API.SUPPORT, {method: 'GET'})
        .then(res => {
            if (res) { 
                // console.log("*** res is :",res);               
                if( res.status && res.status === 1 ) {
                    dispatch({type: 'SET_SUPPORT_API_FLAG'})
                    if (res.data && Object.keys(res.data).length > 0) {
                        dispatch({type: 'STORE_SUPPORT_DATA', data: res.data});
                        // console.log('Support data successfully fetched:' + res.data)
                    }
                    // else {
                    //     dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Empty API response'})    
                    //     console.log('support api Empty data key');
                    // }
                }
                else {
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Invalid API response'})
                    // console.log('support api invalid API response status 0');
                }
            }
            else {
                dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'API response unavailable'})
                // console.log('support api empty API response');
            }
        })
    };
};

export const getServiceRequestHistoryList = () => {
    return (dispatch) => {
        FetchIntercept(API.SUPPORT_LIST, {method: 'GET',body: null})
        .then ( res => {
            if (res) {                                
                if( res.status && res.status === 1 ) {
                    if (res.data && Object.keys(res.data).length > 0) {
                        dispatch({type: 'STORE_SUPPORT_DATA_LIST', data: res.data});
                        console.log('service request history data successfully fetched:' + res.data)
                    }
                    else {
                        dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Empty API response'})    
                        console.log('service request history api Empty data key');
                    }
                }
                else {
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Invalid API response'})
                    console.log('service request history api invalid support API response status 0');
                }
            }
            else {
                dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'API response unavailable'})
                console.log('service request history api empty support API response');
            }
        })
    }
}