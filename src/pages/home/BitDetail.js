import React from "react";
import {StyleSheet, Text, View,Dimensions} from "react-native";
import {trendFormat, unitConvert} from "../../utils/formatUtil";
import {Base_color, Black_color, Dark_color, Split_color} from "../../config/constants";

export default class BitDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {
            data: {rate, price, max, min, vol, change_percent},
            bitStaticInfo: {image_url, full_name},
            coin,
            basedCoin
        } = this.props;

        let trendObj = trendFormat(change_percent || 0);

        return (
            <View style={[{backgroundColor: '#EDEDF2'}]}>
                <View style={styles.container}>
                    <View style={styles.detail}>
                        {/*<Image source={{uri: image_url}} style={styles.img}/>*/}
                        <View>
                            <Text style={styles.coinNameA}>{`${coin}`}</Text>
                            <Text style={styles.coinNameB}>{`${full_name || ''}`}</Text>
                        </View>
                    </View>

                    <View style={styles.priceSection}>
                        <Text style={[styles.PriceTop]}>{`￥${unitConvert(price * rate)}`}</Text>
                        <Text
                            style={[styles.PriceBottom]}>{`${unitConvert(price)}${basedCoin}`}</Text>
                    </View>

                    <View>
                        <Text
                            style={[styles.txtTrend, {color: trendObj.color}]} numberOfLines={1}>{trendObj.txt}</Text>
                    </View>

                </View>

                <View style={styles.txtContainer}>
                    <Text style={styles.txt}>{`最高:￥${unitConvert(max * rate)}`}</Text>
                    <Text style={[styles.txt, {alignSelf: 'center'}]}>{`最低:￥${unitConvert(min * rate)}`}</Text>
                    <Text style={styles.txt}>{`交易量:￥${unitConvert(vol * rate)}`}</Text>
                </View>

            </View>

        )
    }
}

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        paddingVertical: 13
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    img: {
        width: 50,
        height: 50,
        marginRight: 8,
        resizeMode: 'contain'
    },
    coinNameA: {
        color: Black_color,
        fontSize: 15
    },
    coinNameB: {
        color: Dark_color,
        fontSize: 13,
        maxWidth: screenWidth * 0.33,
    },
    priceSection: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center'
    },
    PriceTop: {
        color: Base_color,
        fontWeight: 'bold',
        fontSize: 20,
    },
    PriceBottom: {
        color: Dark_color,
        fontSize: 14,
    },
    picker: {
        width: 80,
        height: 28,
        borderWidth: 1,
        borderRadius: 5,
    },
    txtContainer: {
        flexDirection: 'row',
        marginHorizontal: 15,
        paddingVertical: 11,
        justifyContent: 'space-between',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: Split_color
    },
    txt: {
        color: Dark_color,
        fontSize: 12
    },
    txtTrend: {
        color: 'green',
        fontWeight: 'bold',
        fontSize: 14
    },
    red: {
        color: 'red'
    }
})