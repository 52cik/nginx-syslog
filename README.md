# nginx-syslog

Nginx syslog protocol interface

[中文文档](README_CN.md)


## install

```sh
$ npm install --save nginx-syslog
```

## usage

nginx config:

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

node:

```js
const Syslog = require('nginx-syslog');

const app = new Syslog({ port: 8514 });

app.on('message', (msg, rinfo) => {
  console.log(rinfo);
  console.log(msg);
});
```
