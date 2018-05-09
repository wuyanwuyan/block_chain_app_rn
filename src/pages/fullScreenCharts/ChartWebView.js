import React from "react";
import {Button, Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View, WebView} from "react-native";
import Orientation from "react-native-orientation";

let injectedJavaScript = ``;

export default class ChartWebView extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {header: null}
    };

    constructor() {
        super(...arguments);
        Orientation.lockToLandscape();
        this.state = {};

    }

    componentDidMount() {

    }

    componentWillUnmount() {
        Orientation.lockToPortrait();
    }


    _goBack = () => {
        Orientation.lockToPortrait();
        this.props.navigation.goBack();
    }

    onNavigationStateChange = () => {

    }

    onMessage = () => {

    }

    render() {
        const {params} = this.props.navigation.state;

        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <TouchableOpacity style={styles.backBtn} onPress={this._goBack}>
                    <Text style={styles.backBtnTxt}>返回</Text>
                </TouchableOpacity>
                <WebView
                    style={styles.webView}
                    ref={r => this.webview = r}
                    source={{uri: params.url}}
                    domStorageEnabled
                    scalesPageToFit={false}
                    startInLoadingState
                    onShouldStartLoadWithRequest={(e) => true}
                    onNavigationStateChange={this.onNavigationStateChange}
                    injectedJavaScript={injectedJavaScript}
                    onMessage={this.onMessage}
                />
            </View>
        );
    }
}

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'black'
    },
    webView: {
        width: '100%',
        height: '100%',
    },
    backBtn: {
        position: 'absolute',
        left: 8,
        bottom: 10,
        zIndex: 2,
    },
    backBtnTxt: {
        backgroundColor: 'transparent',
        fontSize: 14,
        color: 'blue'
    }
});