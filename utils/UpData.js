/**
 * Created by admin on 2017/11/27.
 */
import FetchUtil from '../utils/FetchUtils';
import Storage from "../utils/Storage";
import NetUtils from "../utils/NetUtils";
import RequestBodyUtils from "../utils/RequestBodyUtils";
export default class UpData {
  /***
   * 数据更新接口
   * @param url 保存的url地址
   * @param dbAdapter DbAdapter 数据库操作类对象
   * @param currShopCode  当前机构号
   * @return {Promise}
   */
  downLoadAllData = (url, dbAdapter, currShopCode) => {
    return new Promise((resolve, reject) => {
      try {
        Storage.get('ClientCode').then((tags) => {
          let params = {
            reqCode: "App_PosReq",
            reqDetailCode: "App_Client_UseQry",
            ClientCode: tags,
            sDateTime: Date.parse(new Date()),//获取当前时间转换成时间戳
            Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_UseQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
          };
          FetchUtil.post(url, JSON.stringify(params)).then((data) => {
            if (data.retcode == 1) {
              //用户信息
              var detailInfo1 = data.DetailInfo1;
              dbAdapter.insertTShopItemData(detailInfo1);
              //机构信息
              var detailInfo2 = data.DetailInfo2;
              dbAdapter.insertTUserSetData(detailInfo2);
              //权限表
              var detailInfo3 = data.DetailInfo3;
              dbAdapter.insertTUserRrightData(detailInfo3);
              //用户管理机构表
              var detailInfo4 = data.DetailInfo4;
              console.log(detailInfo4);
              dbAdapter.insertTUsershopData(detailInfo4);
              let categoryBody = RequestBodyUtils.createCategory(currShopCode);
              dbAdapter.downProductAndCategory(categoryBody, currShopCode).then((result) => {
                resolve(true);
              });
            }
          })
        });
      } catch (err) {
        resolve(true);
      }
    });
    
  }
}