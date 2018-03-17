import debug from 'debug';

const log = debug('socket.io-wxapp-client:socketGlobalEventHandle');
let needListen = true;

const defaultGloableEventHandler = (...args) => {
  log('没有socket全局处理事件 %O', args);
};

// 全局事件接受者
let gloableEventHandler;

const listeners = {
  // 绑定全局监听initListen
  SocketOpen() {
    gloableEventHandler('open');
  },

  SocketError(res) {
    gloableEventHandler('error', res);
  },

  SocketClose() {
    gloableEventHandler('close');
  },

  SocketMessage(res) {
    log('message', res);
    gloableEventHandler('message', res);
  },
};

/**
 * 监听小程序socket全局的事件
 * @param  {Function} handler 事件接受者
 */
export default function socketGlobalEventHandle(handler = defaultGloableEventHandler) {
  // 设置全局事件接受者
  log('websocket设置全局事件接受者', handler);

  gloableEventHandler = handler;

  if (!needListen) {
    return;
  }

  if (wx.offSocketOpen) {
    // fix 支付宝每次连接都需要重新注册订阅
    Object.keys(listeners).forEach((key) => {
      wx[`off${key}`](listeners[key]);
      wx[`on${key}`](listeners[key]);
    });
  } else {
    needListen = false;
    Object.keys(listeners).forEach((key) => {
      wx[`on${key}`](listeners[key]);
    });
  }
}
