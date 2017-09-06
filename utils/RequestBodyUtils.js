/**
 * Created by admin on 2017/8/25.
 */
import MD5Utils from './MD5Utils';
import DateUtils from './DateUtils';
import FetchUtils from './FetchUtils'
import DataUtils from './DataUtils'
export  default class RequestBodyUtils {
  static  currPage = 1;
  static currDate = '2017-1-1 10:00:00';
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
      'ClientCode': '810001',
      'sDateTime': date,
      'Sign': sign
    });
  }

  static createYH = (reqDetailCode, clientCode) => {
    let date = DateUtils.getCurrentDate(new Date());
    let sign = MD5Utils.encryptMD5('App_PosReq' + "##" + reqDetailCode + "##" + date + "##" + 'PosControlCs');
    let DetailInfo1 = {
      "reqCode": "App_PosReq",
      "reqDetailCode": "reqDetailCode",
      "ClientCode": "clientCode",
      "sDateTime": "",
      "Sign": "",
      "username": "001",
      "usercode": "001",
      "DetailInfo1": {"ShopCode": "0", "OrgFormno": "", "ProMemo": "表单备注"},
      "DetailInfo2": [{"prodcode": "0101", "countm": 10, "ProPrice": 12, "promemo": "", "kccount": '10'}]
    };
    //let DetailInfo2 = {'prodcode': '0101', 'countm': 10, 'ProPrice': 12, 'promemo': '', 'kccount': '10'};
    return DetailInfo1;
  }

  /***
   * 品级请求体
   */
  static createCategory = () => {
    return JSON.stringify({
      'TblName': 'tdepset',
      'ShopCode': '0001',
      'PosCode': '0001',
      'NeedPage': '1',
      'PageSize': 5000,
      'CurrPageIndex': 1,
      'OrderFld': 'pid',
      'NeedYWDate': '0',
      'LastYWDate': '2016-06-04'
    });
  }

  /**
   * 商品请求体
   */
  static createProduct = (shopCode, currDate) => {
    return JSON.stringify({
      'TblName': 'product',
      'shopcode': shopCode,
      'poscode': '0001',
      'NeedPage': '0',
      'PageSize': 100,
      'CurrPage': '1',
      'OrderFld': 'pid',
      'NeedYWDate': '0',
      'LastYWDate': currDate,
    });
  }
  static CurrDate;
  /**
   * 轮询请求商品信息
   */
  //static async requestProduct = (url, shopCode, dbAdapter) => {
    //RequestBodyUtils.CurrDate =  DataUtils.get("CurrDate");
    //console.log("value2", RequestBodyUtils.CurrDate);
    //alert(RequestBodyUtils.CurrDate);
    ////do {
    //let requestBody = RequestBodyUtils.createProduct(shopCode, RequestBodyUtils.currPage);
    ////console.log("aaaa=", RequestBodyUtils.currPage);
    //console.log("aaaa=", requestBody);
    //
    //FetchUtils.post(url, requestBody).then((json) => {
    //  console.log("aaaa=", json);
    //  if (!(json == "" || json == null || json == undefined || (json == "[]"))) {
    //    const strJson = JSON.parse(json);
    //    //alert(json);
    //    let tablow = strJson.TblRow;
    //    if (strJson.CurrDate != undefined) {
    //      DataUtils.save("CurrDate", strJson.CurrDate);
    //
    //    }
    //    let count = strJson.tblRowCount;
    //    if ((count > 0)) {
    //      dbAdapter.insertProductData(tablow);
    //    }
    //    RequestBodyUtils.currPage++;
    //    RequestBodyUtils.requestProduct(url, shopCode, dbAdapter);
    //  } else {
    //    RequestBodyUtils.currPage = 1;
    //  }
    //}, (json) => {
    //  //TODO 处理请求fail
    //}).catch((err) => {
    //  console.log('jsonE=' + err);
    //});
    //} while (RequestBodyUtils.currPage != 1)
    //
  //}

}