import React from "react";
import {InteractionManager, Platform, StyleSheet, Text, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view";
import cStyles from "../../styles/common";
import LoadingView from "../../components/LoadingView";
import ScrollContent from "./ScrollContent";
import CodePush from "react-native-code-push";
import Modal from "react-native-modal";
import ProgressBar from "../../components/ProgressBar";
import {Base_color, Dark_color} from "../../config/constants";
import ModalDropdown from "react-native-modal-dropdown";
import store from "react-native-simple-store";
import Ionicons from "react-native-vector-icons/Ionicons";
import {fetchGet} from "../../utils/fetchUtil";
import {checkUpdate} from "../../utils/checkUpdateUtil";
import DeviceInfo from "react-native-device-info";

class Home extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        let params = (navigation.state && navigation.state.params) || {basedCoinsList: [], basedCoin: 'USD'};
        const {basedCoinsList, _onSelectBasedCoin, basedCoin, _searchCoin} = params;
        return {
            title: '行情',
            tabBarIcon: ({tintColor}) => (
                <Icon name="chart-areaspline" size={25} color={tintColor}/>
            ),
            headerLeft: <Ionicons.Button name="ios-search" iconStyle={{marginLeft: 4}} backgroundColor="transparent"
                                         size={24} color="white" onPress={_searchCoin}/>,
            headerRight: <ModalDropdown
                dropdownStyle={{width: 90, height: 'auto'}}
                dropdownTextStyle={{textAlign: 'center', fontSize: 14}}
                options={basedCoinsList}
                onSelect={_onSelectBasedCoin}>
                <View style={styles.dropDownInner}>
                    <Text style={{color: 'white', marginRight: 4, fontSize: 18}}>{basedCoin}</Text>
                    <Ionicons name="md-arrow-dropdown" size={14} color="white"/>
                </View>
            </ModalDropdown>
        }
    }

    constructor(props) {
        super(props);
        this.childrenArr = [];
        this.lastSelectCoin = null;
        this.state = {
            modalOpen: false,
            showDownloading: false,
            showInstalling: false,
            downloadProgress: 0,
            basedCoin: 'USD',
            basedCoinsList: [],
            coinList: [],
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {

            if (Platform.OS !== 'ios') { // 只对安卓热更新 react-native-code-push
                this.codePushUpdate();
                // 安卓正式版检测更新
                if(!__DEV__ && DeviceInfo.getBundleId().indexOf('releaseStaging') === -1){
                    checkUpdate();
                }
            }

            let basedCoin = 'USD';
            Promise.all([store.get('basedCoin'), store.get('lastSelectCoin')]).then(([data, data2]) => {
                basedCoin = data || 'USD';
                this.lastSelectCoin = data2;
                return basedCoin;
            }).then((basedCoin) => {
                return Promise.all([fetchGet(`/exchange/coinlist/${basedCoin}`), fetchGet(`/exchange/based_coins`)]);
            }).then(([coinList, basedCoinsList]) => {
                this.props.navigation.setParams({
                    basedCoin,
                    _onSelectBasedCoin: this._onSelectBasedCoin,
                    _searchCoin: this._searchCoin,
                    basedCoinsList
                });

                this.setState({
                    basedCoin,
                    basedCoinsList,
                    coinList,
                });

            })
        })
    }


    _onSelectBasedCoin = (index, basedCoin) => {
        if (basedCoin === this.state.basedCoin)
            return;

        this.props.navigation.setParams({basedCoin});
        this.setState({coinList: []});
        fetchGet(`/exchange/coinlist/${basedCoin}`).then(coinList => {
            this.setState({basedCoin, coinList});
            store.update('basedCoin', basedCoin);
        })
    }

    _searchCoin = () => {
        this.props.navigation.navigate('SearchCoin', {
            coinList: this.state.coinList,
            callback: this._onSearchChooseCoin
        });
    }

    _onSearchChooseCoin = (value) => {
        if (value === this.lastSelectCoin) return;
        let initialPage = this.state.coinList.indexOf(value);
        if (initialPage === -1)
            return;
        this.tabView.goToPage(initialPage);
    }

    // #issue https://github.com/skv-headless/react-native-scrollable-tab-view/issues/126
    codePushUpdate = () => {
        // CodePush.checkForUpdate()

        // 先行版本
        if (DeviceInfo.getBundleId().indexOf('releaseStaging') !== -1) {
            CodePush.sync({
                installMode: CodePush.InstallMode.IMMEDIATE,
                mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESUME,
                updateDialog: {
                    title: '更新提示',
                    optionalIgnoreButtonLabel: '稍后',
                    optionalInstallButtonLabel: '立即更新',
                    optionalUpdateMessage: 'App有新版本了，是否更新？',
                    mandatoryContinueButtonLabel: '确定',
                    mandatoryUpdateMessage: 'App有新版本了，立即更新。',
                },
            }, (status) => {
                switch (status) {
                    case CodePush.SyncStatus.DOWNLOADING_PACKAGE:  // 下载中
                        this.setState({modalOpen: true, showDownloading: true, showInstalling: false});
                        break;
                    case CodePush.SyncStatus.INSTALLING_UPDATE: // 安装中
                        this.setState({showDownloading: false, showInstalling: true});
                        break;
                    case CodePush.SyncStatus.UPDATE_INSTALLED: //安装成功
                        this.setState({modalOpen: false, showDownloading: false, showInstalling: false});
                        break;
                    case CodePush.SyncStatus.UNKNOWN_ERROR:
                        this.setState({modalOpen: false});
                        break;
                    default:
                        break;
                }
            }, ({receivedBytes, totalBytes}) => {
                this.setState({downloadProgress: receivedBytes / totalBytes * 100});
            });
        } else {
            // 正式版本
            CodePush.sync({
                installMode: CodePush.InstallMode.ON_NEXT_RESTART,
                mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESTART,
            });
        }
    };

    _onChangeTab = ({i, ref, from}) => {
        this.lastSelectCoin = ref.props.coin;
        store.update('lastSelectCoin', ref.props.coin);

        if (from !== i) {
            this.childrenArr[from].onLeave();
            this.childrenArr[i].onEnter();
        }

    }

    render() {
        const {navigation} = this.props;
        const {modalOpen, showDownloading, showInstalling, downloadProgress, basedCoin, coinList} = this.state;

        let otherProps = {};

        let initialPage = 0;
        if (this.lastSelectCoin) {
            initialPage = coinList.indexOf(this.lastSelectCoin);
            if (initialPage === -1) initialPage = 0;
        }
        otherProps.initialPage = initialPage;

        return (
            <View style={cStyles.flex1}>
                <Modal isVisible={modalOpen} animationInTiming={100}>
                    <View style={styles.modalContent}>
                        <Text style={{textAlign: 'center'}}>{showInstalling ? '安装中' : '下载中'}</Text>
                        {showInstalling ? null : <ProgressBar width="100%" progress={downloadProgress} color="blue"/>}
                    </View>
                </Modal>
                {
                    coinList.length === 0 ? <LoadingView/> :
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
                                coinList.map((v, i) =>
                                    <ScrollContent
                                        ref={r => this.childrenArr[i] = r}
                                        basedCoin={basedCoin}
                                        navigation={navigation}
                                        coin={v}
                                        tabLabel={v}
                                        key={v}/>
                                )
                            }
                        </ScrollableTabView>

                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    dropDownInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: '100%',
        marginRight: 6
    },
});

// const mapStateToProps = (state) => {
//     const {coinList} = state;
//     return {
//         // coinList: coinList.coinList,
//         // basedCoinsList: coinList.basedCoinsList,
//         // basedCoin: coinList.basedCoin
//     };
// };
//
// const mapDispatchToProps = (dispatch) => {
//     return {
//         firstLoad: bindActionCreators(firstLoad, dispatch),
//         switchBasedCoin: bindActionCreators(switchBasedCoin, dispatch),
//     };
// };
// export default connect(mapStateToProps, mapDispatchToProps)(Home);

export default Home;