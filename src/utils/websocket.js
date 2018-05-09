/**
 * websocket 长连接
 */
import {AppState} from "react-native";
import server from "../config/server";

let url = `ws://${server.Ip_Port}/v1/websocket`;

let ws = new WebSocket(url);

function start(websocketServerLocation) {
    ws = new WebSocket(websocketServerLocation);

    ws.onopen = () => {
        // 打开一个连接
        console.log('WebSocket onOpen');
    };

    ws.onmessage = (e) => {

        // 接收到了一个消息
        __DEV__ && console.log('websocket message!   AppState.currentState:',AppState.currentState);

        // 应用处在后台时，不更新
        if(AppState.currentState !== 'active'){
            return;
        }

        try {
            let json = JSON.parse(e.data);
            lastCallback && lastCallback(json);
        } catch (e) {

        }
    };

    ws.onerror = (e) => {
        // 发生了一个错误
        console.warn(e.message);
    };

    ws.onclose = (e) => {
        console.warn('websocket connect close: ', e.code, e.reason);
        // Try to reconnect in 5 seconds
        setTimeout(function () {
            start(websocketServerLocation)
        }, 5000);
    };
}

start(url);


// 一次只能subscribe一个币对
let lastSymbol = null, lastCallback = null;

let subscribe = function (symbol, callBack) {
    if (lastSymbol && lastSymbol === symbol) return;

    if (lastSymbol) {
        console.log('unsub  ', lastSymbol);

        let sendData = {event: "unsub", symbols: [lastSymbol]};
        ws.send(JSON.stringify(sendData));
    }

    lastSymbol = symbol;
    lastCallback = callBack;

    console.log('sub  ', lastSymbol);
    let sendData = {event: "sub", symbols: [symbol]};
    ws.send(JSON.stringify(sendData));
}


let unSubscribe = function (symbol) {
    if (symbol !== lastSymbol) {
        return;
    }
    console.log('unsub  ', symbol);

    let sendData = {event: "unsub", symbols: [symbol]};
    ws.send(JSON.stringify(sendData));

    lastSymbol = null;
    lastCallback = null;
}

let unSubscribeAll = function (symbol = lastSymbol) {
    if (symbol) {
        console.log('unsub  ', symbol);
        let sendData = {event: "unsub", symbols: [symbol]};
        ws.send(JSON.stringify(sendData));

        lastSymbol = null;
        lastCallback = null;

    }
}

export {subscribe, unSubscribe, unSubscribeAll};