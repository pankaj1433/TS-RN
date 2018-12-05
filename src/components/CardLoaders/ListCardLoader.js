import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import ContentLoader from './ContentLoader';
import { Rect} from 'react-native-svg';

import Card from '../UI/Card';

const ListCardLoader = () => {
    let { width } = Dimensions.get('window');
    return (
        <Card>
            <ContentLoader height={ 70 } width={ width } duration={1000}>
                <Rect x="10" y="10" width="250" height="10"/>
                <Rect x="10" y="30" width="200" height="10"/>
                <Rect x="10" y="50" width="150" height="10"/>
            </ContentLoader>
        </Card>
    );
};

export default ListCardLoader;