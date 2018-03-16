import debug from 'debug';
import socketGlobalEventHandle from './socketGlobalEventHandle';

let globalWebsocket;
let nextGlobalWebsocket;
const log = debug('socket.io-wxapp-client:connectSingleSocket');

export function createSingleSocketTask(instance) {
  return {
    send(ops) {
      if (globalWebsocket !== instance) {
        log('error send', 'globalWebsocket !== instance', ops);
        return;
      }
      wx.sendSocketMessage(ops);
    },
    close(ops) {
      if (globalWebsocket !== instance) {
        log('error close', 'globalWebsocket !== instance', ops);
        return;
      }
      wx.closeSocket(ops);
    },
  };
}

export function setGlobalSocket(instance) {
  globalWebsocket = instance;
  socketGlobalEventHandle(instance.$handler);
}

export function hasSingleSocket() {
  return !!globalWebsocket;
}

export default function connectSingleSocket(instance) {
  if (globalWebsocket) {
    if (nextGlobalWebsocket) {
      log('nextGlobalWebsocket被跳过');
      nextGlobalWebsocket = instance;
    } else {
      log('nextGlobalWebsocket将在当前socket断开后被连接');
      const { onclose } = globalWebsocket;
      nextGlobalWebsocket = instance;
      globalWebsocket.onclose = function close(res) {
        log('当前websocket断开连接');
        if (onclose) {
          onclose.call(this, res);
        }
        log('websocket onclose执行完毕');
        if (nextGlobalWebsocket) {
          log('nextGlobalWebsocket将连接');
          setGlobalSocket(nextGlobalWebsocket);
          wx.connectSocket(nextGlobalWebsocket.$options);
          nextGlobalWebsocket = undefined;
        }
      };
    }
  } else {
    log('websocket将连接');
    setGlobalSocket(instance);
    wx.connectSocket(instance.$options);
  }

  return createSingleSocketTask(instance);
}
