import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo';
import {Feather} from '@expo/vector-icons';
import { connect } from 'react-redux';

import TopTabBar from './../components/layout/TopTabBar';
import ListCardLoader from './../components/CardLoaders/ListCardLoader'
import AlertBox from './../components/Alert';
import Card from '../components/UI/Card';

import { getCreateRequestList } from './../actions/CreateRequestListAction';
import Localize from '../config/i18n/Localize';
// import TrackMixpanel from '../utils/TrackMixpanel';



let topTabBarMaxHeight = 0.0
var tabCategories = { complaint: '', request: '' }
const allSideGradientPadding = 10
var requestDataArray = []
var complaintsDataArray = []
var dataArray = [];

class CreateRequestOptionsScreen extends Component {

    constructor() {
        super();
        this.state = {
            gradientHeight: 0,
            selectedTabIndex: 0,
            hasData: false
        }
    }

    componentWillMount () {        
        this.props.getCreateRequestList({});        
    }

    backButtonPressed = () => {
        this.props.navigation.goBack()
    }

    renderHeaderView = () => {
        return (
            <View style = {styles.headerView}>
                <TouchableOpacity onPress = {this.backButtonPressed} style = {styles.backButton}>
                    <Feather name='arrow-left' size={25} color='white' />
                </TouchableOpacity>
                <Text style = {styles.headingText}>{Localize.t('CREATE_REQUEST_OPTIONS.manage_services')}</Text>
                {/* <Text style = {styles.headingText}>Manage Services</Text> */}
            </View>
        );
    }

    tabBarItemTapped = index => {
        if(index === 0) {
            dataArray =  requestDataArray;
            // TrackMixpanel.trackWithProperties('ManageServices',{ action: 'Tab Changed', selectedTab: 'Service Request' });
        }
        else {
            dataArray =  complaintsDataArray;
            // TrackMixpanel.trackWithProperties('ManageServices',{ action: 'Tab Changed', selectedTab: 'Complaints' });
        }
        this.setState({selectedTabIndex: index})
    }

    handleRowItemTapped = (key, rowTitle) => {
        // TrackMixpanel.trackWithProperties('ManageServices',{ action: 'Service Selected', selectedService: rowTitle });
        this.props.navigation.navigate({
            routeName: 'CreateRequestOrComplaintScreen',
            params: { category: this.state.selectedTabIndex === 0 ? 'REQ' : 'COMP' ,title: rowTitle, titleKey: key },
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.apiResponseData.length > 1) {            
            let requestData = nextProps.apiResponseData[0]
            let complaintData = nextProps.apiResponseData[1]

            let reqCategoryKey = requestData.categoryKey;
            let reqCategoryValue = requestData.categoryValue;
            let reqTypes = requestData.type;

            let compCategoryKey = nextProps.apiResponseData[1].categoryKey;
            let compCategoryValue = nextProps.apiResponseData[1].categoryValue;
            let compTypes = nextProps.apiResponseData[1].type;

            tabCategories = { complaint: compCategoryValue, request: reqCategoryValue }

            if (complaintsDataArray.length === 0) {
                let allComplaintKeys = Object.keys(compTypes)
                allComplaintKeys.map((val) => {
                    complaintsDataArray.push({title: compTypes[val], key: val})
                });                
            } 
            if (requestDataArray.length === 0) {                                
                let allRequestKeys = Object.keys(reqTypes)
                allRequestKeys.map((val) => {
                    requestDataArray.push({title: reqTypes[val], key: val})
                });                
            }

            dataArray = this.state.selectedTabIndex === 0 ? requestDataArray : complaintsDataArray
            this.setState({hasData: true})
        }        
    }

    render() {
        return (            
            <View style = {{flex: 1}}>  
                <AlertBox/>
                <LinearGradient colors={['#284397', '#A62871']} start={[1, 1]} end={[0, 1]}
                        style={{padding: allSideGradientPadding, paddingBottom: 0}}>
                    {this.renderHeaderView()}
                    <View style= {{height: 20}}/>                    
                    <TopTabBar data={ [ {title: tabCategories.request, handler: (i) => this.tabBarItemTapped(i)}, {title: tabCategories.complaint, handler: (i) => this.tabBarItemTapped(i)}] }/>
                </LinearGradient>

                { this.state.hasData === true &&
                    <View style = {{flex:1}}>
                        <Card style={styles.flatlistWrapper}>
                            <FlatList showsVerticalScrollIndicator = {false} contentContainerStyle = {{flexDirection: 'column'}} numColumns = {1}
                                data = {dataArray}
                                renderItem = { data =>
                                    <View style = {{height: 65.0,}}>
                                        <TouchableOpacity style = {{flex: 1}} onPress = {(key, title) => {this.handleRowItemTapped(data.item.key, data.item.title)}}>
                                            <View style = {{flex:1, flexDirection: 'row', padding: 10, justifyContent: 'space-between'}}>
                                                <Text style = {styles.listItemText}>{data.item.title}</Text>
                                                <Feather style = {{alignSelf: 'center'}} name='chevron-right' size={15} color='#3282be' />
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{backgroundColor: '#e5e5e5', height: 1, position: 'absolute', bottom: 0, left:0, right:0,}} />
                                    </View>
                                }
                            />
                        </Card>
                    </View>                                
                }

                { this.state.hasData === false &&
                    <View style={styles.loaderWrapper}>
                        <ListCardLoader/>
                    </View>                    
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headingText: {
        fontFamily: 'sky-text-regular', 
        fontSize: 21.0, 
        color: 'white',
        paddingLeft: 10
    },
    headerView: {
        backgroundColor: 'transparent',                 
        marginTop: 30.0, 
        flexDirection: 'row',
        alignItems: 'center'
    },
    flatlistWrapper: {
        margin: 10,
        paddingHorizontal:15,                        
        paddingVertical: 0,
        flexShrink: 1
    },
    listItemText: {
        color: '#3282be',
        fontFamily: 'sky-text-medium',
        fontSize: 15.3,        
        paddingHorizontal: 10,
        alignSelf: 'center'
    },
    loaderWrapper: {
        paddingTop: 15.2,
        paddingHorizontal: 18.5,
        flex:1,
    }
});

const mapDispatchToProps = (dispatch) => ({
    getCreateRequestList: () => dispatch(getCreateRequestList())
});
const mapStateToProps = (state) => ({
    apiResponseData: state.createRequestListAPIData.data
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateRequestOptionsScreen);