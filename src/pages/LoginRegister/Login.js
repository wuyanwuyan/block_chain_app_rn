import React from "react";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import mStyles from "./style";
import NextBtn from "./components/NextBtn";
import {fetchPost} from "../../utils/fetchUtil";
import Profile from "../../utils/profile";
import ToastUtil from "../../utils/ToastUtil";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            password: ''
        }
    }

    _onChangeText = (type) => (value) => {
        this.setState({[type]: value});
    }

    _login = () => {
        const {phone, password} = this.state;
        if (!phone || !password) {
            return;
        }
        fetchPost('/user/login/phone', {phone, pwd: password}).then(data => {

            console.log('login data: ', data);

            if (data.code !== 200) {
                ToastUtil.showShort(data.message);
                return;
            }
            ToastUtil.showShort(data.message);
            Profile.login(data.data);
            this.props.navigation.goBack();
        })
    }

    _resetPassword = () => {
        this.props.navigation.navigate('ResetPassword', {callback: this._resetPasswordSuccess});
    }

    _resetPasswordSuccess = () => {
        this.props.navigation.goBack();
    }

    render() {
        const {phone, password} = this.state;

        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={{flex:1,justifyContent: 'space-between'}}
                keyboardShouldPersistTaps="handled">
                <View>
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
                    <TextInput
                        value={password}
                        style={[mStyles.input, {marginTop: 16}]}
                        secureTextEntry={true}
                        placeholder="请输入密码"
                        placeholderTextColor="#aaaaaa"
                        underlineColorAndroid="transparent"
                        maxLength={20}
                        onChangeText={this._onChangeText('password')}
                    />
                    <View style={mStyles.nextBtnContainer}>
                        <NextBtn onPress={this._login}/>
                    </View>

                </View>
                <TouchableOpacity onPress={this._resetPassword} activeOpacity={0.8} style={{marginBottom: 30}}>
                    <Text style={{color: '#00529C', textAlign: 'center'}}>忘记密码?</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
    }

});