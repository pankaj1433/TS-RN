import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo';
import { connect } from 'react-redux';
// import firebase from 'react-native-firebase';

import DataUsageChart from './../components/DataUsageChart';
import ToggleSwitch from './../components/UI/ToggleSwitch';
import HeaderWithBack from './../components/layout/HeaderWithBack';
import AnimatedMeter from './../components/UI/MeterAnimation';

import Localize from './../config/i18n/Localize';
import config from './../config/config';
import Card from '../components/UI/Card';
import ListCardLoader from './../components/CardLoaders/ListCardLoader';

import { getDataUsage } from './../actions/dataUsageAction';
import { dataFilter } from '../utils/Filters';

class DataUsageScreen extends Component {

    constructor(props){
        super(props);
        this.state={
            dataUsageDays:'Daily',
            dataUsage: props.dailyUsageData || []
        }
    }

    componentDidMount() {
        // firebase.analytics().setCurrentScreen('DataUsage');
        this.props.getDataUsageDetails();
    }

    componentWillReceiveProps(nextProps){
        if ( this.props.dailyUsageData.length !==  nextProps.dailyUsageData.length) {
            this.setState({
                dataUsage: nextProps.dailyUsageData
            })
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return this.state.dataUsage.length != nextState.dataUsage.length;
    // }
    _renderBottomCards = ({ plan, totalData, consumedData, dataUnit, remainingDays,index }) => {
        return (
            <Card key={ index } style={{ marginBottom: 15 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'column', flex: 1.2, justifyContent: 'space-between' }}>
                        <View style={ [ styles.cardTextContainer ] }>
                            <Text style={ [ styles.cardHeadingText ] }>{plan}</Text>
                        </View>
                        {/* <View style={ [ styles.cardTextContainer ] }>
                            <Text style={ [ styles.cardDataLeftTextHighlight ] }>{ planName || addOnName }</Text>
                        </View> */}
                        <View style={ [ styles.cardTextContainer ] }>
                            <Text style={ [ styles.cardDataLeftText ] }>
                                <Text style={ [ styles.cardDataLeftTextHighlight ] }>{ dataFilter(consumedData, dataUnit) }</Text> {Localize.t('DATA_USAGE.data_consumed_out_of')} { dataFilter(totalData, dataUnit) }
                            </Text>
                        </View>
                        <View style={ [ styles.cardTextContainer ] }>
                            <Text style={ [ styles.cardDataValidityText ] }>{Localize.t('DATA_USAGE.data_validity')}
                                <Text style={ [ styles.cardDataValidityTextHighlight ] } > { remainingDays } {Localize.t('DATA_USAGE.days_remaining')}</Text>
                            </Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems:'flex-end' }} >
                        <AnimatedMeter value={ consumedData/totalData } animated={ false } />
                    </View>
                </View>
            </Card>
        );
    }

    _renderBasePlanCard = () => {
        if ( this.props.basePlanData !== '' ) {
            let basePlanData = this.props.basePlanData;
            basePlanData['plan'] = Localize.t('DATA_USAGE.base_plan');
            return this._renderBottomCards(basePlanData);
        }
        return <ListCardLoader />;
    };

    _renderAddOnCards = () => {
        if (this.props.addOnsData.length > 0) {
            let addOnsData = this.props.addOnsData;
            return addOnsData
                    .map((addOn, index) => {
                        addOn['plan'] = Localize.t('DATA_USAGE.addons_plan');
                        return this._renderBottomCards({...addOn, index});
                    });
        }
        return null;
    };

    selectedOption = (title) => {
        let datas;
        switch(title){
            case 'Daily':
                datas = this.props.dailyUsageData;
                break;
            case 'Weekly':
                datas = this.props.weeklyUsageData;
                break;
            case 'Monthly':
                 datas = this.props.monthlyUsageData;
                break;
            default:
                datas = this.props.dailyUsageData;
        }
        this.setState({
            dataUsage:datas,
            dataUsageDays:title
        })
    }

    render() {
        return (
            <View style={{flex:1,backgroundColor: config.UI.greyBackground}}>
                <ScrollView showsVerticalScrollIndicator = {false} style={ styles.container }>
                    <View style={ [ styles.topContainer ] }>
                        <LinearGradient colors={['#63276f', '#004692']} start={[0, 0]} end={[1, 1]} style={{ padding: 0, flex: 0.5 }} >
                            <HeaderWithBack title={ Localize.t('DATA_USAGE.data_usages') } backButtonHandler={this.props.navigation.goBack}/>
                            {
                               this.state.dataUsage.length ? 
                               <DataUsageChart data={this.state.dataUsage} handler={(title)=>this.selectedOption(title)} days={this.state.dataUsageDays}/>
                                : <View style={{ backgroundColor: 'transparent', paddingVertical: 150 }}></View>
                           }    
                            </LinearGradient>
                    </View>
                    
                    <View style={ [ styles.bottomContainer ] }>
                        { this._renderBasePlanCard() }
                        { this._renderAddOnCards() }
                    </View>
                </ScrollView>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        // backgroundColor: 'transparent' 
    },
    topContainer: { 
        flex: 1, 
        shadowOffset: {  
            width: 1,  
            height: 2,  
        }, 
        shadowColor: 'black',
        shadowOpacity: 0.5, 
        elevation: 4, 
        zIndex: 4
    },
    bottomContainer: { 
        flex: 1, 
        backgroundColor: config.UI.background2,
        paddingVertical: 30, 
        paddingHorizontal: 10 
    },
    cardTextContainer: {
        paddingVertical: 3
    },
    cardHeadingContainer: {},
    cardHeadingText: {
        fontFamily: 'sky-text-medium',
        fontSize: 15.3,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 16.3,
        letterSpacing: 0,
        textAlign: "left",
        color: config.UI.textDarkGrey
    },
    cardDataLeftText: {
        fontFamily: 'sky-text-regular',
        fontSize: 15.3,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 16.3,
        letterSpacing: 0,
        textAlign: "left",
        color: config.UI.textDarkGrey
    },
    cardDataLeftTextHighlight: {
        color: config.UI.primaryColor,
        fontFamily: 'sky-text-medium'
    },
    cardDataValidityText: {
        fontFamily: 'sky-text-regular',
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 14.3,
        letterSpacing: 0,
        textAlign: "left",
        color: config.UI.textGrey
    },
    cardDataValidityTextHighlight: {
        color: config.UI.textDarkGrey,
        fontFamily: 'sky-text-medium'
    }
});

const mapStateToProps = (state) => ({
    basePlanData: state.dataUsageAPIData.basePlan,
    addOnsData: state.dataUsageAPIData.addOns,
    dailyUsageData: state.dataUsageAPIData.usageData,
    monthlyUsageData: state.dataUsageAPIData.monthlyData,
    weeklyUsageData: state.dataUsageAPIData.weeklyData,
    APIResponse: state.dataUsageAPIData.APIResponse
});

const mapDispatchToProps = (dispatch) => ({
    getDataUsageDetails: () => dispatch(getDataUsage())
});

export default connect(mapStateToProps, mapDispatchToProps)(DataUsageScreen);
