import React from 'react';
import { View, Dimensions } from 'react-native';
import ContentLoader from './ContentLoader';
import { Rect } from 'react-native-svg';


const MyConsumptionLoader = () => {
    let { width } = Dimensions.get('window');
    return (
        <ContentLoader primaryColor = "#ff609c" secondaryColor="#ff77aa" height={ 70 } width={ width } duration={1000}>
            <Rect x="10" y="10" width="250" height="10"/>
            <Rect x="10" y="30" width="250" height="20"/>
            {/* <Rect x="10" y="10" width="250" height="10"/> */}
        </ContentLoader>
    );
}

export default MyConsumptionLoader;