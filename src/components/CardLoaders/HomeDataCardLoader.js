import React from 'react';
import { View, Text, Dimensions, StyleSheet, Image } from 'react-native';
import ContentLoader from './ContentLoader';
import { Rect } from 'react-native-svg';
import config from './../../config/config'

import Card from '../UI/Card';

const { width } = Dimensions.get('window');
const HomeDataCardLoader = () => {
    return (
        <Card style={{marginHorizontal: 10,padding: 0}}>
            <View style={styles.header}>
                <ContentLoader height={ 130 } width={ width } duration={1000}>
                    <Rect x="10" y="10" width={(width - 40)/2} height="10"/>
                    <Rect x="10" y="30" width={((width - 40)/2)-60} height="10"/>
                    <Rect x="10" y="50" width={(width - 40)/2} height="10"/>
                    <Rect x="10" y="70" width={((width - 40)/2)-60} height="10"/>
                    <Rect x="10" y="90" width={((width - 40)/2)-30} height="10"/>
                    <Rect x="10" y="110" width={(width - 40)/2} height="10"/>
                
                    <Rect x={(width - 20)/2+10} y="10" width={(width - 40)/2-10} height="50"/>
                    <Rect x={(width - 20)/2+10} y="70" width={(width - 40)/2-10} height="10"/>
                    <Rect x={(width - 20)/2+30} y="90" width={(width - 40)/2-60} height="10"/>
                </ContentLoader>
            </View>
            <View style={styles.footer}>
                <Image style={{width:width}} resizeMode="stretch" source={require('./../../assets/img/zigzag/zigzag.png')}/>
                <ContentLoader primaryColor = "#89b4d6" secondaryColor="#b7d6ef" height={ 30 } width={ width } duration={1000}>
                    <Rect x={width/2 } y="10" width={width/2 - 40} height="10"/>
                </ContentLoader>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems:'center',
        width: width-20,
        flexDirection: 'row',
    },
    footer: {
        flexGrow: 1,
        backgroundColor: config.UI.buttonGrey,
        overflow: 'hidden',
    },
});

export default HomeDataCardLoader;