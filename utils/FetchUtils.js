/**
 * Created by admin on 2017/8/24.
 */
export default class FetchUtils {
  /**
   * 基于 fetch 封装的 GET请求
   * @param url
   * @param params {}
   * @param headers
   * @returns {Promise}
   */
  static get = (common_url, params, headers) => {
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
          timeout:15,
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
  static post = (common_url, requstBody) => {
    
    return new Promise(function (resolve, reject) {
      fetch(common_url, {
        method: 'POST',
        //headers: headers,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: 'jsonStr=' +requstBody,
          timeout:15,
      }).then((response) => response.text()).then((responseText) => {
        
        let jsonResult = JSON.parse(responseText);
        resolve(jsonResult);
      }).catch((err) => {
          reject(err);
      })
    })
  };
}