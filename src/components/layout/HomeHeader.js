import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

import config from './../../config/config';
import { isiPhoneX } from './../../utils/iPhoneXHelper';

const HomeHeader = ({ name }) => {
    const styles = StyleSheet.create({
        headerContainer: {
            backgroundColor: 'white', 
            paddingVertical: 10, 
            paddingHorizontal: 10, 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            borderTopColor: '#3583BF', 
            borderTopWidth: (isiPhoneX())? 32 : 23
        },
        headerImageContainer: {
            flex: 0.5 
        },
        headerImage: {
            height: 40, 
            width: null
        },
        textNameContainer: {
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: 'transparent'
        },
        textName: { 
            color: config.UI.textDarkGrey,
            fontFamily:'sky-text-regular',
            fontSize: 12
        }

    });
    return (
        <View style={ [ styles.headerContainer ] }>
            <View style={ [ styles.headerImageContainer ] }>
                <Image 
                    resizeMode={ 'contain' }
                    style={ [ styles.headerImage ] }
                    source={ require('./../../assets/img/colorlogo/logo.png') }
                />
            </View>
            <View style={ styles.textNameContainer }>
                <Text accessible={true} accessibilityLabel="userName" style={ styles.textName }>{ name }</Text>
            </View>
        </View>
    );
};

export default HomeHeader;