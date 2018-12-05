import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import Card from './UI/Card';
import PriceCard from './UI/PriceCard';
import config from '../config/config';
import Localize from '../config/i18n/Localize';
import { priceFilter } from '../utils/Filters';

class getAddonsCard extends Component {
    
    constructor(props){
        super(props);
        console.log('addonlistsssssss', props)
        this.state = {
            data: props.addOnList
        }
    }

    render() {
        return (
            <Card style={{ padding: 12, marginTop: 10, marginHorizontal: 10 }}>
                <Text style={ [ styles.heading ] }>{Localize.t('MY_PLAN.get_addOns')}</Text>
                {/* <Text style={ [ styles.heading ] }>Get Addons</Text> */}
                
                <View style = {{marginTop: 10.0, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <FlatList
                        showsHorizontalScrollIndicator = {false}
                        horizontal = {true} 
                        ItemSeparatorComponent = { 
                            () => <View style = {{width: 20}} />
                        } 
                        data = {this.state.data}
                        renderItem = {
                            (dataItem) => 
                            <View key={ dataItem.index } style = {{flex: 1}}>
                                <PriceCard 
                                    FirstLine = '' 
                                    SecondLine = {dataItem.item.totalData} 
                                    validity= {`${dataItem.item.validity} ${dataItem.item.validityUnit}`} 
                                    price = { priceFilter(dataItem.item.price, dataItem.item.currencyUnit) } 
                                    hasBorder = {true} 
                                    redirectTo='ReviewAddOnsScreen'
                                    navigationProps={ this.props.navigation }
                                    size = {117} 
                                    productOfferingId = { dataItem.item.productOfferingId }
                                />
                            </View>
                        }
                    />
                </View>
            </Card>
        );
    };
};

const styles = StyleSheet.create({
    heading: {
        fontFamily: 'sky-text-medium',
        fontSize: 15.3,
        color: config.UI.textDarkGrey,
    },
});

export default getAddonsCard;