import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import ContentLoader from './ContentLoader';
import { Rect } from 'react-native-svg';
import Divider from './../../components/UI/Divider';
import Card from './../../components/UI/Card';

const RechargeLoader = () => {
    let { width } = Dimensions.get('window');
    return (
        <Card style={{ padding: 0 }}>
            <View style={ { padding: 10 } }>
                <ContentLoader height={ 70 } width={ width } duration={1000}>
                    <Rect x="10" y="10" width="250" height="10"/>
                    <Rect x="10" y="30" width="250" height="15"/>
                </ContentLoader>
            </View>
            <Divider style={{borderBottomWidth: StyleSheet.hairlineWidth}} color = '#ccc' />
            <View style={{ justifyContent:'center', alignItems:'center', paddingHorizontal: 10, paddingVertical:20}}>
                <ContentLoader height={ 70 } width={ 150 } duration={1000}>
                    <Rect x="20" y="10" width="150" height="10"/>
                    <Rect x="20" y="30" width="150" height="15"/>
                </ContentLoader>
            </View>
        </Card>
    );
}

export default RechargeLoader;