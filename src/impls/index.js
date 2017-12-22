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

function singleMode(socketTask, instance, handler) {
  socketEventHandle(handler, socketTask);
}

function globalMode(instance, handler) {
  socketGlobalEventHandle(handler);
}

let globalWebsocket;

function connectSocket(options, instance, handler) {
  let socketTask = wx.connectSocket(options);
  if (socketTask) {
    singleMode(socketTask, instance, handler);
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
    globalMode(socketTask, instance, handler);
  }
  return socketTask;
}

export default {
  connectSocket,
  socketEventHandle,
};
