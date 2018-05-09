import React from "react";
import {StyleSheet, Text, TouchableHighlight, View,Image,Clipboard,Platform} from "react-native";
import {Base_color, Dark_color} from "../config/constants";
import ToastUtil from "../utils/ToastUtil";

export default class AddWechatGroup extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            title: '加微信群',
            headerBackTitle: null,
            headerBackTitleStyle: {
                color: Base_color
            },
            headerRight:Platform.OS === 'ios' ? null:<View/>,
        }
    }

    constructor(props) {
        super(props);
        this.state = {};
        this.wetchatId = 'CQ_blockchain';
    }

    _copyWechatNum = async () => {
        await Clipboard.setString(this.wetchatId);
        ToastUtil.showShort('已复制到剪切板');
    };

    render() {
        return (
            <View style={[styles.container]}>
                <Text style={{fontSize: 14, width: 260, lineHeight: 20, color: Dark_color}}>诚挚的邀请您加入CQcoin微信群给我们您的意见与建议，帮助我们改进产品。这里有志同道合，同进同退的小伙伴！</Text>
                <Image source={require('../assets/qrcode.png')} style={styles.qrCodeImg}/>
                <Text style={{fontSize: 14,color:Base_color,marginTop:10}}>扫描二维码，加我微信</Text>
                <TouchableHighlight style={styles.copyWechatBtn} onPress={this._copyWechatNum} activeOpacity={0.8} underlayColor={Base_color}>
                    <Text style={{color: 'white', fontSize: 16}}>{`加群请先加微信:${this.wetchatId}`}</Text>
                </TouchableHighlight>
                <Text style={{fontSize: 14, color: Base_color, marginTop: 8}}>验证信息填写：CQ</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop:60,
    },
    qrCodeImg:{
        marginTop:20,
        width:160,
        height:160,
        resizeMode:'stretch',
    },
    copyWechatBtn: {
        marginTop: 40,
        width: 290,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: Base_color,
    }

});
