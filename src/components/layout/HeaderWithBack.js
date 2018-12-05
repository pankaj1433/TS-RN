import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo';
import { Feather } from '@expo/vector-icons';

const HeaderWithBack = ({ title = 'Enter Title Here', backButtonHandler, color, textColor = 'white', elevated = false }) => {

    const backColor = (color === 'gradient' || !color)? 'transparent': color;

    const styles = StyleSheet.create({
        container: {
            backgroundColor: backColor,
            paddingTop: 40,
            paddingBottom: 20
        },
        innerContainer: {
            flexDirection: 'row'
        },
        iconContainer: {
            paddingHorizontal: 20
        },
        icon: {
            color: textColor
        },
        titleContainer: {
            justifyContent: 'space-around',
            flex: 1,
            flexDirection: 'column'
        },
        title: {
            fontFamily: 'sky-text-regular',
            fontSize: 20.7,
            fontWeight: "normal",
            fontStyle: "normal",
            letterSpacing: 0,
            textAlign: "left",
            color: textColor
        },
        elevated: {
            shadowOffset: {  
                width: 1,  
                height: 2,  
            }, 
            shadowColor: 'black',
            shadowOpacity: 0.5, 
            elevation: 4, 
            zIndex: 4
        }
    });

    const headerTemplate = (
        <View style={ [ styles.container ] }>
            <View style={ [ styles.innerContainer ] }>
                <View style={ {justifyContent: 'center'} }>
                    <TouchableOpacity onPress={ () => backButtonHandler() } >
                        <Feather style={ { color: textColor, paddingHorizontal:20 } } name='arrow-left' size={ 24 } />
                    </TouchableOpacity>
                </View>
                <View style={ [ styles.titleContainer ] }>
                    <Text style={ [ styles.title ] }>{ title }</Text>
                </View>
            </View>
        </View>
    )

    if (color === 'gradient') {
        return (
            <LinearGradient colors={['#284397', '#A62871']} start={[1, 1]} end={[0, 1]} style={[{ padding: 0}, elevated && styles.elevated]}>
                { headerTemplate }
            </LinearGradient>
        )    
    }
    return headerTemplate;
};

export default HeaderWithBack;