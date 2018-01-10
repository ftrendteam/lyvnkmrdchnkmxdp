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
    DownLoadBasicData.downLoadPosOpt(url, shopCode, dbAdapter);
  }
  
  static async downLoadPosOpt(url, shopCode, dbAdapter) {
    let requestBody = JSON.stringify({
      'TblName': 'positem',
      'shopcode': shopCode,
      'poscode': '0001',
    });
    await FetchUtils.post(url, requestBody).then((response) => {
      if ((response != "" && response.retcode == 1)) {
        let tblRow3 = response.TblRow3;
        dbAdapter.insertPosOpt(tblRow3);
      }
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
        dbAdapter.insertPayInfo(tblRow1);
        
      }
    });
  }
}