/**
 * nginx 日志字符串解码函数
 *
 * @param {String} str 未解码函数
 * @returns {String}
 *
 * @note nginx 编码规则 https://github.com/nginx/nginx/blob/master/src/http/modules/ngx_http_log_module.c#L976
 */
function ngxLogDecode(str) {
  const newStr = str.replace(/(\\x[0-9a-f]{2})+/ig, (m) => {
    let ret = m;
    try {
      ret = JSON.stringify(decodeURIComponent(m.replace(/\\x/g, '%')));
      ret = ret.substring(1, ret.length - 1);
    } catch (e) {
      // console.error(e);
      ret = m;
    }
    return ret;
  });

  return newStr;
}

module.exports = {
  ngxLogDecode,
};
