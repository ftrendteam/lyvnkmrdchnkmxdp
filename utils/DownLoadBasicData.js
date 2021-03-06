/**
 * Created by admin on 2017/11/23.
 */
import FetchUtils from './FetchUtils';
import Storage from './Storage';
export default class DownLoadBasicData {
  static async downLoadKgtOpt(url, shopCode, dbAdapter) {
    let requestBody = JSON.stringify({
      'TblName': 'tshopitem',
      'ShopCode': shopCode,
      'PosCode': '0001',
      'NeedPage': '0',
      'PageSize': 2000,
      'CurrPageIndex': 1,
      'OrderFld': 'pid',
      'NeedYWDate': '0',
      'LastYWDate': ''
    });
    await FetchUtils.post(url, requestBody).then((response) => {
      if ((response.retcode == 1)) {
        let tblRow2 = response.TblRow2;
        dbAdapter.insertKgopt(tblRow2);
      }
    });
    DownLoadBasicData.downLoadTshopitem(url, shopCode, dbAdapter);
    DownLoadBasicData.deownMbarCode(url,dbAdapter);
    //downLoadPosOpt(url, shopCode, dbAdapter, posCode);
    Storage.get('PosCode').then((PosCode) => {
      DownLoadBasicData.downLoadPosOpt(url, shopCode, dbAdapter, PosCode);
    });
  }
  
  static downLaodkgtuser = (url, shopCode, dbAdapter, posCode) => {
    return new Promise((resolve, reject) => {
      let requestBody = JSON.stringify({
        'TblName': 'kgtuser',
        'shopcode': shopCode,
        'poscode': posCode,
      });
      FetchUtils.post(url, requestBody).then((response) => {
        if ((response != "" && response.retcode == 1)) {
          let tblRow = response.TblRow;
          dbAdapter.insertKgtuser(tblRow);
          resolve(true);
        }
      });
    });
  }
  
  
  static deownMbarCode(url,dbAdapter){
    return new Promise((resolve, reject) => {
      let requestBody = JSON.stringify({
        'TblName': 'mbarCode',
      });
      FetchUtils.post(url, requestBody).then((response) => {
        if ((response != "" && response.retcode == 1)) {
          let tblRow = response.TblRow;
          console.log(tblRow)
          dbAdapter.insertMbarCode(tblRow)
        }
      });
    });
  }
  
  static downLoadPosOpt(url, shopCode, dbAdapter, posCode) {
    return new Promise((resolve, reject) => {
      try {
        let requestBody = JSON.stringify({
          'TblName': 'positem',
          'shopcode': shopCode,
          'poscode': posCode,
        });
        console.log("bodu=",requestBody)
        new Promise.all([FetchUtils.post(url, requestBody), DownLoadBasicData.downLaodkgtuser(url, shopCode, dbAdapter, posCode), DownLoadBasicData.downLoadTdschead(url, shopCode, dbAdapter, posCode)]).then((values) => {
          if (values.length == 3) {
            if (values[0] != "" && values[0].retcode == 1) {
              let tblRow3 = values[0].TblRow3;
              console.log("posopt",tblRow3);
              dbAdapter.insertPosOpt(tblRow3);
            }
            if (values[2]) {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            reject(false);
          }
        });
      } catch (err) {
        reject(false);
      }
    });
  }
  
  /***
   * 促销信息下载
   */
  static downLoadTdschead = (url, shopCode, dbAdapter, posCode) => {
    return new Promise((resolve, reject) => {
      let requestBody = JSON.stringify({
        'TblName': 'tdschead',
        'shopcode': shopCode,
        'poscode': posCode,
      });
      FetchUtils.post(url, requestBody).then((response) => {
        if ((response != "" && response.retcode == 1)) {
          let tDscHead = response.TblRow;
          let tDscCondition = response.TblRow1;
          let tDscCust = response.TblRow2;
          let TDscDep = response.TblRow3;
          let tDscExcept = response.TblRow4;
          let tDscGroupPrice = response.TblRow5;
          let tDscBrand = response.TblRow6;
          let tDscPlan = response.TblRow7;
          let tDscPresent = response.TblRow8;
          let tDscProd = response.TblRow9;
          let tDscSupp = response.TblRow11;
          //console.log(tDscGroupPrice)
          dbAdapter.insertTdschead(tDscHead);
          dbAdapter.insertTDscCondition(tDscCondition);
          //console.log("wtf2=",tDscHead)
          dbAdapter.inserttDscGroupPrice(tDscGroupPrice);
          dbAdapter.insertTDscDep(TDscDep);
          dbAdapter.insertTDscExcept(tDscExcept);
          dbAdapter.insertTDscCust(tDscCust);
          dbAdapter.insertTDscBrand(tDscBrand);
          dbAdapter.insertTDscPlan(tDscPlan);
          dbAdapter.inserttDscPresent(tDscPresent);
          dbAdapter.insertTDscProd(tDscProd);
          dbAdapter.insertTDscSupp(tDscSupp);
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }
  
  static async downLoadTshopitem(url, shopCode, dbAdapter) {
    let requestBody = JSON.stringify({
      'TblName': 'tshopitem',
      'ShopCode': shopCode,
      'PosCode': '0',
    });
    await FetchUtils.post(url, requestBody).then((response) => {
      if ((response != "" && response.retcode == 1)) {
        let tblRow1 = response.TblRow1;
        console.log("tblRow1=",tblRow1)
        dbAdapter.insertPayInfo(tblRow1);
        
      }
    });
  }
}