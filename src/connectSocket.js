import debug from 'debug';
import socketGlobalEventHandle from './socketGlobalEventHandle';

const log = debug('socket.io-wxapp-client:connectSocket');

function socketEventHandle(handler, socketTask) {
  socketTask.onOpen(() => {
    handler('open');
  });

  socketTask.onError((res) => {
    handler('error', res);
  });

  socketTask.onClose(() => {
    handler('close');
  });

  socketTask.onMessage((res) => {
    handler('message', res);
  });
}

let globalWebsocket;

function getGlobalSocketTask(instance) {
  return {
    send(ops) {
      if (globalWebsocket !== instance) {
        return;
      }
      wx.sendSocketMessage(ops);
    },
    close(ops) {
      if (globalWebsocket !== instance) {
        return;
      }
      wx.closeSocket(ops);
    },
  };
}


function realConnectSocket(options, instance, handler) {
  const socketTask = wx.connectSocket(options);
  if (socketTask) {
    log('single, 有返回socketTask, 多socket');
    socketEventHandle(handler, socketTask);
    return socketTask;
  }
  globalWebsocket = instance;
  socketGlobalEventHandle(handler);
  return getGlobalSocketTask(instance);
}

/**
 * 创建websocket链接，支持旧版本全局实例和新版本多实例
 * @param  {Object} options   websocket参数
 * @param  {Object} instance  当前实例
 * @param  {Function} handler 事件响应
 * @return {Object}           rocketTask { send, close },如果是旧版本,则降级为全
 * 局方法
 */
export default function connectSocket(options, instance, handler) {
  // 如果有globalWebsocket则认为是单连接情况
  if (globalWebsocket) {
    const { onclose } = globalWebsocket;
    globalWebsocket.onclose = function close(res) {
      globalWebsocket = instance;
      socketGlobalEventHandle(handler);
      wx.connectSocket(options);
      if (onclose) {
        onclose.call(this, res);
      }
    };
    globalWebsocket.close();
    return getGlobalSocketTask(instance);
  }
  return realConnectSocket(options, instance, handler);
}
