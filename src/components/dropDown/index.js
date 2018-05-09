import React from 'react';
import {View,StyleSheet,TouchableWithoutFeedback} from 'react-native';

export default class DropDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active:false
        }

    }

    render() {
        return (
            <TouchableWithoutFeedback style={styles.wrapper}>
                <View style={styles.absolute}>

                </View>

            </TouchableWithoutFeedback>
        )
    }
}

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    wrapper:{
        width:2*screenWidth,
        height:2*screenHeight
    },
    absolute:{
        position:'absolute',
        left:'0',
        top:'100%'
    }
})