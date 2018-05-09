import React from "react";
import {Dimensions, FlatList, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import cStyles from "../../styles/common";
import ListEmptyComponent from "../../components/ListEmptyComponent";
import {trendFormat, unitConvert} from "../../utils/formatUtil";
import {Base_color, Dark_color, Split_color} from "../../config/constants";
import ChartPreView from "./components/ChartPreView";

const screenWidth = Dimensions.get('window').width;
let itemWidth = screenWidth * 0.25;

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: Infinity,
            data: [],
            refreshing: false,
            hasMore: true,
            activeMarket: null,
        }
    }

    componentDidMount() {

    }

    refresh = () => {
        this.setState({refreshing: true});
        this.props.refresh().then(() => {
            this.setState({refreshing: false, activeMarket: null})
        })
    }

    loadMore = (info) => {
        if (!this.state.hasMore) return;
    }

    _onPressToggleCharts = (activeMarket) => () => {
        if (activeMarket === this.state.activeMarket)
            activeMarket = null;

        this.setState({activeMarket});
    }

    _renderItem = ({item, index}) => {

        const {market, price_change_percent, volume, last_price} = item;
        const {rate} = this.props;
        let active = this.state.activeMarket === market;

        let trendObj = trendFormat(price_change_percent);

        return (
            <View style={styles.itemContainer}>
                <TouchableHighlight onPress={this._onPressToggleCharts(market)} activeOpacity={1} underlayColor='white'>
                    <View style={styles.itemWrapper}>
                        <View style={styles.txtWrapper}>
                            <Text style={[styles.fullWidTxtCenter, styles.txtMarket]}
                                  adjustsFontSizeToFit numberOfLines={1}>{market}</Text>
                        </View>
                        <View style={styles.txtWrapper}>
                            <Text style={[styles.fullWidTxtCenter, styles.txtPrice]}
                                  adjustsFontSizeToFit
                                  numberOfLines={1}>{`￥${unitConvert(last_price * rate)}`}</Text>
                        </View>
                        <View style={styles.txtWrapper}>
                            <Text style={[styles.fullWidTxtCenter, styles.txtVulume]} adjustsFontSizeToFit
                                  numberOfLines={1}>{`${unitConvert(volume)}`}</Text>
                            <Text style={[styles.fullWidTxtCenter, styles.txtVulume2]} adjustsFontSizeToFit
                                  numberOfLines={1}>{`￥${unitConvert(volume * rate)}`}</Text>
                        </View>
                        <View style={styles.txtWrapper}>
                            <Text
                                style={[styles.fullWidTxtCenter, styles.txtTrend, {color: trendObj.color}]}
                                adjustsFontSizeToFit
                                numberOfLines={1}>{trendObj.txt}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
                {
                    active ? <ChartPreView
                        market={market}
                        coin={this.props.coin}
                        basedCoin={this.props.basedCoin}
                        navigation={this.props.navigation}
                    /> : null
                }
            </View>
        )
    }

    render() {
        const {coin, based_coin, listData} = this.props;
        let {hasMore, refreshing} = this.state;
        hasMore = false;

        let flatListData = listData;

        let isEmpty = false;

        return (
            <View style={cStyles.flex1}>
                <FlatList
                    data={flatListData}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    keyExtractor={(value, index) => value.market}
                    ListEmptyComponent={ isEmpty ? ListEmptyComponent : null}
                    refreshing={refreshing}
                    onRefresh={this.refresh}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.0001}  // 有坑，这个数值
                    ListFooterComponent={null}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        borderColor: Split_color,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    itemWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    txtWrapper: {
        width: itemWidth,
        flex: 1,
        justifyContent: 'center',
    },
    txtMarket: {
        color: Dark_color,
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'center',
    },
    txtPrice: {
        color: Base_color,
        fontWeight: 'bold',
        textAlign: 'right',
        paddingRight: 8,
        fontSize: 15,
    },
    txtVulume: {
        color: Dark_color,
        textAlign: 'right',
        paddingRight: 8,
        fontSize: 13,
    },
    txtVulume2: {
        textAlign: 'right',
        paddingRight: 8,
        fontSize: 11,
    },
    txtTrend: {
        color: 'green',
        fontWeight: 'bold',
        textAlign: 'right',
        paddingRight: screenWidth / 375 * 20,
        fontSize: 13,
    },
    fullWidTxtCenter: {
        width: '100%',
        flex: 1,
        textAlignVertical: 'center'
    },
    red: {
        color: 'red'
    }
})