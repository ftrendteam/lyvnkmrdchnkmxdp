/**
 * Created by admin on 2016/9/28. 买赠促销
 */
import PromotionUtils from '../../utils/PromotionUtils';
let planList = [];
export default class BPPromotionsManger {
  
  static bpPromotons(productBean, custTypeCode, dbAdapter) {
      console.log('123=')
    return new Promise((resolve, reject) => {
      dbAdapter.selectTdscHead("BP").then((tdscheadBeans) => {
        for (let i = 0; i < tdscheadBeans.length; i++) {
          let tdschead = tdscheadBeans.item(i);
          let dtCust = tdschead.dtCust;
          let FromNo = tdschead.FormNo;
          // console.log("bp=",dtCust)
          if (1 == dtCust) {//全场促销
            PromotionUtils.custAndDate(custTypeCode, dbAdapter,FromNo).then((plans) => {
              planList = plans;
              console.log('plans=',plans)
            });
          } else {
            PromotionUtils.custAndDate(custTypeCode, dbAdapter,FromNo).then((plans) => {
              planList = plans;
              BPPromotionsManger.isHasGiveShop(productBean, dbAdapter).then((giveFormNo) => {
                resolve(giveFormNo);
                  console.log('giveFormNo=',giveFormNo)
              });
            });
          }
        }
      });
    })
    
  }
  
  static isHasGiveShop(productBean, dbAdapter) {
   return new Promise((resolve, reject) => {
      for (let i = 0; i < planList.length; i++) {
        dbAdapter.selectTDscProd2(productBean.ProdCode, planList[i].FormNo).then((tDscProdBean) => {
          for(let j = 0;j<tDscProdBean.length;j++){
            let item = tDscProdBean.item(i);
            let curr1 = item.Curr1;//买商品的个数成立 赠送商品
            if (curr1 <= productBean.ShopNumber) {
              resolve(item.FormNo);
            } else {
              resolve("");
            }
          }
        });
      }
    })
    
  }
}
