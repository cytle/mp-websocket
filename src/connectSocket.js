import debug from 'debug';
import connectSingleSocket, { hasSingleSocket, createSingleSocketTask, setGlobalSocket } from './connectSingleSocket';
import { isMy, apis } from './utils';

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

/**
 * 创建websocket链接，支持旧版本全局实例和新版本多实例
 * @param  {Object} options   websocket参数
 * @param  {Object} instance  当前实例
 * @param  {Function} handler 事件响应
 * @return {Object}           rocketTask { send, close },如果是旧版本,则降级为全
 * 局方法
 */
export default function connectSocket(instance) {
  if (isMy() || hasSingleSocket()) {
    return connectSingleSocket(instance);
  }
  const socketTask = apis.connectSocket(instance.$options);
  if (socketTask) {
    log('single, 有返回socketTask, 多socket');
    socketEventHandle(instance.$handler, socketTask);
    return socketTask;
  }
  setGlobalSocket(instance);
  return createSingleSocketTask(instance);
}
