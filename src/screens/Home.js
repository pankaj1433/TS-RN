import React, { Component } from 'react'
import { View, Text, Animated, ScrollView, Dimensions, RefreshControl, Platform, StyleSheet,Easing ,TouchableHighlight} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ImageSlider from './../components/ImageSlider';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import SortableList from './../components/layout/sortableCard/SortableList';
// import firebase from 'react-native-firebase'

import Card from './../components/UI/Card';
import Divider from './../components/UI/Divider';
import HomeHeader from '../components/layout/HomeHeader';
import OTTApps from './../components/OTTApps';
import HomeDataUseCard from './../components/layout/HomeDataUseCard';
import config from './../config/config';
import RecentTransactionsCard from './../components/recentTransactionsCard'
import GetAddonsCard from './../components/getAddonsCard';
import SliderImageLoader from './../components/CardLoaders/SliderImageLoader';
import Row from './../components/cardSwapView';

import { postHomeApi, postCardOrder, getScreenParamStatus } from './../actions/homeAction';
import { navigationConfig, apiNavigationHandler } from './../utils/BannerNavigation';

// import TrackMixpanel from './../utils/TrackMixpanel';

class HomeScreen extends Component {

    constructor (props) {
        super(props);        
        this.state = {
            showRecharge: true,
            more:true,
            pageRefreshing: false,
            order: [0,1,2] ,// set default order for cards,
            newOrder:[] // to maintain the order on refresh
        };
        this.cards =[
            {
                key: 'HomeDataUseCard',
                order:0,
                component: <View style={{marginVertical: 5,flex:1}}><HomeDataUseCard recharge={this.state.showRecharge} navigation={this.props.navigation}/></View>
            },
            {
                key: 'OTTApps',
                order:1,
                component: (Platform.OS !== 'ios')? <View style={{margin: 5, marginHorizontal:10, flex: 1 }}><OTTApps /></View>: null
            },
            {
                key: 'RecentTransactionCard',
                order:2,
                component: <View style-={{margin: 5, marginHorizontal:10, flex: 1}} onLayout = {this.consumptionViewDidLayout}><RecentTransactionsCard navigation={this.props.navigation} /></View>
            }
        ];

    }
        
    onImageClick = (index) => {
        //banner click event
        // firebase.analytics().logEvent('BannerClick');

        if (this.props.sliderData.length > 0) {
            // TrackMixpanel.track('HomeClickP', { action: 'Carousel Banner Clicked', index });
            if(this.props.sliderData[index]['bannerLink']){
                const screenName = this.props.sliderData[index]['bannerLink'] ;
                const screenParams=  this.props.sliderData[index]['bannerParams'];
                const screenConfig =  navigationConfig(screenName,screenParams);
                
                if(screenConfig){
                    if(screenConfig.screen){
                        this.props.getScreenParamStatus({
                            screen: screenConfig.screen,
                            params: screenParams
                        })
                    }else if(screenConfig.isFirstScreen && screenConfig.routeName){
                        const { tab, params, routeName } = screenConfig;
                        const nav = NavigationActions.navigate({
                        routeName: tab,
                        params,
                        action: NavigationActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName, params })],
                          })
                        });
                        this.props.navigation.dispatch(nav);
                    }else if(screenConfig.routeName){
                        const { routeName,params } = screenConfig;
                        this.props.navigation.navigate({routeName,params});
                    }
                }

            }
        }
    };

    
    _renderImageSlider() {
        if (this.props.sliderData && this.props.sliderData.length > 0) {
            // const sliderData = [{
            //     "url": "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
            //     // "url":"http://res.cloudinary.com/mapptsbbdev/image/upload/v1522416246/uat/OTT/ott_Hungama%20Play.jpg2018-03-30T13:24:05.058.jpg",
            //     "appStoreId": "id959839618",
            //     "playStoreId": "com.hungama.movies",
            //     "deepLinkUrl": null,
            //     "displayText": "Hungama Play",
            //     "order": 2,
            //     "video":true
            //     // "video":false
            // },
            // {
            //     "url": "https://res.cloudinary.com/cloudinaryaccount/video/upload/v1534480704/tsb/VIDEO_BANNERS/small.mp4",
            //     // "url":"http://res.cloudinary.com/mapptsbbdev/image/upload/v1522417123/uat/OTT/ott_Atl.jpg2018-03-30T13:38:42.264.jpg",
            //     "appStoreId": "id1080276092",
            //     "playStoreId": "com.balaji.alt",
            //     "deepLinkUrl": null,
            //     "displayText": "ALTBalaji",
            //     "order": 3,
            //     "video":true
            //     // "video":false
            // },
            // {
            //     // "url": "https://res.cloudinary.com/cloudinaryaccount/video/upload/v1534480704/tsb/VIDEO_BANNERS/small.mp4",
            //     "url":"http://res.cloudinary.com/mapptsbbdev/image/upload/v1522416664/uat/OTT/ott_eros%20now.jpg2018-03-30T13:31:01.596.jpg",
            //     "appStoreId": "id551666302",
            //     "playStoreId": "com.erosnow",
            //     "deepLinkUrl": null,
            //     "displayText": "Eros Now",
            //     "order": 4,
            //     // "video":true
            //     "video":false
            // }]
            return (
                <View style={{flex: 1}}>
                    <ImageSlider
                        onClick={ ({ index }) => { this.onImageClick(index) } }
                        urlLink={ this.props.sliderData.map(val => ({bannerLink:val.url,isVideo:val.video}))}
                        timer = { this.props.config.bannerSwitchingInterval }
                        navigation = { this.props.navigation }
                    />
                </View>
            )
        }
        else {
            return (
                <View style={{flex:1}}>
                    <SliderImageLoader />
                </View>
                )
        }
    }
        
    componentWillMount () {
        //firebase custom event
        // firebase.analytics().setCurrentScreen('home');

        this.props.postHomeApi({});
        const {routeName} = this.props.navigation.state || 'HomeScreen';
        const screenCards =this.props.screenCards;
        if(screenCards.length){
            const screen = screenCards.find(card => card.screen == routeName)
            let cards = screen ? screen.cards : [];
            let finalOrder=[]
            if(cards){
                cards.map(card => {
                    let cardComp = this.cards.find(data => data.key == card.name)
                    if(cardComp){
                        finalOrder.push(cardComp.order)
                    }
                })
            }
            if(finalOrder.length){
                this.setState({
                    order:finalOrder
                })
            }
        }
    }
        
    _onRefresh(){
        // TrackMixpanel.trackWithProperties('PullToRefresh',{refreshedScreen: 'Home Screen'});
        if(this.state.newOrder.length){
            this.setState({ pageRefreshing: true ,order:this.state.newOrder}, () => {
                this.props.postHomeApi({});
            });
        }else{
            this.setState({ pageRefreshing:true,newOrder:this.state.order},()=>{
                this.props.postHomeApi({});
            })
        }
        
    };
        
    componentWillReceiveProps (nextProps) {
        if ( this.props.APIFlag !== nextProps.APIFlag && nextProps.APIFlag === true ) {
            this.setState({ pageRefreshing: false })
        }
        
        
        if(nextProps.bannerNavigations && nextProps.bannerNavigations.screen){
            
            const screenConfig = apiNavigationHandler(nextProps.bannerNavigations);
            if(screenConfig){
                if (screenConfig.isFirstScreen && screenConfig.routeName) {
                    const { tab, params, routeName } = screenConfig;
                    const nav = NavigationActions.navigate({
                        routeName: tab,
                        params,
                        action: NavigationActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName, params })],
                          })
                    });
                    this.props.navigation.dispatch(nav);
                }
                else if(screenConfig.routeName){
                    const { routeName , params} = screenConfig;
                    this.props.navigation.navigate({routeName,params});
                }
            }
        }
    };

    onRowOrderChange (itemOrder) {
        let screenCards = this.props.screenCards;
        const {routeName} = this.props.navigation.state || 'HomeScreen';
        if(screenCards.length){
            const screen = screenCards.find(card => card.screen == routeName)
            let cards = screen ? screen.cards : [];
            itemOrder.map(order => {
                let localCard = this.cards.find(card => card.order == order)
                let apiCard = cards.find(card => card.name == localCard.key)
                apiCard.precedence = itemOrder.indexOf(order)
            })
            this.setState({
                newOrder:itemOrder,
            },()=>{
                this.props.postCardOrder(screenCards);
            })
        }
    }

    shouldComponentUpdate(nextProps,nextState){
        if( nextState.newOrder.length )
        { 
            return false 
        }
        return true;
    }

    _renderRow = ({data, active}) => {
        return <Row data={data} active={active} />
    }
     
  render() {
    let cards =[
        {
            key: 'HomeDataUseCard',
            order:0,
            component: <View style={{marginVertical: 8,flex:1}} class=""><HomeDataUseCard recharge={this.state.showRecharge} navigation={this.props.navigation} hideMeter={this.state.pageRefreshing}/></View>
        },
        {
            key: 'OTTApps',
            order:1,
            component: (Platform.OS !== 'ios')? <View style={{margin: 5, marginHorizontal:10, flex: 1 }}><OTTApps /></View>: null
        },
        {
            key: 'RecentTransactionCard',
            order:2,
            component: <View style={{margin: 5, marginHorizontal:10, flex: 1 }}><RecentTransactionsCard navigation={this.props.navigation} /></View>
        },
        
    ];

    return (
      <View style={styles.container} >
        <HomeHeader name={ this.props.userDataDetail.name }/>
        <SortableList
          style={styles.list}
          refreshControl={<RefreshControl
                refreshing={this.state.pageRefreshing}
                onRefresh={()=>this._onRefresh()}
          />}
          order={this.state.order}
          renderHeader={()=>this._renderImageSlider()}
          data={cards}
          renderRow={this._renderRow} 
          innerContainerStyle = {styles.contentContainer}
          dynamicRowIndex = {[2]}
          onChangeOrder={(itemOrder)=>this.onRowOrderChange(itemOrder)}/>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
        postHomeApi: (payload) => dispatch(postHomeApi(payload)),
        postCardOrder: (payload) => dispatch(postCardOrder(payload)),
        getScreenParamStatus: (payload) => dispatch(getScreenParamStatus(payload))
});
const mapStateToProps = (state) => ({
        sliderData: state.homeAPIData.banners,
        APIFlag: state.homeAPIData.homeAPIFlag,
        userDataDetail: state.homeAPIData.userDataDetail,
        config: state.config.data,
        screenCards : state.login.screenCards,
        bannerNavigations: state.homeAPIData.bannerNavigation
});
    
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:config.UI.greyBackground
  },


  list: {
    flex: 1,
  }
});