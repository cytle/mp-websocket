import socketGlobalEventHandle from './socketGlobalEventHandle';

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

function connectSocket(options, instance, handler) {
  let socketTask = wx.connectSocket(options);
  if (socketTask) {
    socketEventHandle(handler, socketTask);
  } else {
    if (globalWebsocket) {
      globalWebsocket.carsh();
    }
    globalWebsocket = instance;
    socketTask = {
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
    socketGlobalEventHandle(handler);
  }
  return socketTask;
}

export default {
  connectSocket,
  socketEventHandle,
};
