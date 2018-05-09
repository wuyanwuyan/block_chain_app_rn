// 保存用户的基本信息
import store from "react-native-simple-store";
import {DeviceEventEmitter} from "react-native";
import {fetchGet} from "./fetchUtil";


let userInfo = null;
store.get('userInfo').then((data) => {
    userInfo = data;
    console.info('login ????  ', userInfo);
    if (userInfo) {
        fetchGet('/user/verify_token').then(data => {
        }, data => {
        })
    }
})

function get() {
    return userInfo;
}

function login(data) {
    userInfo = data;
    store.update('userInfo', data);
    DeviceEventEmitter.emit('loginChange', data);
}

function logout() {
    userInfo = null;
    store.delete('userInfo');
    DeviceEventEmitter.emit('loginChange', null);
}

export default {
    get, login, logout
}