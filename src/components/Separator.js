import React from 'react';
import {View,StyleSheet,Dimensions,PixelRatio} from 'react-native';

export default class Separator extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={styles.separator}>

            </View>
        )
    }
}

let screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    separator:{
        height:StyleSheet.hairlineWidth,
        width:screenWidth,
        backgroundColor:'rgb(217,217,217)',
    }
})