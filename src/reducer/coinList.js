import * as types from '../actionTypes/index';

const initialState = {
    coinList: [],
    basedCoinsList: [],
    basedCoin: 'USD'
};

export default function coinList(state = initialState, action) {
    switch (action.type) {
        case types.first_load_start:
            return state;
        case types.first_load_success: {
            let {coinList, basedCoinsList, basedCoin} = action;
            return {...state, coinList, basedCoinsList, basedCoin};
        }

        case types.switch_baseCoin_success: {
            let {coinList,basedCoin} = action;
            return {...state, coinList,basedCoin};
        }


        // case types.fetch_Article_start:
        //     return action.coinList;
        //
        // case types.fetch_Article_success:
        //     let old = state.articleList[action.categoryId] || {};
        //     let newOne = {
        //         ...action.data,
        //         contents: (old.contents || []).concat(action.data.contents)
        //     };
        //
        //     return {
        //         ...state,
        //         articleList: {
        //             ...state.articleList,
        //             [action.categoryId]: newOne,
        //         },
        //         loading: false
        //     }
        default:
            return state;

    }
}