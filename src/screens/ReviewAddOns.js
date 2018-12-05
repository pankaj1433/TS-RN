import React, {Component} from 'react'
import {View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native'
import { LinearGradient, Constants } from 'expo';
import {Feather} from '@expo/vector-icons';
import { connect } from 'react-redux';

import Localize from './../config/i18n/Localize';
import PriceCard from './../components/UI/PriceCard';
import Card from './../components/UI/Card';
import config from './../config/config';
import { priceFilter, dataFilter } from '../utils/Filters';
import PriceCardLoader from './../components/CardLoaders/PriceCardLoader';
import AlertBox from './../components/Alert';
import HeaderWithBack from '../components/layout/HeaderWithBack';
import ButtonPrimary from '../components/UI/ButtonPrimary';
import PaymentSuccessModal from './../components/modal/PaymentSuccessModal';

import { getReviewCurrentPlan, getMyPlanApi } from './../actions/myPlanAction';
import { postAddAddon, resetAddAddon } from './../actions/addAddonAction';
class ReviewAddOnsScreen extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            currentPlanCardMaxY: 0.0,
            selectedAddOn: {
                secondLine: this.props.navigation.state.params.secondLine,
                price: this.props.navigation.state.params.price,
                validity: this.props.navigation.state.params.validity,
                productOfferingId: this.props.navigation.state.params.productOfferingId,
                // addOnName: this.props.navigation.state.params.aliasName || this.props.navigation.state.params.addOnName
            },
            paymentSuccess: false
        }
    }

    componentWillMount () {
        this.props.getReviewCurrentPlan();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.invoiceId !== '') {
            //trigger payment Modal
            this.setState({ paymentSuccess: true });
        }
    }

    backButtonPressed = () => {
        this.props.navigation.goBack()
    }

    renderCardBaseView = () => {
        let cardSize = Math.min(0.38*(Dimensions.get('window').width), 180);
        let addOnCardSize = Math.min(0.32*(Dimensions.get('window').width), 144);
        const myPlanCard = (Object.keys(this.props.reviewCurrentPlanData).length > 0)?
            (
                <PriceCard 
                    FirstLine = { Localize.t('REVIEW_ADD_ON.data_per_month') }
                    // AliasName = { this.props.reviewCurrentPlanData.planName }
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
                        <Text style = {styles.priceCardHeading}>{ Localize.t('REVIEW_ADD_ON.current_base_plan') }</Text>
                        
                    </View>
                    <View onLayout = {this.didLayoutCurrentPlanCard}>
                        { myPlanCard }
                    </View>

                    {/* <View style = {[styles.cardFooterView, {width: cardSize}]}>
                        <Text style = {styles.priceCardFooter}>{ Localize.t('REVIEW_ADD_ON.usage') } { priceFilter(this.props.reviewCurrentPlanData.walletBalance || 0) }</Text>
                        <Text style = {[styles.priceCardFooter, {fontFamily: 'sky-text-regular'}]}>({ Localize.t('REVIEW_ADD_ON.based_on_pro_data') })</Text>
                    </View> */}
                </View>

                <View style = {[styles.centerSeparatorView, {height: this.state.currentPlanCardMaxY}]}>
                    <Image source = {require('./../assets/img/AddIcon/icAdd.png')} resizeMode = 'contain' style = {{flex: 1}}/>
                </View>                

                <View style = {[styles.addOnCard, {height: this.state.currentPlanCardMaxY, width: addOnCardSize}]}>
                    <View style = {styles.priceCardHeadingParent}><Text style = {styles.priceCardHeading}>{ Localize.t('REVIEW_ADD_ON.selected_addons') }</Text></View>
                    <PriceCard 
                        FirstLine = ''
                        // AliasName = { this.state.selectedAddOn.addOnName }
                        SecondLine = { this.state.selectedAddOn.secondLine } 
                        validity = { this.state.selectedAddOn.validity } 
                        price = { priceFilter(this.state.selectedAddOn.price) } 
                        hasGradientText = {true} 
                        hasBorder = {true} 
                        size = {addOnCardSize}
                        productOfferingId = { this.state.selectedAddOn.productOfferingId }
                    />
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
        let deductedAmount = 0;
        let remainingWalletBalance = 0;
        let rechargeButtonText = Localize.t('REVIEW_ADD_ON.buy_addon');
        if (Object.keys(this.props.reviewCurrentPlanData).length > 0) {
            let selectedAddOnPrice = parseFloat(this.state.selectedAddOn.price);
            //calculateTotal = selectedAddOnPrice - this.props.reviewCurrentPlanData.walletBalance;
            if (this.props.reviewCurrentPlanData.walletBalance >= selectedAddOnPrice) {
                showRecharge = false;
                calculateTotal = 0;
                remainingWalletBalance = this.props.reviewCurrentPlanData.walletBalance - selectedAddOnPrice;
                deductedAmount = selectedAddOnPrice;
            }
            else {
                showRecharge = true;
                calculateTotal = selectedAddOnPrice - this.props.reviewCurrentPlanData.walletBalance;;
                remainingWalletBalance = 0;
                selectedAddOnPrice = this.props.reviewCurrentPlanData.walletBalance;
            }
            rechargeButtonText = (showRecharge)? Localize.t('REVIEW_ADD_ON.pay_now'): Localize.t('REVIEW_ADD_ON.buy_addon');
            
        }
        return (
            <View style={{ margin: 14 }}>
                <View style = {[styles.calculationCard, {marginBottom: 14}]}>
                    <View style = {{paddingHorizontal: 10}}>
                        <Text style = {styles.calculationCardDarkText}>{ Localize.t('REVIEW_ADD_ON.to_pay') }</Text>
                        
                    </View>

                    <View style = {[styles.calculationCardRowItem, {marginTop: 15}]}>
                        <Text style = {styles.calculationCardDarkText}>{ Localize.t('REVIEW_ADD_ON.addon_cost') }</Text>
                        
                        <Text style = {styles.calculationCardDarkText}>{ priceFilter(this.state.selectedAddOn.price) }</Text>
                    </View>

                    <View style = {[styles.calculationCardRowItem, {marginTop: 12}]}>
                        <View style = {{flexDirection: 'row'}}>
                            <Text style = {styles.calculationCardDarkText}>{ Localize.t('REVIEW_ADD_ON.account_balance') }</Text>
                            
                            <Text style = {styles.calculationCardRegularText}></Text>
                        </View>
                        <View style = {{flexDirection: 'row'}}><Text style = {styles.calculationCardRegularText}>(-) </Text><Text style = {styles.calculationCardDarkText}>{ priceFilter(deductedAmount) }</Text></View>
                    </View>
                    <Text style = {[styles.calculationCardRegularText, {paddingHorizontal: 10}]}>({ Localize.t('REVIEW_ADD_ON.remaining_balance') } { priceFilter(remainingWalletBalance) })</Text>
                    
                    <View style = {[styles.calculationCardRowItem, {backgroundColor: config.UI.buttonGrey, marginTop: 20, height: 46.3, alignItems: 'center'}]}>
                        <Text style = {styles.calculationCardDarkText}>{ Localize.t('REVIEW_ADD_ON.total') }</Text>
                        
                        <Text style = {styles.calculationCardHighlightedText}>{ priceFilter(calculateTotal) }</Text>
                    </View>
                </View>
                <ButtonPrimary 
                    title={ rechargeButtonText }
                    onClick = { () => { this.handlePayNowButtonTapped(calculateTotal) } }
                    scheme = "dark"
                    disabled = { Object.keys(this.props.reviewCurrentPlanData).length === 0 }
                    trackEvent = { 'AddAddOn' }
                    trackProperties = {{ action: rechargeButtonText }}
                />
            </View>
        );
    }

    handlePayNowButtonTapped = (calculateTotal) => {
        if (calculateTotal === 0) {
            let payload = {
                productOfferingId: this.state.selectedAddOn.productOfferingId
            };
            this.props.postAddAddon(payload);
        }
        else {
            this.props.navigation.navigate('RechargeWebViewScreen', { 
                transactionValue: calculateTotal, 
                from: 'MyPlanTab'
            });
        }
    }

    closePaymentSuccess = () => {
        this.setState({ paymentSuccess: false }, () => {
            this.props.resetAddAddon();
            this.props.getMyPlanApi();
            this.props.navigation.popToTop();
        });
    };

    render () {        
        return (
            <ScrollView showsVerticalScrollIndicator = {false} bounces = {false} style = {{flex: 1}}>
                <AlertBox />
                <View style = {{flex: 1}}>
                    <LinearGradient colors={['#284397', '#A62871']} start={[1, 1]} end={[0, 1]}>
                        <HeaderWithBack title={ Localize.t('REVIEW_ADD_ON.review_&_pay_text') } backButtonHandler={ () => { this.backButtonPressed() } } />
                        {this.renderCardBaseView()}                        
                    </LinearGradient>
                    {this.renderCalculationCard()}
                </View>
                <PaymentSuccessModal 
                    visible = { this.state.paymentSuccess }
                    invoiceId = { this.props.invoiceId }
                    paymentDate = { Date.now() }
                    amountPaid = { this.state.selectedAddOn.price }
                    closeModal = { () => { this.closePaymentSuccess() } }
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cardBaseView: {
        marginTop: 18, 
        flexDirection: 'row', 
        justifyContent: 'center'
    },
    cardFooterView: {
        marginTop: 15, 
        marginBottom: 8,         
        alignItems: 'center'
    },
    addOnCard: {        
        flexDirection: 'column', 
        justifyContent: 'center'
    },
    centerSeparatorView: {
        justifyContent: 'center', 
        margin: 10        
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
        paddingTop: 10,
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
        paddingHorizontal: 10,
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
    }
});

const mapStateToProps = (state) => ({
    reviewCurrentPlanData: state.myPlanAPIData.reviewCurrentPlanData,
    invoiceId: state.addAddonAPIData.invoiceId
});

const mapDispatchToProps = (dispatch) => ({
    getReviewCurrentPlan: () => dispatch(getReviewCurrentPlan()),
    postAddAddon: (payload) => dispatch(postAddAddon(payload)),
    resetAddAddon: () => dispatch(resetAddAddon()),
    getMyPlanApi: () => dispatch(getMyPlanApi())
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewAddOnsScreen);