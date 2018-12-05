import { Dimensions, Platform } from 'react-native';

export const isiPhoneX = () => {
    let { width, height } = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (height === 812 || width === 812)
    );
};

export function ifIphoneX(iphoneXStyle, regularStyle) {
    if (isiPhoneX()) {
        return iphoneXStyle;
    }
    return regularStyle;
}