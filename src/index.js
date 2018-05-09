/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import 'es6-symbol/implement';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import RootView from "./RootView";
import configureStore from './configureStore';

import rootSaga from './sagas';

import './utils/profile';

let store = configureStore({});
store.runSaga(rootSaga);

export default () => (
    <Provider store={store}>
      <RootView/>
    </Provider>
)



