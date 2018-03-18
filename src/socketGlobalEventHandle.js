import debug from 'debug';
import { isMy } from './utils';

const log = debug('socket.io-wxapp-client:socketGlobalEventHandle');
let isInitSocketGlobalEvent = false;

const defaultGloableEventHandler = (...args) => {
  log('没有socket全局处理事件 %O', args);
};

function mySocketGlobalEventHandle(handler = defaultGloableEventHandler) {
  // 绑定全局监听initListen
  my.onSocketOpen(() => {
    handler('open');
  });

  my.onSocketError((res) => {
    handler('error', res);
  });

  my.onSocketClose(() => {
    handler('close');
  });

  my.onSocketMessage((res) => {
    log('message', res);
    handler('message', res);
  });
}

// 全局事件接受者
let gloableEventHandler;
/**
 * 监听小程序socket全局的事件
 * @param  {Function} handler 事件接受者
 */
function weSocketGlobalEventHandle(handler = defaultGloableEventHandler) {
  // 设置全局事件接受者
  gloableEventHandler = handler;

  if (isInitSocketGlobalEvent) {
    return;
  }
  isInitSocketGlobalEvent = true;

  // 绑定全局监听initListen
  wx.onSocketOpen(() => {
    gloableEventHandler('open');
  });

  wx.onSocketError((res) => {
    gloableEventHandler('error', res);
  });

  wx.onSocketClose(() => {
    gloableEventHandler('close');
  });

  wx.onSocketMessage((res) => {
    log('message', res);
    gloableEventHandler('message', res);
  });
}

export default isMy() ? mySocketGlobalEventHandle : weSocketGlobalEventHandle;
