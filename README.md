# mp-websocket

小程序`websocket`实现

## 说明

### 1.  单连接和多连接

> 基础库 1.7.0 之前，一个微信小程序同时只能有一个 WebSocket 连接，如果当前已存在一个 WebSocket 连接，会自动关闭该连接，并重新创建一个 WebSocket 连接。基础库版本 1.7.0 及以后，支持存在多个 WebSokcet 连接，每次成功调用 wx.connectSocket 会返回一个新的 SocketTask。
> [小程序socket文档](https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-socket.html)

本项目两种模式都支持，不过在单连接版本下，只能连接一个。

### 2. 支付宝和微信小程序

本项目都支持
