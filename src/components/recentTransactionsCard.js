import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';

import Card from './UI/Card';
import config from '../config/config';
import Localize from '../config/i18n/Localize';
import { dateFilter, priceFilter, timeFilter } from '../utils/Filters';
import HomeRecentTransactionLoader from './CardLoaders/HomeRecentTransactionLoader';
// import TrackMixpanel from '../utils/TrackMixpanel';

class recentTransactionsCard extends Component {
    
    constructor(){
        super();
        this.state = {
            showMore: false,
            dataToShow: []
        }
    }

    moreLessHandler = () => {
        if(!this.state.showMore) {
            this.setState({
                showMore: true,
                dataToShow: this.props.recentTransaction
            })
        }
        else {
            let tmp = [];
            if (this.props.recentTransaction[0]) {
                tmp.push(this.props.recentTransaction[0]);
            }
            this.setState({ showMore: false, dataToShow: tmp })
        }
           
    };

    redirectToAllTransactions = () => {
        // TrackMixpanel.track('HomeClick', { action: 'View All', location: 'Recent Transaction Card' });
        this.props.navigation.navigate('RecentTransactionsScreen');
    };

    componentWillMount(){
        if (this.props.recentTransaction.length > 0) {
            let dataToShow = this.props.recentTransaction;
            if (this.state.showMore === false) {
                dataToShow = [this.props.recentTransaction[0]];
                this.setState({ dataToShow })
            }
            else {
                this.setState({ dataToShow });
            }
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.recentTransaction.length > 0) {
            let dataToShow = nextProps.recentTransaction;
            if (this.state.showMore === false) {
                dataToShow = [nextProps.recentTransaction[0]];
                this.setState({ dataToShow })
            }
            else {
                this.setState({ dataToShow });
            }
        }
    }

    renderItem = (data, index) => {
        let { width, height } = Dimensions.get('window');
        return (
            <View key={ data.index } style={{flexDirection:'row',alignItems:'center',marginVertical:12, justifyContent: 'space-between'}}>
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
        );
    };

    _renderDataList = () => {
        if (this.props.APIFlag === true) {
            if (this.state.dataToShow.length > 0) {
                return (
                    <FlatList
                        contentContainerStyle={ styles.list }
                        data={ this.state.dataToShow }
                        renderItem={this.renderItem} 
                        showsVerticalScrollIndicator = {false}
                    />
                );
            }
            else {
                return (<View style={{ padding: 10 }}><Text>No Data To Display</Text></View>);
            }
        }
        return <HomeRecentTransactionLoader />;
    };

    render() {
        return (
            <Card style={{ padding: 0 }}>
                    <View style={ [ styles.headingContainer ] }>
                        <Text style={ [ styles.heading ] }>{Localize.t('TRANSACTION.recent_transactions')}</Text>
                        {/* <Text style={ [ styles.heading ] }>Recent Transactions</Text> */}
                    </View> 
                    { this._renderDataList() }
                    {
                        (this.state.showMore)?
                        <TouchableOpacity onPress={ this.redirectToAllTransactions } style={{paddingHorizontal:12,paddingBottom:12}}>
                            <Text style={styles.viewAllTextStyle}>{Localize.t('MY_PLAN.view_all')}</Text>
                            {/* <Text style={styles.viewAllTextStyle}>View All</Text> */}
                        </TouchableOpacity>:null
                    }
                    {
                        (this.state.dataToShow.length > 0)?
                            <TouchableOpacity style={styles.bottomButton} onPress={()=> this.moreLessHandler()}>
                                {
                                    (!this.state.showMore)?
                                    <View style={styles.bottomButtonWrapper}>
                                        <Text style={styles.viewAllTextStyle}>{Localize.t('COMMON.more')}</Text>
                                        {/* <Text style={styles.viewAllTextStyle}>More</Text> */}
                                        <Image source={ require('./../assets/img/icArrowDown/icArrowDown.png') }/>
                                    </View>:
                                    <View style={styles.bottomButtonWrapper}>
                                        <Text style={styles.viewAllTextStyle}>{Localize.t('COMMON.less')}</Text>
                                        {/* <Text style={styles.viewAllTextStyle}>Less</Text> */}
                                        <Image source={ require('./../assets/img/icArrowUp/icArrowUp.png') }/>
                                    </View>
                                }
                            </TouchableOpacity>:
                            null
                    }
                
            </Card>
        );
    };
};

const styles = StyleSheet.create({
    headingContainer: {
        padding: 12,
        paddingBottom: 0,
    },
    heading: {
        fontFamily: 'sky-text-medium',
        fontSize: 15.3,
        color: config.UI.textDarkGrey,
    },
    list: {
        justifyContent: 'center',
        padding: 12,
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
    viewAllTextStyle: {
        fontFamily: 'sky-text-medium',
        fontSize: 15,
        color: config.UI.textBlue,
        marginRight: 11.3
    },
    bottomButton: {
        flexGrow: 1,
        backgroundColor: config.UI.buttonGrey,
        alignItems:'center',
        overflow: 'hidden',
    },
    bottomButtonWrapper: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = (state) => ({
    recentTransaction: state.homeAPIData.recentTransaction,
    APIFlag: state.homeAPIData.homeAPIFlag
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(recentTransactionsCard);