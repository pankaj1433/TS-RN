import FetchIntercept from "../utils/FetchIntercept";
import API from './../config/constants/APIConstants';
import { showLoader, hideLoader } from './Loader';

export const postHomeApi = (payload) => {
    return (dispatch) => {
        dispatch({ type: 'UNSET_HOME_API_FLAG' });
        dispatch(resetHomeAPIData());
        FetchIntercept(API.HOME, {method: 'GET'})
        .then(res => {
            if (res) {
                if( res.status && res.status === 1 ) {
                    let { banners, otts, userDataDetail, recentTransaction } = res.data;
                    dispatch({ type: 'SET_HOME_API_FLAG' });
                    if ( banners )
                        dispatch({ type: 'STORE_IMAGE_SLIDER_DATA', banners });
                    if ( otts ) 
                        dispatch({ type: 'STORE_OTT_DATA', otts });
                    if ( userDataDetail ) {
                        dispatch({ type: 'STORE_USER_DATA_DETAIL', userDataDetail });
                    }
                    if ( recentTransaction && recentTransaction.length > 0 ) {
                        dispatch({ type: 'STORE_HOME_RECENT_TRANSACTION', recentTransaction });
                    }
                }
                else {
                    console.log('invalid response status 0');
                }
            }
            else {
                console.log('empty response');
            }
        })
    };
};

export const postCardOrder = (payload) => {
    // console.log("***** payload is :",payload)
    return (dispatch) => {
        FetchIntercept(API.CHANGE_CARD_ORDER, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => {
            if (res) {
                if (res.status === 1) {
                    // console.log(res.data);
                    // let {screenCards} = res.data;
                    // console.log("****** result :",res.data)
                    // dispatch({ type:'GET_CARD_ORDER' , screenCards:screenCards})
                }
                else {
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message || '' });
                }
            }
        });
    };
}

export const getScreenParamStatus = (payload) => {
    return (dispatch) => {
        dispatch(showLoader(false));
        // console.log("*** payload send is :",payload)
        FetchIntercept(API.VALIDATE_BANNER_PARAMS, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => {
            if (res) {
                dispatch(hideLoader());
                if (res.status === 1) {
                    dispatch({ type:'GET_BANNER_NAVIGATION_STATUS' , data:res.data})
                }
                else {
                    dispatch({ type:'GET_BANNER_NAVIGATION_STATUS' , data:payload})
                }
            }
        });
    };
}


export const resetState = () =>{
    return {type: 'RESET_BANNER_NAVIGATION'}
}

export const resetHomeAPIData = () => ({ 
    type: 'RESET_HOME_API_DATA' 
});

