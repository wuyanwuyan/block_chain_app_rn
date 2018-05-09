import React from "react";
import {DeviceEventEmitter, Platform, StyleSheet, View} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view";
import Profile from "../../utils/profile";
import {fetchGet} from "../../utils/fetchUtil";
import CoinEmptyView from "./CoinEmptyView";
import LoadingView from "../../components/LoadingView";
import ScrollContent from "../home/ScrollContent";
import {Base_color, Dark_color} from "../../config/constants";

export default class Concern extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        let params = (navigation.state && navigation.state.params) || {
                onAdd: () => {
                }
            };
        let {onAdd} = params;
        return {
            title: '关注',
            tabBarIcon: ({tintColor}) => (
                <Icon name="heart" size={25} color={tintColor}/>
            ),
            headerLeft: Platform.OS === 'ios' ? null : <View/>,
            headerRight: <MaterialIcons.Button name="add" color='white' size={26} backgroundColor="transparent"
                                               onPress={onAdd}/>
        }
    }

    constructor(props) {
        super(props);
        this.childrenArr = [];
        this.state = {
            favList: null,
        }
    }

    _onAdd = () => {
        if (Profile.get()) {
            this.props.navigation.navigate('SearchCoinBaseCoin', {
                favList: this.state.favList || [],
                callback: this._onAddCallback
            });
        } else {
            this.props.navigation.navigate('LoginRegister', {});
        }
    }

    _onAddCallback = (favList) => {
        this.setState({favList});
    }

    componentDidMount() {
        this.props.navigation.setParams({onAdd: this._onAdd});
        DeviceEventEmitter.addListener('loginChange', (data) => {
            if (data) {
                this._fetchInitData();
            } else {
                this.forceUpdate();
            }
        });

        if (Profile.get()) {
            this._fetchInitData();
        }
    }

    _fetchInitData = () => {
        fetchGet('/favorites').then(data => {
            this.setState({favList: data || []});

        }).catch(e => {

        })
    }

    _onChangeTab = ({i, ref, from}) => {

        if (from !== i) {
            this.childrenArr[from].onLeave();
            this.childrenArr[i].onEnter();
        }

    }

    render() {
        const {favList} = this.state;
        const {navigation} = this.props;

        let profile = Profile.get();
        if (!profile) {
            return <CoinEmptyView onAdd={this._onAdd} isLogin={!!profile}/>
        }

        if (favList === null) {
            return <LoadingView/>;
        }

        let empty = favList.length === 0;
        if (empty) {
            return <CoinEmptyView onAdd={this._onAdd} isLogin={!!profile}/>
        }

        let otherProps = {};
        return (
            <View style={styles.container}>
                {
                    favList.length === 0 ? <LoadingView/> :
                        <ScrollableTabView
                            ref={r => this.tabView = r}
                            renderTabBar={() => <ScrollableTabBar/>}
                            onChangeTab={this._onChangeTab}
                            tabBarBackgroundColor="white"
                            tabBarUnderlineStyle={{backgroundColor: Base_color}}
                            tabBarActiveTextColor={Base_color}
                            tabBarInactiveTextColor={Dark_color}
                            {...otherProps}
                        >
                            {
                                favList.map((v, i) => {
                                        let splitArr = v.split(/[_/]/g);
                                        let coin = splitArr[0];
                                        let basedCoin = splitArr[1];
                                        return (
                                            <ScrollContent
                                                ref={r => this.childrenArr[i] = r}
                                                basedCoin={basedCoin}
                                                navigation={navigation}
                                                coin={coin}
                                                tabLabel={v.replace('_', '/')}
                                                key={v}/>
                                        )
                                    }
                                )
                            }
                        </ScrollableTabView>

                }
            </View>
        )
    }

    componentWillUnmount() {
        // DeviceEventEmitter.removeAllListeners('loginChange');
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});