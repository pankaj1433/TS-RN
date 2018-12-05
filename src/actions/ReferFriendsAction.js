import FetchIntercept from "../utils/FetchIntercept";
import API from './../config/constants/APIConstants';

export const generateReferRequest = (payload) => {
    return (dispatch) => {
        FetchIntercept(API.UPDATE_REFER_FRIENDS,  { method: 'POST', body: JSON.stringify(payload) })
        .then((res) => {
            if (res) {
                if (res.status && res.status === 1) {
                    dispatch({type: 'REFER_FRIEND_SUCCESS',message:res.message});
                }
            }
            else {
                dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: 'Server error', alertType: 'error' });
            }
        }).catch(err => {
            console.log("**** err is :",err)
            dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: 'Server error', alertType: 'error' });
        })
    };
};

export const clearMessage = () => {
    return(dispatch) => {
        dispatch({type: 'REFER_FRIEND_CLEAR_MESSAGE'})
    }
}