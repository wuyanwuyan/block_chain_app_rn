import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


export default class CheckBox extends React.Component {
    static defaultProps = {
        onValueChange: f => f,
        color: '#00529c',
        size: 26,
        value: false,
    }

    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.value
        }

    }

    _onPress = () => {
        this.setState({checked: !this.state.checked});
        this.props.onValueChange();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({checked: nextProps.value})
    }

    render() {
        const {size, color} = this.props;
        let name = this.state.checked ? 'checkbox-marked-outline' : 'checkbox-blank-outline';
        return (
            <Icon.Button name={name} color={color} size={size} backgroundColor="transparent"
                         onPress={this._onPress}/>
        )
    }
}