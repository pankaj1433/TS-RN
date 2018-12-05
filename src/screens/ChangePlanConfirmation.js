import React, {Component} from 'react'
import {View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native'
import { LinearGradient, Constants } from 'expo';
import {Feather} from '@expo/vector-icons'
import { connect } from 'react-redux';

import Localize from './../config/i18n/Localize';
import PriceCard from './../components/UI/PriceCard';
import Card from './../components/UI/Card';
import config from './../config/config';
import { dataFilter, priceFilter, dateFilter } from './../utils/Filters';
import { getReviewCurrentPlan, getMyPlanApi } from './../actions/myPlanAction';
import { postChangePlan, resetChangePlanData } from './../actions/changePlanAction';
import PriceCardLoader from './../components/CardLoaders/PriceCardLoader';
import AlertBox from './../components/Alert';
import ButtonPrimary from '../components/UI/ButtonPrimary';
import HeaderWithBack from './../components/layout/HeaderWithBack';
import PaymentSuccessModal from '../components/modal/PaymentSuccessModal';

class ChangePlanConfirmationScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            currentPlanCardMaxY: 0.0,
            radioButton: 'billing_cycle',
            selectedPlan: {
                secondLine: props.navigation.state.params.secondLine,
                validity: props.navigation.state.params.validity,
                price: props.navigation.state.params.price,
                productOfferingId: props.navigation.state.params.productOfferingId,
                // planName: props.navigation.state.params.aliasName || props.navigation.state.params.planName
            },
            showRecharge: false,
            paymentSuccess: false
        }
        this.billingCycleDate = 'xx Jxx ,2XXX';
    }

    componentWillMount () {
        this.props.getReviewCurrentPlan();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.invoiceId !== '') {
            //show payment success
            this.setState({ paymentSuccess: true });
        }
    }

    backButtonPressed = () => {
        this.props.navigation.goBack()
    }

    toggleRadioButton = (buttonName) => {
        if (this.state.radioButton == buttonName)   {
            return;
        }
        (this.state.radioButton == 'billing_cycle') ?
            this.setState({radioButton: 'today'}) :
            this.setState({radioButton: 'billing_cycle'})
    }

    renderRadioButton = (buttonName) => {
      return (this.state.radioButton == buttonName)?
            <Image style={{marginRight: 5.7}} source = {require('../assets/img/tickRadio/tickRadio.png')} />:
            <Image style={{marginRight: 5.7}} source = {require('../assets/img/blankRadio/blankRadio.png')} />
    }

    renderCardBaseView = () => {
        const cardSize = Math.min(0.38*(Dimensions.get('window').width), 180);
        const myPlanCard = (Object.keys(this.props.reviewCurrentPlanData).length > 0)?
            (
                <PriceCard 
                // AliasName = { this.props.reviewCurrentPlanData.planName }
                    FirstLine = { Localize.t('CHANGE_PLAN_CONFIRM.data_per_month') }
                    // FirstLine = "Data Per Month"
                    SecondLine = { dataFilter(this.props.reviewCurrentPlanData.data, this.props.reviewCurrentPlanData.dataUnit) } 
                    validity = { `${this.props.reviewCurrentPlanData.validity} ${this.props.reviewCurrentPlanData.validityUnit}` } 
                    price = { priceFilter( this.props.reviewCurrentPlanData.totalPrice ) } 
                    hasGradientText = {false} 
                    hasBorder = {true} 
                    size = {cardSize}
                    productOfferingId = { this.props.reviewCurrentPlanData.productOfferingId }
                >
                </PriceCard>
            )
        :
        ( <View>
            <PriceCardLoader />
        </View> )
        return (
            <View style = {styles.cardBaseView}>
                <View style = {{width: cardSize, flexDirection: 'column'}}>
                    <View style = {styles.priceCardHeadingParent}>
                        <Text style = {styles.priceCardHeading}>{Localize.t('CHANGE_PLAN_CONFIRM.current_base_plan_text')}</Text>
                        {/* <Text style = {styles.priceCardHeading}>Current Base Plan</Text> */}
                    </View>
                    <View onLayout = {this.didLayoutCurrentPlanCard}>
                        { myPlanCard }
                    </View>

                    {/* <View style = {[styles.cardFooterView, {width: cardSize}]}>
                        <Text style = {styles.priceCardFooter}>{Localize.t('CHANGE_PLAN_CONFIRM.usage_text')} { priceFilter(this.props.reviewCurrentPlanData.walletBalance || 0) }</Text>
                        <Text style = {[styles.priceCardFooter, {fontFamily: 'sky-text-regular'}]}>({Localize.t('CHANGE_PLAN_CONFIRM.pro_data_text')})</Text>
                    </View> */}
                </View>
                <View style = {[styles.separatorView, {height: this.state.currentPlanCardMaxY}]}>
                    <Image source = {require('./../assets/img/designerArrow/icConvert.png')} resizeMode = 'contain' style = {{flex: 1}}/>
                </View>                
                <View style = {[ styles.addOnCardParentView,{height: this.state.currentPlanCardMaxY, width: cardSize }]}>
                    <View style = {styles.priceCardHeadingParent}>
                        <Text style = {styles.priceCardHeading}>{Localize.t('CHANGE_PLAN_CONFIRM.new_selected_plan_text')}</Text>
                        {/* <Text style = {styles.priceCardHeading}>New Plan Selected</Text> */}
                    </View>
                    <PriceCard 
                        FirstLine = { Localize.t('CHANGE_PLAN_CONFIRM.data_per_month') }
                        // AliasName = { this.state.selectedPlan.planName }
                        SecondLine = { this.state.selectedPlan.secondLine }
                        validity= { this.state.selectedPlan.validity }
                        price = { priceFilter(this.state.selectedPlan.price)  }
                        hasBorder = {true} 
                        size = {cardSize}
                        productOfferingId = { this.state.selectedPlan.productOfferingId }
                    >
                    </PriceCard>
                </View>            
            </View>
        );
    }

    didLayoutCurrentPlanCard = (event) => {
        let {y, height} = event.nativeEvent.layout
        this.setState({currentPlanCardMaxY: y + height})
    }

    renderCalculationCard = () => {
        const walletBalance = (Object.keys(this.props.reviewCurrentPlanData).length > 0)?( this.props.reviewCurrentPlanData.walletBalance ):'xxxx';
        let calculateTotal = 0;
        let showRecharge = false;
        let buttonText = Localize.t('CHANGE_PLAN_CONFIRM.change_plan');
        // let buttonText = "Change Plan"
        let remainingWalletBalance = 0;
        let deductedAmount = 0;
        if (Object.keys(this.props.reviewCurrentPlanData).length > 0) {
            this.billingCycleDate = this.props.reviewCurrentPlanData.nextBillingCycle || Date.now()
            let selectedPlanPrice = parseFloat(this.state.selectedPlan.price);
            //calculateTotal = selectedPlanPrice - this.props.reviewCurrentPlanData.walletBalance;
            if (this.props.reviewCurrentPlanData.walletBalance >= selectedPlanPrice) {
                showRecharge = false;
                remainingWalletBalance = this.props.reviewCurrentPlanData.walletBalance - selectedPlanPrice;
                calculateTotal = 0;
                deductedAmount = selectedPlanPrice;
            }
            else {
                showRecharge = true;
                remainingWalletBalance = 0;
                calculateTotal = selectedPlanPrice - this.props.reviewCurrentPlanData.walletBalance;
                deductedAmount = this.props.reviewCurrentPlanData.walletBalance;
            }
            buttonText = (showRecharge)? Localize.t('CHANGE_PLAN_CONFIRM.pay_now_text') : Localize.t('CHANGE_PLAN_CONFIRM.change_plan');
            // buttonText = (showRecharge)? "Pay Now" : "Change Plan";
        }
        return (
            <View style={{ padding: 14 }}>
                <View style = {[styles.calculationCard, { marginBottom: 14 } ]}>
                    <View style = {styles.radioContainer}>
                        <Text style = {styles.calculationCardDarkText}>{Localize.t('CHANGE_PLAN_CONFIRM.apply_from')}</Text>
                        {/* <Text style = {styles.calculationCardDarkText}>Apply From</Text> */}
                        <View style={styles.radioButtonsContainer}>
                            <TouchableOpacity onPress={() => this.toggleRadioButton('billing_cycle')} style={[styles.radioButtonContainer,{marginRight:17.3}]}>
                                {this.renderRadioButton('billing_cycle')}
                                <View>
                                    <Text style = {styles.calculationCardDarkText}>{Localize.t('CHANGE_PLAN_CONFIRM.billing_cycle')}</Text>
                                    {/* <Text style = {styles.calculationCardDarkText}>Billing Cycle</Text> */}
                                    <Text style = {[styles.calculationCardRegularText]}>{dateFilter(this.billingCycleDate)}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.toggleRadioButton('today')} style={styles.radioButtonContainer}>
                                {this.renderRadioButton('today')}
                                <View>
                                    <Text style = {styles.calculationCardDarkText}>{Localize.t('CHANGE_PLAN_CONFIRM.today')}</Text>
                                    {/* <Text style = {styles.calculationCardDarkText}>Today</Text> */}
                                    <Text style = {[styles.calculationCardRegularText]}>{dateFilter(Date.now())}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style = {{paddingHorizontal: 15}}><Text style = {styles.calculationCardDarkText}>{Localize.t('CHANGE_PLAN_CONFIRM.to_pay_text')}</Text></View>
                    {/* <View style = {{paddingHorizontal: 15}}><Text style = {styles.calculationCardDarkText}>To Pay</Text></View> */}
                    <View style = {[styles.calculationCardRowItem, {marginTop: 15}]}>
                        <Text style = {styles.calculationCardDarkText}>{Localize.t('CHANGE_PLAN_CONFIRM.new_plan_cost_text')}</Text>
                        {/* <Text style = {styles.calculationCardDarkText}>New Plan Cost</Text> */}
                        <Text style = {styles.calculationCardDarkText}>{ priceFilter(this.state.selectedPlan.price) }</Text>
                    </View>
                    <View style = {[styles.calculationCardRowItem, {marginTop: 12}]}>
                        <View style = {{flexDirection: 'row'}}>
                            <Text style = {styles.calculationCardDarkText}>{Localize.t('CHANGE_PLAN_CONFIRM.account_balance')}</Text>
                            {/* <Text style = {styles.calculationCardDarkText}>Account balance</Text> */}
                        </View>
                        <View style = {{flexDirection: 'row'}}>
                            <Text style = {styles.calculationCardRegularText}>(-) </Text>
                            <Text style = {styles.calculationCardDarkText}>{ priceFilter(deductedAmount) }</Text>
                        </View>
                    </View>
                    <Text style = {[styles.calculationCardRegularText, {paddingHorizontal: 15}]}>({ Localize.t('CHANGE_PLAN_CONFIRM.remaining_balance') } { priceFilter(remainingWalletBalance) })</Text>
                    {/* <Text style = {[styles.calculationCardRegularText, {paddingHorizontal: 15}]}>(Remaining balance { priceFilter(remainingWalletBalance) })</Text> */}
                    <View style = {[styles.calculationCardRowItem, {backgroundColor: config.UI.buttonGrey, marginTop: 20, height: 46.3, alignItems: 'center'}]}>
                        <Text style = {styles.calculationCardDarkText}>{Localize.t('CHANGE_PLAN_CONFIRM.total_text')}</Text>
                        {/* <Text style = {styles.calculationCardDarkText}>Total</Text> */}
                        <Text style = {styles.calculationCardHighlightedText}>{ priceFilter(calculateTotal) }</Text>
                    </View>
                </View>
                <ButtonPrimary 
                    title = { buttonText }
                    onClick = { () => this.handlePayNowButtonTapped(calculateTotal) }
                    scheme = "dark"
                    disabled = { Object.keys(this.props.reviewCurrentPlanData).length === 0 }
                    trackEvent = { 'ChangePlan' }
                    trackProperties = {{ action: buttonText }}
                />
            </View>
        );
    }

    handlePayNowButtonTapped = (calculateTotal) => {
        console.log('calculate Yotal', calculateTotal)
        if (calculateTotal !== undefined && calculateTotal === 0) {
            let payload = {
                productOfferingId: this.state.selectedPlan.productOfferingId,
                planChangeEffectiveDate: (this.state.radioButton === 'billing_cycle')? this.billingCycleDate : Date.now()
            };
            this.props.postChangePlan(payload);
        }
        else {
            this.props.navigation.navigate('RechargeWebViewScreen', { 
                transactionValue: calculateTotal, 
                from: 'MyPlanTab', 
            });
        }
    }

    paymentSuccessCallback = () => {
        this.setState({ paymentSuccess: false }, () => {
            this.props.resetChangePlanData();
            this.props.getMyPlanApi();
            this.props.navigation.popToTop();
        });
    };

    render () {        
        return (
            <View style={{ flex: 1 }}>
                <AlertBox />
                <ScrollView showsVerticalScrollIndicator = {false} bounces = {false} style = {{flex: 1}}>                
                    <View style = {{flex: 1}}>
                        <LinearGradient colors={['#284397', '#63276f']} start={[0.5, 1]} end={[0, 0.5]}>
                            <HeaderWithBack title={ Localize.t('CHANGE_PLAN_CONFIRM.review_&_pay_text') } backButtonHandler={ () => { this.backButtonPressed() } } />
                            {/* <HeaderWithBack title="Review & Pay" backButtonHandler={ () => { this.backButtonPressed() } } /> */}
                            {this.renderCardBaseView()}
                        </LinearGradient>
                        {this.renderCalculationCard()}
                        <View style={[ styles.refundTextContainer ]}>
                            <Text style={[ styles.refundText ]}>{ Localize.t('CHANGE_PLAN_CONFIRM.refund_message') }</Text>
                            {/* <Text style={[ styles.refundText ]}>* Adjusted amount post plan downgrade/upgrade will be refunded to your account shortly.</Text> */}
                        </View>
                    </View>
                    <PaymentSuccessModal 
                        visible = { this.state.paymentSuccess }
                        invoiceId = { this.props.invoiceId }
                        paymentDate = { (this.state.radioButton === 'billing_cycle')? this.billingCycleDate : Date.now() }
                        amountPaid = { this.state.selectedPlan.price }
                        closeModal = { () => { this.paymentSuccessCallback() } }
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cardBaseView: {
        marginTop: 18,
        flexDirection: 'row', 
        justifyContent: 'center',
        flex: 1
    },
    cardFooterView: {
        marginTop: 15, 
        marginBottom: 8,         
        alignItems: 'center'
    },
    separatorView: {
        justifyContent: 'center', 
        margin: 10
    },
    addOnCardParentView: {        
        flexDirection: 'column', 
        justifyContent: 'center'
    },
    priceCardHeadingParent: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginBottom: 8
    },
    priceCardHeading: {
        fontFamily: 'sky-text-regular',
        fontSize: 15.3,
        color: '#afb1db',
        textAlign: 'center',
        flex: 1
    },
    priceCardFooter: {
        fontFamily: 'sky-text-medium',
        fontSize: 11.3,
        color: '#afb1db',
        textAlign: 'center',
        backgroundColor: 'transparent'
    },
    calculationCard: {
        backgroundColor: 'white', 
        borderWidth: 1, 
        borderColor: 'white', 
        borderRadius: 3.3,
        shadowOffset: {  
            width: 0,  
            height: 0.5,  
        }, 
        shadowColor: 'black',
        shadowOpacity: 0.3, 
        elevation: 2
    },
    calculationCardDarkText: {
        fontFamily: 'sky-text-medium',
        fontSize: 15.3,
        color: config.UI.ticketTextGrey
    },
    calculationCardRegularText: {
        fontFamily: 'sky-text-regular',
        fontSize: 11.3,
        color: config.UI.ticketTextGrey
    },
    calculationCardHighlightedText: {
        fontFamily: 'sky-text-bold',
        fontSize: 23,
        color: '#fb0361'
    },
    calculationCardRowItem: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    payNowButtonText: {
        fontFamily: 'sky-text-medium',
        fontSize: 15.3,
        color: '#fff',
        alignSelf: 'center',
        textAlign: 'center'
    },
    payNowButton: {
        backgroundColor: '#ff1f74', 
        borderWidth: 1, 
        borderColor: '#ff1f74', 
        borderRadius: 3.3, 
        shadowOffset: {  
            width: 0,  
            height: 0.5,  
        }, 
        shadowColor: '#ff0061',
        shadowOpacity: 0.21, 
        elevation: 2,
        margin: 14,
        height: 40
    },
    refundTextContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    refundText: {
        color: config.UI.primaryColor,
        fontFamily: 'sky-text-regular',
        fontSize: 12.3,
        textAlign: 'center',
        paddingHorizontal: 40,
        paddingVertical: 20
    },
    radioContainer: {
        flexDirection: 'row',
        borderBottomColor: 'rgb(204,204,204)', 
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 14.7,
        marginBottom: 14.3,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    radioButtonsContainer: {
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-between',
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

const mapStateToProps = (state) => ({
    reviewCurrentPlanData: state.myPlanAPIData.reviewCurrentPlanData,
    invoiceId: state.changePlanAPIData.invoiceId
});
const mapDispatchToProps = (dispatch) => ({
    getReviewCurrentPlan: () => dispatch(getReviewCurrentPlan()),
    postChangePlan: (payload) => dispatch(postChangePlan(payload)),
    resetChangePlanData: () => dispatch(resetChangePlanData()),
    getMyPlanApi: () => dispatch(getMyPlanApi())
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePlanConfirmationScreen);