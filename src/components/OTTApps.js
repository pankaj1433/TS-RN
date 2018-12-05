import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import AppLink from 'react-native-app-link';
import { connect } from 'react-redux';

import Card from './UI/Card';
import config from '../config/config';
import Localize from '../config/i18n/Localize';
import OTTCardLoader from './CardLoaders/OTTCardLoader';
// import TrackMixpanel from '../utils/TrackMixpanel';

class OTTApp extends Component {

    constructor () {
        super();
        this.state = {
            OTTAppData : []
        };
    };

    openAppOrStore = ({ url, appName, appStoreId, playStoreId, position }) => {
        AppLink.maybeOpenURL(url.trim(), {appName, appStoreId, playStoreId, appStoreLocale: 'in'})
        .then(ok => {
            // TrackMixpanel.trackWithProperties('HomeClick', {
            //     action: 'OTT Apps Click',
            //     appName,
            //     position
            // });
        })
        .catch(err => {
            console.log(err, 'App Link error')
        })
    };

    renderItem = (data) => {
        let { width, height } = Dimensions.get('window');
        return (
            <TouchableOpacity key={ data.index } onPress={ () => { this.openAppOrStore({ appName: data.item.displayText, appStoreId: data.item.appStoreId, playStoreId: data.item.playStoreId, url: data.item.deepLinkUrl, position: data.index }) } }>
                <View style={ [ styles.listItemContainer ] }>
                    <View style={ [ styles.listItem, { width: ( (width-38)/4 ) } ] }>
                        <View style={{ height: 70, paddingVertical: 10 }}>
                            <Image source={{ uri: data.item.imageUrl }} style={{ height: 50, width: 50 }}/>
                        </View>
                        <View style={{ height: 50 }}>
                            <Text style={ [ styles.listItemText ] }>{ data.item.displayText }</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    shouldComponentUpdate(nextProps) {
        if (nextProps.ottData.length === 0) {
            return false;
        }
        if(nextProps.ottData.length === this.props.ottData.length && nextProps.ottData.length > 0) {
            let shouldUpdate = false;
            nextProps.ottData
                .map((newObj, index) => {
                    if (newObj.displayText !== this.props.ottData[index].displayText) {
                        shouldUpdate = true;
                    }
                });
            return shouldUpdate;
        }
        return true;
    }

    render() {
        let ottElements = <OTTCardLoader /> ;
        if (this.props.ottData.length > 0) {
            ottElements = <FlatList
                            horizontal = { false }
                            numColumns = { 4 }
                            showsVerticalScrollIndicator = {false}
                            contentContainerStyle={ styles.list }
                            data={ this.props.ottData }
                            renderItem={this.renderItem}
                            />
        }
        return (
            <Card style={{ padding: 0 }}>
                <View style={ [ styles.headingContainer ] }>
                    <Text style={ [ styles.heading ] }>{ Localize.t('HOME.OTT.heading') }</Text>
                    {/* <Text style={ [ styles.heading ] }>Made for Videos</Text> */}
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    { ottElements }
                </View>
            </Card>
        );
    };
};

const styles = StyleSheet.create({
    headingContainer: {
        padding: 12
    },
    heading: {
        fontFamily: 'sky-text-medium',
        fontSize: 15.3,
        color: config.UI.textDarkGrey,
    },
    list: {
        justifyContent: 'center',
        paddingBottom: 5
    },
    listItemContainer: {
        flex: 1,
        height: 120,
        maxHeight:120,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'center'
        },
    listItem: { 
        justifyContent: 'center',
        alignItems: 'center' 
    },
    listItemImage: {},
    listItemText: { 
        color: config.UI.textBlue, 
        fontFamily: 'sky-text-regular', 
        fontSize: 15.3, 
        paddingTop: 10,
        textAlign: 'center'
    }
});

const mapStateToProps = (state) => ({
    ottData: state.ott.otts
});
const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(OTTApp);


// import React, { Component } from 'react';
// import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
// import AppLink from 'react-native-app-link';
// import { connect } from 'react-redux';
// import Carousel, {ParallaxImage, Pagination} from 'react-native-snap-carousel';
// import { Video } from 'expo'
// import Swiper from 'react-native-swiper-custom';

// import Card from './UI/Card';
// import config from '../config/config';
// import Localize from '../config/i18n/Localize';
// import OTTCardLoader from './CardLoaders/OTTCardLoader';
// import TrackMixpanel from '../utils/TrackMixpanel';


// const screenWidth = Dimensions.get('window').width;
// const itemWidth = screenWidth * 62 / 100;
// const itemHeight = 127;

// class OTTApp extends Component {

//     constructor () {
//         super();
//         let { width } = Dimensions.get('window');
//         this.state = {
//             height: width * (203 / 360),
//             width,
//             OTTAppData : []
//         };
//     };

//     // _handleVideoRef = component => {
//     //     const playbackObject = component;
//     //     playbackObject.presentFullscreenPlayer();
//     //   };

//     openAppOrStore = ({ url, appName, appStoreId, playStoreId, position }) => {
//         AppLink.maybeOpenURL(url.trim(), {appName, appStoreId, playStoreId, appStoreLocale: 'in'})
//         .then(ok => {
//             TrackMixpanel.trackWithProperties('HomeClick', {
//                 action: 'OTT Apps Click',
//                 appName,
//                 position
//             });
//         })
//         .catch(err => {
//             console.log(err, 'App Link error')
//         })
//     };

//     renderItem = (data) => {
//         let { width, height } = Dimensions.get('window');
//         // console.log("** image is :",data.item.url)
// //         let ottData = [
// //             {
// //                 "url": "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
// //     //   "url": "http://res.cloudinary.com/mapptsbbdev/image/upload/v1522416664/uat/OTT/ott_eros%20now.jpg2018-03-30T13:31:01.596.jpg",
// //       "appStoreId": "id551666302",
// //       "playStoreId": "com.erosnow",
// //       "deepLinkUrl": "erosnowapp://",
// //       "displayText": "Eros Now",
// //       "order": 4,
// //       "video": false
// //    },
// //             {
// //                 "url": "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
// //     //   "url": "http://res.cloudinary.com/mapptsbbdev/image/upload/v1522416749/uat/OTT/ott_sony%20logo_PNG__36-36%20%281%29.png2018-03-30T13:32:28.653.png",
// //       "appStoreId": "id587794258",
// //       "playStoreId": "com.sonyliv",
// //       "deepLinkUrl": "https://goo.gl/wS2eJW",
// //       "displayText": "Sony Liv",
// //       "order": 5,
// //       "video": false
// //    },
// //             {
// //                 "url": "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
// //     //   "url": "http://res.cloudinary.com/mapptsbbdev/image/upload/v1522418096/uat/OTT/ott_tata%20sky.jpg2018-03-30T13:54:55.860.jpg",
// //       "appStoreId": "id385090000",
// //       "playStoreId": "com.ryzmedia.tatasky",
// //       "deepLinkUrl": "https://ts2p.app.link/n5dDWWWujK",
// //       "displayText": "Tata Sky",
// //       "order": 6,
// //       "video": false
// //    }]
//         return (
//             <TouchableOpacity key={ data.index } onPress={ () => { this.openAppOrStore({ appName: data.item.displayText, appStoreId: data.item.appStoreId, playStoreId: data.item.playStoreId, url: data.item.deepLinkUrl, position: data.index }) } }>
//                 <View style={ [ styles.listItemContainer ] }>
//                     <View style={ [ styles.listItem, { width: ( (width-38)/4 ) } ] }>
//                         <View style={{ height: 70, paddingVertical: 10 }}>
//                             <Image source={{ uri: data.item.imageUrl }} style={{ height: 50, width: 50 }}/>
//                         </View>
//                         <View style={{ height: 50 }}>
//                             <Text style={ [ styles.listItemText ] }>{ data.item.displayText }</Text>
//                         </View>
//                     </View>
//                 </View>
//             </TouchableOpacity>

//             // ottData.map((data,index) => (
//             //     <View style={{marginBottom:30,flex:1}}>
//             //         <Video
//             //         // ref={this._handleVideoRef}
//             //         key={index}
//             //         source={{uri:`${data.url}`}}
//             //         rate={1.0}
//             //         volume={1.0}
//             //         muted={false}
//             //         resizeMode="contain"
//             //         shouldPlay={false}
//             //         isLooping={false}
//             //         useNativeControls={data.url ? true :false}
//             //         style={{flex:1}}
//             //         // onPlaybackStatusUpdate = {this._handlePlayback}
//             //         />
//             //         <TouchableOpacity style={styles.listItemText} onPress={ () => { this.openAppOrStore({ appName:data.displayText, appStoreId:data.appStoreId, playStoreId:data.playStoreId, url: data.deepLinkUrl, position: index }) } }> 
//             //             <Text style={{textAlign:'center'}}>{data.displayText }</Text> 
//             //         </TouchableOpacity>
//             //  </View>
//             // ))
                
//         );
//     };

//     shouldComponentUpdate(nextProps) {
//         if (nextProps.ottData.length === 0) {
//             return false;
//         }
//         if(nextProps.ottData.length === this.props.ottData.length && nextProps.ottData.length > 0) {
//             let shouldUpdate = false;
//             nextProps.ottData
//                 .map((newObj, index) => {
//                     if (newObj.displayText !== this.props.ottData[index].displayText) {
//                         shouldUpdate = true;
//                     }
//                 });
//             return shouldUpdate;
//         }
//         return true;
//     }
    

//     render() {
//         let ottElements = <OTTCardLoader /> ;
//         if (this.props.ottData.length > 0) {
//             ottElements = <FlatList
//                             horizontal = { false }
//                             numColumns = { 4 }
//                             showsVerticalScrollIndicator = {false}
//                             contentContainerStyle={ styles.list }
//                             data={ this.props.ottData }
//                             renderItem={this.renderItem}
//                             />
//         }
        
//         // console.log("***n  data is :",this.props.ottData)
//         return (
//             <Card style={{ padding: 0 }}>
//                 <View style={ [ styles.headingContainer ] }>
//                     <Text style={ [ styles.heading ] }>{ Localize.t('HOME.OTT.heading') }</Text>
//                 </View>
//                 <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                     { ottElements }
//                 </View>
//                 {/* <Swiper 
//                     height={ this.state.height }
//                     width={ this.state.width }
//                     paginationStyle={{ right: 15, left: null, bottom: 15 }}
//                     activeDotColor={ config.UI.primaryColor }
//                     dotStyle={{ height: 5, width: 5 }}
//                     activeDotStyle={{ height: 5, width: 5 }}
//                     // autoplay={ this.state.autoplay }
//                     // autoplayTimeout={ this.props.timer || 10 }
//                     scrollEnabled = { true }
//                     loop = { false }
//                     // showsButtons = {true}
//                     >
//                     { this._renderItem() }
//                 </Swiper> */}
//                 {/* <FlatList
//                     style={{marginBottom:10,flex:1}}
//                     // style={{marginLeft: 10, marginRight: 10}}
//                     showsHorizontalScrollIndicator={false}
//                     horizontal={true}
//                     data={ottData}
//                     keyExtractor={(item, index) => Math.floor(Math.random() * 10000000) + index}
//                     renderItem={this._renderItem}
//                 /> */}
//             </Card>


                
                
                
//         );
//     };
// };

// const styles = StyleSheet.create({
//     headingContainer: {
//         padding: 12
//     },
//     heading: {
//         fontFamily: 'sky-text-medium',
//         fontSize: 15.3,
//         color: config.UI.textDarkGrey,
//     },
//     slide: {
//         width: itemWidth,
//         height: itemHeight,
//         // marginLeft:horizontalMargin,
//         backgroundColor: "green"
//         // paddingHorizontal: horizontalMargin
//         // other styles for the item container
//     },
//     slideInnerContainer: {
//         flex: 1,
//     },
//     list: {
//         justifyContent: 'center',
//         paddingBottom: 5
//     },
//     listItemContainer: {
//         flex: 1,
//         // height: 120,
//         // maxHeight:120,
//         backgroundColor: 'white',
//         borderColor: '#ccc',
//         // borderWidth: StyleSheet.hairlineWidth,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginLeft:10,
//         marginRight:10
//         },
//     listItem: { 
//         justifyContent: 'center',
//         alignItems: 'center' 
//     },
//     listItemImage: {},
//     listItemText: { 
//         color: config.UI.textBlue, 
//         fontFamily: 'sky-text-regular', 
//         fontSize: 15.3, 
//         paddingTop: 10,
//         justifyContent: 'center'
//     }
// });

// const mapStateToProps = (state) => ({
//     ottData: state.ott.otts
// });
// const mapDispatchToProps = (dispatch) => ({
// });

// export default connect(mapStateToProps, mapDispatchToProps)(OTTApp);