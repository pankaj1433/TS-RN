import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';

const AnchorLinks = ({ onClick, title, highlightColor, accessible = true, accessibilityLabel = title}) => {
    highlightColor = highlightColor || 'transparent';
    return (
        <TouchableHighlight 
        accessible={accessible} 
        accessibilityLabel={accessibilityLabel} 
        onPress={ onClick } 
        underlayColor={ highlightColor } 
        activeOpacity={0.5}>
            <View>
                <Text style={ [styles.links] }>{ title }</Text>
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    links: {
        color: 'white',
        backgroundColor: 'transparent',
        fontFamily: "sky-text-regular",
        fontSize: 14.7,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 27,
        letterSpacing: 0,
    }
});

export default AnchorLinks;