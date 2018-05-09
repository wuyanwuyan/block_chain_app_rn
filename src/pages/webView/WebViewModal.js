import React from 'react';
import {
    StyleSheet,
    WebView,
    BackHandler,
    Dimensions,
    Text,
    TouchableOpacity,
    View,
    Clipboard, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';


export default class WebViewModal extends React.Component {
    constructor(props) {
        super(props);

    }

    writeToClipboard = async () => {
        await Clipboard.setString(this.props.url);
        __DEV__ && Alert.alert(await Clipboard.getString());
    };

    render() {
        return (
            <Modal {...this.props} style={styles.bottomModal}>
                <View style={styles.modalContent}>
                    <View style={styles.itemsContainer}>
                        <View style={styles.itemContainer}>
                            <TouchableOpacity style={styles.iconContainer}
                                              onPress={()=>{}}>
                                <Icon name="wechat" size={30} color="green"/>
                            </TouchableOpacity>
                            <Text style={styles.iconText}>分享到微信</Text>
                        </View>
                        <View style={styles.itemContainer}>
                            <TouchableOpacity style={styles.iconContainer}
                                              onPress={this.writeToClipboard}>
                                <Icon name="content-copy" size={30} color="#000000"/>
                            </TouchableOpacity>
                            <Text style={styles.iconText}>复制链接</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: '#e8e8e8',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    itemsContainer:{
        width:'100%',
        flexDirection:'row',
        alignItems:'flex-start',
        justifyContent:'flex-start',
    },
    itemContainer: {
        width: 60,
        marginRight:20,
    },
    iconContainer: {
        height: 60,
        backgroundColor: 'transparent',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconText: {
        marginTop: 8,
        fontSize: 12,
        width: '100%',
        flexWrap: 'wrap',
        textAlign: 'center'
    }
})