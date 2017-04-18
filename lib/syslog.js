const dgram = require('dgram');
const EventEmitter = require('events');

const utils = require('./utils');

const defaultOpt = {
  port: 514, // 默认端口
  decode: true, // 解码日志字符
  listenInfo: true, // 显示监听消息
  errorInfo: true, // 显示错误消息
};

class Syslog extends EventEmitter {
  constructor(opts) {
    super();

    this.opts = Object.assign({}, defaultOpt, opts || {});
    this.port = this.opts.port;
    this.decode = this.opts.decode;
    this.listenInfo = this.opts.listenInfo;
    this.errorInfo = this.opts.errorInfo;

    this.init();
  }

  init() {
    const self = this;

    this.servers = [dgram.createSocket('udp4'), dgram.createSocket('udp6')];

    this.servers.forEach((socket) => {
      socket.on('close', () => self.emit('close'));
      socket.on('message', (msg, rinfo) => {
        if (this.decode) {
          msg = utils.ngxLogDecode(msg.toString('utf8'));
        }
        self.emit('message', msg, rinfo);
      });

      socket.on('error', (exception) => {
        if (self.listenInfo) {
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

      socket.bind(this.port);
    });
  }
}

module.exports = Syslog;
