import debug from 'debug';
import socketGlobalEventHandle from './socketGlobalEventHandle';

let globalWebsocket;
let nextGlobalWebsocket;
const log = debug('socket.io-wxapp-client:connectSingleSocket');

export function setGlobalSocket(instance) {
  globalWebsocket = instance;
  socketGlobalEventHandle(instance.$handler);
}

export function hasSingleSocket() {
  return !!globalWebsocket;
}

function popGlobal() {
  wx.connectSocket(nextGlobalWebsocket.$options);
  setGlobalSocket(nextGlobalWebsocket);
  nextGlobalWebsocket = undefined;
}

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
        instance.$handler('close');
        return;
      }

      wx.closeSocket(Object.assign({
        success(res) {
          console.log('closeSocket success', res);
          if (nextGlobalWebsocket) {
            console.log('nextGlobalWebsocket将连接');
            popGlobal();
          }
        },
        fail(err) {
          console.log('closeSocket fail', err);
        },
      }, ops));
    },
  };
}


function connect(instance) {
  if (nextGlobalWebsocket) {
    log('nextGlobalWebsocket被跳过');
    nextGlobalWebsocket = instance;
    return;
  }
  nextGlobalWebsocket = instance;

  if (!globalWebsocket) {
    log('websocket将连接');
    popGlobal();
    return;
  }

  if (globalWebsocket.readyState === 3) {
    log('当前socket为断开状态，将打开新socket');
    popGlobal();
    return;
  }

  globalWebsocket.close();
}

export default function connectSingleSocket(instance) {
  connect(instance);
  return createSingleSocketTask(instance);
}
