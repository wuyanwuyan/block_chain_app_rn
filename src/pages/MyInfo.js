import React from "react";
import {FlatList, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity,Platform, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Base_color, Dark_color, Hightlight_color, Split_color} from "../config/constants";
import Profile from '../utils/profile';

export default class MyInfo extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            title: '个人信息',
            headerBackTitle: null,
            headerBackTitleStyle: {
                color: Base_color
            },
            headerRight:Platform.OS === 'ios' ? null:<View/>,
        }
    }

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    _logout = () => {
        Profile.logout();
        this.props.navigation.goBack();
    }

    render() {
        let profile = Profile.get();
        return (
            <View style={[styles.container]}>
                <View style={styles.section}>
                    <Text style={{fontSize:14}}>手机号</Text>
                    <Text style={{fontSize:14}}>{profile.user.phone}</Text>
                </View>
                <View style={{alignItems:'center'}}>
                    <TouchableHighlight style={styles.logoutBtn} onPress={this._logout} activeOpacity={1} underlayColor={Hightlight_color}>
                        <Text style={{color:Base_color,fontSize:14}}>退出登录</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    section:{
        marginTop:16,
        marginBottom:40,
        marginHorizontal:14,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    logoutBtn:{
        width:290,
        height:48,
        borderColor:Dark_color,
        borderWidth:StyleSheet.hairlineWidth,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:30,
    }

});
