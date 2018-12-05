// import Mixpanel from 'react-native-mixpanel';

// import Store from './../store/index';
// import TrackingConstants from '../config/constants/TrackingConstants';

// class TrackMixpanel {

//     constructor() {
//         let oldKey = '';
//         Store.subscribe(() => {
//             const config = Store.getState()['config'];
//             if (config.data !== '') {
//                 const mixpanelToken = config.data.mixpanel;
//                 if (oldKey === '' || oldKey !== mixpanelToken) {
//                     oldKey = mixpanelToken;
//                     Mixpanel.sharedInstanceWithToken(mixpanelToken);
//                 }
//             } 
//         });
//     };

//     mapEventNameToValue = (eventName) => {
//         if (TrackingConstants[eventName]) {
//             return TrackingConstants[eventName];
//         }
//         return eventName;
//     };

//     track (eventName) {
//         let eventValue = this.mapEventNameToValue(eventName);
//         Mixpanel.track(eventValue);
//     };

//     trackWithProperties (eventName, properties) {
//         let eventValue = this.mapEventNameToValue(eventName);
//         Mixpanel.trackWithProperties(eventValue, properties);
//     };

//     createAlias (UNIQUE_ID) {
//         Mixpanel.createAlias(UNIQUE_ID);
//     };

//     identify (UNIQUE_ID) {
//         Mixpanel.identify(UNIQUE_ID);
//     };

//     setPeople (properties) {
//         Mixpanel.set(properties);
//     };

//     setPeopleOnce (properties) {
//         Mixpanel.setOnce(properties);
//     };

//     trackCharge (charge) {
//         Mixpanel.trackCharge(charge);
//     };

//     trackChargeWithProperties (charge, properties) {
//         Mixpanel.trackChargeWithProperties(charge, properties);
//     };

//     increment (incrementProperty, incrementBy) {
//         Mixpanel.increment(incrementProperty, incrementBy);
//     };

//     setPushRegistrationId (pushToken) {
//         Mixpanel.setPushRegistrationId(pushToken);
//     };

//     reset () {
//         Mixpanel.reset();
//     };

//     getDistinctId (callback) {
//         Mixpanel.getDistinctId((id) => { callback(id) });
//     };

//     addPushDeviceTokenIOS (token) {
//         Mixpanel.addPushDeviceToken(token);
//     };

//     timeEvent (eventName) {
//         Mixpanel.timeEvent(eventName);
//     };

//     registerSuperProperties (properties) {
//         Mixpanel.registerSuperProperties(properties);
//     };

//     registerSuperPropertiesOnce (properties) {
//         Mixpanel.registerSuperPropertiesOnce(properties);
//     };

// }

// export default new TrackMixpanel;