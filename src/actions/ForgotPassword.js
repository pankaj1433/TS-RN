import { showLoader, hideLoader } from './Loader';
import FetchIntercept from './../utils/FetchIntercept';
import API from '../config/constants/APIConstants';

export const forgotPassword = (payload) => {
    return (dispatch) => {
        dispatch(showLoader(false));
        FetchIntercept( API.RESET_PASSWORD , { method: 'POST', body: JSON.stringify(payload) })
        .then( data => {
            if (data.status != 1){
                dispatch( { type: 'SHOW_ALERT', showAlert: true, alertMessage: data.message } );
                dispatch(hideLoader());
            }
            else{
                dispatch(hideLoader());
                dispatch( { type: 'FORGOT_PASS', data } );
            }
            
        })
        .catch( err => {
            console.log('in error');
            dispatch( { type: 'SHOW_ALERT', showAlert: true, alertMessage: '' } );  
            dispatch(hideLoader());
        });
    };
};
