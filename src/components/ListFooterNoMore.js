import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

export default class ListFooterNoMore extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>我是有底线的</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    footerText: {
        textAlign: 'center',
        fontSize: 14,
        marginLeft: 10
    }
})