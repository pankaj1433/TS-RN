import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Timeline from 'react-native-timeline-listview';
import { connect } from 'react-redux';
// import firebase from 'react-native-firebase';

import { dateFilter } from './../utils/Filters';
import { getServiceRequestHistoryList } from './../actions/supportAction';
import Card from './../components/UI/Card';
import Localize from './../config/i18n/Localize';
import config from './../config/config';
// import TrackMixpanel from '../utils/TrackMixpanel';

import HeaderWithBackScreen from './../components/UI/HeaderWithBackScreen';
import ListLoader from './../components/UI/ListLoader';
import ListCardLoader from './../components/CardLoaders/ListCardLoader';
import AlertBox from './../components/Alert';

class ServiceRequestHistory extends Component {
    
    constructor(){
        super();
        this.state = {
            data: [],
            isRefreshing: false,
            hasMoreData: false,
            offset: 5,
            index: 0,
        }
        this.countInOneLoad= 5;
    }

    componentWillMount() {
        // firebase.analytics().setCurrentScreen('ServiceRequestHistory');
        this.props.getSupportHistory();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.historyList.length !== 0) {
            let data= [];
            let hasMoreDataFlag = false;

            //intialize the list.
            for(var i=this.state.index;i<this.state.offset;i++) {
                if (nextProps.historyList[i]) {
                    data.push(nextProps.historyList[i]);
                }
            }
            if(nextProps.historyList.length >= this.state.offset)
                hasMoreDataFlag = true
            this.setState({
                data,
                index: this.state.offset,
                offset: (this.state.offset + this.countInOneLoad),
                hasMoreData: hasMoreDataFlag,
            })
        }
    }

    loadContent = () => {
        if (!this.state.isRefreshing) {
            this.setState({isRefreshing: true});
            // TrackMixpanel.trackWithProperties('ServiceRequestHistory',{ action: 'Load More',count: this.state.index/5});
            // //fetch and concat data.
            setTimeout(() => {
              //concat initial data.
              let nextData = [];
              let hasMoreDataFlag = true;
              for(var i=this.state.index;i<this.state.offset;i++) {
                  if(this.props.historyList[i])
                    nextData.push(this.props.historyList[i])
                }
              var data = this.state.data.concat(nextData)
            
              //hide load more.
              if(this.props.historyList.length <= this.state.offset)
                hasMoreDataFlag = false

                //set offset and index.
              this.setState({
                isRefreshing: false,
                data: data,
                index: this.state.offset,
                offset: (this.state.offset + this.countInOneLoad),
                hasMoreData: hasMoreDataFlag,
              });
            }, 1000);
        }
    }

    renderItem = (rowData, sectionID, rowID) => {
        let data = {item : rowData};
        return (
            <Card style={{top:-10, padding: 12, marginBottom:19.4, marginRight: 5}}>
                <View>
                    <View style={[styles.cardRowWrapper,{marginBottom:6.5}]}>
                        <Text style={styles.dateTextStyle}>{Localize.t("SUPPORT.req_created")}</Text>
                        <Text style={styles.dateTextStyle}>{ dateFilter(rowData.requestCreateDate) }</Text>
                    </View>
                    <View style={styles.cardRowWrapper}>
                        <Text style={styles.dateTextStyle}>{Localize.t("SUPPORT.req_type")+' : '}</Text>
                        <Text style={[styles.dataTextStyle, {flex:1, flexWrap: 'wrap'}]}>{ rowData.requestType }</Text>
                    </View>
                    <View style={styles.cardRowWrapper}>
                        <Text style={styles.dateTextStyle}>{Localize.t("SUPPORT.req_status")+' : '}</Text>
                        <Text style={styles.priceTextStyle}>{ rowData.status }</Text>
                    </View>
                    <View style={{flexDirection:'row',alignSelf:'flex-end',alignItems:'center',}}>
                        <Text style={styles.dateTextStyle}>{Localize.t("SUPPORT.ticket")+' : '}</Text>
                        <Text style={styles.dataTextStyle}>{ rowData.ticketNumber }</Text>
                    </View>
                </View>
            </Card>
        );
    };

    renderList = () => {
        return(
                (this.state.data.length !== 0) ?
                    <View style={styles.list}>
                        <Timeline
                            data={this.state.data}
                            renderDetail={this.renderItem}
                            separator={false}
                            timeContainerStyle={{display:'none'}}
                            innerCircle={'dot'}
                            circleColor = '#fff'
                            dotColor={config.UI.profilePinkHeader}
                            circleSize = {22}
                            lineColor = 'rgba(66,66,66,0.23)'
                            lineWidth = {1}                            
                            options = {{
                                showsVerticalScrollIndicator: false,
                                renderFooter: () => {
                                    return(
                                        (this.state.hasMoreData)?
                                            (!this.state.isRefreshing) ?
                                                <Card style={styles.loadMoreButton}>
                                                    <TouchableOpacity onPress={()=>this.loadContent()} style={{paddingVertical:15,justifyContent:'center',alignItems:'center'}}>
                                                        <Text style={{color:config.UI.textBlue}}>{Localize.t('TRANSACTION.load_more')}</Text>
                    
                                                    </TouchableOpacity>
                                                </Card>:
                                            <ListLoader style={styles.loadMoreButton} />:null )
                                },                            
                            }}
                        />
                    </View>:
                    <View style={styles.loderWrapper}>
                        <ListCardLoader/>
                    </View>
                    
            )
    }

    render() {
        return (
            <View style = {{flex: 1}}>
                <AlertBox/>
                <HeaderWithBackScreen title="Service Request History" goBack = {this.props.navigation.goBack} >
                    {this.renderList()}
                </HeaderWithBackScreen>
            </View>
        );
    };
};

const styles = StyleSheet.create({
    list: {
        justifyContent: 'center',
        paddingTop: 15.2,
        paddingBottom: 5,
        paddingLeft:0,
        paddingRight: 18.5,
        flex:1
    },
    loderWrapper: {
        paddingTop: 15.2,
        paddingHorizontal: 18.5,
        flex:1,
    },
    dateTextStyle: {
        color: config.UI.textDarkGrey,
        fontFamily: 'sky-text-regular',
        fontSize: 15.3,
    },
    priceTextStyle: {
        fontFamily: 'sky-text-medium',
        fontSize: 15.3,
        color: config.UI.profilePinkHeader,
    },
    dataTextStyle: {
        fontFamily: 'sky-text-medium',
        fontSize: 15.3,
        color: config.UI.textDarkGrey,
    },
    loadMoreButton: {
        marginLeft: 40,
        padding: 0,
        marginVertical:5,
    },
    cardRowWrapper: {
        flexDirection:'row',
        marginBottom:5.7,
        alignItems:'center'
    }
});


const mapDispatchToProps = (dispatch) => ({
    getSupportHistory : () => dispatch(getServiceRequestHistoryList())
});
const mapStateToProps = (state) => ({
    historyList : state.supportAPIData.list
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceRequestHistory);