import * as types from '../actionTypes';

export function firstLoad() {
    return {
        type: types.first_load_start,
    }
}

export function switchBasedCoin(basedCoin='BTC') {
    return {
        type: types.switch_baseCoin_start,
        basedCoin,
    }
}


export function fetchCoinData(coin,based_coin='BTC') {
    return {
        type: types.fetch_CoinData_start,
        coin,
        based_coin,
    }
}