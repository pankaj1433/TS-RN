import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Timeline from 'react-native-timeline-listview'
import { connect } from 'react-redux';
// import firebase from 'react-native-firebase';

import Card from './../components/UI/Card'
import Localize from './../config/i18n/Localize'
import config from './../config/config'

import HeaderWithBackScreen from './../components/UI/HeaderWithBackScreen';
import ListLoader from './../components/UI/ListLoader';;
import { getRecentTransaction } from './../actions/recentTransactionAction';
import { dateFilter, timeFilter, priceFilter } from '../utils/Filters';
import ListCardLoader from '../components/CardLoaders/ListCardLoader';
// import TrackMixpanel from '../utils/TrackMixpanel';


class RecentTransactions extends Component {
    
    constructor(){
        super();
        this.state = {
            data: [],
            isRefreshing: false,
            hasMoreData: false,
            offset: 5,
            index: 0,
            pageRefreshing: false
        }
        this.countInOneLoad= 5;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.recentTransactionData.length !== 0) {
            let data= [];
            let hasMoreDataFlag = false;
            //intialize the list.
            for(var i=this.state.index;i<this.state.offset;i++) {
                if(nextProps.recentTransactionData[i]) {
                    data.push(nextProps.recentTransactionData[i]);
                }
            }
            if(nextProps.recentTransactionData.length >= this.state.offset)
                hasMoreDataFlag = true
            this.setState({
                data,
                index: this.state.offset,
                offset: (this.state.offset + this.countInOneLoad),
                hasMoreData: hasMoreDataFlag,
            })
        }
        console.log(this.props.APICount, nextProps.APICount, 'wil; receive ))))))))))))))))');
        if (this.props.APICount < nextProps.APICount) {
            this.setState({ pageRefreshing: false });
        }
    }

    componentWillMount() {
        // firebase.analytics().setCurrentScreen('RecentTransactions');
        this.props.getRecentTransaction();
    }

    loadContent = () => {
        if (!this.state.isRefreshing) {
            this.setState({isRefreshing: true});
            // TrackMixpanel.trackWithProperties('RecentTransactions',{ action: 'Load More',count: this.state.index/5});
            // //fetch and concat data.
            setTimeout(() => {
              //concat initial data.
              let nextData = [];
              let hasMoreDataFlag = true;
              for(var i=this.state.index;i<this.state.offset;i++) {
                  if(this.props.recentTransactionData[i])
                    nextData.push(this.props.recentTransactionData[i])
                }
              var data = this.state.data.concat(nextData);
              //hide load more.
              if(this.props.recentTransactionData.length <= this.state.offset)
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
                <View style={{flexDirection:'row',alignItems:'center',marginVertical:12, justifyContent: 'space-between'}}>
                    <View style={{flexShrink:1,minWidth:70}}>
                        <Text style={[styles.dateTextStyle,{marginBottom:5.7}]}>{ dateFilter(data.item.transactionDate) }</Text>
                        <Text style={[styles.dateTextStyle]}>{ timeFilter(data.item.transactionDate) }</Text>
                    </View>
                    <View style={{ alignItems: 'flex-start', flex: 1 }}>
                        <Text style={[styles.priceTextStyle,{marginBottom:5.7, flexWrap: 'wrap'}]}>{ priceFilter(data.item.amount) } <Text style={[styles.dateTextStyle]}>({ data.item.paymentType })</Text></Text>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.dataTextStyle]}>{data.item.paymentMode}</Text>
                        </View>
                    </View>
                </View>
            </Card>
        );
    };

    onRefresh = () => {
        this.setState({ 
            pageRefreshing: true,
            data: [],
            isRefreshing: false,
            hasMoreData: false,
            offset: 5,
            index: 0 
        });
        this.props.getRecentTransaction();
    };



    _renderList = () => {
        if (this.props.APICount > 0) {
            if (this.state.data.length > 0) {
                return (
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
                            refreshControl:  
                                <RefreshControl 
                                    refreshing={ this.state.pageRefreshing }
                                    onRefresh={ () => { this.onRefresh() } }
                                /> ,
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
                );
            }
            else {
                if ( this.state.pageRefreshing === true ) {
                    return (
                        <View style={{ paddingTop: 15.2, paddingHorizontal: 18.5, flex:1 }}>
                            <ListCardLoader />
                        </View>
                    );
                }
                else {
                    return (
                        <View style={{ paddingTop: 15.2, paddingHorizontal: 18.5, flex:1 }}>
                            <Text>No Data To Display</Text>
                        </View>
                    );
                }
            }
        }
        else {
            return (
                <View style={{ paddingTop: 15.2, paddingHorizontal: 18.5, flex:1 }}>
                    <ListCardLoader />
                </View>
            );
        }
        
    };

    render() {
        console.log(this.props.recentTransactionData)
        return (
            <HeaderWithBackScreen title={Localize.t('TRANSACTION.recent_transactions')} goBack = {this.props.navigation.goBack} >
                <View style={styles.list}>
                    { this._renderList() }
                </View>
            </HeaderWithBackScreen>
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
    dateTextStyle: {
        color: config.UI.textGrey,
        fontFamily: 'sky-text-regular',
        fontSize: 12,
    },
    priceTextStyle: {
        fontFamily: 'sky-text-medium',
        fontSize: 15.3,
        color: config.UI.profilePinkHeader,
    },
    dataTextStyle: {
        fontFamily: 'sky-text-medium',
        fontSize: 12,
        color: config.UI.textDarkGrey,
    },
    loadMoreButton: {
        marginLeft: 40,
        padding: 0,
        marginVertical:5
    }
});

const mapStateToProps = (state) => ({
    recentTransactionData: state.recentTransactionAPIData.recentTransactionData,
    APICount: state.recentTransactionAPIData.recentTransactionAPICount
});
const mapDispatchToProps = (dispatch) => ({
    getRecentTransaction: () => dispatch(getRecentTransaction())
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentTransactions);