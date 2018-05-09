import React from 'react';
import {
    View,
    Text,
    Platform,
    TouchableOpacity,
    TouchableNativeFeedback,
    StyleSheet,
    Dimensions,
    PixelRatio
} from 'react-native';


export default class TableHeader extends React.Component {
    static defaultProps = {
        onPress: f => f,
        height: 36,
    }

    constructor(props) {
        super(props);
        this.state = {activeIndex: 0}

    }

    _onItemPress = (activeIndex) => (sortKey,order) => {
        this.setState({
            activeIndex
        });
        this.props.onTabHeader(sortKey,order);
    }

    render() {
        const {height} = this.props;
        const {activeIndex} = this.state;

        return (
            <View style={[styles.container, {height}]}>
                {
                    React.Children.map(this.props.children, (child, index) => {
                        return React.cloneElement(child, {
                            active: index === activeIndex,
                            onPress: this._onItemPress(index)
                        })
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
});

