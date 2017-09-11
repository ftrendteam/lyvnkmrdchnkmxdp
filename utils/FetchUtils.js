/**
 * Created by admin on 2017/8/24.
 */

export default class FetchUtil {
  /**
   * 基于 fetch 封装的 GET请求
   * @param url
   * @param params {}
   * @param headers
   * @returns {Promise}
   */
  FetchUtil.get = function (common_url, params, headers) {
    if (params) {
      let paramsArray = [];
      //encodeURIComponent
      Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
      if (url.search(/\?/) === -1) {
        url += '?' + paramsArray.join('&')
      } else {
        url += '&' + paramsArray.join('&')
      }
    }
    return new Promise(function (resolve, reject) {
      fetch(url, {
        method: 'GET',
        headers: headers,
      }).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          reject({status: response.status})
        }
      }).then((response) => {
        resolve(response);
      }).catch((err) => {
        reject({status: -1});
      })
    })
  }
  
  
  /**
   * 基于 fetch 封装的 POST请求
   * @param url
   * @param requstBody
   * @returns {Promise}
   */
  FetchUtil.post = function (common_url, requstBody) {
    console.log(common_url);
    return new Promise(function (resolve, reject) {
      fetch(common_url, {
        method: 'POST',
        //headers: headers,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: 'jsonStr=' + requstBody,
      }).then((response) => response.text()).then((responseText) => {
        //alert('dddb=' + responseText);
        console.log('c=' + responseText);
        resolve(responseText);
      }).catch((err) => {
        console.log(err);
      })
    })
  }
  
};