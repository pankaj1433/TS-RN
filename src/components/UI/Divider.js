import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = ({style, color}) => {
    style = style || {};
    style.borderBottomColor = color;
    return <View style={[styles.divider, style]}></View>
};

const styles = StyleSheet.create({
    divider: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginVertical: 1
    }
});

export default Divider;