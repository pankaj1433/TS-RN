import { showLoader, hideLoader } from './Loader';
import FetchIntercept from './../utils/FetchIntercept';
import API from './../config/constants/APIConstants';

export const postNewConnection = (payload) => {
    return (dispatch) => {
        dispatch(showLoader(false));
        FetchIntercept( API.NEW_CONNECTION, { method: 'POST', body: JSON.stringify(payload) })
            .then( data => {
                console.log('apidata', data);
                dispatch(hideLoader());
                if (data.status === 404) {
                    dispatch( { type: 'SHOW_ALERT', showAlert: true, alertMessage: '' } );       
                }
                else {
                    dispatch( { type: 'STORE_NEW_CONNECTION_RESPONSE', data } );
                }
            })
            .catch( err => {
                console.log('in error')
                dispatch( { type: 'SHOW_ALERT', showAlert: true, alertMessage: '' } )
                dispatch(hideLoader());
            });
    };
};