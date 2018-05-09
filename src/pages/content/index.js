import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Content extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            title: '资讯',
            tabBarIcon: ({tintColor}) => (
                <Icon name="file-text" size={25} color={tintColor}/>
            )
        }
    }
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View>
                <Text>{__DEV__ ? 'dev 资讯':'pro 资讯'}</Text>
            </View>
        )
    }
}