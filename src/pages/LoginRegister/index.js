import React from "react";
import {SafeAreaView, StyleSheet, View} from "react-native";
import ScrollableTabView, {DefaultTabBar} from "react-native-scrollable-tab-view";
import Register from "./Register";
import Login from "./Login";
import Icon from "react-native-vector-icons/MaterialIcons";
import {Base_color, Dark_color} from "../../config/constants";


export default class LoginRegister extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        }
    }

    constructor(props) {
        super(props);

    }

    _goBack = () => {
        this.props.navigation.goBack();
    }


    render() {
        const {navigation} = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <View>
                    <Icon.Button
                        name="close"
                        color={Dark_color}
                        size={26}
                        backgroundColor="transparent"
                        underlayColor="transparent"
                        onPress={this._goBack}/>
                </View>
                <View style={{flex: 1}}>
                    {/*<Text style={styles.cqcoin}>CQCOIN</Text>*/}
                    <ScrollableTabView
                        // scrollWithoutAnimation={true}
                        style={{flex: 1}}
                        renderTabBar={() => <DefaultTabBar />}
                        tabBarBackgroundColor="white"
                        tabBarUnderlineStyle={{backgroundColor: Base_color}}
                        tabBarActiveTextColor={Base_color}
                        tabBarInactiveTextColor={Dark_color}
                    >
                        <Login navigation={navigation} tabLabel="登录"/>
                        <Register navigation={navigation} tabLabel="注册"/>
                    </ScrollableTabView>
                </View>
            </SafeAreaView>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cqcoin: {
        fontSize: 40,
        color: 'black',
        textAlign: 'center',
    }
})