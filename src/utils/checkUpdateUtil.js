// 安卓apk硬更新
import {Alert, Linking} from "react-native";
import {fetchGet, serialize} from "./fetchUtil";
import DeviceInfo from "react-native-device-info";
import store from "react-native-simple-store";

const checkUrl = 'http://cqcoin.info/checkupdate/android';

function checkUpdate() {
    store.get('lastCheck').then(lastCheck => {
        if (!lastCheck) {
            doUpdate();
            return;
        }
        if (lastCheck && Date.now() - lastCheck > 1 * 24 * 60 * 60 * 1000) {
            doUpdate();
        }
    })
}


function doUpdate() {
    store.update('lastCheck', Date.now().toString());

    let appVersion = DeviceInfo.getVersion();
    let bundleId = DeviceInfo.getBundleId();
    let query = serialize({appVersion, bundleId});
    fetchGet('', {}, {url: `${checkUrl}?${query}`}).then((data) => {
        if (data.update) {
            Alert.alert(
                `App有新版本了 V${data.version}`,
                data.log,
                [
                    {
                        text: '稍后', onPress: () => {
                    }
                    },
                    {
                        text: '更新', onPress: () => {
                        Linking.openURL(data.downloadUrl)
                    }
                    },
                ],
                {cancelable: true}
            )
        }
    }, (e) => {
    })
}

export {
    checkUpdate
}