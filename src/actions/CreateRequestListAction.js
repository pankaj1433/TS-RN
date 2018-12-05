import FetchIntercept from "../utils/FetchIntercept";
import API from './../config/constants/APIConstants';
import { showLoader, hideLoader } from './Loader';

// export const getCreateRequestList = () => {
//     return (dispatch) => {
//         FetchIntercept(API.CREATE_REQUEST_LIST, {method: 'GET'})
//         .then(res => {
//             if (res) {            
//                 if( res.status && res.status === 1 ) {
//                     if (res.data && Object.keys(res.data).length > 0) {
//                         dispatch({type: 'STORE_CREATE_REQUEST_LIST', data: res.data});
//                         console.log('Create request list successfully fetched:' + res.data)    
//                     }
//                     else {
//                         dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Empty API response'})    
//                         console.log('create request list Empty data key');
//                     }
//                 }
//                 else {
//                     dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Invalid API response'})
//                     console.log('create request list invalid support API response status 0');
//                 }
//             }
//             else {
//                 dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'API response unavailable'})
//                 console.log('create request list empty API response');
//             }
//         })
//     };
// };

export const getCreateRequestList = () => {
    return (dispatch) => {
        FetchIntercept(API.CREATE_REQUEST_LIST, {method: 'GET'})
        .then(res => {
            if (res) {                            
                if( res.status && res.status === 1 ) {                                        
                    if (res.data && Object.keys(res.data).length > 0) {                        
                        dispatch({type: 'STORE_CREATE_REQUEST_LIST', data: res.data});
                        console.log('Create request list successfully fetched:' + res.data)                            
                    }
                    else {                                                
                        dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Empty API response'})    
                        console.log('create request list Empty data key');
                    }
                }
                else {                    
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Invalid API response'})
                    console.log('create request list invalid support API response status 0');
                }
            }
            else {                
                dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'API response unavailable'})
                console.log('create request list empty API response');
            }
        })
    };
};