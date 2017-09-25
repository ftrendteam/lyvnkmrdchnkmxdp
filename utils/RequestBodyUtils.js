/**
 * Created by admin on 2017/8/25.
 */
import MD5Utils from './MD5Utils';
import DateUtils from './DateUtils';
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
      'ClientCode': clientCode,
      'sDateTime': date,
      'Sign': sign
    });
  }
  
  /***
   *  要货单据请求
   * @param reqDetailCode
   * @param clientCode
   * @return {{reqCode: string, reqDetailCode: string, ClientCode: string, sDateTime: string, Sign: string, username:
   *   string, usercode: string, DetailInfo1: {ShopCode: string, OrgFormno: string, ProMemo: string}, DetailInfo2:
   *   [*]}}
   */
  static createYH = (clientCode) => {
    let date = DateUtils.getCurrentDate(new Date());
    let sign = MD5Utils.encryptMD5('App_PosReq' + "##" + "App_Client_ProYH" + "##" + date + "##" + 'PosControlCs');
    let DetailInfo1 = {
      "reqCode": "App_PosReq",
      "reqDetailCode": "App_Client_ProYH",
      "ClientCode": clientCode,
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
   *  配送收货单
   * @param reqDetailCode
   * @param clientCode
   * @return {{reqCode: string, reqDetailCode: string, ClientCode: string, sDateTime: string, Sign: string, username:
   *   string, usercode: string, DetailInfo1: {ShopCode: string, OrgFormno: string, ProMemo: string}, DetailInfo2:
   *   [*]}}
   */
  static createPS = (clientCode,orgFormno) => {
    let date = DateUtils.getCurrentDate(new Date());
    let sign = MD5Utils.encryptMD5('App_PosReq' + "##" + "App_Client_ProPSSH" + "##" + date + "##" + 'PosControlCs');
    let DetailInfo1 = {
      "reqCode": "App_PosReq",
      "reqDetailCode": "App_Client_ProPSSH",
      "ClientCode": clientCode,
      "sDateTime": "",
      "Sign": "",
      "username": "001",
      "usercode": "001",
      "DetailInfo1": {"ShopCode": "0", "OrgFormno": ""+orgFormno+"", "ProMemo": "表单备注"},
      "DetailInfo2": [{"prodcode": "0101", "countm": 10, "ProPrice": 12, "promemo": "", "kccount": '10'}]
    };
    //let DetailInfo2 = {'prodcode': '0101', 'countm': 10, 'ProPrice': 12, 'promemo': '', 'kccount': '10'};
    return DetailInfo1;
  }
  
  /***
   *  商品盘点单
   * @param reqDetailCode
   * @param clientCode
   * @return {{reqCode: string, reqDetailCode: string, ClientCode: string, sDateTime: string, Sign: string, username:
   *   string, usercode: string, DetailInfo1: {ShopCode: string, OrgFormno: string, ProMemo: string}, DetailInfo2:
   *   [*]}}
   */
  static createPD = (clientCode,orgFormno) => {
    let date = DateUtils.getCurrentDate(new Date());
    let sign = MD5Utils.encryptMD5('App_PosReq' + "##" + "App_Client_ProPC" + "##" + date + "##" + 'PosControlCs');
    let DetailInfo1 = {
      "reqCode": "App_PosReq",
      "reqDetailCode": "App_Client_ProPC",
      "ClientCode": clientCode,
      "sDateTime": "",
      "Sign": "",
      "username": "001",
      "usercode": "001",
      "DetailInfo1": {"ShopCode": "0", "OrgFormno": ""+orgFormno+"", "ProMemo": "表单备注"},
      "DetailInfo2": [{"prodcode": "0101", "countm": 10, "ProPrice": 12, "promemo": "", "kccount": '10'}]
    };
    //let DetailInfo2 = {'prodcode': '0101', 'countm': 10, 'ProPrice': 12, 'promemo': '', 'kccount': '10'};
    return DetailInfo1;
  }
  
  /***
   *  实时盘点
   * @param reqDetailCode
   * @param clientCode
   * @return {{reqCode: string, reqDetailCode: string, ClientCode: string, sDateTime: string, Sign: string, username:
   *   string, usercode: string, DetailInfo1: {ShopCode: string, OrgFormno: string, ProMemo: string}, DetailInfo2:
   *   [*]}}
   */
  static createSSPD = (clientCode) => {
    let date = DateUtils.getCurrentDate(new Date());
    let sign = MD5Utils.encryptMD5('App_PosReq' + "##" + "App_Client_ProCurrPC" + "##" + date + "##" + 'PosControlCs');
    let DetailInfo1 = {
      "reqCode": "App_PosReq",
      "reqDetailCode": "App_Client_ProCurrPC",
      "ClientCode": clientCode,
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
   *  商品损益
   * @param reqDetailCode
   * @param clientCode
   * @return {{reqCode: string, reqDetailCode: string, ClientCode: string, sDateTime: string, Sign: string, username:
   *   string, usercode: string, DetailInfo1: {ShopCode: string, OrgFormno: string, ProMemo: string}, DetailInfo2:
   *   [*]}}
   */
  static createSY = (clientCode,userName,userCode) => {
    let date = DateUtils.getCurrentDate(new Date());
    let sign = MD5Utils.encryptMD5('App_PosReq' + "##" + "App_Client_ProSY" + "##" + date + "##" + 'PosControlCs');
    let DetailInfo1 = {
      "reqCode": "App_PosReq",
      "reqDetailCode": "App_Client_ProSY",
      "ClientCode": clientCode,
      "sDateTime": date,
      "Sign": sign+"",
      "username": userName,
      "usercode": userCode,
      "DetailInfo1": {"ShopCode": "0", "OrgFormno": "", "ProMemo": "表单备注"},
      "DetailInfo2": [{"prodcode": "0101", "countm": 10, "ProPrice": 12, "promemo": "", "kccount": '10'}]
    };
    //let DetailInfo2 = {'prodcode': '0101', 'countm': 10, 'ProPrice': 12, 'promemo': '', 'kccount': '10'};
    return DetailInfo1;
  }
  
  /***
   * 单据查询,根据不同的reqDetailCode,请求不同单据信息
   */
  businessSelect(reqDetailCode, clientCode) {
    let date = DateUtils.getCurrentDate(new Date());
    let sign = MD5Utils.encryptMD5('App_PosReq' + "##" + reqDetailCode + "##" + date + "##" + 'PosControlCs');
    return JSON.stringify({
      'reqCode': 'App_PosReq'  //固定内容
      , 'reqDetailCode': reqDetailCode,
      //固定内容 App_Client_ProYHQ 要货单
      //App_Client_ProPSSHQ配送收货单
      //App_Client_ProPCQ商品盘点单
      //App_Client_ProCurrPCQ实时盘点
      //App_Client_ProSYQ 商品损益
      'ClientCode': clientCode, //商户号编码
      'sDateTime': date, //时间戳
      'Sign': sign + '',
    });
  }
  
  /***
   * 单据详情查询
   * ClientCode传入固定内容
   *  App_Client_ProYHDetailQ 要货单
   *  App_Client_ProPSSHDetailQ配送收货单
   *  App_Client_ProPCDetailQ商品盘点单
   *  App_Client_ProCurrPCDetailQ实时盘点
   *  App_Client_ProSYDetailQ  商品损益
   *
   */
  businessDetailSelect(reqDetailCode,clientCode,beginDate,endDate,shopcode,formno,prodcode) {
    let date = DateUtils.getCurrentDate(new Date());
    let sign = MD5Utils.encryptMD5('App_PosReq' + "##" + reqDetailCode + "##" + date + "##" + 'PosControlCs');
    return JSON.stringify({
      'reqCode':'App_PosReq'  //固定内容
      ,'reqDetailCode':reqDetailCode
      ,'ClientCode':clientCode //商户号编码
      ,'sDateTime':date //时间戳
      ,'Sign':'sign'
      //校验MD5(reqCode + '##' + reqDetailCode + '##' + sDateTime + '##' + 'PosControlCs')
      ,'username':'收银员1' //用户名称
      ,'usercode':'001' //用户编码
      ,'BeginDate':beginDate //开始日期
      ,'EndDate':endDate //截止日期
      ,'shopcode':shopcode //机构号
      ,'formno':formno //过滤的单据信息
      ,'prodcode':prodcode //过滤用的商品编码
    });
  }
  
  /***
   * 品级请求体
   */
  static createCategory = (shopCode) => {
    return JSON.stringify({
      'TblName': 'tdepset',
      'ShopCode': shopCode,
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
   * 商品请求体  shopCode 根据当前的选择的机构下载商品
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