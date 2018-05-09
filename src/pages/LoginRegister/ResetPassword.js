import React from "react";
import {Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import mStyles from "./style";
import NextBtn from "./components/NextBtn";
import ToastUtil from "../../utils/ToastUtil";
import {fetchPost} from "../../utils/fetchUtil";
import Profile from "../../utils/profile";
import server from "../../config/server";
import {Base_color, Phone_reg} from "../../config/constants";

let isFetchingSMS_code = false;
export default class ResetPassword extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            title: '修改密码',
            headerBackTitle: null,
            headerBackTitleStyle: {
                color: Base_color
            },
            headerRight: Platform.OS === 'ios' ? null : <View/>,
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            password: '',
            passwordAgain: '',
            captcha: '',
            sms_code: '',
            captcha_url: '',
            countDown: 0,
        }
    }

    _onChangeText = (type) => (value) => {
        this.setState({[type]: value});
        if (type === 'phone') {
            if (Phone_reg.test(value)) {
                this.setState({
                    captcha_url: `${server.backend}/user/captcha/${decodeURIComponent(value)}?noCache=${Date.now()}`,
                    captcha: ''
                });

            } else {
                this.setState({captcha_url: ''});
            }
        }
    }

    _renewCaptha = () => {
        this.setState({
            captcha_url: `${server.backend}/user/captcha/${decodeURIComponent(this.state.phone)}?noCache=${Date.now()}`,
            captcha: ''
        });
    }

    timeKey = null;
    _getCacha = () => {
        if (isFetchingSMS_code) return;

        const {phone, captcha, countDown} = this.state;
        if (!phone) {
            ToastUtil.showShort('请填写手机号');
            return;
        }
        if (!captcha) {
            ToastUtil.showShort('请填写图形验证码');
            return;
        }

        // 防止快速点两下，发两次请求
        isFetchingSMS_code = true;
        fetchPost('/user/sms_code', {phone, captcha, spec: 'resetpwd'}).then(data => {
            isFetchingSMS_code = false;
            if (data.code != 200) {
                ToastUtil.showShort(data.message);
                return;
            }

            this.setState({countDown: 60});
            this.timeKey = setInterval(() => {
                let newCountDown = this.state.countDown - 1;
                this.setState({countDown: newCountDown});
                if (newCountDown <= 0) {
                    clearInterval(this.timeKey);
                }
            }, 1000);
        })
    }

    _resetPassword = () => {
        const {phone, captcha, password, passwordAgain, sms_code} = this.state;

        if (!phone || !captcha || !sms_code || !password || !passwordAgain) {
            ToastUtil.showShort('内容填写不完整');
            return;
        }

        if (!Phone_reg.test(phone)) {
            ToastUtil.showShort('手机格式错误，请重新输入');
            return;
        }

        if (password !== passwordAgain) {
            ToastUtil.showShort('两次输入的密码不一致');
            return
        }

        fetchPost('/user/reset_pwd', {phone, pwd: password, sms_code}).then(data => {
            console.log('%c reset_pwd data:  ' + data, 'color: green');
            if (data.code !== 200) {
                ToastUtil.showShort(data.message);
                return;
            }
            ToastUtil.showShort(data.message);
            Profile.login(data.data);
            this.props.navigation.goBack();
            this.props.navigation.state.params.callback();
        });
    }

    componentWillUnmount() {
        this.timeKey && clearInterval(this.timeKey);
    }

    render() {
        const {phone, password, passwordAgain, captcha, sms_code, captcha_url, countDown} = this.state;

        return (
            <ScrollView
                style={styles.container}
                keyboardShouldPersistTaps='handled'
            >
                <TextInput
                    value={phone}
                    style={[mStyles.input, {marginTop: 16}]}
                    keyboardType="numeric"
                    placeholder="请输入手机号"
                    placeholderTextColor="#aaaaaa"
                    underlineColorAndroid="transparent"
                    maxLength={20}
                    onChangeText={this._onChangeText('phone')}
                />
                {
                    captcha_url ?
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16,}}>
                            <TextInput
                                value={captcha}
                                style={[mStyles.input, {marginRight: 10, flex: 1}]}
                                placeholder="请输入图形验证码"
                                placeholderTextColor="#aaaaaa"
                                underlineColorAndroid="transparent"
                                maxLength={6}
                                onChangeText={this._onChangeText('captcha')}
                            />
                            <TouchableOpacity onPress={this._renewCaptha} activeOpacity={0.7}>
                                <Image source={{uri: captcha_url}} style={styles.imgCaptcha}></Image>
                            </TouchableOpacity>
                        </View> : null
                }

                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
                    <TextInput
                        value={sms_code}
                        style={[mStyles.input, {width: '100%'}]}
                        keyboardType="numeric"
                        placeholder="请输入短信验证码"
                        placeholderTextColor="#aaaaaa"
                        underlineColorAndroid="transparent"
                        maxLength={8}
                        onChangeText={this._onChangeText('sms_code')}
                    />
                    {countDown <= 0 ? <TouchableOpacity onPress={this._getCacha} style={styles.getCaptcha}>
                        <Text>获取短信验证码</Text>
                    </TouchableOpacity> :
                        <View style={styles.getCaptcha}><Text
                            style={{color: 'gray'}}>{`${countDown}秒后重新发送`}</Text></View>
                    }
                </View>


                <TextInput
                    value={password}
                    style={[mStyles.input, {marginTop: 16}]}
                    secureTextEntry={true}
                    placeholder="请输入新密码"
                    placeholderTextColor="#aaaaaa"
                    underlineColorAndroid="transparent"
                    maxLength={20}
                    onChangeText={this._onChangeText('password')}
                />
                <TextInput
                    value={passwordAgain}
                    style={[mStyles.input, {marginTop: 16}]}
                    secureTextEntry={true}
                    placeholder="请再次输入新密码"
                    placeholderTextColor="#aaaaaa"
                    underlineColorAndroid="transparent"
                    maxLength={20}
                    onChangeText={this._onChangeText('passwordAgain')}
                />
                <View style={mStyles.nextBtnContainer}>
                    <NextBtn onPress={this._resetPassword}/>
                </View>

            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
    },

    imgCaptcha: {
        width: 80,
        height: 48,
        resizeMode: 'stretch'
    },
    getCaptcha: {
        position: 'absolute',
        right: 10,
        height: '100%',
        justifyContent: 'center',

    }
});