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
import Icon from 'react-native-vector-icons/FontAwesome';


export default class TableHeaderItem extends React.Component {
    static defaultProps = {
        onPress: f => f,
        color: '#646464',
        activeColor: '#00529c',
    }

    constructor(props) {
        super(props);
        this.state = {
            order: 'desc',
        }

    }

    _onPress = () => {
        const {active, sortKey,sortable} = this.props;
        if(!sortable){
            this.props.onPress(sortKey, 'desc');
            return;
        }
        if (active) {
            let order = this.state.order === 'desc' ? 'incr' : 'desc';
            this.setState({order});
            this.props.onPress(sortKey, order);
        } else {
            this.props.onPress(sortKey, this.state.order);
        }
    }


    render() {

        const {text, sortable, active, color, activeColor, width} = this.props;

        let finalWidth = width;
        if (width <= 1) {
            finalWidth = Dimensions.get('window').width * width;
        }

        let upColor = color, downColor = color;
        if (active) {
            this.state.order === 'desc' ? downColor = activeColor : upColor = activeColor;
        }

        return (
            <View style={[styles.container, {width: finalWidth}]}>
                <TouchableOpacity style={[styles.touchContainer]} onPress={this._onPress} activeOpacity={1}>
                    <Text style={[styles.txt, {color: active ? activeColor : color}]}>{text}</Text>
                    {
                        sortable && <View>
                            <View style={[styles.triangle, {borderBottomColor: upColor}]}></View>
                            <View style={[styles.triangle, styles.triangleDown, {borderBottomColor: downColor}]}></View>
                        </View>
                    }
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 36,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgb(217,217,217)',
        borderLeftWidth: 0,
        borderLeftColor: 'transparent',
    },
    touchContainer: {
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txt: {
        fontSize: 13,
        marginRight: 2
    },
    activeInactiveTextColor: {},
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 5,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        // borderBottomColor: 'red'
    },
    triangleDown: {
        marginTop: 2,
        transform: [
            {rotate: '180deg'}
        ]
    }
});

