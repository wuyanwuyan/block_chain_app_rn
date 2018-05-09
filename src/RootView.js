import React, {Component} from "react";
import {BackHandler, Platform} from "react-native";
import {connect} from "react-redux";
import {createStackNavigator, createBottomTabNavigator, StackNavigator, TabNavigator} from "react-navigation";
import Splash from "./pages/Splash";
import Home from "./pages/home";
import Concern from "./pages/concern";
import Mine from "./pages/mine";
import ToastUtil from "./utils/ToastUtil";

import RNExitApp from "react-native-exit-app";
import {Base_color, Dark_color} from "./config/constants";
import getSlideFromRightTransition from "./utils/react-navigation-slide-from-right-transition";

//安卓 ios差异
let stylePlatform = Platform.OS === 'ios' ? {
    height: 46
} : {};

const Tab = createBottomTabNavigator(
    {
        index: {
            screen: Home
        },
        // index2: {
        //     screen: Content
        // },
        index2: {
            screen: Concern
        },
        index3: {
            screen: Mine
        }
    },
    {
        lazy: true,
        tabBarPosition: 'bottom',
        swipeEnabled: true,
        animationEnabled: true,
        tabBarOptions: {
            activeTintColor: Base_color,
            inactiveTintColor: Dark_color,
            showIcon: true,
            style: {
                ...stylePlatform,
                backgroundColor: 'white'
            },
            labelStyle: Platform.OS === 'ios' ? {paddingBottom: 2} : {
                marginTop: 0,
                marginBottom: 2,
                fontSize: 10,
            },
            indicatorStyle: {
                height: 0,
                opacity: 0
            },
            tabStyle: Platform.OS === 'ios' ? {} : {
                paddingTop: 2,
                paddingBottom: 0,
            }
        },
    });

//安卓上实现从右到左滑动
const App = createStackNavigator(
    {
        Splash: {screen: Splash},
        Home: {
            screen: Tab,
            // navigationOptions: { // 避免StackNavigator添加两个header，这里设置为空
            //     header: null,
            // }
        }
    },
    {
        headerMode: 'screen',
        navigationOptions: {
            headerStyle: {
                backgroundColor: Base_color
            },
            headerTitleStyle: {
                color: '#fff',
                ...Platform.select({
                    ios: null,
                    android: {
                        textAlign: 'center',
                        alignSelf: 'center',
                    }
                }),
            },
            headerTintColor: '#fff',
        },
        cardStyle: {
            backgroundColor: '#fff',
        },
        transitionConfig: Platform.OS === 'ios' ? null : getSlideFromRightTransition
    });

export default App;
