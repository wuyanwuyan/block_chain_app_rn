import React, {Component} from "react";
import {BackHandler, Platform} from "react-native";
import {connect} from "react-redux";
import {addNavigationHelpers, DrawerNavigator, NavigationActions, StackNavigator, TabNavigator} from "react-navigation";
import Splash from "./pages/Splash";
import Home from "./pages/home";
import Concern from "./pages/concern";
import Mine from "./pages/mine";
import LoginRegister from "./pages/LoginRegister/index";
import WebViewPage from "./pages/webView/index";
import SearchCoin from "./pages/SearchCoin";
import SearchCoinBaseCoin from "./pages/SearchCoinBaseCoin";
import ResetPassword from "./pages/LoginRegister/ResetPassword";
import MyInfo from "./pages/MyInfo";
import AddWechatGroup from "./pages/AddWechatGroup";
import AboutThisApp from "./pages/AboutThisApp";
import ToastUtil from "./utils/ToastUtil";

import DrawerContainer from "./Containers/DrawerContainer";
import FullScreenCharts from "./pages/fullScreenCharts";
import ChartWebView from "./pages/fullScreenCharts/ChartWebView";
import RNExitApp from "react-native-exit-app";
import {Base_color, Dark_color} from "./config/constants";
import getSlideFromRightTransition from "./utils/react-navigation-slide-from-right-transition";

//安卓 ios差异
let stylePlatform = Platform.OS === 'ios' ? {
    height: 46
} : {};

const Tab = TabNavigator(
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
            labelStyle: Platform.OS === 'ios' ? {paddingBottom:2} : {
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

//再包裹一层StackNavigator，是因为我需要StackNavigator的header，https://reactnavigation.org/docs/intro/headers
const DrawHome = StackNavigator(
    {
        DrawHome: {
            screen: Tab
        }
    },
    {
        navigationOptions: {
            headerStyle: {
                backgroundColor: 'rgb(0,82,156)'
            },
            headerTitleStyle: {
                color: 'white',
                fontSize: 20
            },
            headerTintColor: 'white'
        }
    }
);

const DrawerNav = DrawerNavigator({
    DrawerNav: {
        screen: DrawHome
    }
}, {
    drawerWidth: 300,
    contentComponent: (props) => <DrawerContainer {...props} />
})

//安卓上实现从右到左滑动
const App = StackNavigator(
    {
        Splash: {screen: Splash},
        Home: {
            screen: Tab,
            // navigationOptions: { // 避免StackNavigator添加两个header，这里设置为空
            //     header: null,
            // }
        },
        WebViewPage: {
            screen: WebViewPage
        },
        FullScreenCharts: {
            screen: FullScreenCharts
        },
        ChartWebView: {
            screen: ChartWebView
        },
        SearchCoin: {
            screen: SearchCoin
        },
        SearchCoinBaseCoin: {
            screen: SearchCoinBaseCoin
        },
        LoginRegister: {
            screen: LoginRegister
        },
        MyInfo: {
            screen: MyInfo
        },
        ResetPassword: {
            screen: ResetPassword
        },
        AddWechatGroup: {
            screen: AddWechatGroup
        },
        AboutThisApp: {
            screen: AboutThisApp
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


class AppWithRedux extends Component {
    constructor(props) {
        super(...arguments);
        this.lastBackPressed = null;
    }

    // https://github.com/react-community/react-navigation/issues/117
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress = () => {
        const {dispatch, nav} = this.props;
        if (nav.index === 0) {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                BackHandler.exitApp();
                RNExitApp.exitApp();
                return false;
            }
            this.lastBackPressed = Date.now();
            ToastUtil.showShort('再按一次退出应用');
            return true;
        } else {
            dispatch(NavigationActions.back());
            return true;
        }
    };

    render() {
        const {dispatch, nav} = this.props;
        const navigation = addNavigationHelpers({
            dispatch,
            state: nav
        })

        return <App navigation={navigation}/>

    }
}

const mapStateToProps = state => ({nav: state.nav});
export default connect(mapStateToProps)(AppWithRedux);
export {App};
