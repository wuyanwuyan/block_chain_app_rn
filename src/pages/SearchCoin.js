import React from "react";
import {FlatList, Platform, StyleSheet, Text, TextInput, TouchableHighlight, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import cStyles from "../styles/common";
import {Base_color, Dark_color, Hightlight_color, Split_color} from "../config/constants";

export default class Search extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            title: '搜索币种名称',
            headerBackTitle: null,
            headerBackTitleStyle: {
                color: Base_color
            },
            headerRight: Platform.OS === 'ios' ? null : <View/>,
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            showCoinList: this.props.navigation.state.params.coinList,
        }
    }

    componentDidMount() {

    }

    _navigate2Main = (value) => () => {
        const {goBack, state} = this.props.navigation;
        goBack();
        state.params.callback(value);
    }

    _renderItem = ({item, index}) => {
        return (
            <TouchableHighlight onPress={this._navigate2Main(item)} activeOpacity={1} underlayColor={Hightlight_color}
                                delayPressIn={0} style={styles.coinTxtContainer}>
                <Text style={styles.coinTxt}>{item}</Text>
            </TouchableHighlight>
        );
    }

    _onChangeText = (text) => {
        let showCoinList = this.props.navigation.state.params.coinList.filter(v => v.toLowerCase().indexOf(text.toLowerCase()) !== -1)
        this.setState({text, showCoinList});
    }

    render() {
        const {text, showCoinList} = this.state;
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
                    {/*<TouchableOpacity style={styles.searchBtn} activeOpacity={0.8} onPress={f => f}>*/}
                    {/*<Text style={{color: 'white'}}>搜索</Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>
                <View style={styles.hintView}>
                    <Text>从以下币种选择</Text>
                </View>
                <View style={cStyles.flex1}>
                    <FlatList
                        data={showCoinList}
                        extraData={this.state}
                        renderItem={this._renderItem}
                        keyExtractor={(value, index) => value}
                    />
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
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    coinTxt: {
        paddingVertical: 10,
        paddingLeft: 14,
        fontSize: 16,
        color: Dark_color
    }
});
