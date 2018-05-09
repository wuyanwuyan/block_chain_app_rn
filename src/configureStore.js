import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducers from './reducer';

const rootReducer = combineReducers({
    ...rootReducers,
});

export default function configureStore(initialState = {}) {

    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];
    if (__DEV__) {
        middlewares.push(require('redux-immutable-state-invariant').default(), require('redux-logger').logger);
    }
    const storeEnhancers = compose(
        applyMiddleware(...middlewares)
    );

    let store = createStore(rootReducer, initialState, storeEnhancers);
    store.runSaga = sagaMiddleware.run;
    return store;
}