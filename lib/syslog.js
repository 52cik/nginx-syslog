const dgram = require('dgram');
const EventEmitter = require('events');

const utils = require('./utils');

const defaultOpt = {
  port: 514, // 默认端口
  ipv4: true, // 是否监听IPv4
  udp4: '0.0.0.0', // 监听IP地址
  ipv6: false, // 是否监听IPv6
  udp6: '::', // 监听IP地址
  decode: true, // 解码日志字符
  listenInfo: true, // 显示监听消息
  errorInfo: true, // 显示错误消息
};

class Syslog extends EventEmitter {
  constructor(opts) {
    super();

    Object.assign(this, defaultOpt, opts || {});
    this.init();
  }

  init() {
    const self = this;
    this.servers = [];

    if (this.ipv4) {
      this.servers.push(dgram.createSocket('udp4'));
    }

    if (this.ipv6) {
      this.servers.push(dgram.createSocket('udp6'));
    }

    this.servers.forEach((socket) => {
      socket.on('close', () => self.emit('close'));
      socket.on('message', (msg, rinfo) => {
        if (this.decode) {
          msg = utils.ngxLogDecode(msg.toString('utf8'));
        }
        self.emit('message', msg, rinfo);
      });

      socket.on('error', (exception) => {
        if (self.errorInfo) {
          console.warn(exception);
        }
        self.emit('error', exception);
      });

      socket.on('listening', function listening() {
        if (self.listenInfo) {
          const info = this.address();
          console.log(`server listening ${info.address}:${info.port}`);
        }
        self.emit('listening');
      });

      socket.bind(this.port, this[socket.type]);
    });
  }
}

module.exports = Syslog;
