import React, {Component} from 'react'
import {View, Text, Dimensions, TouchableHighlight, ScrollView,TouchableOpacity, FlatList, StyleSheet} from 'react-native'
import {Feather} from '@expo/vector-icons'
import PriceCard from './../components/UI/PriceCard'
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
// import firebase from 'react-native-firebase';

// import type { Route, NavigationState } from 'react-native-tab-view/types';
import { LinearGradient, Constants } from 'expo';
import config from './../config/config';
import Localize from './../config/i18n/Localize';
import { getAvailablePlans } from './../actions/myPlanAction';
import { connect } from 'react-redux';
import PriceCardLoader from './../components/CardLoaders/PriceCardLoader';
import { addonsValidityFilter, priceFilter } from './../utils/Filters'
import AlertBox from './../components/Alert';

var {width, height} = Dimensions.get('window');
var selectedIndex = 0;
var dataPlanArray = [
    {dataAmount: '5 GB', validity: '30 Days', price: 'Rs. 150'},
    {dataAmount: '10 GB', validity: '30 Days', price: 'Rs. 250'}, 
    {dataAmount: '15 GB', validity: '30 Days', price: 'Rs. 350'}, 
    {dataAmount: '20 GB', validity: '30 Days', price: 'Rs. 450'}, 
    {dataAmount: '30 GB', validity: '30 Days', price: 'Rs. 550'}, 
    {dataAmount: '40 GB', validity: '30 Days', price: 'Rs. 650'}, 
    {dataAmount: '50 GB', validity: '30 Days', price: 'Rs. 750'},
    {dataAmount: '70 GB', validity: '30 Days', price: 'Rs. 900'}, 
    {dataAmount: '100 GB', validity: '30 Days', price: 'Rs. 1000'}
];

const tabBarHeight = 0;
const navBarMaxY = 0;
const cardWidth = 140
const numberOfColumns = Math.floor(width/(cardWidth+20))

// type State = NavigationState<
//   Route<{
//     key: string,
//     title: string,
//   }>
// >;

const initialLayout = {
    // height: 0,
    width: Dimensions.get('window').width,
};
  

class ChooseNewPlanScreen extends Component {

    constructor() {
        super();
        this.state = {
            gradientHeight: 0,
            highlightedIndex: 0,
            index: 0,
            month : [],
            quaterly : [],
            halfYearly : [],
            yearly : [],
            routes: [
              { key: '1', title: 'Monthly' },
            ]
        }
    }

    static title = 'Scrollable top bar';
    static appbarElevation = 0;
  
    _handleIndexChange = index => {
        this.setState({
            index            
        });      
    }

    _renderLabel = ({ route }) => {
        return (
            <Text style={[styles.label, {color: this.state.gradientHeight > 0 ? '#ffeb50' : 'transparent'}]}>{route.title}</Text>
        );
    } 

    _renderHeader = props => (
        <View style = {{backgroundColor: 'transparent'}} onLayout = {this.tabBarDidLayout}>
            <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{backgroundColor: this.state.gradientHeight > 0 ? '#ffeb50' : 'transparent'}}
            style={styles.tabbar}
            tabStyle={styles.tab}
            renderLabel = {this._renderLabel}          
            />
        </View>        
      );

    tabBarDidLayout = (event) => {
        if (this.state.gradientHeight == 0) {
            let {height} = event.nativeEvent.layout
            tabBarHeight = height

            if (navBarMaxY > 0 && tabBarHeight > 0) {
                this.setState({gradientHeight: navBarMaxY + tabBarHeight + 20})   
            }
        } else {
            return
        }
    }

    navBarDidLayout = (event) => {
        if (this.state.gradientHeight == 0) {
            let {y, height} = event.nativeEvent.layout
            navBarMaxY = y + height

            if (navBarMaxY > 0 && tabBarHeight > 0) {
                this.setState({gradientHeight: navBarMaxY + tabBarHeight + 20})   
            }
        } else {
            return
        }
    }

    _renderScene = ({ route }) => {
        switch (route.key) {
            case '1':
            return (
                this.renderItemsCollectionView(this.state.month)
            );
            case '2':
            return (
                this.renderItemsCollectionView(this.state.quaterly)
            );
            case '3':
            return (
                this.renderItemsCollectionView(this.state.halfYearly)
            );
            case '4':
            return (
                this.renderItemsCollectionView(this.state.yearly)
            );
            default:
            return null;
        }
    };

    componentWillMount() {
        // firebase.analytics().setCurrentScreen('ChoosePlan');
        if(!this.props.navigation.state.params){
            console.log("*** get plans")
            this.props.getAvailablePlans();
        }else{
            console.log("** params plan")
            this.setRenderData(this.props.navigation.state.params)
        }
    }

    setRenderData(dataPlanArray){
        if(dataPlanArray && dataPlanArray.length !== 0){
            let month = [];
            let quaterly = [];
            let halfYearly = [];
            let yearly = [];
            let newRoutes = [];
            
            //filter response data.
            dataPlanArray.forEach(element => {
                validityTabFlag = addonsValidityFilter(element.validity);
                    
                switch (validityTabFlag) {
                    case "monthly":     month.push(element);    break;
                    case "quaterly":    quaterly.push(element);     break;
                    case "halfYearly":    halfYearly.push(element);   break;
                    case "yearly":    yearly.push(element);   break;
                    default:
                        break;
                }
            });
            
            //define tabs routing after response
            (month.length)?newRoutes.push({ key: '1', title: 'Monthly' }):null;
            (quaterly.length)?newRoutes.push({ key: '2', title: '3 Months' }):null;
            (halfYearly.length)?newRoutes.push({ key: '3', title: '6 Months' }):null;
            (yearly.length)?newRoutes.push({ key: '4', title: 'Yearly' }):null;

            //set tabs in state from response
            this.setState({
                routes:newRoutes,
                month : month,
                quaterly : quaterly,
                halfYearly : halfYearly,
                yearly : yearly,
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.apiResponseData && nextProps.apiResponseData.plans.length !== 0) {
            this.setRenderData(nextProps.apiResponseData.plans)
        //     let month = [];
        //     let quaterly = [];
        //     let halfYearly = [];
        //     let yearly = [];
        //     let newRoutes = [];
            
        //     //filter response data.
        //     nextProps.apiResponseData.plans.forEach(element => {
        //         validityTabFlag = addonsValidityFilter(element.validity);
                    
        //         switch (validityTabFlag) {
        //             case "monthly":     month.push(element);    break;
        //             case "quaterly":    quaterly.push(element);     break;
        //             case "halfYearly":    halfYearly.push(element);   break;
        //             case "yearly":    yearly.push(element);   break;
        //             default:
        //                 break;
        //         }
        //     });
            
        //     //define tabs routing after response
        //     (month.length)?newRoutes.push({ key: '1', title: 'Monthly' }):null;
        //     (quaterly.length)?newRoutes.push({ key: '2', title: '3 Months' }):null;
        //     (halfYearly.length)?newRoutes.push({ key: '3', title: '6 Months' }):null;
        //     (yearly.length)?newRoutes.push({ key: '4', title: 'Yearly' }):null;

        //     //set tabs in state from response
        //     this.setState({
        //         routes:newRoutes,
        //         month : month,
        //         quaterly : quaterly,
        //         halfYearly : halfYearly,
        //         yearly : yearly,
        //     });
        }
    }

    backButtonPressed = () => {        
        this.props.navigation.goBack()
    }

    renderPlansData = () => {
        return (
            dataPlanArray
        );
    }

    redirectToReviewCurrentPlan = ({ secondLine, validity, price }) => {
        this.props.navigation.navigate('ChangePlanConfirmationScreen', { secondLine, validity, price });
    };

    _handleNavigate = index => {
        selectedIndex = index
        this.setState({ highlightedIndex: index });
    };

    renderItemsCollectionView = (dataPlanArray) => {
        const cardWidth = 140 + 20
        if(dataPlanArray.length > 0 ){
            return (
                <View style = {{flex: 1, marginTop: 15.0, flexDirection: 'row', }}>
                    { this.state.gradientHeight > 0 &&
                        <FlatList showsVerticalScrollIndicator = {false} contentContainerStyle = {{flexDirection: 'column', alignItems: 'center'}} numColumns = {numberOfColumns}
                        data = {dataPlanArray}
                        renderItem = { data =>
                            <View style = {{margin: 10.0 ,width: 140}}>            
                                <PriceCard 
                                    SecondLine = {data.item.data || data.item.secondLine} 
                                    // AliasName = { data.item.planName }
                                    validity= {data.item.validity} 
                                    price = { priceFilter(data.item.price) } 
                                    hasBorder = {true} 
                                    size = {140}
                                    navigationProps={ this.props.navigation }
                                    redirectTo='ChangePlanConfirmationScreen'
                                    productOfferingId = { data.item.productOfferingId }
                                />
                            </View>
                        }
                        />
                    }
                </View>
            );
        }
        return (
            <View style = {{ marginTop: 15.0, flexDirection: 'row',justifyContent:'center' }}>
                        <PriceCardLoader size = {140} hasFirstLine={false} hasBorder={true} />
            </View>
        )
    }

    render() {
        const cardWidth = 140 + 20
        let numberOfColumns = Math.floor(width/cardWidth)

        return (            
            <View style = {{flex: 1}}>
                <AlertBox />
                <LinearGradient colors={['#284397', '#A62871']} start={[1, 1]} end={[0, 1]}
                    style={{height: this.state.gradientHeight}}/>

                <View style = {{backgroundColor: 'transparent', padding: 10, paddingTop: Constants.statusBarHeight, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
                    <View style = {{backgroundColor: 'transparent', marginTop: 10.0, flexDirection: 'row', alignItems: 'center'}} onLayout = {this.navBarDidLayout}>
                        <TouchableOpacity onPress = {this.backButtonPressed} style = {{height: 44.0, width: 44.0, flexDirection: 'row',alignItems: 'center'}}>
                            <Feather name='arrow-left' size={25} color= {this.state.gradientHeight > 0 ? 'white' : 'transparent'} />
                        </TouchableOpacity>
                        <Text style = {{fontFamily: 'sky-text-regular', fontSize: 21.0, color: this.state.gradientHeight > 0 ? 'white' : 'transparent'}}>{ Localize.t('CHOOSE_PLAN.choose_plan')}</Text>
                        {/* <Text style = {{fontFamily: 'sky-text-regular', fontSize: 21.0, color: this.state.gradientHeight > 0 ? 'white' : 'transparent'}}>Choose Plan</Text> */}
                    </View>
                    <TabViewAnimated
                        style={[styles.container, this.props.style]}
                        navigationState={this.state}
                        renderScene={this._renderScene}
                        renderHeader={this._renderHeader}
                        onIndexChange={this._handleIndexChange}
                        initialLayout={initialLayout}                        
                    />            
                </View>                
            </View>            
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      marginTop: 20
    },
    tabbar: {
        backgroundColor: 'transparent',    
    },
    tab: {
        // width: 100,
        // height: 50
    },
    indicator: {
      backgroundColor: '#ffeb50',
    },
    label: {
        margin: 0,
        paddingBottom: 5,
        fontFamily: 'sky-text-regular',
        fontSize: 15.3,
        fontWeight: '400',
    },
  });

const mapDispatchToProps = (dispatch) => ({
    getAvailablePlans: () => dispatch(getAvailablePlans())
});
const mapStateToProps = (state) => ({
    apiResponseData: state.myPlanAPIData.allPlans
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseNewPlanScreen);