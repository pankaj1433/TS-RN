import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo';
import { connect } from 'react-redux';

import config from './../config/config';
import UserForm from './../components/UI/UserForm';
import FriendForm from './../components/UI/FriendForm';
import AlertBox from './../components/Alert';
import GenericScreenBackground from './../components/UI/GenericScreenBackground';
import HeaderTransparent from './../components/layout/HeaderTransparent';
import Localize from './../config/i18n/Localize';
import Card from './../components/UI/Card';

class ReferFriendScreen extends Component {

    constructor(props){
        super(props);
        this.state={
            submitUserDetails:false,
            name:'',
            mobile:''
        }
        
    }

    onSubmitUserDetails = (name,mobile) => {
        this.setState({
            submitUserDetails: true,
            name:name,
            mobile:mobile
        })
    }



    render() {
        return(
        <View style={{flex: 1, position: 'relative'}}>
                <AlertBox />
                <GenericScreenBackground>
                    <ScrollView >
                    <HeaderTransparent title = {Localize.t('REFER_FRIEND.title')} />
                    <Card style={{ padding: 0 }}>
                        <View style={ { padding: 10 } }>
                            <View style={{ marginVertical: 5 }}>
                                <Text style={[ styles.textHeader ]}>{Localize.t('REFER_FRIEND.description1')}<Text style={styles.boldText}> ₹ 300 </Text>{Localize.t('REFER_FRIEND.description2')}</Text>
                            </View>
                        

                    {
                        !this.state.submitUserDetails ?
                        <UserForm showAlert={this.props.showAlert} onSubmitUserDetails={this.onSubmitUserDetails}/>
                        :
                        
                        <FriendForm showAlert={this.props.showAlert} name={this.state.name} mobile={this.state.mobile} navigation={this.props.navigation}/>
                    }



                        </View>
                    </Card>
                    
                    
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
    boldText:{
        color: '#ff2b30',
        fontFamily:'sky-text-medium',
        fontSize:16
    },
    list: {
        justifyContent: 'center',
        paddingBottom: 5
    }
});


const mapStateToProps = (state) => ({
    // basePlanData: state.dataUsageAPIData.basePlan,
    // addOnsData: state.dataUsageAPIData.addOns,
    // dailyUsageData: state.dataUsageAPIData.usageData,
    // monthlyUsageData: state.dataUsageAPIData.monthlyData,
    // weeklyUsageData: state.dataUsageAPIData.weeklyData,
    // APIResponse: state.dataUsageAPIData.APIResponse
});

const mapDispatchToProps = (dispatch) => ({
    showAlert: (alertType, alertMessage) => dispatch({ type: 'SHOW_ALERT', alertType, alertMessage })
    // getDataUsageDetails: () => dispatch(getDataUsage())
});

export default connect(mapStateToProps, mapDispatchToProps)(ReferFriendScreen);
