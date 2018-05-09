import React from "react";
import {InteractionManager, StyleSheet, View} from "react-native";
import BitDetail from "./BitDetail";
import TableHeader from "./components/TableHeader";
import TableHeaderItem from "./components/TableHeaderItem";
import List from "./List";
import cStyles from "../../styles/common";
import {fetchGet} from "../../utils/fetchUtil";
import LoadingView from "../../components/LoadingView";
import {subscribe, unSubscribe, unSubscribeAll} from "../../utils/websocket";
import ToastUtil from "../../utils/ToastUtil";

function sortListData(sortArr, sortKey, order) {
    if (!sortKey || !order) return sortArr;
    sortArr.sort((a, b) => {
        return order === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey];
    });
    return [...sortArr];
}

class ScrollContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailInfo: null,
            listData: [],
            sortKey: 'market_weight',
            order: 'desc',
            bitStaticInfo: {}
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._fetchDataList();
            fetchGet(`/exchange/coin_info/${this.props.coin}`).then(bitStaticInfo => {
                this.setState({bitStaticInfo});
            });
            subscribe(`${this.props.coin}_${this.props.basedCoin}`, this.liveUpdate);
        });
    }

    onEnter = () => {
        subscribe(`${this.props.coin}_${this.props.basedCoin}`, this.liveUpdate);
    }

    onLeave = () => {
        unSubscribeAll(`${this.props.coin}_${this.props.basedCoin}`);
    }

    liveUpdate = (data) => {
        let symbol = `${this.props.coin}_${this.props.basedCoin}`;
        if (data.symbol !== symbol) {
            console.warn('not same!', data, symbol);
            return;
        }

        let {tickers, ...rest} = data;
        let listData = sortListData(tickers, this.state.sortKey, this.state.order);
        this.setState({listData, detailInfo: rest});
    }

    _fetchDataList = (basedCoin = this.props.basedCoin) => {
        return fetchGet('/exchange/tickers', {coin: this.props.coin, based_coin: basedCoin}).then(data => {
            let {tickers, ...rest} = data;
            let listData = sortListData(tickers, this.state.sortKey, this.state.order);
            this.setState({listData, detailInfo: rest});
            return Promise.resolve();
        }).catch((e) => {
            ToastUtil.showShort('网络发生错误，请重试')
        })
    }

    onTabHeader = (sortKey, order) => {
        let listData = sortListData(this.state.listData, sortKey, order);
        this.setState({listData, sortKey, order});
    }

    render() {
        const {coin, basedCoin, navigation} = this.props;
        const {listData, detailInfo, bitStaticInfo} = this.state;

        if (!detailInfo) {
            return <LoadingView />
        }

        return (
            <View style={cStyles.flex1}>
                <BitDetail
                    coin={coin}
                    basedCoin={basedCoin}
                    data={detailInfo}
                    bitStaticInfo={bitStaticInfo}
                />
                <TableHeader onTabHeader={this.onTabHeader}>
                    <TableHeaderItem text="市场" width={0.25} sortKey='market_weight'/>
                    <TableHeaderItem text="价格" width={0.25} sortKey='last_price' sortable/>
                    <TableHeaderItem text="成交24h" width={0.25} sortKey='volume' sortable/>
                    <TableHeaderItem text="波动24h" width={0.25} sortKey='price_change_percent' sortable/>
                </TableHeader>
                <List
                    coin={coin} basedCoin={basedCoin} listData={listData} navigation={navigation}
                    rate={detailInfo.rate}
                    refresh={this._fetchDataList}/>
            </View>
        )
    }

    componentWillUnmount() {
        unSubscribe(`${this.props.coin}_${this.props.basedCoin}`);
    }
}

const styles = StyleSheet.create({});

export default ScrollContent;