import React from "react";
import {Image, Platform, StyleSheet, Text, View} from "react-native";
import {Base_color, Black_color, Dark_color} from "../config/constants";
import DeviceInfo from "react-native-device-info";

export default class AboutThisApp extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            title: '关于CQcoin',
            headerBackTitle: null,
            headerBackTitleStyle: {
                color: Base_color
            },
            headerRight: Platform.OS === 'ios' ? null : <View/>,
        }
    }

    constructor(props) {
        super(props);
    }

    render() {
        let appVersion = DeviceInfo.getVersion();
        return (
            <View style={[styles.container]}>
                <Image source={require('../assets/logo.png')} style={styles.logoImg}/>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: Black_color, marginTop: 21}}>CQcoin</Text>
                <Text style={{fontSize: 16, color: Dark_color, marginTop: 14}}>{`版本号 V${appVersion}`}</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop:95,
    },
    logoImg: {
        marginTop: 20,
        width: 80,
        height: 80,
        resizeMode: 'stretch',
    }

});
