import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HeaderTransparent = ({ title }) => {
    return (
        <View style={ styles.headerContainer }>
            <Text style={ styles.headerText }>
                { title }
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 20
    },
    headerText: {
        fontFamily: 'sky-text-medium',
        fontSize: 22,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: "#ffffff",
        paddingHorizontal: 10
    }
});

export default HeaderTransparent;