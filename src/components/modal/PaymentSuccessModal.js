import React, { Component } from 'react';
import { View, Text, Modal, Image, StyleSheet, Animated } from 'react-native';
import PropTypes from 'prop-types';

import config from './../../config/config';
import ButtonPrimary from '../UI/ButtonPrimary';
import Localize from '../../config/i18n/Localize';
import { dateFilter, priceFilter } from '../../utils/Filters';

class PaymentSuccessModal extends Component {
    constructor() {
        super();
        this.state = {
            printPaperAnim: new Animated.Value(0),
            showContent: false,
            stampAnim: new Animated.Value(0)
        };
    }

    componentWillReceiveProps(nextProp) {
        if( nextProp.visible === true && this.props.visible !== nextProp.visible ) {
            this.setState({ printPaperAnim: new Animated.Value(0), stampAnim: new Animated.Value(0) }, () => {
                Animated.spring(
                    this.state.printPaperAnim,
                    {
                        toValue: 400,
                        speed: 8
                        // useNativeDriver: true
                    }
                ).start(() => {
                    this.setState({ showContent: true })
                })
            });
        }
        else {
            this.setState({ showContent: false })
        }
    }

    renderPaperContent() {
        if ( this.state.showContent === true ) {
            Animated.timing(
                this.state.stampAnim,
                {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                }
            ).start()
            return (
                <View>
                    <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                        <Image source={ require('./../../assets/img/icSuccess/icSuccess.png') }/>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={ styles.heading }>{ Localize.t('RECHARGE.RECHARGE_SUCCESS.payment_successful') }</Text>
                        <Text style={ styles.subHeading }>{ Localize.t('RECHARGE.RECHARGE_SUCCESS.thank_you_msg') }</Text>
                        {/* <Text style={ styles.heading }>Payment Successful!</Text>
                        <Text style={ styles.subHeading }>Thank you for your payment</Text> */}
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={[ styles.invoiceRowContainer, styles.invoiceRowBorder ]}>
                            <View>
                                <Text style={[ styles.invoiceRowTitle ]}>{ Localize.t('RECHARGE.RECHARGE_SUCCESS.invoice_id') }</Text>
                                {/* <Text style={[ styles.invoiceRowTitle ]}>Invoice Id</Text> */}
                            </View>
                            <View>
                                <Text style={[ styles.invoiceRowTitle, styles.invoiceRowValue ]}>{ this.props.invoiceId }</Text>
                            </View>
                        </View>
                        <View style={[ styles.invoiceRowContainer, styles.invoiceRowBorder ]}>
                            <View>
                                <Text style={[ styles.invoiceRowTitle ]}>{ Localize.t('RECHARGE.RECHARGE_SUCCESS.payment_date') }</Text>
                                {/* <Text style={[ styles.invoiceRowTitle ]}>Payment Date</Text> */}
                            </View>
                            <View>
                                <Text style={[ styles.invoiceRowTitle, styles.invoiceRowValue ]}>{ dateFilter(this.props.paymentDate) || dateFilter(Date.now()) }</Text>
                            </View>
                        </View>
                        <View style={[ styles.invoiceRowContainer ]}>
                            <View>
                                <Text style={[ styles.invoiceRowTitle ]}>{ Localize.t('RECHARGE.RECHARGE_SUCCESS.amount_paid') }</Text>
                                {/* <Text style={[ styles.invoiceRowTitle ]}>Amount Paid</Text> */}
                            </View>
                            <View>
                                <Text style={[ styles.invoiceRowTitle, styles.invoiceRowValue, { color: config.UI.primaryColor } ]}>{ priceFilter(this.props.amountPaid) }</Text>
                            </View>
                        </View>
                    </View>
                    <View style={ styles.footer }>
                        <View style={ styles.footerTextContainer }>
                            <Text style={ styles.footerText }>{ Localize.t('RECHARGE.RECHARGE_SUCCESS.note') }</Text>
                            {/* <Text style={ styles.footerText }>Note - Confirmation mail sent on your registered email and sms on registered mobile Number</Text> */}
                        </View>
                        <Animated.View style={ [styles.footerImageContainer, { transform: [ { scale: this.state.stampAnim } ] }] }>
                            <Image source={ require('./../../assets/img/icPaid/icPaid.png') } />
                        </Animated.View>
                    </View>
                </View>
            );
        }
        else {
            return null;
        }
    }

    render() {
        const { width, height } = Image.resolveAssetSource(require('./../../assets/img/printer/printer.png'));
        return (
            <Modal transparent={ true } visible={ this.props.visible } animationType='none'>
                <View style={ styles.modalBackground }>
                    <View style={ styles.mainContainer }>
                        <View>
                            <Image source={ require('./../../assets/img/printer/printer.png') }/>
                        </View>
                        <View style={ [ styles.paperContainer, { width: width-50, top: -height/2 } ] }>
                            <Animated.View style={ [styles.paperContentContainer, { height: this.state.printPaperAnim }  ] }>
                                { this.renderPaperContent() }
                            </Animated.View>
                            <View style={ styles.paperZigZagContainer }>
                                <Image source={ require('./../../assets/img/zigzag/zigzag.png') } style={{ width: width-50 }} />
                            </View>
                        </View>
                        <ButtonPrimary title={ Localize.t('RECHARGE.RECHARGE_SUCCESS.great') } onClick={ () => { this.props.closeModal() } } scheme='dark' layout='rounded'/>
                        {/* <ButtonPrimary title="Great !" onClick={ () => { this.props.closeModal() } } scheme='dark' layout='rounded'/> */}
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'center',
        paddingVertical: 50
    },
    mainContainer: { 
        alignItems: 'center',
        flex: 1
    },
    paperContainer: { 
        backgroundColor: 'transparent',
        flex: 1
    },
    paperContentContainer: { 
        backgroundColor: 'white', 
        padding: 10  
    },
    heading: {
        fontSize: 20.3,
        fontFamily: 'sky-text-regular'
    },
    subHeading: {
        fontSize: 15.3,
        fontFamily: 'sky-text-regular',
        color: config.UI.textGrey
    },
    invoiceRowContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    invoiceRowBorder: {
        borderBottomWidth: 1, 
        borderBottomColor: 'grey', 
        borderRadius: 1 
    },
    invoiceRowTitle: {
        fontSize: 15.3,
        fontFamily: 'sky-text-regular',
        color: config.UI.textDarkGrey
    },
    invoiceRowValue: {
        fontFamily: 'sky-text-bold'
    },
    footer: { 
        flexDirection: 'row' 
    },
    footerTextContainer: {
        flex: 2,
        justifyContent: 'center'
    },
    footerText: {
        fontSize: 12,
        color: config.UI.textGrey,
        fontFamily: 'sky-text-italics'
    },
    footerImageContainer: {
        flex: 1
    },
    footerImage: {},
    paperZigZagContainer: { 
        alignItems: 'center' 
    }
});

PaymentSuccessModal.propTypes = {
    visible: PropTypes.bool,
    closeModal: PropTypes.func
};

export default PaymentSuccessModal;