import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

import config from '../../config/config';
import Localize from './../../config/i18n/Localize';
import GradientText from './../../components/UI/GradientText';
// import TrackMixPanel from './../../utils/TrackMixpanel';

const {height, width} = Dimensions.get('window');
const PriceCard = ({
                        FirstLine = 'Data Per Month', 
                        SecondLine, 
                        hasGradientText = true,
                        hasBorder=false, 
                        price, 
                        validity, 
                        size = 140,
                        firstLineFontSize = 16,
                        navigationProps,
                        redirectTo,
                        productOfferingId,
                        // AliasName
                    }) => {

    const borderStyle =
    (hasBorder)?{
        borderWidth: 1, 
        borderColor: config.UI.borderGrey, 
    }:{}
    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#fff',
            width: size,
            overflow: 'hidden',
            borderRadius: 5,
            shadowOffset: {  
                width: 1,  
                height: 2,  
            }, 
            shadowColor: 'black',
            shadowOpacity: 0.5, 
            elevation: 2
        },
        header: {
            paddingHorizontal: 15,
            paddingBottom: 10,
            paddingTop: 0,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
        footer: {
            backgroundColor: '#f7f7f7'
        },
        FirstLineStyle: {
            fontSize: firstLineFontSize,
            color: config.UI.textGrey,
            fontFamily: 'sky-text-regular',
            textAlign:'center',
            marginTop: 15,
        },
        validityStyle: {
            fontSize: 14,
            color: config.UI.textGrey
        },
        priceStyle: {
            textAlign: 'center',
            fontSize: 20,
            fontFamily:'sky-text-medium',
            color: '#424242',
            marginVertical: 4
        }
    });

    const trackPriceCard = () => {
        // TrackMixPanel.trackWithProperties('Price Card Click', {
        //     offerType: (FirstLine)? 'Plan': 'AddOn',
        //     price,
        //     validity,
        //     location: navigationProps.state.routeName,
        //     productOfferingId
        // })
    };

    const priceCardRedirect = () => {
        console.log('Price Card Redirect', redirectTo, navigationProps);
        if (redirectTo) {
            trackPriceCard();
            const nav = NavigationActions.navigate({
                routeName: redirectTo,
                params: {
                    secondLine: SecondLine,
                    validity,
                    price: (price) ? parseFloat(price.split(' ')[1]) : price,
                    productOfferingId,
                    // aliasName: AliasName
                }
            });
            if (navigationProps) {
                navigationProps.dispatch(nav);
            }
        }
    };

    const _renderPriceCard = () => {
        return (
            <View style={[styles.container,borderStyle]}>
                <View style={styles.header}>
                {/* {
                        (AliasName) ?
                        (hasGradientText) ? 
                        <View style={{marginTop: 5,flexDirection: 'row'}}>
                            <GradientText text={AliasName} />
                        </View>:
                        <Text style={[styles.validityStyle,{marginLeft: 5,fontFamily:'sky-text-bold'}]}>{AliasName}</Text>:null
                    } */}

                    {
                        (FirstLine)?
                        <Text style={styles.FirstLineStyle}>{FirstLine}</Text>
                        :<View style={{marginTop:5}}></View>
                    }
                    {
                        (SecondLine)?
                        (hasGradientText)?
                        <View style={{alignItems:'center'}}>
                            <GradientText text={SecondLine} />
                        </View>:
                        <Text style={{fontSize:26,fontWeight:"900",fontFamily:'sky-text-bold'}}>{SecondLine}</Text>:null
                    }
                    {
                        (validity) ? 
                        <View style={{marginTop: 10,flexDirection: 'row'}}>
                            <Text style={[styles.validityStyle,{fontFamily:'sky-text-regular'}]}>{Localize.t('COMMON.validity')}</Text> 
                            {/* <Text style={[styles.validityStyle,{fontFamily:'sky-text-regular'}]}>Validity:</Text> */}
                            <Text style={[styles.validityStyle,{marginLeft: 5,fontFamily:'sky-text-bold'}]}>{validity}</Text>
                        </View>: null
                    }
                    
                </View>
                <View style={styles.footer}>
                    <Image resizeMode='cover' source={require('./../../assets/img/zigzag/zigzag.png')}/>
                    <Text style={styles.priceStyle} >{price}</Text>
                </View>
            </View>
        );
    };

    if (redirectTo && navigationProps) {
        return (
            <TouchableOpacity onPress={ priceCardRedirect } >
                { _renderPriceCard() }
            </TouchableOpacity>
        );
    }
    return _renderPriceCard();
}

PriceCard.propTypes = {
    FirstLine: PropTypes.string, 
    SecondLine: PropTypes.string, 
    hasGradientText: PropTypes.bool,
    // AliasName: PropTypes.string,
    hasBorder: PropTypes.bool, 
    price: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]), 
    validity: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]), 
    size: PropTypes.number,
    firstLineFontSize : PropTypes.number,
};

export default PriceCard;