import React, { Component } from 'react';
import { WebView, View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Constants } from 'expo';
// import firebase from 'react-native-firebase';

import MessageBox from './../components/modal/MessageBox';
import { postPaymentInit, getTransactionStatus } from './../actions/PaymentAction';
import { getReviewCurrentPlan } from './../actions/myPlanAction';
import { getRecharge } from './../actions/rechargeAction';
import Localize from './../config/i18n/Localize';

class RechargeWebView extends Component {

    constructor (props) {
        super(props);
        this.state = {
            transactionValue: props.navigation.state.params.transactionValue || 10,
            standingInstructionYN: props.navigation.state.params.standingInstructionYN || false,
            from: props.navigation.state.params.from || 'RechargeScreen',
            paymentMethod: props.navigation.state.params.paymentOption || 'BillDesk',
            paymentStatusModal: {
                visible: false,
                type: 'success',
                title: '',
                description: ''
            }
        };
    }

    componentWillMount () {
        this.props.resetPaymentState();
        const transactionValue = this.state.transactionValue;
        const standingInstructionYN = this.state.standingInstructionYN ? 'Y' : 'N'; 
        const paymentMethod = this.state.paymentMethod;
        this.props.postPaymentInit({ transactionValue ,standingInstructionYN,paymentMethod});
    }

    setModalValues (type, title, description, visible) {
        this.setState({ paymentStatusModal: { type, visible, title, description } });
    }

    componentWillReceiveProps (nextProps) {
        if ( this.props.paymentTimeout !== nextProps.paymentTimeout && nextProps.paymentTimeout === true ) {
            this.setModalValues('failure', Localize.t('PAYMENT.payment_timeout'), Localize.t('PAYMENT.payment_timeout_desc'), true);
            
        }
        if ( Object.keys(nextProps.paymentStatusData).length > 0 ) {
            switch (nextProps.paymentStatusData.transactionStatus) {
                case 'FAILURE':
                    this.setModalValues('failure', Localize.t('PAYMENT.payment_failure'), Localize.t('PAYMENT.payment_failure_desc'), true);
                    
                break;
                case 'COMPLETED':
                    // firebase.analytics().logEvent('PaymentSuccess',{paymentMode:this.state.paymentMethod,autoDebit:this.state.standingInstructionYN});
                    this.setModalValues('success', Localize.t('PAYMENT.payment_successful'), Localize.t('PAYMENT.payment_successful_desc'), true);
                    
                break;
                case 'ERRORED':
                    this.setModalValues('failure', Localize.t('PAYMENT.error'), Localize.t('PAYMENT.error_desc'), true);
                    
                break;
            }
            // this.setModalValues();
        }
    }

    

    modalGoBackHandler = () => {
        if (this.state.from && this.state.from.match(/recharge/ig) !== null) {
            this.props.getRecharge();
        }
        else {
            this.props.getReviewCurrentPlan();
        }
        this.setState({
            paymentStatusModal: {
                visible: false
            }
        }, () => {
            this.props.navigation.goBack();
        });
    };

    _renderWebView = () => {
        if (this.props.paymentInitDataReceived) {
            let {redirectUrl, transactionId} = this.props.paymentInitAPIData;
            // if (Constants.manifest.extra.API_ROOT.indexOf('https://mapp.tataskybb.com/api/v1') === -1) {
            //     redirectUrl = redirectUrl.replace('https://', 'http://');
            // }
            return (
                <View style={{ flex: 1 }}>
                    <WebView 
                        source={{ uri: redirectUrl }}
                        onNavigationStateChange = { (e) => { console.log('WebView', e) } }
                        renderLoading = { this._renderLoader }
                        startInLoadingState={true}
                        onError = { (e) => console.log(e, 'Error Webview') }
                        mixedContentMode = 'always'
                    />
                    <MessageBox 
                        type = { this.state.paymentStatusModal.type }
                        title = { this.state.paymentStatusModal.title }
                        description = { this.state.paymentStatusModal.description }
                        visible = { this.state.paymentStatusModal.visible }
                        handler = { () => { this.modalGoBackHandler() } }
                        source = "RechargeWebView"
                        buttonText = { Localize.t('PAYMENT.go_back') }
                        hasOverlayBackground = { true }
                    />
                </View>
            );
        }
        else {
            this._renderLoader();
        }
    };

    _renderLoader = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                <View style={ styles.imageContainer }>
                    <Image 
                        source={ require('./../assets/img/loading.gif') }
                        style={ styles.image }
                        resizeMode={ 'cover' }
                    />
                </View>
            </View>
        );
    };

    render () {
        console.log("*** state is :",this.state.paymentStatusModal)
        return (
            <View style={{ flex: 1 }}>
                { this._renderWebView() }
            </View>
        );
    }
};

const styles = StyleSheet.create({
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 100/2,
        backgroundColor: 'transparent',
        elevation: 5,
        shadowOffset: {  
            width: 0,  
            height: 0.5,  
        }, 
        shadowColor: 'black',
        shadowOpacity: 0.9,
        zIndex: 10 
    },
    image: {
        height: null,
        width: null,
        flex: 1
    }
});

const mapStateToProps = (state) => ({
    paymentInitAPIData: state.paymentAPIData.data,
    paymentInitDataReceived: state.paymentAPIData.paymentInitFlag,
    paymentTimeout: state.paymentAPIData.timeout,
    paymentStatusData: state.paymentAPIData.paymentStatusData
});

const mapDispatchToProps = (dispatch) => ({
    postPaymentInit: (payload) => dispatch(postPaymentInit(payload)),
    resetPaymentState: () => dispatch({ type: 'RESET_PAYMENT_STATE' }),
    getRecharge: () => dispatch(getRecharge()),
    getReviewCurrentPlan: () => dispatch(getReviewCurrentPlan())
});

export default connect(mapStateToProps, mapDispatchToProps)(RechargeWebView);