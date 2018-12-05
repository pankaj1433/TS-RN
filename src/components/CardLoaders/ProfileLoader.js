import React from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import ContentLoader from './ContentLoader';
import { Rect } from 'react-native-svg';
import Card from './../../components/UI/Card';
import config from './../../config/config';


const ProfileCardLoader = () => {
    let { width,height } = Dimensions.get('window');
    return (
        <Card style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.columnContainer}>
                    <ContentLoader primaryColor = "#ff609c" secondaryColor="#ff77aa" width={ width } duration={1000}>
                        <Rect x="20" y="10" width="150" height="10"/>
                        <Rect x="20" y="30" width="150" height="15"/>
                    </ContentLoader>
                </View>
                <View style={styles.columnContainer}>
                    {/* <Text style={[{textAlign:'right',marginBottom:2},this.fontStyle(config.UI.secondaryColor,12)]}>{Localize.t('PROFILE.cust_id')}</Text>
                    <Text style={[{textAlign:'right'},this.fontStyle(config.UI.secondaryColor,14.9,'700','sky-text-medium')]}>{data.customerId}</Text> */}
                </View>

                <View style={styles.whiteOverlay}></View>
            </View>

            <View style={styles.content}>
                <ContentLoader width={ width } duration={1000}>
                    <Rect x="20" y="10" width="150" height="15"/>
                    <Rect x="20" y="30" width="200" height="25"/>
                    <Rect x="20" y="80" width="150" height="15"/>
                    <Rect x="20" y="100" width="200" height="25"/>
                </ContentLoader>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: config.UI.secondaryColor,
        alignItems: 'center',
        padding: 0,
        overflow: 'hidden',
        borderWidth: 0
    },
    headerContainer: {
        height: 100,
        width: window.width - 20,
        backgroundColor: config.UI.profilePinkHeader,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        paddingTop: 20,
        position: 'relative'
    },
    columnContainer: {
        justifyContent: 'space-between',
        alignSelf: 'flex-start',
    },
    whiteOverlay : {
        width: window.width-20,
        position: 'absolute',
        borderBottomColor: config.UI.secondaryColor,
        borderLeftColor: 'transparent',
        borderStyle: 'solid',
        borderBottomWidth: 30,
        borderLeftWidth: window.width-20,
        bottom: 0
    },
    content: {
        flex: 1,
        padding: 10,
        paddingBottom: 0,
    }
});
 

export default ProfileCardLoader;