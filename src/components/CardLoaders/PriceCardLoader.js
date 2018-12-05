import React from 'react';
import { View, Text, Dimensions, Image, StyleSheet } from 'react-native';
import ContentLoader from './ContentLoader';
import { Rect} from 'react-native-svg';
import PropTypes from 'prop-types';

import Card from '../UI/Card';

const PriceCardLoader = (props) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#fff',
            width: props.size,
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
    });
    const borderStyle =
    (props.hasBorder)?{
        borderWidth: 1, 
        borderColor: '#c6c6c6', 
    }:{}
    let width = props.size;
    return (
        <View style={[styles.container,borderStyle]}>
            <View style={styles.header}>
                {   props.hasFirstLine &&
                    <ContentLoader height={ 20 } width={ width } duration={1000}>
                        <Rect x="20" y="10" width={(width - 40)} height="10"/>
                    </ContentLoader >
                }
            <ContentLoader height={ 60 } width={ width } duration={1000}>
                <Rect x="15" y={10} width={(width - 30)} height="30"/>
                <Rect x="15" y={50} width={(width - 30)} height="10"/>
            </ContentLoader >
            </View>
            <View style={styles.footer}>
                <Image resizeMode='cover' source={require('./../../assets/img/zigzag/zigzag.png')}/>
                <ContentLoader height={ 30 } width={ width } duration={1000}>
                    <Rect x="35" y="10" width={(width - 70)} height="10"/>
                </ContentLoader >
            </View>
        </View>
    );
};
PriceCardLoader.defaultProps = {
    size: 140,
    hasFirstLine: true,
    hasBorder: false,
}
export default PriceCardLoader;