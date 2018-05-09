import React from "react";
import {DeviceEventEmitter, Image, Share, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Profile from "../../utils/profile";
import {Base_color, Split_color} from "../../config/constants";
import cStyles from "../../styles/common";
import DeviceInfo from "react-native-device-info";

export default class Mine extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            title: '我的',
            tabBarIcon: ({tintColor}) => (
                <Icon name="account" size={25} color={tintColor}/>
            )
        }
    }

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        DeviceEventEmitter.addListener('loginChange', (data) => {
            this.forceUpdate();
        });
    }

    _login = () => {
        if (Profile.get()) {
            this.props.navigation.navigate('MyInfo');
            return;
        }
        this.props.navigation.navigate('LoginRegister');
    }

    _addWechartGroup = () => {
        this.props.navigation.navigate('AddWechatGroup');
    }

    _aboutThisApp = () => {
        this.props.navigation.navigate('AboutThisApp');
    }

    _shareMessage() {
        Share.share({
            message: '分享CQcoin区块链大数据资讯平台，下载地址：cqcoin.info',
            url: 'http://cqcoin.info/',
            title: 'CQcoin'
        }).catch((error) => {
            console.log(error)
        });
    }

    // _showResult(result) {
    //     console.log('restttt ',result);
    //     if (result.action === Share.sharedAction) {
    //         if (result.activityType) {
    //             this.setState({result: 'shared with an activityType: ' + result.activityType});
    //         } else {
    //             this.setState({result: 'shared'});
    //         }
    //     } else if (result.action === Share.dismissedAction) {
    //         this.setState({result: 'dismissed'});
    //     }
    // }

    componentWillUnmount() {
        // DeviceEventEmitter.removeAllListeners('loginChange');
    }

    render() {
        let profile = Profile.get();
        let appVersion = DeviceInfo.getVersion();

        return (
            <View style={styles.container}>
                <TouchableOpacity style={{alignItems: 'center', marginTop: 50}} onPress={this._login}
                                  activeOpacity={0.8}>
                    <Image source={require('../../assets/head.png')} style={styles.avater}></Image>
                    {
                        profile ?
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Text>{profile.user.phone}</Text>
                            </View> :
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Text>登录 |</Text>
                                <Text style={{color: Base_color}}> 注册</Text>
                            </View>
                    }
                </TouchableOpacity>
                <View style={styles.sectionContainer}>
                    <TouchableOpacity onPress={this._addWechartGroup} activeOpacity={0.8}>
                        <View style={styles.section}>
                            <Text>加微信群</Text>
                            <Ionicons name='ios-arrow-forward' size={20}/>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this._shareMessage} activeOpacity={0.8}>
                        <View style={styles.section}>
                            <Text>分享CQcoin</Text>
                            <Ionicons name='ios-arrow-forward' size={20}/>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={this._aboutThisApp} activeOpacity={0.8}>
                        <View style={[styles.section, styles.noBorder]}>
                            <Text>关于CQcoin</Text>
                            <View style={[cStyles.flexDirectionRow, cStyles.center]}>
                                <Text>{`V${appVersion} `}</Text>
                                <Ionicons name='ios-arrow-forward' size={20}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avater: {
        width: 74,
        height: 74,
        resizeMode: 'stretch'
    },
    cqcoin: {
        fontSize: 48,
        color: 'black',
        textAlign: 'center',
    },
    sectionContainer: {
        marginTop: 32,
        marginHorizontal: 15,

        borderRadius: 10,

        shadowColor: '#999999',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.5,
        elevation: 2,
    },
    section: {
        paddingHorizontal: 16,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: Split_color,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    noBorder: {
        borderBottomWidth: 0,
    }
})