/**
 * Created by admin on 2016/9/27. 满赠
 */

//import BigDecimalUtils from '../../utils/BigDecimalUtils';
import PromotionUtils from '../../utils/PromotionUtils';

let formNo;
let currentDiscountPrice;
let conditionType;
let shopTotal;
let shopNum;
let list = [];
let planList = [];
export default class MZPromotionManger {
  static mzPromotion(custTypeCode, productBeans,dbAdapter) {
    return new Promise(()=>{
      
    });
    list = productBeans;
    let promises = [];
    let tdschead;
    PromotionUtils.custAndDate(custTypeCode,dbAdapter).then((plans)=>{
      if (plans.length!=0){
        planList = plans;
      }
      for (let planIndex = 0; planIndex < planList.length; planIndex++) {//遍历所有商品，取出最大优惠
        dbAdapter.selectTdscHead("MZ").then((tdscheadBeans)=>{
          if (tdscheadBeans.length!=0) {
            for (let i = 0; i < productBeans.length; i++) {//遍历所有商品
              let productBean = productBeans.item(i);
              PromotionUtils.isTDscExceptShop(productBean.ProdCode,dbAdapter).then((tDscExceptShop)=>{
                if (!tDscExceptShop) {//不是非促销商品
                  for (let indext = 0; indext < tdscheadBeans.length; indext++) {
                    //System.out.println(tdscheadBeans.get(indext).getFormNo());
                      tdschead = tdscheadBeans.item(indext);
                    let dtAll = tdschead.dtAll();
                    if ("1" == dtAll) {
                      //System.out.println("全场");
                    } else if ("0"==dtAll) {
                      let dtDep = tdschead.dtDep;
                      let dtSupp = tdschead.dtSupp;
                      let dtBrand = tdschead.dtBrand;
                      let dtProd = tdschead.dtProd;
                      if ("1" == dtDep) {
                        promises.push(dbAdapter.selectTDscDep(productBean.DepCode))
                      } else if ("1" == dtSupp) {
                        promises.push(dbAdapter.selectTDscSupp(productBean.SuppCode))
                      } else if ("1" == dtBrand) {
                        promises.push(dbAdapter.selectTDscBrand(productBean.BrandCode))
                      } else if ("1" == dtProd) {
                        promises.push(dbAdapter.selectTDscProd(productBean.ProdCode))
                      }
                    }
                  }
                  new Promise.all(promises).then((results) => {
                    //console.log("mj2-1=",results.length)
                    if (results.length != 0) {
                      for (let i = 0; i < results.length; i++) {
                        if (results[i]) {
                          //MJPromotionManger.initData(productBean, tdschead);
                          MZPromotionManger.initData(productBean, tdschead);
                        }
                      }
                    }
                  });
                }
              });
            }
            shopNum = 0;
            shopTotal = 0;
          }
        });
    
      }
    });
    return currentDiscountPrice;
  }
  
  static initData(productBean, tdschead) {
    shopNum += productBean.ShopNumber;
    shopTotal += productBean.ShopAmount;
    formNo = tdschead.FormNo;
    conditionType = tdschead.ConditionType;
    let price = countMZPrice(tdschead);
    if (currentDiscountPrice < price) {
      currentDiscountPrice = price;
    }
  }
  
  static countMZPrice(tdscheadBean) {
    let con1 = tdscheadBean.Con1;
    if ("0" == conditionType) {//满金额
      if (con1 < shopTotal) {
        return tdscheadBean.Con2;
      }
    } else if ("1" == conditionType) {//数量
      if (con1 < shopNum) {
        return tdscheadBean.Con2;
      }
    } else if ("2" == conditionType) {//项数
      if (con1 < list.length) {
        return tdscheadBean.Con2;
      }
    }
    return 0;
  }
  
}
