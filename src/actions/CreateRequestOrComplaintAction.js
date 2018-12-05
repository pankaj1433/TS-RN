import FetchIntercept from "../utils/FetchIntercept";
import API from './../config/constants/APIConstants';
import { showLoader, hideLoader } from './Loader';
import { getSupportApi } from './supportAction';

export const getRequestOrComplaintSubtypes = (reqOrCompType) => {
    return (dispatch) => {
        dispatch(showLoader(false));
        FetchIntercept(`${API.GET_REQUEST_COMPLAINT_TYPES}?type=${reqOrCompType}`, { method: 'GET' })        
        .then(res => {
            if (res) {
                dispatch(hideLoader());                                
                if( res.status && res.status === 1 ) {                    
                    if (res.data && Object.keys(res.data).length > 0) {
                        dispatch({type: 'STORE_REQUEST_OR_COMPLAINT_SUBTYPES', data: res.data});
                        console.log('Request or Complaint subtypes successfully fetched:' + res.data)
                    }
                    else {
                        dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Empty API response'})    
                        console.log('Get request or complaint subtypes api Empty data key');
                    }
                }
                else {
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Invalid API response'})
                    console.log('Get request or complaint subtypes invalid API response status 0');
                }
            }
            else {
                dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'API response unavailable'})
                console.log('Get request or complaint subtypes empty API response');
            }
        })
    }
}

export const postRequestOrComplaint = (payload) => {
    return (dispatch) => {
        dispatch(showLoader(false));
        FetchIntercept(API.CREATE_REQUEST_OR_COMPLAINT, {method: 'POST', body: JSON.stringify(payload)})
        .then(res => {
            if (res) {                
                if( res.status && res.status === 1 ) {                    
                    dispatch({type: 'STORE_CREATE_REQUEST_OR_COMPLAINT', data: res});
                    dispatch(getSupportApi())
                    console.log('Request or Complaint successfully generated:' + res)
                }
                else {
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Invalid API response'})
                    console.log('Create request invalid API response status 0');
                }
            }
            else {
                dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'API response unavailable'})
                console.log('Create request empty API response');
            }
            dispatch(hideLoader());
        })
    };
};