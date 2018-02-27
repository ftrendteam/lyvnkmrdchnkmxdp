/**
 * Created by admin on 2016/9/24. 满减促销
 */
import BigDecimalUtils from '../../utils/BigDecimalUtils';
import PromotionUtils from '../../utils/PromotionUtils';
let conditionType;
let dscType;
let str1;
let dscValue;
let formNo;
let shopTotal = 0;
let shopNum = 0;
let list = [];
let isReturnPrice = false;
//let tDscDepBean;
//let tDscSuppBean;
//let tDscBrandBean;
//let tDscProdBean;
//let tdscheadBeans = [];
//let currentDiscountPrice;
let planList = [];
let dbAdapter;
export default class MJPromotionManger {
  static MJPromotion(productBeans, custTypeCode, dbAdapte) {
    dbAdapter = dbAdapte;
    list = productBeans;
    let promises = []
    let initProducts = [];
    let TDscExceptShops = [];
    let tdschead;
    return new Promise((resolve, reject) => {
      dbAdapter.selectTdscHead("MJ").then((tdscheadBeans) => {
        for (let i = 0; i < productBeans.length; i++) {//遍历所有商品
          let productBean = productBeans[i];
          TDscExceptShops.push(PromotionUtils.isTDscExceptShop(productBean.ProdCode, dbAdapter));
        }
        new Promise.all(TDscExceptShops).then((TDscExceptShop) => {//是否是非促销商品
          for (let i = 0; i < TDscExceptShop.length; i++) {
            let productBean = productBeans[i];
            let tDscExceptShop = TDscExceptShop[i];
            if (!tDscExceptShop) {//不是非促销商品 判断促销类型
              if (tdscheadBeans.length != 0) {
                for (let indext = 0; indext < tdscheadBeans.length; indext++) {
                  tdschead = tdscheadBeans.item(indext);
                  //console.log("wtf=",tdschead)
                  PromotionUtils.custAndDate(custTypeCode, dbAdapter,tdschead.FormNo).then((plans) => {
                    planList = plans;
                    for (let planIndex = 0; planIndex < planList.length; planIndex++) {//遍历促销单，取出最大优惠
                      let dtAll = tdschead.dtAll;
                      if ("1" == dtAll) {
                      } else if ("0" == dtAll) {
                        let dtDep = tdschead.dtDep;
                        let dtSupp = tdschead.dtSupp;
                        let dtBrand = tdschead.dtBrand;
                        let dtProd = tdschead.dtProd;
                        //console.log('1' == dtDep)
                        if ('1' == dtDep) {
                          console.log("dtDep")
                          promises.push(dbAdapter.selectTDscDep(productBean.DepCode))
                          //initProducts.push(MJPromotionManger.initData(productBean, tdschead))
                        } else if ('1' == dtSupp) {
                          promises.push(dbAdapter.selectTDscSupp(productBean.SuppCode))
                          //initProducts.push(MJPromotionManger.initData(productBean, tdschead))
                        } else if ('1' == dtBrand) {
                          promises.push(dbAdapter.selectTDscBrand(productBean.BrandCode))
                          //initProducts.push(MJPromotionManger.initData(productBean, tdschead))
                        } else if ('1' == dtProd) {
                          promises.push(dbAdapter.selectTDscProd(productBean.ProdCode))
                          //initProducts.push(MJPromotionManger.initData(productBean, tdschead))
                        } else {
                          //resolve(false);
                          //break;
                        }
                      } else {
                        //resolve(false);
                        //break;
                      }
                    }
                    new Promise.all(promises).then((results) => {
                      console.log("mj2sadf-1=", results)
                      if (results.length != 0) {
                        for (let i = 0; i < results.length; i++) {
                          if (results[i].length != 0) {
                            MJPromotionManger.initData(productBeans[i], tdschead).then((result) => {
                              shopNum = 0;
                              shopTotal = 0;
                              if (i == results.length - 1) {
                                resolve(result);
                              }
                            });
                          }
                        }
                      }
                    });
                  });
                  
                }
              }
            } else {
              resolve(false);
              //break
            }
          }
          
        });
    
      });
     
    });
  }
  
  static initData(productBean, tdschead) {
    return new Promise((resolve, reject) => {
      //console.log("asdf=",tdschead)
      shopNum += productBean.ShopNumber;
      shopTotal += productBean.ShopAmount;
      conditionType = tdschead.ConditionType;
      str1 = tdschead.str1;
      dscType = tdschead.DscType;
      dscValue = tdschead.DscValue;
      formNo = tdschead.FormNo;
      console.log("mj2=",shopNum, formNo)
      MJPromotionManger.countMJPrice(shopNum, formNo, productBean).then((result) => {
        resolve(true);
      });
      //let price =
      //if (currentDiscountPrice < price) {
      //  currentDiscountPrice = price;
      //}
    })
    
  }
  
  static countMJPrice(shopNum, formNo, productBean) {
    return new Promise((resolve, reject) => {
      let discountPrice = 0;
      dbAdapter.selectTDscCondition(formNo).then((select) => {
        if ("0" == conditionType) {//金额
          if ("0" == dscType) {//返款
            isReturnPrice = true;
            if ("0" == str1) {//不累加
              for (let i = select.length - 1; i >= 0; i--) {
                let con1 = select.item(i).Con1;
                if (con1 <= shopTotal) {
                  discountPrice = select.item(select.length - 1).Con2;
                  break;
                }
              }
            } else if ("1" == str1) {//累加
              let lastCon1 = 0;
              for (let i = select.length - 1; i >= 0; i--) {
                let con1 = select.item(i).Con1;
                if (con1 <= shopTotal - lastCon1) {
                  discountPrice += select.item(i).Con2;
                  lastCon1 += con1;
                }
              }
            }
          } else if ("1" == dscType) {//折扣
            isReturnPrice = false;
            for (let i = select.length - 1; i >= 0; i--) {
              let con1 = select.item(i).Con1;
              if (con1 <= shopTotal) {
                let con2 = select.item(select.length - 1).Con2;
                discountPrice = BigDecimalUtils.multiply(shopTotal, BigDecimalUtils.divide(con2, 100));
                break;
              }
            }
            
          }
        } else if ("1" == conditionType) {//数量
          if ("0" == dscType) {//返款
            isReturnPrice = true;
            if ("0" == str1) {//不累加
              for (let i = select.length - 1; i >= 0; i--) {
                let con1 = select.item(i).Con1;
                if (con1 <= shopNum) {
                  discountPrice = select.item(select.length - 1).Con2;
                  break;
                }
              }
              
              
            } else if ("1" == str1) {//累加
              let lastCon1 = 0;
              for (let i = select.length - 1; i >= 0; i--) {
                let con1 = select.item(i).Con1;
                if (con1 <= shopNum - lastCon1) {
                  discountPrice += select.item(i).Con2;
                  lastCon1 += con1;
                }
              }
            }
          } else if ("1" == dscType) {//折扣
            isReturnPrice = false;
            for (let i = select.length - 1; i >= 0; i++) {
              let con1 = select.item(i).Con1;
              if (con1 <= shopNum) {
                let con2 = select.item(select.length - 1).Con2;
                discountPrice = BigDecimalUtils.multiply(shopTotal, BigDecimalUtils.divide(con2, 100));
              }
            }
            
          }
        } else if ("2" == conditionType) {//项数
          if ("0" == dscType) {//返款
            isReturnPrice = true;
            if ("0" == str1) {//不累加
              let con1 = select.item(select.length - 1).Con1;
              if (con1 <= list.length) {
                discountPrice = select.item(select.length - 1).Con2;
//                            BigDecimalUtils.subtract(shopTotal)
              }
            } else if ("1" == str1) {//累加
              let lastCon1 = 0;
              for (let i = select.length - 1; i >= 0; i--) {
                let con1 = select.item(i).Con1;
                if (con1 <= list.length - lastCon1) {
                  discountPrice += select.item(i).Con2;
                  lastCon1 += con1;
                }
              }
            }
          } else if ("1" == dscType) {//折扣
            isReturnPrice = false;
            let con1 = select.item(select.length - 1).Con1;
            if (con1 <= list.length) {
              let con2 = select.item(select.length - 1).Con2;
              discountPrice = BigDecimalUtils.multiply(shopTotal, BigDecimalUtils.divide(con2, 100));
            }
          }
        }
        if (discountPrice > dscValue && dscValue != 0) {
          discountPrice = dscValue;
        }
        productBean.ShopAmount = BigDecimalUtils.subtract(productBean.ShopAmount, discountPrice, 2);
        //console.log("sadf=", productBean.ShopAmount, "---", productBean.ProdName)
        resolve(true);
      });
    });
    
  }
}
