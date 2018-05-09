import {all, call, put, take} from "redux-saga/effects";
import * as types from "../actionTypes";
import store from "react-native-simple-store";
import ToastUtil from "../utils/ToastUtil";
import {fetchGet} from "../utils/fetchUtil";

export function* firstLoad() {
    try {
        yield take(types.first_load_start);
        let basedCoin = yield call(store.get, 'basedCoin');
        basedCoin = basedCoin || 'USD';
        let {coinList, basedCoinsList} = yield all({
            coinList: call(fetchGet, `/exchange/coinlist/${basedCoin}`),
            basedCoinsList: call(fetchGet, '/exchange/based_coins')
        });

        yield put({type: types.first_load_success, coinList, basedCoinsList, basedCoin});
    } catch (e) {
        yield ToastUtil.showShort('网络发生错误，请重试');
    }
}

export function* switchBaseCoin() {
    while (true) {
        try {
            let {basedCoin} = yield take(types.switch_baseCoin_start);
            let {coinList} = yield all({
                coinList: call(fetchGet, `/exchange/coinlist/${basedCoin}`)
            });
            yield put({type: types.switch_baseCoin_success, coinList, basedCoin});
        } catch (e) {
            yield ToastUtil.showShort('网络发生错误，请重试');
        }
    }
}