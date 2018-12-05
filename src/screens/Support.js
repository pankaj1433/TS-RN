import React, { Component } from 'react';
import { View, Text, FlatList, Image, StyleSheet,TouchableOpacity,ScrollView, Linking, RefreshControl } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
// import firebase from 'react-native-firebase';

import GenericScreenBackground from './../components/UI/GenericScreenBackground';
import HeaderTransparent from './../components/layout/HeaderTransparent';
import Card from './../components/UI/Card';
import Divider from './../components/UI/Divider';
import AlertBox from './../components/Alert';

import config from './../config/config';
import Localize from './../config/i18n/Localize';

import { dateFilter } from './../utils/Filters';
// import TrackMixpanel from './../utils/TrackMixpanel';

import { getSupportApi } from './../actions/supportAction';

const RequestHistoryRowIndex = 0
const DoYourselfRowIndex = 2
const CreateRequestRowIndex = 1

const List = [
    {
        icon:require('./../assets/img/icServiceHistory/icServiceHistory.png'),
        title: 'Service Request History',
        desc:'Displays history of your requests'
    },
    // {
    //     icon:require('./../assets/img/icDoItYourself/icDoItYourself.png'),
    //     title: 'Do it Yourself',
    //     desc:'Solve your queries with our help widget'
    // },
    {
        icon:require('./../assets/img/icCreateRequest/icCreateRequest.png'),
        title: 'Create a Request',
        desc:'Raise a request or make a complaint'
    },
]

class ContactScreen extends Component {

    constructor() {
        super();
        this.state = {
            pageRefreshing: false,
        }
    }

    componentWillMount () {
        // firebase.analytics().setCurrentScreen('Support');
        this.props.getSupportData({});
    }
    componentWillReceiveProps(nextProps) {
        if ( this.props.APIFlag !== nextProps.APIFlag && nextProps.APIFlag === true ) {
            this.setState({pageRefreshing: false})
        }
    }
    
    track(action) {
        // TrackMixpanel.trackWithProperties('SupporClicks',{ action: action });
    }

    onRefresh = () => {
        // TrackMixpanel.trackWithProperties('PullToRefresh',{refreshedScreen: 'Support Screen'});
        this.setState({ pageRefreshing: true }, () => {
            this.props.getSupportData({});
        });
    };

    ticket = () => {
        let data = {
            'requestCreateDate': '',
            'requestType': '',
            'status': '',
            'ticketNumber': ''
        };        

        if (this.props.apiResponseData !== '') {            
            let { requestType, status, ticketNumber, requestCreateDate } = this.props.apiResponseData;
            data = {
                requestType,
                status,
                ticketNumber,
                requestCreateDate: dateFilter(requestCreateDate)
            }
        } else {
            return null
        }
        return (
            <View style={styles.ticketContainer}>
                <View style={styles.ticketWraper}>
                    <Image style={styles.ticketBackground}  resizeMode='stretch' source={require('./../assets/img/ticket/ticket.png')}/>
                </View>
                <View style={styles.ticketTextContainer}>
                    <View style={styles.ticketTextWrapper}>
                        <View style={{flex: 8,justifyContent:'space-around'}}>
                            <View style={styles.ticketDateWrapper}>
                                <Text style={styles.ticketDateText}>{Localize.t('SUPPORT.req_created')}</Text>
                                <Text style={styles.ticketDateText}>{data.requestCreateDate}</Text>
                            </View>
                            <View style={styles.ticketBottomWraper}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.ticketLightText}>{Localize.t('SUPPORT.req_type')}</Text>
                                    <Text style={styles.ticketBoldText}>{data.requestType}</Text>
                                </View>
                                <View style={{flex: 1,alignItems:'flex-end'}}>
                                    <View>
                                        <Text style={styles.ticketLightText}>{Localize.t('SUPPORT.req_status')}</Text>
                                        <Text style={[styles.ticketBoldText,{color:'#fb0160'}]}>{data.status}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.rotatedText}>
                            <Text style={styles.ticketLightText}>{Localize.t('SUPPORT.ticket')}</Text>
                            <Text style={[styles.ticketBoldText,{fontFamily:'sky-text-bold'}]}>{data.ticketNumber}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    makeCall () {
        this.track('Call Us');
        if ( this.props.config.phoneNo ) {
            Linking.canOpenURL('tel:' + this.props.config.phoneNo)
            .then(supported => { 
                if (!supported) {
                    console.log('not supported');
                }
                else {
                    return Linking.openURL('tel:' + this.props.config.phoneNo);
                }
            })
            .catch(err => {
                console.log('Error in calling ', err);
            });
        }
    }

    sendEmail () {
        this.track('Write to Us');
        if ( this.props.config.emailId ) {
            Linking.canOpenURL('mailto:' + this.props.config.emailId)
            .then(supported => { 
                if (!supported) {
                    console.log('not supported');
                }
                else {
                    return Linking.openURL('mailto:' + this.props.config.emailId);
                }
            })
            .catch(err => {
                console.log('Error in mail', err);
            });
        }
    }

    selectedItem = (index) => {
        if (index == RequestHistoryRowIndex) {
            this.track('Service Request History');
            this.props.navigation.navigate('ServiceRequestHistoryScreen');
        } 
        else if (index == DoYourselfRowIndex) {
            this.track('Do it yourself')
        }
        else if (index == CreateRequestRowIndex) {
            this.track('Create a Request')
            this.props.navigation.navigate('CreateRequestOptionsScreen')
        }
        else {}
    }

    checkForAnyOpenTicket = () => {
        if (Object.keys(this.props.apiResponseData).length > 0) {                        
            return true
        }

        return false
    }

    render() {
        const openTicket = this.checkForAnyOpenTicket() === true ? this.ticket() : null
        return (
            <View style={{flex: 1, position: 'relative'}}>
                <AlertBox/>
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
                    <HeaderTransparent title = "Support" />
                        {openTicket}                        
                        <Card style={styles.flatlistWrapper}>
                            <FlatList 
                                showsVerticalScrollIndicator = {false}
                                data={List}
                                ItemSeparatorComponent = { () => <Divider color={config.UI.dividerGrey} />}
                                renderItem={({item,index}) => {
                                    return (                                        
                                        <TouchableOpacity key={index} onPress={()=>this.selectedItem(index)} style={styles.ItemWrapper}>
                                            <Image source={item.icon} style={{marginRight:15}}/>
                                            <View style={{flex:1}}>
                                                <Text style={[styles.ticketBoldText,{color:'#3782be'}]}>{item.title}</Text>
                                                <Text style={[styles.ticketLightText,{color:'#8b8b8b'}]}>{item.desc}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            ></FlatList>
                        </Card>
                        <Card style={{marginVertical: 10,padding:0}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={styles.contactImageWrapper}>
                                    <Image source={require('./../assets/img/icContact/icContact.png')}/>
                                    <Text style={styles.ticketDateText}>Contact Us</Text>
                                </View>
                                <View style={styles.contactItemWrapper}>
                                    <TouchableOpacity style={{paddingVertical:15,justifyContent:'center'}} onPress={()=> this.makeCall()}>
                                        <Text style={[styles.ticketBoldText,{color:'#3782be'}]}>Call Us</Text>
                                    </TouchableOpacity>
                                    <Divider color={config.UI.dividerGrey} />
                                    <TouchableOpacity style={{paddingVertical:15,justifyContent:'center'}} onPress={()=> this.sendEmail()}>
                                        <Text style={[styles.ticketBoldText,{color:'#3782be'}]}>Write to Us</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>
                    </ScrollView>
                </GenericScreenBackground>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    ticketContainer: {
        position: 'relative',
        marginTop:20,
        height:150,
    },
    ticketWraper: {
        position:'absolute',
        top:10,
        right:0,
        left:0,
    },
    ticketBackground: {
        width:null,
        height:140,
    },
    ticketTextContainer: {
        height:130,
        position:'absolute',
        top:12,
        right:0,
        left:0,
        flexDirection:'row'
    },
    ticketTextWrapper: {
        flex:1,
        flexDirection:'row',
        paddingHorizontal:40,
        paddingVertical:15,
        overflow:'hidden',
    },
    ticketDateWrapper: {
        flexDirection:'row',
        paddingBottom: 7,
        marginBottom:7,
        borderBottomColor:'#00000060',
        borderBottomWidth:1
    },
    ticketDateText: {
        fontSize:12, 
        color: config.UI.ticketTextGrey,
        fontFamily:'sky-text-regular'
    },
    ticketBottomWraper: {
        flex:1,
        flexDirection: 'row',
        alignItems:'center'
    },
    ticketLightText: {
        color: config.UI.ticketTextGrey, 
        marginVertical: 2,
        fontFamily:'sky-text-regular',
        fontSize:15
    },
    ticketBoldText: {
         marginVertical: 2,
         color: config.UI.ticketTextGrey,
         fontFamily:'sky-text-medium',
         fontSize:15
    },
    rotatedText: {
        flex:3,
        transform: [{ rotate: '270deg'}],
        justifyContent:'flex-end',
        marginBottom:5,
        alignItems:'center',
        paddingRight: 11
    },
    flatlistWrapper: {
        marginTop: 10,
        paddingVertical:0,
        paddingHorizontal:15
    },
    ItemWrapper: {
        flexDirection: 'row', 
        alignItems:'center', 
        paddingVertical: 15 
    },
    contactImageWrapper: {
        backgroundColor: config.UI.buttonGrey,
        flex: 2.5,
        padding:20,
        alignItems:'center',
        justifyContent:'space-between'
    },
    contactItemWrapper: {
        paddingHorizontal:10,
        justifyContent:'space-around',
        flexDirection: 'column', 
        flex: 10
    }
})

const mapDispatchToProps = (dispatch) => ({
    getSupportData: () => dispatch(getSupportApi())
});
const mapStateToProps = (state) => ({
    apiResponseData: state.supportAPIData.data,
    config: state.config.data,
    APIFlag: state.supportAPIData.supportAPIFlag
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactScreen);