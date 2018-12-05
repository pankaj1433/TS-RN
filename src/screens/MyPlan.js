import React, { Component, PropTypes } from 'react'
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity,Image, FlatList, List, Dimensions, RefreshControl} from 'react-native'
import {Feather} from '@expo/vector-icons';
import { connect } from 'react-redux';
// import firebase from 'react-native-firebase'

import GenericScreenBackground from './../components/UI/GenericScreenBackground';
import HeaderTransparent from './../components/layout/HeaderTransparent';
import PriceCardLoader from './../components/CardLoaders/PriceCardLoader';
import ExpandableCard from './../components/UI/ExpandableCard';
import PriceCard from './../components/UI/PriceCard';
import AlertBox from './../components/Alert';
import PlanCardLoader from './../components/CardLoaders/PlanCardLoader';
import MyConsumptionLoader from './../components/CardLoaders/MyConsumptionLoader'

import config from './../config/config';
import Localize from './../config/i18n/Localize';

import { dateFilter, dataFilter, priceFilter } from './../utils/Filters';
// import TrackMixpanel from './../utils/TrackMixpanel';

import { getMyPlanApi } from './../actions/myPlanAction';

var isAddOnsAvailable = true;
var {height, width} = Dimensions.get('window')
var scrollYContentOffset = 0.0
var basePlanViewMaxY = 0.0
var addOnsViewMaxY = 0.0
var scrollViewHeight = 0.0
var updateContentOffset = false
var expandBasePlanButtonTapped = false
var expandAddOnsButtonTapped = false

class MyPlanScreen extends Component {

    constructor() {
        super();
        this.state = {
            showBasePlanExpandedView: false,
            showAddOnsExpandedView: false,
            consumtionDetailsViewmaxX: 0.0,
            scrollViewContentOffset: {x: 0, y: scrollYContentOffset},
            pageRefreshing: false,
        }
    }

    componentDidMount () {
        // firebase.analytics().setCurrentScreen('MyPlan');
        this.props.getMyPlanData();
    }

    componentWillReceiveProps (nextProps) {
        if ( this.props.APIFlag !== nextProps.APIFlag && nextProps.APIFlag === true ) {
            this.setState({ pageRefreshing: false })
        }
    }

    onRefresh = () => {
        // TrackMixpanel.trackWithProperties('PullToRefresh',{refreshedScreen: 'My Plan Screen'});
        this.setState({ pageRefreshing: true }, () => {
            this.props.getMyPlanData({});
        });
    }

    handleBasePlanExpandableButtonTap =() => {
        expandBasePlanButtonTapped = true
        if (this.state.showBasePlanExpandedView == false) {
            this.setState({showBasePlanExpandedView: true});
        }
    }

    handleViewAllBasePlanButtonTapped = () => {
        this.props.navigation.navigate('ChooseBasePlanScreen')                    
    }
    
    handleAddOnsExpandableTap =() => {
        expandAddOnsButtonTapped = true
        if (this.state.showAddOnsExpandedView == false) {
            this.setState({showAddOnsExpandedView: true});
        }
    }    

    handleViewAllAddOnsButtonTapped = () => {
        this.props.navigation.navigate('ChooseAddOnsScreen')        
    }

    hideBasePlansButtonTapped = () => {
        this.setState({showBasePlanExpandedView: false});
    }

    hideAddOnsButtonTapped = () => {
        this.setState({showAddOnsExpandedView: false});
    }

    renderConsumptionInfoView = () => {
        let basePlanText = Localize.t('MY_PLAN.base_plan') ;
        let dataConsumed = '';
        let nextRechargeSchedule = '';
        let addOnPlanDTO = {};
        let nextRechargeDate = ''
        // let planName = '';

        
        if ( Object.keys(this.props.apiResponseData).length > 0) {
            let {basePlanDetails} = this.props.apiResponseData;
            addOnPlanDTO = this.props.apiResponseData.addOnPlanDTO;
            let {
                totalData,
                dataUnit,
                consumedData,
            } = basePlanDetails;
            nextRechargeDate = basePlanDetails.nextRechargeDate;
            // planName = basePlanDetails.planName;

            dataConsumed = dataFilter(consumedData,dataUnit)+ ' ' +Localize.t('MY_PLAN.data_consumed_out_of') +' '+dataFilter(totalData,dataUnit);
            nextRechargeSchedule = Localize.t('MY_PLAN.next_recharge_due')+' '+dateFilter(nextRechargeDate);    
        }
        // else {
        //     // dataConsumed = 'XX GB '+ Localize.t('MY_PLAN.data_consumed_out_of') +' XX GB';
        //     // nextRechargeSchedule = Localize.t('MY_PLAN.next_recharge_due')+' xx Jxx ,2XXX';

        // }
        
        return (
            <View style = {{paddingTop: 15.0,flexDirection: 'column'}}>
                <Text style = {styles.consumptionViewHeading}>{ Localize.t('MY_PLAN.consumption_heading') }</Text>
                <View style = {[styles.consumptionDetailsView, styles.shadowStyle]}>                                        
                    <ScrollView horizontal = {true}>
                        <View style = {[{maxWidth:(width-20)/2,flex:1,padding: 10, flexDirection: 'column'}]} onLayout = {this.consumptionViewDidLayout}>
                        {
                            Object.keys(this.props.apiResponseData).length > 0 ? 
                            <View>
                                <View style = {[styles.priceCardHeadingParent]}><Text style = {styles.consumptionViewLine1}>{basePlanText}</Text></View>
                                {/* <View style = {styles.priceCardHeadingParent}><Text style = {styles.consumptionViewLine2}>{planName}</Text></View> */}
                                <View style = {styles.priceCardHeadingParent}><Text style = {styles.consumptionViewLine2}>{dataConsumed}</Text></View>
                                {
                                    dateFilter(nextRechargeDate) ?
                                    <View style = {styles.priceCardHeadingParent}><Text style = {styles.consumptionViewLine3}>{nextRechargeSchedule}</Text></View>:null
                                }

                            </View>:
                            <MyConsumptionLoader/>
                        }
                        </View>
                        { 
                            ((Object.keys(this.props.apiResponseData).length > 0 ))?
                             addOnPlanDTO.currentAddOns.map((item,index)=><View key={index}>{this.renderAddOnsView(item)}</View>):
                            null
                        }
                    </ScrollView>
                </View>                    
            </View>
        );
    }

    consumptionViewDidLayout = (event) => {
        let {x, width} = event.nativeEvent.layout
        this.setState({consumtionDetailsViewmaxX : x + width})
    }

    renderAddOnsView = (currentAddOns) => {
        let {
            totalData,
            dataUnit,
            consumedData,
            validityUnit,
            validity,
            // addOnName
        } = currentAddOns;
        let addOnsText = Localize.t('MY_PLAN.addons');
        let addOnsLeftData = totalData;
        let addOnsValidityText = Localize.t('MY_PLAN.data_validity');
        let addOnsRemainingDays = validity+' '+validityUnit+' '+Localize.t('MY_PLAN."remaining"');

        if (isAddOnsAvailable && this.state.consumtionDetailsViewmaxX > 0) {
            return (                
                <View style = {{ flex: 1,flexDirection: 'row'}}>
                    <View style = {{paddingVertical: 10,width: 15, alignItems: 'center'}}>
                        <View style = {styles.separatorLine}></View>                        
                        <Feather style = {{marginTop: 4.0, marginBottom: 4.0}} name='plus' size={15} color='#fff' />
                        <View style = {styles.separatorLine}></View>                        
                    </View>                    
                    <View style = {{margin: 10, flexShrink: 1,flexDirection: 'column'}}>
                        <Text style = {styles.addOnsTextLine1}>{addOnsText}</Text>
                        {/* <Text style = {styles.addOnsTextLine2}>{addOnName}</Text> */}
                        <Text style = {styles.addOnsTextLine2}>{addOnsLeftData}</Text>
                        <Text style = {styles.addOnsTextLine3}>{addOnsValidityText}</Text>
                        <Text style = {styles.addOnsTextLine4}>{addOnsRemainingDays}</Text>
                    </View>
                </View>
            );
        } else {
            return <Text/>
        }
    }

    basePlanViewOnLayoutHandler = (event) => {
        let {y, height} = event.nativeEvent.layout
        basePlanViewMaxY = y + height

        if (expandBasePlanButtonTapped === true && basePlanViewMaxY > (scrollYContentOffset + scrollViewHeight)) {
            expandBasePlanButtonTapped = false            
            updateContentOffset = true
            let difference = basePlanViewMaxY - (scrollYContentOffset + scrollViewHeight)
            scrollYContentOffset = scrollYContentOffset + difference

            this.setState({scrollViewContentOffset: {x: 0, y: scrollYContentOffset}})
                        
        }
    }

    basePlanTile = (icon,title,desc) => {
        return(
            <View style = {{flex: 0.3}}>
                <Image resizeMode = 'contain' source = {icon} style = {styles.basePlanTileImage}/>
                <Text style = {styles.basePlanTileText1}>{title}</Text>
                <Text style = {styles.basePlanTileText2}>{desc}</Text>
            </View>
        )
    }

    renderBasePlanView = (basePlanDetails) => {

        // let basePlanViewHeight = this.state.showBasePlanExpandedView ? 380.0 : 188.0
        let basePlanViewHeight = this.state.showBasePlanExpandedView ? 400.0 : 188.0

        let myBasePlanText = <Text style = {styles.myBasePlanText}>{Localize.t('MY_PLAN.basePlan_Heading_text')}</Text>
        let subscriptionActivationText = <Text style = {styles.subscriptionActivationText}>{Localize.t('MY_PLAN.subscription_did_activate')}</Text>
        let changePlanButtonText = <Text style={styles.viewAllButtonText}>{Localize.t('MY_PLAN.change_plan')}</Text>
        let viewAllButtonText = <Text style={styles.viewAllButtonText}>{Localize.t('MY_PLAN.view_all')} ></Text>
        let changePlanHeadingText = <Text style = {styles.myBasePlanText}>{Localize.t('MY_PLAN.change_plan')}</Text>

        let subscriptionActivationDate = null;
        let basePlanBody = null;
        let availableAddOnsBody = null;
        if (Object.keys(this.props.apiResponseData).length > 0) {
            //Content in variables that will render after API response
            let {totalData,
                dataUnit,
                subscriptionActivatedDate,
                validity, 
                validityUnit,
                price,
                availablePlans} = this.props.apiResponseData.basePlanDetails;

            subscriptionActivationDate = <Text style = {styles.subscriptionActivationDate}>{dateFilter(subscriptionActivatedDate)}</Text>
            basePlanBody =   <View style = {{height: 70.0 , marginTop: 5.0, flexDirection: 'row', justifyContent: 'space-between'}}>
                            {this.basePlanTile(require('./../assets/img/DataIcon/icData.png'),Localize.t('MY_PLAN.data'),dataFilter(totalData,dataUnit)+' /'+Localize.t('MY_PLAN.month'))}
                            {this.basePlanTile(require('./../assets/img/ValidityIcon/validity.png'), Localize.t('COMMON.validity') ,validity+' '+validityUnit)}
                            {this.basePlanTile(require('./../assets/img/PriceIcon/price.png'),Localize.t('MY_PLAN.package_price'),'₹ '+price)}
                        </View>
            
            availableAddOnsBody = <FlatList showsHorizontalScrollIndicator = {false} style = {{marginTop: 15.0}} horizontal = {true} ItemSeparatorComponent = {
                () => <View style = {{width: 20}} />
                }
                data = {availablePlans}
                renderItem = { (dataItem) => 
                    <View style = {{flex: 1}} key={ dataItem.index }>
                        <PriceCard 
                                FirstLine = {Localize.t('MY_PLAN.data_per_month')} 
                                // AliasName = {dataItem.item.planName}
                                SecondLine = {dataItem.item.data} 
                                validity= {dataItem.item.validity} 
                                price = { priceFilter(dataItem.item.price) } 
                                hasBorder = {true} 
                                size = {140} 
                                firstLineFontSize = {12}
                                navigationProps={ this.props.navigation }
                                redirectTo='ChangePlanConfirmationScreen'
                                productOfferingId = { dataItem.item.productOfferingId }
                            />
                    </View>
                }
            />
            
            return (
                <View style = {[styles.shadowStyle, {backgroundColor: '#fff', marginTop: 12, borderRadius: 3.3, height:basePlanViewHeight}]} onLayout = {this.basePlanViewOnLayoutHandler}>
                    <View style = {{padding: 12}}>
                        {myBasePlanText}
                        <Text>{subscriptionActivationText} {subscriptionActivationDate}</Text>
                        {basePlanBody}
                    </View>
    
                    { this.state.showBasePlanExpandedView &&                    
                        <View style = {styles.basePlanExpandedView}>
                            <View style = {styles.basePlanListView}>
                                <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    {changePlanHeadingText}                                
                                    <TouchableOpacity onPress = {this.hideBasePlansButtonTapped} style = {styles.basePlanCloseButton}> 
                                        <Feather name='x' size={18} color='#5087c7' />
                                    </TouchableOpacity>
                                </View>
                                {availableAddOnsBody}
                            </View>                            
                            <View style={{backgroundColor: config.UI.buttonGrey, height: 44.0, flexDirection: 'row'}}>
                                <TouchableOpacity style={styles.viewAllPlansButton} onPress={()=>this.handleViewAllBasePlanButtonTapped()}>
                                {viewAllButtonText}
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
    
                    { !this.state.showBasePlanExpandedView &&
                        <View style={styles.expandBasePlanView}>
                            <TouchableOpacity style={styles.expandBasePlanViewButton} onPress={()=>this.handleBasePlanExpandableButtonTap()}>
                            {changePlanButtonText}
                            <Image style={{marginLeft:9.7}} source={require('./../assets/img/icArrowDown/icArrowDown.png')}/>
                            </TouchableOpacity>
                        </View> 
                    }
    
                                        
                </View>
            );
        }
        else {
            // subscriptionActivationDate = <Text style = {styles.subscriptionActivationDate}>xx Jxx 2XXX</Text>
            
            availableAddOnsBody = <PriceCardLoader hasBorder = {true} size = {140}/>

            return (
                <View style = {[styles.shadowStyle, {backgroundColor: '#fff', marginTop: 12, borderRadius: 3.3, height:basePlanViewHeight}]} onLayout = {this.basePlanViewOnLayoutHandler}>
                    <View style = {{padding: 12}}>
                        {myBasePlanText}
                        <PlanCardLoader/>
                    </View>

                    { this.state.showBasePlanExpandedView &&                    
                        <View style = {styles.basePlanExpandedView}>
                            <View style = {styles.basePlanListView}>
                                <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    {changePlanHeadingText}                                
                                    <TouchableOpacity onPress = {this.hideBasePlansButtonTapped} style = {styles.basePlanCloseButton}> 
                                        <Feather name='x' size={18} color='#5087c7' />
                                    </TouchableOpacity>
                                </View>
                                {availableAddOnsBody}
                            </View>                            
                            <View style={{backgroundColor: config.UI.buttonGrey, height: 44.0, flexDirection: 'row'}}>
                                <TouchableOpacity style={styles.viewAllPlansButton} onPress={()=>this.handleViewAllBasePlanButtonTapped()}>
                                {viewAllButtonText}
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    
                    { !this.state.showBasePlanExpandedView &&
                        <View style={styles.expandBasePlanView}>
                            <TouchableOpacity style={styles.expandBasePlanViewButton} onPress={()=>this.handleBasePlanExpandableButtonTap()}>
                            {changePlanButtonText}
                            <Image style={{marginLeft:9.7}} source={require('./../assets/img/icArrowDown/icArrowDown.png')}/>
                            </TouchableOpacity>
                        </View> 
                    }
                </View>
            )
        }
    }

    addOnsViewOnLayoutHandler = (event) => {
        let {y, height} = event.nativeEvent.layout
        addOnsViewMaxY = y + height
        
        if (expandAddOnsButtonTapped === true && addOnsViewMaxY > (scrollYContentOffset + scrollViewHeight)) {
            expandAddOnsButtonTapped = false            
            updateContentOffset = true
            let difference = addOnsViewMaxY - (scrollYContentOffset + scrollViewHeight)
            
            scrollYContentOffset = scrollYContentOffset + difference

            this.setState({scrollViewContentOffset: {x: 0, y: scrollYContentOffset}})
        }
    }

    renderMyAddOnsView = () => {
        
        const myAddOnsText = <Text style = {styles.myBasePlanText}>{Localize.t('MY_PLAN.my_addOns')}</Text>
        const moreAddonsButtonText = <Text style={styles.viewAllButtonText}>{Localize.t('MY_PLAN.more_addOns')}</Text>
        const viewAllButtonText = <Text style={styles.viewAllButtonText}>{Localize.t('MY_PLAN.view_all')} ></Text>
        const changePlanHeadingText = <Text style = {styles.myBasePlanText}>{Localize.t('MY_PLAN.change_plan')}</Text>
        const moreAddOnsHeadingText = <Text style = {styles.myBasePlanText}>{Localize.t('MY_PLAN.more_addOns')}</Text>

        const addOnsViewHeight = this.state.showAddOnsExpandedView ? 370.0 : 210.0
        const addOnsViewFlexValue = this.state.showAddOnsExpandedView ? 0.4108 : 0.7429

        let currentAddOnsBody = null;
        let availableAddOnsBody = null;

        if (Object.keys(this.props.apiResponseData).length > 0) {
            let {currentAddOns, availableAddOns} = this.props.apiResponseData.addOnPlanDTO;
            if(currentAddOns.length > 0) {
                currentAddOnsBody = <FlatList showsHorizontalScrollIndicator = {false} horizontal = {true} ItemSeparatorComponent = { 
                    () => <View style = {{width: 20}} />
                } 
                data = {currentAddOns}
                renderItem = {
                    (dataItem) => 
                    <View key={ dataItem.index } style = {{flex: 1}}>
                        <PriceCard 
                            FirstLine = '' 
                            // AliasName = { dataItem.item.addOnName }
                            SecondLine = { dataItem.item.totalData } 
                            validity= {dataItem.item.validity+' '+dataItem.item.validityUnit} 
                            price = { priceFilter(dataItem.item.price) }
                            hasBorder = {true} 
                            size = {117}
                        />
                    </View>
                }
                />
            }
            else {
                currentAddOnsBody = <View style={[{marginTop:42,flex:1,justifyContent:'center',alignItems:'center'}]}><Text>No active addons</Text></View>
            }
            availableAddOnsBody = <FlatList showsHorizontalScrollIndicator = {false} style = {{marginTop: 15.0}} horizontal = {true} ItemSeparatorComponent = {
                                    () => <View style = {{width: 20}} />
                                    }
                                    data = {availableAddOns}
                                    renderItem = { (dataItem) => 
                                        <View style = {{flex: 1}} key={ dataItem.index }>
                                            <PriceCard 
                                                FirstLine = '' 
                                                // AliasName = {dataItem.item.addOnName}
                                                SecondLine = {dataItem.item.totalData} 
                                                validity= {dataItem.item.validity+' '+dataItem.item.validityUnit} 
                                                price = { priceFilter(dataItem.item.price) } 
                                                hasBorder = {true} size = {117} 
                                                navigationProps={ this.props.navigation }
                                                redirectTo='ReviewAddOnsScreen'
                                                productOfferingId = { dataItem.item.productOfferingId }
                                            />
                                        </View>
                                    }
                                />
        }
        else {
            currentAddOnsBody = <PriceCardLoader hasFirstLine={false} hasBorder = {true} size = {117}/>
            availableAddOnsBody = <PriceCardLoader hasFirstLine={false} hasBorder = {true} size = {117}/>
        }

        return (
            <View style = {[styles.shadowStyle, {backgroundColor: 'white', marginTop: 12, borderRadius: 3.3, height: addOnsViewHeight, marginBottom: 5}]} onLayout = {this.addOnsViewOnLayoutHandler}>
                <View style = {{flex: addOnsViewFlexValue, paddingHorizontal: 12.0, paddingTop: 12.0}}>
                    {myAddOnsText}                        
                    <View style = {styles.addOnListView}>
                        {currentAddOnsBody}
                    </View>
                </View>

                { this.state.showAddOnsExpandedView &&
                    <View style = {{backgroundColor: config.UI.buttonGrey, flex: 1-addOnsViewFlexValue}}>
                        <View style = {{paddingTop: 15.0, paddingLeft: 12.0, paddingBottom: 12.0, flex: 1, paddingRight: 10 }}>
                            <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
                                {moreAddOnsHeadingText}                                
                                <TouchableOpacity onPress = {this.hideAddOnsButtonTapped} style = {styles.addOnsCloseButton}> 
                                    <Feather name='x' size={18} color='#5087c7' />
                                </TouchableOpacity>
                            </View>

                            {availableAddOnsBody}                    
                        </View>         
                        <View style={styles.expandBasePlanView}>
                            <TouchableOpacity style={styles.expandBasePlanViewButton} onPress={()=>this.handleViewAllAddOnsButtonTapped()}>
                                {viewAllButtonText}
                            </TouchableOpacity>
                        </View>                                
                    </View>
                }

                { !this.state.showAddOnsExpandedView &&
                    <View style={styles.expandBasePlanView}>
                        <TouchableOpacity style={styles.expandBasePlanViewButton} onPress={()=>this.handleAddOnsExpandableTap()}>
                            {moreAddonsButtonText}
                        </TouchableOpacity>
                    </View>                
                }
                
            </View> 
        );
    }

    contentSizeChangeHandler = (height) => {
    }

    onScrollHandler = (event) => {
        scrollYContentOffset = event.nativeEvent.contentOffset.y   
    }

    scrollViewViewOnLayoutHandler = (event) => {
        let {height} = event.nativeEvent.layout
        scrollViewHeight = height        
    }

    render() {        
        let newContentOffset = updateContentOffset ? this.state.scrollViewContentOffset : null
        updateContentOffset = false
            return (         
                <View style={{flex: 1, position: 'relative'}}>   
                <AlertBox />
                    <GenericScreenBackground gradientViewFlex = {0.39}>
                        <ScrollView contentOffset = {newContentOffset} scrollEventThrottle={16} 
                            refreshControl = { 
                                <RefreshControl 
                                    refreshing={this.state.pageRefreshing }
                                    onRefresh={ () => { this.onRefresh() } }
                                    tintColor = "#fff"
                                /> }
                            onScroll = {this.onScrollHandler} onContentSizeChange = {(contentWidth, contentHeight) => {this.contentSizeChangeHandler(contentHeight)}} style = {{flexGrow: 1}} 
                            showsVerticalScrollIndicator = {false} contentContainerStyle = {styles.contentContainer} onLayout = {this.scrollViewViewOnLayoutHandler}>
                            <HeaderTransparent title = { Localize.t('MY_PLAN.heading_text') } />
                            {this.renderBasePlanView()}
                            {this.renderMyAddOnsView()}
                            {this.renderConsumptionInfoView()}
                        </ScrollView>
                    </GenericScreenBackground>
                </View>
            );
    }

}

const styles = StyleSheet.create({
    separatorLine: {
        backgroundColor: '#afb1db70',
        width: 1,
        flex: 1
    },
    consumptionViewHeading: {
        color: config.UI.ticketTextGrey, 
        fontFamily: 'sky-text-medium', 
        fontSize: 16
    },
    consumptionViewLine1: {
        fontFamily: 'sky-text-regular', 
        fontSize: 13.3, 
        color: 'white', 
        marginBottom: 3
    },
    consumptionViewLine2: {
        fontFamily: 'sky-text-regular', 
        fontSize: 17.3, 
        color: '#f2eeff', 
        marginBottom: 3
    },
    consumptionViewLine3: {
        fontFamily: 'sky-text-regular', 
        fontSize: 14, 
        color: '#fcc6de', 
        marginBottom: 3
    },
    priceCardHeadingParent: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    contentContainer: {    
        
    },
    headerContainer: {        
        height: 44.0,
        flexDirection: 'column',
        justifyContent: 'center' 
    },
    viewHeading: {
        paddingLeft: 10.0,
        textAlign: 'left',
        color: 'white',
        fontFamily: 'sky-text-regular',
        fontSize: 20.7
    },
    consumptionDetailsView: {
        backgroundColor: config.UI.primaryColor,
        flex: 1,
        marginVertical: 8,
        borderRadius: 3.3,
        flexDirection: 'row'
    },
    planDetailsView: {   
        marginTop: 8,
        borderRadius: 3.3,
        height: 190.0,
        flexDirection: 'row'
    },
    shadowStyle: {        
        shadowOffset: {  
            width: 0,  
            height: 0.5,  
        }, 
        shadowColor: 'black',
        shadowOpacity: 0.3, 
        elevation: 2
    },
    addOnsTextLine1: {
        fontFamily: 'sky-text-regular', 
        fontSize: 13.3, 
        color: 'white', 
        marginBottom: 3
    },
    addOnsTextLine2: {
        fontFamily: 'sky-text-regular', 
        fontSize: 17.3, 
        color: '#f2eeff', 
        marginBottom: 3
    },
    addOnsTextLine3: {
        fontFamily: 'sky-text-regular', 
        fontSize: 14, 
        color: '#fcc6de', 
        marginBottom: 3
    },
    addOnsTextLine4: {
        fontFamily: 'sky-text-regular',
        fontSize: 14, 
        color: '#fcc6de'
    },
    basePlanTileText1: {
        fontFamily: 'sky-text-regular',
        fontSize: 13.3,
        color: '#42424270',
        marginTop: 5.0
    },
    basePlanTileText2: {
        fontFamily: 'sky-text-medium', 
        fontSize: 15.3,
        color: config.UI.ticketTextGrey,
        marginTop: 5.0
    },
    myBasePlanText: {
        fontFamily: 'sky-text-medium',
        fontSize: 15.3, 
        color: config.UI.ticketTextGrey
    },
    subscriptionActivationText: {
        fontFamily: 'sky-text-regular',
        fontSize: 12, 
        color: '#979797'
    },
    viewAllButtonText: {
        color: config.UI.textBlue, 
        fontFamily: 'sky-text-medium',
        fontSize: 14
    },
    subscriptionActivationDate: {
        fontFamily: 'sky-text-regular', 
        fontSize: 12, 
        color: '#424242'
    },
    basePlanTileImage: {
        width: 23.0, 
        height: 18.0, 
        marginTop: 10.0
    },
    basePlanExpandedView: {
        paddingTop:10, 
        backgroundColor: config.UI.buttonGrey, 
        flex: 1,
        marginTop: 10,
        paddingRight: 10
    },
    basePlanListView: {
        marginTop: 3.0, 
        marginLeft: 12.0, 
        marginBottom: 12.0, 
        flex: 1
    },
    basePlanCloseButton: {
        justifyContent: 'center', 
        width: 30.0, 
        height: 20.0
    },
    viewAllPlansButton: {
        flexGrow: 1, 
        flexBasis: 50, 
        borderBottomLeftRadius: 3.3, 
        borderBottomRightRadius: 3.3, 
        overflow: 'hidden', 
        backgroundColor: config.UI.buttonGrey, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    expandBasePlanViewButton: {
        flexDirection: 'row',
        flexGrow: 1, 
        flexBasis: 50, 
        backgroundColor: config.UI.buttonGrey, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    expandBasePlanView: {
        backgroundColor: config.UI.buttonGrey, 
        borderBottomLeftRadius: 3.3, 
        borderBottomRightRadius: 3.3, 
        height: 44.0, 
        flexDirection: 'row', 
        marginTop: 5.0, 
        position: 'absolute', 
        bottom: 0, 
        left:0, 
        right:0, 
        overflow: 'hidden'
    },
    addOnListView: {
        marginTop: 10.0, 
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    addOnsCloseButton: {
        justifyContent: 'center',
        width: 30.0, 
        height: 20.0
    }
});

const mapDispatchToProps = (dispatch) => ({
    getMyPlanData: () => dispatch(getMyPlanApi())
});
const mapStateToProps = (state) => ({
    apiResponseData: state.myPlanAPIData.data,
    APIFlag: state.myPlanAPIData.myPlanAPIFlag
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPlanScreen);