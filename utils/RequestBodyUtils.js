/**
 * Created by admin on 2017/8/25.
 */
import MD5Utils from './MD5Utils';
import DateUtils from './DateUtils';

export default class RequestBodyUtils {
  /***
   * 验证商户号请求
   * @param clientCode 商户号
   * @param pwd 密码
   */
  static createShopCode = (clientCode, pwd) => {
    let date = DateUtils.getCurrentDate(new Date());
    let md5Pwd = MD5Utils.encryptMD5(pwd);
    console.log('date=' + date + ',pwd=' + md5Pwd);
    let sign = MD5Utils.encryptMD5('App_PosReq' + '##' + 'App_Client_Qry' + '##' + date + '##' + 'PosControlCs');
    return JSON.stringify({
      'reqCode': 'App_PosReq',
      'reqDetailCode': 'App_Client_Qry',
      'ClientCode': clientCode,
      'sDateTime': date,
      'Pwd': md5Pwd + '',
      'Sign': sign + '',
    });
  }
  
  static createDownload = () => {
    let date = DateUtils.getCurrentDate(new Date());
    let sign = MD5Utils.encryptMD5('App_PosReq' + "##" + 'App_Client_UseQry' + "##" + date + "##" + "PosControlCs");
    return JSON.stringify({
      'reqCode': 'App_PosReq',
      'reqDetailCode': 'App_Client_UseQry',
      'ClientCode': '810001',
      'sDateTime': date,
      'Sign': sign
    });
  }
}
/**
   * 数据下发
   * @param clientCode 商户号
   */
  static createDownload = (clientCode) => {
    let date = DateUtils.getCurrentDate(new Date());
    let sign = MD5Utils.encryptMD5('App_PosReq' + "##" + 'App_Client_UseQry' + "##" + date + "##" + "PosControlCs");
    return JSON.stringify({
      'reqCode': 'App_PosReq',
      'reqDetailCode': 'App_Client_UseQry',
      'ClientCode': clientCode,
      'sDateTime': date,
      'Sign': sign + '',
    });
  }