import React from "react";
import {Image, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {Hightlight_color} from "../../config/constants";

export default class CoinEmptyView extends React.Component {
    static defaultProps = {
        onAdd: f => f,
    }

    constructor(props) {
        super(props);
    }

    render() {

        const {isLogin} = this.props;

        return (
            <View style={styles.container}>
                <Image source={require('../../assets/noConcern.png')} style={styles.img}/>
                <Text>{`${isLogin?``:`登录后`}点击右上角“+”按钮，`}</Text>
                <Text>可将想要关注的币种存储至“关注”</Text>
                <TouchableHighlight style={styles.addBtn} onPress={this.props.onAdd} activeOpacity={1}
                                    underlayColor={Hightlight_color} delayPressIn={0}>
                    <Text>{isLogin ? '立即添加':'立即登录'}</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: 170,
        height: 116,
        resizeMode: 'stretch',
        marginBottom:18,
    },
    descTxt:{
        color:'#909090',
    },
    addBtn: {
        width: 110,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#D8D8D8',
        marginTop: 42,
    }
})