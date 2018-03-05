/**
 * Created by admin on 2016/9/19.分组促销
 */
//import DateUtils from '../../utils/DateUtils';
import BigDecimalUtils from '../../utils/BigDecimalUtils';
import PromotionUtils from '../../utils/PromotionUtils';
export default class BGPromotionManager {
  static BGPromotion(custTypeCode, productBean, dbAdapter) {
      return new Promise((resolve, reject) => {
      let prodCode = productBean.ProdCode;
        dbAdapter.selectTdscHead("BG").then((tdscheadBeans) => {
          let promises = [];
          if (tdscheadBeans.length != 0) {
            for (let i = 0; i < tdscheadBeans.length; i++) {
              let tdscheadBean = tdscheadBeans.item(i);
              let formNo = tdscheadBean.FormNo;
              let dtDep = tdscheadBean.dtDep;
              let dtSupp = tdscheadBean.dtSupp;
              let dtBrand = tdscheadBean.dtBrand;
              new Promise.all([PromotionUtils.isTDscExceptShop(prodCode, dbAdapter), PromotionUtils.custAndDate(custTypeCode, dbAdapter,formNo)]).then((results) => {
                if (results.length != 0 && !results[0] == true && results[1].length != 0) {//表示不是非促销商品
                  console.log("tdscheadBean=",tdscheadBean)
                  if ("1" == tdscheadBean.dtAll) {
                    //System.out.println("1");
                    let dscValue = tdscheadBean.DscValue;
                    let priceMode = tdscheadBean.PriceMode;
                    let dscType = tdscheadBean.DscType;
                    //console.log("sdfasdf="dscValue)
                    BGPromotionManager.b(productBean, dscValue, dscType, priceMode);
                    if (i == tdscheadBeans.length - 1) {
                      resolve(productBean);
                    }
                  } else if ("0" == tdscheadBean.dtAll) {//非全场促销判断客户和时间范围
                    if ("1" == dtDep) {
                      promises.push(dbAdapter.selectTDscDep(productBean.DepCode));
      
                    } else if ("1" == dtSupp) {
                      promises.push(dbAdapter.selectTDscSupp(productBean.SuppCode));
      
                    } else if ("1" == dtBrand) {
                      promises.push(dbAdapter.selectTDscBrand(productBean.BrandCode));
      
                    }else{
                      resolve(false);
                    }
                  }
                } else {
                  resolve(false);
                }
                new Promise.all(promises).then((results2) => {
                  console.log("BGresults2", results2);
                  if (results2.length != 0) {
                    for (let i = 0; i < results2.length; i++) {
                      if(results2[i].length!=0){
                        for (let j = 0; j < results2[i].length; j++) {
                          let object = results2[i].item(j);
                          // console.log(object)
                          let dscValue = object.DscValue;
                          console.log('dscValue=',dscValue)
                          let priceMode = object.PriceMode;
                          let dscType = object.DscType;
                          BGPromotionManager.b(productBean, dscValue, dscType, priceMode);
                          resolve(productBean);
                          console.log('productBean',productBean)
                        }
                      }else{
                        resolve(false);
                      }
        
                    }
                  } else {
                    resolve(false);
                  }
                });
              });
            }
          } else {
            resolve(false);
          }
        });
      
    });
  }
  
  static b(productBean, dscValue, dscType, priceMode) {
    let stdOPrice = productBean.StdOPrice;
    let stdPrice = productBean.StdPrice;
    let vipPrice1 = productBean.VipPrice1;
    let vipPrice2 = productBean.VipPrice2;
    let vipPrice3 = productBean.VipPrice3;
    let wPrice = productBean.WPrice;
     //console.log("priceMode=", priceMode)
    if ("0" == priceMode) {
      BGPromotionManager.setShopTotal(productBean, dscValue, stdOPrice, dscType);
    } else if ("1" == priceMode) {
      BGPromotionManager.setShopTotal(productBean, dscValue, stdPrice, dscType);
    } else if ("2" == priceMode) {
      BGPromotionManager.setShopTotal(productBean, dscValue, vipPrice1, dscType);
    } else if ("3" == priceMode) {
      BGPromotionManager.setShopTotal(productBean, dscValue, vipPrice2, dscType);
    } else if ("4" == priceMode) {
      BGPromotionManager.setShopTotal(productBean, dscValue, vipPrice3, dscType);
    } else if ("5" == priceMode) {
      BGPromotionManager.setShopTotal(productBean, dscValue, wPrice, dscType);
    }
  }
  
  static setShopTotal(productBean, dscValue, basePrice, dscType) {
    //console.log('dscType=', dscValue, basePrice, dscType)
    let shopPrice = 0;
    if ("Z" == dscType) {
      let discountRate = BigDecimalUtils.multiply(basePrice,
        BigDecimalUtils.subtract(1, BigDecimalUtils.divide(dscValue, 100)));
      shopPrice = discountRate;
      let s = BigDecimalUtils.multiply(productBean.ShopNumber,
        discountRate);
       //console.log('z=', s)
      productBean.ShopAmount = Number(s);
        //console.log('s=',s)
      //productBean.setItemTotal(s);
    } else if ("S" == dscType) {
      let newPrice = BigDecimalUtils.add(basePrice, BigDecimalUtils.multiply(basePrice, BigDecimalUtils.divide(dscValue, 100)));
      let multiply = BigDecimalUtils.multiply(productBean.ShopNumber,
        newPrice);
      shopPrice = newPrice;
      if (multiply < productBean.StdPrice) {
        //productBean.ShopAmount = BigDecimalUtils.multiply(productBean.StdPrice,);
        //productBean.ShopPrice = productBean.StdPrice;
        //productBean.setItemTotal(productBean.StdPrice);
        //productBean.setItemTotal(multiply);
        productBean.ShopAmount =Number(multiply);
        //console.log('multiply=',multiply)
      }
    }
    //console.log("BG=", productBean);
  }
}
