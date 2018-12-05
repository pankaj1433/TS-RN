import React, {Component} from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import {Feather} from '@expo/vector-icons';
import { LinearGradient, Constants } from 'expo';
import { connect } from 'react-redux';
// import firebase from 'react-native-firebase';

import PriceCard from './../components/UI/PriceCard'
import Localize from '../config/i18n/Localize';
import config from './../config/config';
import HeaderWithBackScreen from './../components/UI/HeaderWithBackScreen';
import { getAllAddOns } from './../actions/myPlanAction';
import { dataStringFilter, priceFilter } from '../utils/Filters';
import PriceCardLoader from './../components/CardLoaders/PriceCardLoader';
import AlertBox from './../components/Alert';

var {width, height} = Dimensions.get('window')
const gradientHeight = Constants.statusBarHeight + 61

class ChooseAddonsScreen extends Component {    

    constructor() {
        super();
        this.state={
            allAddOns:{}
        }
    }
    componentWillMount() {
        // firebase.analytics().setCurrentScreen('ChooseAddOns');
        if(!this.props.navigation.state.params){
            this.props.getAllAddOns();
        }else{
            this.setState({
                allAddOns:this.props.navigation.state.params
            })
        }
    }

    componentWillReceiveProps(nextProps){
        if(Object.keys(nextProps.apiResponseData).length > 0 ){
            this.setState({
                allAddOns:nextProps.apiResponseData
            })
        }
    }

    backButtonPressed = () => {
        this.props.navigation.goBack()
    }

    renderAddOn = (addOnData) => {
        return (
            <View style = {{margin: 10.0 ,width: 117}}>
               <PriceCard 
                    FirstLine = '' 
                    // AliasName = { addOnData.item.addOnName }
                    SecondLine = { dataStringFilter(addOnData.item.totalData) || dataStringFilter(addOnData.item.secondLine)} 
                    validity = { addOnData.item.validityUnit ? `${addOnData.item.validity} ${ addOnData.item.validityUnit }`:`${addOnData.item.validity}` }
                    price = { priceFilter(addOnData.item.price, addOnData.item.currencyUnit) } 
                    hasBorder = {true} 
                    navigationProps={ this.props.navigation }
                    redirectTo='ReviewAddOnsScreen'
                    size = {117}
                    productOfferingId = { addOnData.item.productOfferingId }
                />
            </View>
        )
      }
    render() {
        const headerViewFlexValue = 81.0/height                
        const cardWidth = 117 + 20
        let numberOfColumns = Math.floor(width/cardWidth)
            return (
                <View style = {{flex: 1}}>
                <AlertBox />
                <HeaderWithBackScreen title={ Localize.t('CHOOSE_ADDONS.choose_addOns')} goBack={ this.backButtonPressed }>                    
                {/* <HeaderWithBackScreen title="Choose Addons" goBack={ this.backButtonPressed }> */}
                    <View style = {{flex: 1}}>
                        <View style = {{flex: 1, flexDirection: 'row', paddingTop: 10.0}}>
                        {
                            (Object.keys(this.state.allAddOns).length > 0 ) ? 
                            <FlatList showsVerticalScrollIndicator = {false} contentContainerStyle = {{flexDirection: 'column', alignItems: 'center'}} numColumns = {numberOfColumns}
                               data = {this.state.allAddOns}
                               renderItem = {this.renderAddOn}
                            />:
                            <View style = {{flex:1,alignItems:'center', marginTop: 15.0 ,justifyContent:'flex-start' }}>
                                <View>
                                    <PriceCardLoader size = {117} hasFirstLine={false} hasBorder={true} />
                                </View>                            
                            </View>
                        }
                        </View>
                    </View>
                </HeaderWithBackScreen>

                </View>
            );
    }
} 

const mapDispatchToProps = (dispatch) => ({
    getAllAddOns: () => dispatch(getAllAddOns())
});
const mapStateToProps = (state) => ({
    apiResponseData: state.myPlanAPIData.allAddOns
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseAddonsScreen);
