# nginx-syslog

> 基于 syslog 协议实现 nginx 日志 node 端服务。

## 安装

```sh
$ npm install --save nginx-syslog
```

## 使用

nginx 配置:

```nginx
log_format nodelog '{"ip":"$remote_addr","url":"$request_uri","status":"$status","ua":"$http_user_agent"}';
server {
  listen 80;
  # 其他配置
  location ~ [^/]\.php(/|$) {
    fastcgi_pass  127.0.0.1:9000;
    fastcgi_index index.php;
    include       fastcgi.conf;
    include       pathinfo.conf;

    access_log syslog:server=127.0.0.1:8514,tag=mylog,nohostname nodelog;
  }
}
```

node 接收:

```js
const Syslog = require('nginx-syslog');

const app = new Syslog({ port: 8514 });

app.on('message', (msg, rinfo) => {
  console.log(rinfo); // nginx 服务器信息
  console.log(msg); // nodelog 格式的数据，但头部会加上一个固定信息
});
```
