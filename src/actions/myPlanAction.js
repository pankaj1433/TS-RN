import FetchIntercept from "../utils/FetchIntercept";
import API from './../config/constants/APIConstants';
import { showLoader, hideLoader } from './Loader';

export const getMyPlanApi = () => {
    return (dispatch) => {
        dispatch({ type: 'UNSET_MYPLAN_API_FLAG' });
        FetchIntercept(API.MY_PLAN, {method: 'GET'})
        .then(res => {
            if (res) {                                
                if( res.status && res.status === 1 ) {                    
                    if (res.data && Object.keys(res.data).length > 0) {       
                        dispatch({ type: 'SET_MYPLAN_API_FLAG' });                 
                        dispatch({type: 'MY_PLAN', data: res.data});
                        console.log('My plan api successfully fetched:' + res.data)    
                    }
                    else {                        
                        dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Empty API response'})    
                        console.log('My plan api Empty data key');
                    }
                }
                else {
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Invalid API response'})
                    console.log('My plan api invalid support API response status 0');
                }
            }
            else {
                dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'API response unavailable'})
                console.log('My plan api empty support API response');
            }
        })
    };
};

export const getAllAddOns = () => {
    return (dispatch) => {
        FetchIntercept(API.ALL_ADDONS, {method: 'GET'})
        .then(res => {            
            if (res) {
                if( res.status && res.status === 1 ) {
                    if (res.data && Object.keys(res.data).length > 0) {
                        dispatch({type: 'ALL_ADDONS', data: res.data});
                        console.log('All addons api successfully fetched:' + res.data)
                    }
                    else {
                        dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Empty API response'})    
                        console.log('All addons api Empty data key');
                    }
                }
                else {
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Invalid API response'})
                    console.log('All addons api invalid support API response status 0');
                }
            }
            else {
                dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'API response unavailable'})
                console.log('All addons api empty support API response');
            }
        })
    };
};

export const getAvailablePlans = () => {
    return (dispatch) => {
        FetchIntercept(API.AVAILABLE_PLANS, {method: 'GET'})
        .then(res => {
            if (res) {                
                if( res.status && res.status === 1 ) {
                    if (res.data && Object.keys(res.data).length > 0) {
                        dispatch({type: 'AVAILABLE_PLANS', data: res.data});
                        console.log('available plans api successfully fetched:' + res.data)
                    }
                    else {
                        dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Empty API response'})    
                        console.log('available plans api Empty data key');
                    }
                }
                else {
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Invalid API response'})
                    console.log('available plans api invalid support API response status 0');
                }
            }
            else {
                dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'API response unavailable'})
                console.log('available plans api empty support API response');
            }
        })
    };
};

export const getReviewCurrentPlan = () => {
    return (dispatch) => {
        FetchIntercept(API.REVIEW_CURRENT_PLAN, { method: 'GET' })
        .then(res => {
            if (res) {                
                if( res.status && res.status === 1 ) {
                    if (res.data && Object.keys(res.data).length > 0) {
                        dispatch({type: 'STORE_REVIEW_CURRENT_PLAN', data: res.data});
                        console.log('review plan api successfully fetched:' + res.data)
                    }
                    else {
                        dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Empty API response'})    
                        console.log('review plan api Empty data key');
                    }
                }
                else {
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'Invalid API response'})
                    console.log('review plan api invalid support API response status 0');
                }
            }
            else {
                dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message ? res.message : 'API response unavailable'})
                console.log('review plan api empty support API response');
            }
        });
    };
};