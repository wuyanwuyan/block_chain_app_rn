import React from "react";
import {
    FlatList,
    Image,
    InteractionManager,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View
} from "react-native";
// import CheckBox from "../components/CheckBox";
import Ionicons from "react-native-vector-icons/Ionicons";
import cStyles from "../styles/common";
import ModalDropdown from "react-native-modal-dropdown";
import LoadingView from "../components/LoadingView";
import {Base_color, Dark_color, Hightlight_color, Split_color} from "../config/constants";
import store from "react-native-simple-store";
import {fetchGet, fetchPost} from "../utils/fetchUtil";

export default class SearchCoinBaseCoin extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        let params = (navigation.state && navigation.state.params) || {finish: f => f,};
        const {finish} = params;
        return {
            title: '添加',
            headerBackTitle: null,
            headerBackTitleStyle: {
                color: Base_color
            },
            headerRight: <Text style={{fontSize:16,color: 'white',padding:8}} onPress={finish} selectionColor='gray'>完成</Text>
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            basedCoin: 'USD',
            coinList: null,
            showCoinList: [],
            basedCoinsList: [],
            favList: [...this.props.navigation.state.params.favList],
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {

            this.props.navigation.setParams({finish: this._finish});

            let basedCoin = 'USD';
            Promise.all([store.get('basedCoin')]).then(([data]) => {
                basedCoin = data || 'USD';
                return basedCoin;
            }).then((basedCoin) => {
                return Promise.all([fetchGet(`/exchange/coinlist/${basedCoin}`), fetchGet(`/exchange/based_coins`)]);
            }).then(([coinList, basedCoinsList]) => {
                this.setState({
                    basedCoin,
                    coinList,
                    basedCoinsList,
                    showCoinList: coinList
                });
            })
        })
    }

    _onSelectBasedCoin = (index, basedCoin) => {
        if (basedCoin === this.state.basedCoin)
            return;

        this.setState({coinList: null, showCoinList: []});
        fetchGet(`/exchange/coinlist/${basedCoin}`).then(coinList => {
            let text = this.state.text;
            let showCoinList = coinList.filter(v => v.toLowerCase().indexOf(text.toLowerCase()) !== -1);
            this.setState({basedCoin, coinList, showCoinList});
        })
    }

    _onCheck = (item, preValue) => () => {
        const {favList, basedCoin} = this.state;
        let newFavList = favList;
        let symbol = `${item}_${basedCoin}`;
        if (preValue) { //当前选中
            newFavList = favList.filter(v => v !== symbol);
        } else {
            if (newFavList.indexOf(symbol) === -1)
                newFavList.push(symbol);
        }
        this.setState({favList: newFavList});
    }

    _renderItem = ({item, index}) => {
        const {favList, basedCoin} = this.state;
        let curCoin = `${item}_${basedCoin}`;
        const isExist = favList.indexOf(curCoin) !== -1;
        return (
            <TouchableHighlight onPress={this._onCheck(item, isExist)} underlayColor={Hightlight_color}>
                <View style={styles.coinTxtContainer}>
                    <Text style={styles.coinTxt}>{item}</Text>
                    {/*<CheckBox onValueChange={this._onCheck(item, isExist)} value={isExist}/>*/}
                    {
                        isExist ? <Image source={require('../assets/check.png')} style={styles.checkImg}/> : null
                    }
                </View>
            </TouchableHighlight>
        );
    }

    _onChangeText = (text) => {
        let showCoinList = this.state.coinList.filter(v => v.toLowerCase().indexOf(text.toLowerCase()) !== -1);
        this.setState({text, showCoinList});
    }

    _finish = () => {
        this.props.navigation.goBack();
    }

    componentWillUnmount() {
        let isSame = this.state.favList.toString() === this.props.navigation.state.params.favList.toString();
        if (!isSame) {
            let postData = this.state.favList;
            fetchPost('/favorites', postData);
            this.props.navigation.state.params.callback([...postData]);
        }
    }

    render() {
        const {text, showCoinList, coinList, basedCoinsList, basedCoin} = this.state;
        return (
            <View style={[cStyles.flex1]}>
                <View style={styles.textInputContainer}>
                    <Ionicons name="ios-search" size={18} color={Dark_color} style={{marginLeft: 8, marginRight: 6}}/>
                    <TextInput
                        ref={r => this.textInput = r}
                        value={text}
                        style={styles.textInput}
                        placeholder="输入你要搜索的币种"
                        placeholderTextColor="#aaaaaa"
                        underlineColorAndroid="transparent"
                        maxLength={20}
                        onChangeText={this._onChangeText}
                    />
                    <ModalDropdown
                        dropdownStyle={{width: 80, height: 'auto'}}
                        dropdownTextStyle={{textAlign: 'center', fontSize: 14}}
                        options={basedCoinsList}
                        onSelect={this._onSelectBasedCoin}>
                        <View style={styles.dropDownInner}>
                            <Text style={{color: 'white', marginRight: 4, fontSize: 16}}>{basedCoin}</Text>
                            <Ionicons name="md-arrow-dropdown" size={14} color="white"/>
                        </View>
                    </ModalDropdown>
                </View>
                <View style={styles.hintView}>
                    <Text>从以下币种选择</Text>
                </View>
                <View style={cStyles.flex1}>
                    {
                        !coinList ?
                            <LoadingView/> :
                            <FlatList
                                data={showCoinList}
                                extraData={this.state}
                                renderItem={this._renderItem}
                                keyExtractor={(value, index) => value}
                            />
                    }
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {},
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        padding: 0,
    },
    searchBtn: {
        marginRight: 8,
        padding: 6,
        backgroundColor: Base_color,
        borderRadius: 4,
    },
    hintView: {
        paddingVertical: 6,
        paddingLeft: 6,
        backgroundColor: '#EDEDF2',
    },
    coinTxtContainer: {
        width: '100%',
        borderBottomColor: Split_color,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coinTxt: {
        paddingVertical: 10,
        paddingLeft: 14,
        fontSize: 16,
        color: Dark_color
    },
    dropDownInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        paddingVertical: 6,
        marginRight: 6,
        backgroundColor: Base_color,
        borderRadius: 4,
    },
    CheckBox: {
        width: 20,
        height: 20,
    },
    checkImg: {
        width: 21,
        height: 18,
        resizeMode: 'stretch',
        marginRight: 14,
    }
});
