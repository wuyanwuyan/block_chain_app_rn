import React from 'react';
import {View, ImageBackground, StyleSheet, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import NavigationUtil from '../utils/NavigationUtil';
import cStyles from '../styles/common';

export default class Splash extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            countDown: 2
        }
        this.key = null;
    }

    componentDidMount() {
        this.key = setInterval(() => {
            if (this.state.countDown <= 0) {
                clearInterval(this.key);
                this.key = null;
                this.navigate2Main();
            } else {
                let countDown = this.state.countDown - 1;
                this.setState({countDown})
            }
        }, 1000);
    }

    componentWillUnmount() {
        console.log('--componentWillUnmount----');
        this.key && clearInterval(this.key);
    }

    navigate2Main = () => {
        const {navigate} = this.props.navigation;
        navigate('Home');
        // NavigationUtil.reset(this.props.navigation, 'Home');
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ImageBackground source={require('../assets/splash.jpg')} style={styles.img} resizeMode="stretch">
                    <TouchableOpacity style={styles.pass} onPress={this.navigate2Main}>
                        <Text style={cStyles.fontSizeNormal}>{`跳过(${this.state.countDown}s)`}</Text>
                    </TouchableOpacity>
                </ImageBackground>

                {/*<View style={[cStyles.flex1,styles.descTextContainer]}>*/}
                    {/*<Text style={styles.descText}>Copyright©2013-2017闯奇信息科技（上海）有限公司</Text>*/}
                {/*</View>*/}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#004888',

    },
    img: {
        width: '100%',
        height: '100%',
        // resizeMode: 'stretch',
    },
    pass: {
        position: 'absolute',
        top: 20,
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 4,
        padding: 6
    },
    descTextContainer:{
        justifyContent:'flex-end',
        alignItems:'center'
    },
    descText:{
        paddingBottom:30,
        fontSize:12,
        color:'white',
    }

});
