import React from "react";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Base_color} from "../../../config/constants";
import Icon from "react-native-vector-icons/Ionicons";

export default class NextBtn extends React.Component {
    static defaultProps = {
        onPress: f => f,
    }

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <TouchableOpacity style={styles.loginBtn} onPress={this.props.onPress} activeOpacity={0.8}>
                <Icon name='ios-arrow-forward' size={26} color="white"/>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    loginBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        backgroundColor: Base_color,
        borderRadius: 22,
        shadowColor: '#1E78C9',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.54
    }
})