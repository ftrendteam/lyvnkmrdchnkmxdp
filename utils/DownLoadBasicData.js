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
    // DownLoadBasicData.downLoadPosOpt(url, shopCode, dbAdapter);
  }
  
  static downLoadPosOpt(url, shopCode, dbAdapter,posCode) {
    return new Promise((resolve, reject)=>{
      try {
          Storage.get('ShopCode').then((ShopCode) => {
              Storage.get('PosCode').then((PosCode) => {
                  Storage.get('LinkUrl').then((tags) => {
                        let requestBody = JSON.stringify({
                            'TblName': 'positem',
                            'shopcode': ShopCode,
                            'poscode': PosCode,
                        });
                        FetchUtils.post(tags, requestBody).then((response) => {
                            if ((response != "" && response.retcode == 1)) {
                                let tblRow3 = response.TblRow3;
                                dbAdapter.insertPosOpt(tblRow3);
                                resolve(true);
                            }else{
                                reject(false);
                            }
                        });
                  })
              })
          })
      }catch (err){
          reject(false);
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