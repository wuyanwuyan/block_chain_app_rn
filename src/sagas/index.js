import {fork,all} from 'redux-saga/effects';
import {firstLoad,switchBaseCoin} from './coin';

export default function* rootSaga() {
    yield all([
        fork(firstLoad),
        fork(switchBaseCoin)
    ]);
}