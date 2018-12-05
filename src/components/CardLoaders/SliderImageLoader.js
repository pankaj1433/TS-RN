import React from 'react';
import { Dimensions } from 'react-native';
import { Rect } from 'react-native-svg';

import ContentLoader from './ContentLoader';

const SliderImageLoader = () => {
    let { width } = Dimensions.get('window');
    let height = width * (203 / 360);
    return (
        <ContentLoader height={ height } width={ width } duration={1000}>
            <Rect x={ 0 } y="0" width={ width } height={ height }/>
        </ContentLoader>
    );
};

export default SliderImageLoader;