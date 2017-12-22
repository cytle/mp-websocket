import { isString, isArray, DOMExceptionError } from './utils';
import { connectSocket } from './impls';

/**
 * 小程序 Websocket
 * @param       {DOMString}             url       url
 * @param       {DOMString|DOMString[]} protocols Optional 协议
 * @constructor
 */
function WebSocket(url, protocols) {
  if (protocols) {
    if (isString(protocols)) {
      /* eslint no-param-reassign: off */
      protocols = [protocols];
    } else if (!isArray(protocols)) {
      throw new DOMExceptionError(`Failed to construct 'WebSocket': The subprotocol '${protocols}' is invalid.`);
    }
  }

  // binaryType
  this.binaryType = '';
  this.readyState = WebSocket.CONNECTING;
  const options = {
    url,
    header: {
      'content-type': 'application/json',
    },
    protocols,
    method: 'GET',
  };
  const handler = (event, res) => {
    if (event === 'close') {
      this.readyState = WebSocket.CLOSED;
    } else if (event === 'open') {
      this.readyState = WebSocket.OPEN;
    }
    if (this[`on${event}`]) {
      this[`on${event}`](res);
    }
  };
  this.$socket = connectSocket(
    options,
    this,
    handler,
  );
}

WebSocket.prototype.send = function send(data) {
  if (this.readyState === WebSocket.CONNECTING) {
    throw new DOMExceptionError("Failed to execute 'send' on 'WebSocket': Still in CONNECTING state.");
  }
  if (this.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is already in CLOSING or CLOSED state.');
    return;
  }
  this.$socket.send({
    data,
  });
};

WebSocket.prototype.close = function close(code, reason) {
  this.readyState = WebSocket.CLOSING;
  this.$socket.close({
    code,
    reason,
  });
};

WebSocket.CONNECTING = 0; // The connection is not yet open.
WebSocket.OPEN = 1; // The connection is open and ready to communicate.
WebSocket.CLOSING = 2; // The connection is in the process of closing.
WebSocket.CLOSED = 3; // The connection is closed or couldn't be opened.

module.exports = WebSocket;
