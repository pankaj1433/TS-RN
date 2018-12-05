import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, RefreshControl, ScrollView , FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { Switch } from 'react-native-switch';
// import firebase from 'react-native-firebase'

import { getRecharge } from '../actions/rechargeAction';
import { resetState } from '../actions/homeAction';
import { dateFilter , priceFilter } from './../utils/Filters';
// import TrackMixpanel from './../utils/TrackMixpanel';

import GenericScreenBackground from './../components/UI/GenericScreenBackground'
import Card from './../components/UI/Card';
import Divider from './../components/UI/Divider';
import PrimaryButton from './../components/UI/ButtonPrimary';
import HeaderTransparent from './../components/layout/HeaderTransparent';
import AlertBox from './../components/Alert';
import ToggleSwitch from './../components/UI/ToggleSwitch';
import RechargeLoader from '../components/CardLoaders/RechargeLoader';

import config from './../config/config';
import Localize from './../config/i18n/Localize';

class RechargeScreen extends Component {

    constructor () {
        super();
        this.state = {
            amount: '0',
            pageRefreshing: false,
            autoPay: false,
            next_recharge_due: 'xx Jxx ,2XXX',
            base_plan_cost: '₹ XXX',
            account_balance: '₹ XXX',
            paymentMode: ''
        }
    }
    payNowSubmit = () => {
        //pay now button handler
        if (this.state.amount && this.state.amount !== '0') {
            // firebase.analytics().logEvent('PayNow');
            // TrackMixpanel.trackWithProperties('RechargeClick',{ action: 'Pay Now', rechargeAmount: priceFilter(this.state.amount) });
            this.props.navigation.navigate('RechargeWebViewScreen', { transactionValue: this.state.amount ,standingInstructionYN: this.state.autoPay,paymentOption:this.state.paymentMode});
        }
        else {
            // TrackMixpanel.trackWithProperties('RechargeClick',{ action: 'Pay Now', rechargeAmount: 'Invalid Amount' });
            this.props.showAlert('warn', Localize.t('RECHARGE.invalid_recharge_amount'));
            
        }
    }

    componentWillMount() {
        // firebase.analytics().setCurrentScreen('Recharge');
        if(!this.props.navigation.state.params){
            this.props.getRecharge();
        }else{
            let { basePlanPrice, walletBalance, recommendedAmount, nextRechargeDate } = this.props.navigation.state.params;
            this.setState({ 
                amount: Number(recommendedAmount).toString(),
                next_recharge_due: dateFilter(Number(nextRechargeDate)),
                base_plan_cost: priceFilter(basePlanPrice),
                account_balance: priceFilter(walletBalance)
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log('this.props.navigation', this.props.navigation);
        if ( this.props.APIFlag !== nextProps.APIFlag && nextProps.APIFlag === true ) {
            this.setState({ pageRefreshing: false })
        }

        // todo : set amount send from banner

        if (!nextProps.navigation.state.params && Object.keys(nextProps.rechargeData).length > 0) {
            let { basePlanPrice, walletBalance, recommendedAmount,nextRechargeDate } = nextProps.rechargeData
            // if (basePlanPrice > walletBalance) {
            //     this.setState ({
            //         amount: (basePlanPrice - walletBalance).toString() ,
            //     })
            // }
            // else {
            //     this.setState({amount: '0'})
            // }
            this.setState({ 
                amount: recommendedAmount.toString(),
                next_recharge_due: dateFilter(nextRechargeDate),
                base_plan_cost: priceFilter(basePlanPrice),
                account_balance: priceFilter(walletBalance)
             })
        }
    }

    onRefresh = () => {
        // TrackMixpanel.trackWithProperties('PullToRefresh',{refreshedScreen: 'Recharge Screen'});
        this.setState({ pageRefreshing: true }, () => {
            this.props.getRecharge({});
        });
    }

    handleAutoPay = () => {
        this.setState({
            autoPay: !this.state.autoPay
        })
    }

    setPaymentOption = (key) => {
        this.setState({
            paymentMode:key
        })
    }

    renderItem = (data) => {
        let { width, height } = Dimensions.get('window');
        return (
            <TouchableOpacity key={ data.item.key } onPress = {() => {this.setPaymentOption(data.item.key)}}>
                <View style={ data.item.key === this.state.paymentMode ? [ styles.listItemContainer,{backgroundColor:config.UI.greyBackground} ]: [styles.listItemContainer] }>
                    <View style={ [ styles.listItem, { width: ( (width-45)/2 ) } ] }>
                        <View style={{ height: 70, paddingVertical: 10 ,alignContent:'center'}}>
                            <Image source={ data.item.imageUrl }/>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        );
    };


    render() {
        let paymentOptions = [
            {key:'PayTM',imageUrl:require('./../assets/img/Payment/icon_paytm.png'),description:'Pay via PayTM ,one stop solution for every need.'},
            {key:'BillDesk',imageUrl:require('./../assets/img/Payment/icon_billdesk.png'),description:'Pay via Bill Desk,all your payments at single Location.'}
        ]

        let paymentElements = <FlatList
                                style={{marginTop:10}}
                                horizontal = { false }
                                numColumns = { 2 }
                                showsVerticalScrollIndicator = {false}
                                contentContainerStyle={ styles.list }
                                data={ paymentOptions }
                                renderItem={this.renderItem}
                                />


        return (
            <View style={{flex: 1, position: 'relative'}}>
                <AlertBox />
                <GenericScreenBackground>
                    <ScrollView  
                        refreshControl = { 
                            <RefreshControl 
                                refreshing={this.state.pageRefreshing }
                                onRefresh={ () => { this.onRefresh() } }
                                tintColor = "#fff"
                            /> }
                        showsVerticalScrollIndicator = {false}        
                    >
                    <HeaderTransparent title = {Localize.t('RECHARGE.title')} />
                    {
                        Object.keys(this.props.rechargeData).length || this.props.navigation.state.params ?
                        <Card style={{ padding: 0 }}>
                        <View style={ { padding: 10 } }>
                            <View style={{ marginVertical: 5 }}>
                                <Text style={[ styles.textHeader ]}>{Localize.t('DATA_USAGE.next_due')}<Text style={[ styles.textHeaderHighlight ]}> {this.state.next_recharge_due}</Text></Text>
                                
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={ [ styles.pinkHeading ] }>{Localize.t('RECHARGE.base_plan')}</Text>
                                    
                                    <Text style={ [ styles.valueText ] }>{this.state.base_plan_cost}</Text>
                                </View>
                                <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Text style={ [ styles.pinkHeading ] }>{Localize.t('RECHARGE.acc_bal')}</Text>
                                    
                                    <Text style={ [ styles.valueText ] }>{ this.state.account_balance }</Text>
                                </View>
                            </View>
                        </View>
                        
                        <Divider style={{borderBottomWidth: StyleSheet.hairlineWidth}} color = '#ccc' />
                        

                        <View style={{ justifyContent: 'center',alignItems: 'center', paddingHorizontal: 10, paddingVertical:20}}>
                                <View>
                                    <Text style={[styles.pinkHeading,{lineHeight: 14.7}]}>{Localize.t('RECHARGE.recommended')}</Text>
                                    <View style={{paddingVertical: 10, flexDirection: 'column'}}>
                                        <View style={{flexDirection: 'row', borderBottomColor: '#3583BF', borderBottomWidth: 1.3,justifyContent:'center',alignItems:'center' ,paddingBottom:10}}>
                                            <FontAwesome name='rupee' size = {27} style={{ paddingHorizontal: 5 }}/>
                                            <TextInput
                                                accessible={true}
                                                accessibilityLabel="rechargeAmount"
                                                onChangeText={(amount) => { this.setState({amount}) }}
                                                value={this.state.amount}
                                                underlineColorAndroid={'transparent'}
                                                //placeholder={Localize.t('RECHARGE.amt')}
                                                keyboardType='numeric'
                                                returnKeyType='done'
                                                // onSubmitEditing={ () => this.payNowSubmit() }
                                                maxLength={6}
                                                onFocus = { () => { if(this.state.amount == '0'){this.setState({amount: ''})} } }
                                                style={{flex:1,lineHeight:17.7,paddingHorizontal: 5, fontSize: 27, fontWeight: '700', textAlign: 'center' }}
                                            />
                                        </View>
                                    </View>
                                </View>
                        </View>

                        <Divider style={{borderBottomWidth: StyleSheet.hairlineWidth}} color = '#ccc' />
                        <View style={ { padding: 10 } }>
                            <View style={{ marginVertical: 5 }}>
                                <Text style={[ styles.textHeader ]}>{Localize.t('RECHARGE.payment_options')}</Text>
                                { paymentElements }
                            </View>
                        </View>


                        <View style={styles.bottomCard}>
                            {/*<View > */}
                                {/*<Text style={[styles.pinkHeading,{lineHeight: 14.7,fontSize:14.7,padding:8,marginVertical:0}]}>{Localize.t('RECHARGE.autoPay')}</Text>*/}
                                {/*<View style={{alignItems:'center'}}> */}
                                    {/*<Switch*/}
                                        {/*accessible={true}*/}
                                        {/*accessibilityLabel="autoPay"*/}
                                        {/*backgroundActive = {config.UI.toggleSwitchActive}*/}
                                        {/*backgroundInactive = {config.UI.toggleSwitchInActive}*/}
                                        {/*innerCircleStyle={{ alignItems: "center", justifyContent: "center" , width: 20 , height:20 , borderRadius: 20/2 ,borderColor: this.state.autoPay ? '#1e8a51' : '#4d4d4d' }}*/}
                                        {/*onValueChange={ () => this.handleAutoPay()}*/}
                                        {/*value={this.state.autoPay}*/}
                                    {/*/>*/}
                                {/*</View>*/}
                            {/*</View>*/}

                            <PrimaryButton 
                                    disabled={!this.state.paymentMode}
                                    accessible={true}
                                    accessibilityLabel="payNowButton"
                                    onClick = {()=> this.payNowSubmit()}
                                    title={Localize.t('RECHARGE.pay')}
                                    scheme="dark"
                                    from="lslsls"
                            />
                        </View>
                    </Card>:
                    <RechargeLoader/>
                    }
                    
                    </ScrollView>
                </GenericScreenBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textHeader: {
        fontFamily: "sky-text-medium",
        fontSize: 15.3,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: config.UI.textDarkGrey
    },
    textHeaderHighlight: {
        color: '#ff2b30'
    },
    pinkHeading: {
        fontFamily: "sky-text-regular",
        fontSize: 13.3,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 13.6,
        letterSpacing: 0,
        textAlign: "left",
        color: config.UI.textGrey,
        marginVertical: 5
    },
    valueText: {
        fontFamily: 'sky-text-medium',
        fontSize: 15.3,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: config.UI.textDarkGrey,
        marginVertical: 5
    },
    bottomCard:{
        backgroundColor: config.UI.buttonGrey, 
        justifyContent: 'space-around',
        flexDirection: 'row', 
        height: 100,
        overflow: 'hidden',
        alignItems: 'center'
    },
    listItemContainer: {
        flex: 1,
        height: 100,
        maxHeight:100,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'center'
        },
    listItem: { 
        justifyContent: 'center',
        alignItems: 'center' 
    },

    list: {
        justifyContent: 'center',
        paddingBottom: 5
    }
});


const mapDispatchToProps = (dispatch) => ({
    getRecharge: () => dispatch(getRecharge()),
    resetState: () => dispatch(resetState()),
    showAlert: (alertType, alertMessage) => dispatch({ type: 'SHOW_ALERT', alertType, alertMessage })
});

const mapStateToProps = (state) => ({
    rechargeData: state.rechargeAPIData.data,
    APIFlag: state.rechargeAPIData.rechargeAPIFlag
});

export default connect(mapStateToProps, mapDispatchToProps)(RechargeScreen);