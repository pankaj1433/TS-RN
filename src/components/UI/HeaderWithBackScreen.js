import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import config from './../../config/config';
import {LinearGradient} from 'expo';
import { Feather } from '@expo/vector-icons';
import HeaderWithBack from './../layout/HeaderWithBack'
import PropTypes from 'prop-types';
import Alert from '../Alert'

const HeaderWithBackScreen = (props) => {
    return (
        <View style={styles.container}>
             {/* <LinearGradient colors={['#284397', '#A62871']} start={[1, 1]} end={[0, 1]} style={{ padding: 10}}>
                <View style = {{backgroundColor: 'transparent', marginTop: 30.0, flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={()=>props.goBack()} style = {{height: 44.0, width: 44.0, flexDirection: 'row',alignItems: 'center'}}>
                        <Feather name='arrow-left' size={25} color='white' />
                    </TouchableOpacity>
                    <Text style = {{fontFamily: 'sky-text-regular', fontSize: 21.0, color: 'white'}}>{ props.title }</Text>
                </View> 
            </LinearGradient> */}
            <Alert/>
            <HeaderWithBack title={props.title} backButtonHandler={()=>props.goBack()} color="gradient" elevated={ true } />
            <View style={{ flex: 1, backgroundColor: config.UI.greyBackground }}>
                { props.children }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        shadowOffset: {  
            width: 0,  
            height: 0.5,  
        }, 
        shadowColor: 'black',
        shadowOpacity: 0.3, 
        elevation: 2
    }
});

HeaderWithBackScreen.PropTypes = {
    title: PropTypes.string.isRequired,
    goBack: PropTypes.func.isRequired,
    children: PropTypes.element
};

export default HeaderWithBackScreen;