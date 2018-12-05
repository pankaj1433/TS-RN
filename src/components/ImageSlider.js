import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableWithoutFeedback , TouchableOpacity} from 'react-native';
import Swiper from 'react-native-swiper-custom';
import PropTypes from 'prop-types';
import { Video } from 'expo'

import config from '../config/config';
import { cloudinaryTransform } from './../utils/Filters';
import VideoComponent from './layout/VideoComponent';
// import { type } from 'os';

class ImageSlider extends Component {

    constructor(props) {
        super(props);
        let { urlLink } = props.urlLink;
        let { width } = Dimensions.get('window');
        this.state = {
            n: urlLink && urlLink.length,
            height: width * (203 / 360),
            width,
            autoplay:true,
            shouldPlay:false,
            playbackObject:null
        };

    }

    _handlePlayback=(status) => {
        this.setState({
            autoplay:status
        })
    }

    _renderImages = () => {
        let { width, height } = this.state;
        let { onClick } = this.props;
        // console.log("*** prod data is :",this.props.urlLink)
        
        return(
            this.props.urlLink.map((item, index) => {
                if(item.isVideo){
                    // const videoLink = ( typeof item.bannerLink === 'string' )? {}: item.bannerLink;
                    const videoLink = item.bannerLink;
                    return (
                        // <View>

                            <VideoComponent source={videoLink} setAutoplay={(status) => this._handlePlayback(status)} navigation={this.props.navigation}/>
                            
                            // {/* <TouchableOpacity style={{alignItems: 'center',backgroundColor: '#DDDDDD',padding: 10}}>
                            //     <Text>DeepLink</Text>
                            // </TouchableOpacity> */}
                        // </View>
                    );
                }else{
                    const imageLink = (typeof item.bannerLink === 'string')? { uri: cloudinaryTransform(item.bannerLink) }: item.bannerLink;
                    // console.log("*** image link is :",imageLink)
                    return (
                        <TouchableWithoutFeedback 
                            key={ index } 
                            style={{ flex: 1 }}
                            onPress={ () => onClick({ image: cloudinaryTransform(item.bannerLink), index }) }
                        >
                            <Image
                                source={ imageLink }
                                resizeMode={'stretch'}
                                style={{ height }}
                            />
                        </TouchableWithoutFeedback>
                    );
                }
        })
    )
        
    };

    render () {
        return (
            <Swiper 
                height={ this.state.height }
                width={ this.state.width }
                paginationStyle={{ right: 15, left: null, bottom: 15 }}
                activeDotColor={ config.UI.primaryColor }
                dotStyle={{ height: 5, width: 5 }}
                activeDotStyle={{ height: 5, width: 5 }}
                autoplay={ this.state.autoplay }
                autoplayTimeout={ this.props.timer || 10 }
                scrollEnabled = { this.state.autoplay }
            >
                { this._renderImages() }
            </Swiper>
        );
    };
};

ImageSlider.propTypes = {
    images: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired
};

export default ImageSlider;