/**
 * Created by admin on 2016/9/27. 满赠
 */

//import BigDecimalUtils from '../../utils/BigDecimalUtils';
import PromotionUtils from '../../utils/PromotionUtils';

let formNo;
let currentDiscountPrice;
let conditionType;
//let shopTotal;
//let shopNum;
let list = [];
let planList = [];
export default class MZPromotionManger {
  static mzPromotion(custTypeCode, productBeans, dbAdapter) {
    MZPromotionManger.shopNum = 0;
    MZPromotionManger.shopTotal = 0;
    return new Promise((resolve, reject) => {
      list = productBeans;
      let promises = [];
      let TDscExceptShops = [];
      let tdschead;
      dbAdapter.selectTdscHead("MZ").then((tdscheadBeans) => {
        if (tdscheadBeans.length != 0) {
          for (let i = 0; i < productBeans.length; i++) {//遍历所有商品
            let productBean = productBeans[i];
            TDscExceptShops.push(PromotionUtils.isTDscExceptShop(productBean.ProdCode, dbAdapter));
          }
          new Promise.all(TDscExceptShops).then((TDscExceptShop) => {//是否是非促销商品
            for (let i = 0; i < TDscExceptShop.length; i++) {
              let tDscExceptShop = TDscExceptShop[i];
              let productBean = productBeans[i];
              if (!tDscExceptShop) {//不是非促销商品
                for (let indext = 0; indext < tdscheadBeans.length; indext++) {
                  tdschead = tdscheadBeans.item(indext);
                  PromotionUtils.custAndDate(custTypeCode, dbAdapter,tdschead.FromNo).then((plans) => {
                    if (plans.length != 0) {
                      planList = plans;
                    }
                    for (let planIndex = 0; planIndex < planList.length; planIndex++) {//遍历所有商品，取出最大优惠
                      //console.log("mz2=", tdschead)
                      let dtAll = tdschead.dtAll;
                      if ("1" == dtAll) {
                        //System.out.println("全场");
                      } else if ("0" == dtAll) {
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
                      if (results.length != 0) {
                        for (let i = 0; i < results.length; i++) {
                          if (results[i].length != 0) {
                            MZPromotionManger.initData(productBeans[i], tdschead).then((result) => {
                              if (i == results.length - 1) {
                                MZPromotionManger.shopNum = 0;
                                MZPromotionManger.shopTotal = 0;
                                resolve(result);
                              }
                            });
                          }
                        }
                      }
                    });
                  });
                }
              }else{
              
              }
            }
            
          });
        }
      });
    });
  }
  static shopTotal=0;
  static shopNum=0;
  static initData(productBean, tdschead) {
    return new Promise((resolve, reject) => {
      MZPromotionManger.shopNum += productBean.ShopNumber;
      MZPromotionManger.shopTotal +=productBean.ShopAmount;
      formNo = tdschead.FormNo;
      conditionType = tdschead.ConditionType;
      //let price =
      let countMZPrice = MZPromotionManger.countMZPrice(tdschead);
      resolve(countMZPrice);
    });
    
    //if (currentDiscountPrice < price) {
    //  currentDiscountPrice = price;
    //}
  }
  
  static countMZPrice(tdscheadBean) {
    //return new Promise((resolve, reject) => {
    //
    //});
    //
    let con1 = tdscheadBean.Con1;
    if (0 == conditionType) {//满金额
      if (con1 < MZPromotionManger.shopTotal) {
        return (tdscheadBean.Con2);
      }
    } else if (1 == conditionType) {//数量
      if (con1 < MZPromotionManger.shopNum) {
        return (tdscheadBean.Con2);
      }
    } else if (2 == conditionType) {//项数
      if (con1 < list.length) {
        return (tdscheadBean.Con2);
      }
    } else {
      return (0);
    }
  }
  
}
