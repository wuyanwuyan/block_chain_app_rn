import React from 'react';
import {
    View,
    Text,
    FlatList,
    Platform,
    TouchableOpacity,
    TouchableNativeFeedback,
    StyleSheet,
    Dimensions,
    processColor,
    PixelRatio
} from 'react-native';
import {CandleStickChart} from 'react-native-charts-wrapper';
// import {Dark_color} from '../../../config/constants';
import {fetchGet} from '../../../utils/fetchUtil';
import LoadingView from '../../../components/LoadingView';
import moment from 'moment';
import update from 'immutability-helper';
import ToastUtil from '../../../utils/ToastUtil';
import {serialize} from '../../../utils/fetchUtil';

const timeData = [
    {label: '1分', value: 1},
    {label: '15分', value: 15},
    {label: '1小时', value: 60},
    {label: '1天', value: 60 * 24},
    {label: '1周', value: 60 * 24 * 7},
]

export default class ChartPreView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            noData: false,

            interval: '',
            timeDataArr: [],


            data: {
                dataSets: [{
                    values: [],
                    label: '',
                    config: {
                        drawValues: false,
                        highlightEnabled: false,
                        shadowColor: processColor('black'),
                        shadowWidth: 1,
                        shadowColorSameAsCandle: true,
                        increasingColor: processColor('#71BD6A'),
                        increasingPaintStyle: 'fill',
                        decreasingColor: processColor('#D14B5A')
                    }
                }],
            },

            xAxis: {
                drawLabels: true,
                drawGridLines: true,
                gridColor: processColor('#e6e6e6'),
                position: 'BOTTOM',
                valueFormatter: [],
                // valueFormatterPattern: 'HH:mm',
                avoidFirstLastClipping: true,
                labelCount: 6,
            },
            yAxis: {
                left: {
                    gridColor: processColor('#e6e6e6'),
                },
                right: {
                    enabled: false
                }
            },
        };
    }

    componentDidMount() {
        this._fetchChartData();
    }

    _fetchChartData = () => {
        const {market, coin, basedCoin} = this.props;

        if (this.state.interval) {

            fetchGet('/exchange/kline', {
                market,
                symbol: `${coin}_${basedCoin}`,
                interval: this.state.interval
            }).then((kData) => {
                return this._dealData(kData)
            }).catch((e) => {
                console.log('e  ', e);
                this.setState({noData: true});
                ToastUtil.showShort('网络错误');
            });
            return;
        }

        fetchGet('/exchange/exists_kline', {market}).then(isExist => {
            return isExist ? fetchGet(`/exchange/kline_interval/${decodeURIComponent(market)}`) : Promise.reject();
        }).then(timeData => {
            let timeDataArr = timeData.slice(0, 5);
            let interval = timeDataArr[0];

            this.setState({timeDataArr, interval});


            return fetchGet('/exchange/kline', {
                market,
                symbol: `${coin}_${basedCoin}`,
                interval: interval
            })

        }).then((kData) => {
            return this._dealData(kData)
        }).catch((e) => {
            console.log('e  ', e);
            this.setState({noData: true});
            ToastUtil.showShort('不存在K线图');
        });
    }


    _dealData = (kData) => {
        let {data, xAxis} = this.state;

        let valueFormatter = [];

        kData = kData.slice(0,100);

        let newDataArr = kData.map(v => {
            valueFormatter.push(moment(v.timestamp).format('HH:mm'));
            return {
                date: v.timestamp,
                shadowH: v.high,
                shadowL: v.low,
                open: v.open,
                close: v.close,
            }
        })

        xAxis = {...xAxis, valueFormatter};

        // data.dataSets[0].values = newDataArr;
        let newData = update(data, {
            dataSets: [
                {
                    $merge: {
                        values: newDataArr
                    }
                }
            ]

        })

        this.setState({loading: false, data: newData, xAxis});

    }

    componentWillUnmount() {

    }

    handleSelect = (event) => {

        return;

        const {market, coin, basedCoin} = this.props;
        let query = {
            market,
            symbol: `${coin}_${basedCoin}`
        }
        this.props.navigation.navigate('ChartWebView', {url: `http://121.41.91.93:8088?${serialize(query)}`});
    }

    handleTimeSelect = (interval) => () => {
        this.setState({interval}, () => {
            this._fetchChartData();
        })
    }

    render() {
        const {loading, timeDataArr, interval} = this.state;
        const chartProps = {}
        return (
            <View style={styles.container}>
                <View style={styles.timeContainer}>
                    {
                        timeDataArr.map((v, i) =>
                            <TouchableOpacity
                                style={[styles.timeItem, v === interval ? styles.timeItemActive : null]}
                                key={v} onPress={this.handleTimeSelect(v)}>
                                <Text style={styles.timeTxt}>{v}</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
                <View style={styles.chartContainer}>
                    {loading ? <LoadingView size="small" noText/> :
                        <CandleStickChart
                            style={styles.chart}
                            data={this.state.data}
                            scaleEnabled={false}
                            dragEnabled={false}
                            doubleTapToZoomEnabled={false}
                            chartDescription={{text: ''}}
                            legend={{enabled: false}}
                            xAxis={this.state.xAxis}
                            yAxis={this.state.yAxis}
                            maxVisibleValueCount={32}
                            autoScaleMinMaxEnabled={false}
                            // zoom={{scaleX: 2, scaleY: 1, xValue:  400000, yValue: 1}}
                            zoom={{scaleX: 1, scaleY: 1, xValue: 1, yValue: 1, axisDependency: 'LEFT'}}
                            onSelect={this.handleSelect}
                            {...chartProps}
                        />}
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        // height: 160,
        backgroundColor: '#EDEDF2',
    },
    chartContainer: {
        height: 100,
        marginBottom: 4
    },
    chart: {
        flex: 1,
    },
    timeContainer: {
        marginTop: 6,
        marginHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    timeTxt: {
        fontSize: 12,
    },
    timeItem: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'transparent',
    },
    timeItemActive: {
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
    }
});
