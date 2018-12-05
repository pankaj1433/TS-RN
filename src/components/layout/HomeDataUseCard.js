import React, { Component } from 'react';
import { View, StyleSheet,Text,Dimensions,Image,TouchableOpacity,Platform } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Card from './../UI/Card';
import MeterAnimation from './../UI/MeterAnimation'
import AnimatedProgressBar from './../UI/AnimatedProgressBar';
import HomeDataCardLoader from './../CardLoaders/HomeDataCardLoader';
import config from './../../config/config';
import Localize from './../../config/i18n/Localize';
import PrimaryButton from '../UI/ButtonPrimary';
import GetAddonsCard from './../getAddonsCard';
import { dateFilter, camelCase, dataFilter, dateTimeFilter } from './../../utils/Filters';
// import TrackMixpanel from '../../utils/TrackMixpanel';

const {width,height} = Dimensions.get('window');

class HomeDataUseCard extends Component {

    knowMoreClick = () => {
        // TrackMixpanel.track('HomeClick', { action: 'Know More', location: 'Data Use Card' })
        this.props.navigation.navigate('DataUsageScreen');
    };

    rechargeButtonClick = () => {
        this.props.navigation.navigate('RechargeTab');
    };

    _renderRechargeButton () {
        return (
            <PrimaryButton 
                onClick = {()=> this.rechargeButtonClick()}
                title={Localize.t('RECHARGE.title')}
                // title="Recharge"
                scheme="dark"
                trackEvent={ 'HomeClick' }
                trackProperties={ { action: 'Recharge', location: 'Data Use Card' } }
            />
        );
    }

    render() {
        if (Object.keys(this.props.userDataDetail).length > 0) {
            let { name,
                remainingDays,
                totalDays,
                nextRechargeDate,
                totalData,
                dataUnit,
                consumedData,
                usesAsOnDate,
                rechargeButtonVisible,
                addOnVisible,
                availableAddOns,
                // planName
            } = this.props.userDataDetail;
            const addOnCard = (addOnVisible)? <GetAddonsCard navigation={ this.props.navigation } addOnList = { availableAddOns || [] } />: null;
            let UserName = camelCase(name) || "";
            let daysRemaining = remainingDays || "0";
            let dueDate = dateFilter(nextRechargeDate);
            let now = usesAsOnDate || "15 Apr, 02:34pm";
            let balance =  dataFilter(consumedData, dataUnit);
            let totalDataText = dataFilter(totalData, dataUnit);
            // let meterWidth = (width/2)-20;
            let meterWidth = (((width/2)-20)>190)?190:(width/2)-20;
            let meterPercent = (consumedData/totalData)*100;
            let progressValue = (remainingDays/totalDays) * 100;   //out of 100
            const rechargeButton = (rechargeButtonVisible)? this._renderRechargeButton() : null;

            return (
                <View>
                    <View style={styles.androidContainer}>
                        <Card style={styles.cardStyle}>
                            <View style={styles.header}>
                                <View style={styles.leftContainer}>
                                    <View style={{flexDirection:'row',marginTop:6}}>
                                        <Text allowFontScaling={true} style={styles.boldText}>{Localize.t('COMMON.Hi')} !</Text>
                                        {/* <Text allowFontScaling={true} style={styles.boldText}>Hi !</Text> */}
                                        {/* <Text style={styles.boldText}>{UserName}!</Text>                        */}
                                    </View>
                                    {/* {
                                        planName ? 
                                        <View style={{flexDirection: 'row',marginTop:6}}>
                                            <Text style={styles.lightText}>{Localize.t('DATA_USAGE.curren_plan')}</Text>
                                        </View>
                                        :null
                                    }
                                    {
                                        planName ?
                                        <View style={{flexDirection: 'row',marginTop:4}}>
                                            <Text style={styles.planNameText}>{planName}</Text>
                                        </View>
                                        :null
                                    } */}

                                    <View style={{flexDirection:'row',marginTop:6}}>
                                        <Text style={styles.lightText}>{Localize.t('DATA_USAGE.monthly_usage')}</Text>
                                        {/* <Text style={styles.lightText}>Your Monthly Data Usage</Text> */}
                                        
                                    </View>
                                    <View style={{flexDirection:'row',marginTop:16}}>
                                        <Text style={styles.boldText}>{Localize.t('COMMON.validity')}</Text> 
                                        {/* <Text style={styles.boldText}>Data Validity</Text> */}
                                          
                                    </View>
                                    <View style={{flexDirection:'row',marginTop:6}}>
                                        <Text style={[styles.boldText,{fontFamily: 'sky-text-regular'}]}>{daysRemaining}</Text>
                                        <Text style={[styles.boldText,{fontFamily: 'sky-text-regular'}]}> {Localize.t('DATA_USAGE.days_remaining')}</Text>   
                                        {/* <Text style={[styles.boldText,{fontFamily: 'sky-text-regular'}]}> days remaining </Text> */}
                                    </View>
                                    <View style={{marginTop:6}}>
                                        <AnimatedProgressBar width={meterWidth} progress = {progressValue} />
                                    </View>
                                    <View style={{flexDirection:'row',marginTop:16,marginBottom:9}}>
                                        <Text style={styles.lightText}>{Localize.t('DATA_USAGE.next_due')} </Text>
                                        {/* <Text style={styles.lightText}>Next Recharge Due </Text> */}
                                        
                                        <Text style={[styles.lightText,{color: config.UI.textDarkGrey}]}> {dueDate}</Text>   
                                    </View>
                                </View>
                                <View style={styles.rightContainer}>
                                    {
                                        (Platform.OS === 'ios') ? 
                                        <View style={styles.meterWrapperIOS}>
                                            <MeterAnimation width={meterWidth} value={meterPercent} />
                                        </View>:null
                                    }
                                    <View style={{ top:36,alignItems:'center',alignSelf: 'center'}}>
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={styles.lightText}>{Localize.t('DATA_USAGE.as_on')} </Text>
                                            {/* <Text style={styles.lightText}>Usage as on </Text> */}
                                            
                                            <Text style={styles.lightText}>{ dateTimeFilter(now) }</Text>
                                        </View>
                                        <View style={{flexDirection:'row',marginTop:6}}>
                                            <Text style={styles.DataBalance}>{balance}</Text>
                                        </View>
                                        <View style={{flexDirection:'row',marginTop:6}}>
                                        <Text style={styles.boldText}>{Localize.t('DATA_USAGE.consumed')} </Text>
                                        {/* <Text style={styles.boldText}>Consumed of </Text> */}
                                            <Text style={styles.boldText}>{totalDataText}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.footer}>
                                <Image style={{width:width}} resizeMode="stretch" source={require('./../../assets/img/zigzag/zigzag.png')}/>
                                <View style={styles.footerWraper}>
                                    <View>
                                        { rechargeButton }
                                    </View>
                                    <TouchableOpacity style={{paddingHorizontal:10}} onPress={ this.knowMoreClick }>
                                        <Text style={styles.knowMore}>{Localize.t('COMMON.know_more')}  ></Text>
                                        {/* <Text style={styles.knowMore}>Know More  ></Text> */}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>
                        <View style={styles.AndroidMeterWrapper}>
                            <MeterAnimation width={meterWidth} value={meterPercent} />
                        </View>
                    </View>
                    { addOnCard }
                </View>
            );
        }
        return <HomeDataCardLoader/>;
    }
}

const styles = StyleSheet.create({
    androidContainer: {
        ...Platform.select({
            android: {
              backgroundColor: 'transparent',
              marginHorizontal:10,
              position: 'relative',
              padding:1,
              top: -13,
              marginBottom: -13
            },
          }),
    },
    AndroidMeterWrapper: {
        ...Platform.select({
            ios: {
                display: 'none'
            },
            android: {
                position:'absolute',
                top: 3,
                right: 0,
                zIndex: 100,
                elevation: 100,
                width: width/2-10,
                alignItems:'center'
            }
        })
    },
    cardStyle: {
        flexShrink:1,
        marginHorizontal: 10,
        padding:0,
        ...Platform.select({
            android: {
                marginTop: 13,
                position:'relative',
                marginHorizontal: 0,
            }
        })
    },
    header: {
        alignItems:'center',
        width: width-20,
        flexDirection: 'row',
    },
    footer: {
        flexGrow: 1,
        backgroundColor: config.UI.buttonGrey,
        overflow: 'hidden',
    },
    footerWraper: {
        padding:10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    leftContainer: {
        width: width/2-10,
        padding: 10,
        overflow:'hidden',
    },
    rightContainer: {
        width: width/2-10,
        padding: 10,
        position: 'relative',
    },
    boldText: {
        color: config.UI.textDarkGrey,
        fontFamily:'sky-text-medium',
        fontSize:16
    },
    lightText: {
        color: config.UI.textGrey,
        fontFamily: 'sky-text-regular',
        fontSize: 12
    },
    meterWrapperIOS: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                top: -60,
                alignSelf: 'center'
            }
        })
    },
    knowMore: {
        fontSize: 14,
        fontFamily: 'sky-text-medium',
        color: config.UI.textBlue
    },
    DataBalance: {
        color: config.UI.redBalance,
        fontFamily: 'sky-text-bold',
        fontSize: 23,
        textAlign:'center'
    },
     // planNameText:{
    //     color: config.UI.redBalance,
    //     fontFamily: 'sky-text-medium',
    //     fontSize: 16,
    //     // textAlign:'center'
    // }

});

HomeDataUseCard.propTypes = {
    recharge: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    userDataDetail: state.homeAPIData.userDataDetail
});
const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeDataUseCard);