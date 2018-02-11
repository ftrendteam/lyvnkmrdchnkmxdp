/**
 * Created by admin on 2018/2/5.
 */
import DateUtils from '../../utils/DateUtils';
import BigDecimalUtils from '../../utils/BigDecimalUtils';
export default class DPPromotionManager {
  /**
   * 单品促销
   *
   * @param cardTypeCode
   * @param productBean 某个商品
   * @return
   */
  static dp = (cardTypeCode, productBean, dbAdapter) => {
   return new Promise((resolve, reject)=>{
      let disPrice = 0;
      let shopNewTotal = 0;
      let prodCode = productBean.ProdCode;
      let shopNum = productBean.ShopNumber;
      let saleType = productBean.SaleType;
      let barCode = productBean.BarCode;
       let dscPrice = 0;
      // console.log('wtf=',productBean)
      DPPromotionManager.isContainCustType(cardTypeCode,dbAdapter,prodCode).then((result)=>{
        // console.log("result=",result)
        if (result) {
          dbAdapter.selectTDscProd(prodCode).then((tDscProdBeans) => {
            if (tDscProdBeans != null) {
              let tDscProdBean = tDscProdBeans.item(0);
              let curr1 = tDscProdBean.Curr1;
              let str1 = tDscProdBean.Str1;
                dscPrice = tDscProdBean.DscPrice;
              //console.log("ad=", tDscProdBean)
              if (0 == str1) {
                // console.log("ad=")
                shopNewTotal = BigDecimalUtils.multiply(shopNum,
                  dscPrice, 2);
                // console.log("ad=", shopNewTotal)
              } else if (1 == str1) {
                if (shopNum <= curr1) {
                  shopNewTotal = BigDecimalUtils.multiply(shopNum,
                    dscPrice, 2);
                } else {
                  shopNewTotal = BigDecimalUtils.multiply(curr1,
                    dscPrice, 2);
                  shopNewTotal += BigDecimalUtils.multiply(shopNum
                    - curr1, productBean.StdPrice, 2);
                }
              } else if (2 == str1) {
                if (shopNum > curr1) {
                  shopNewTotal = BigDecimalUtils.multiply(curr1,
                    productBean.StdPrice, 2);
                  shopNewTotal += BigDecimalUtils.multiply(shopNum
                    - curr1, dscPrice, 2);
                } else if (shopNum < curr1) {
                  shopNewTotal = BigDecimalUtils.multiply(shopNum,
                    productBean.StdPrice, 2);
                }
              } else if (3 == str1) {
                if (shopNum > curr1) {
                  shopNewTotal = BigDecimalUtils.multiply(shopNum,
                    dscPrice, 2);
                }
              }
              productBean.ShopAmount = Number(shopNewTotal);
              // productBean.ShopPrice = dscPrice;
              resolve(productBean);
              // console.log('ccc=',productBean)
            }else{
              resolve(productBean);
              // console.log("aaaa")
            }
          });
        }else{
              // console.log("bbbbb")
          resolve(productBean);
        }
      });
      
    })
    
  }
  
  static isContainCustType=(cardTypeCode,dbAdapter,prodCode)=>{
    return new Promise((resolve, reject)=>{
      let promises = [];
      dbAdapter.selectTDscCust(cardTypeCode).then((tDscCustBeans) => {
        if (tDscCustBeans != null && tDscCustBeans.length != 0) {
         for (let i = 0; i < tDscCustBeans.length; i++) {
            promises.push(dbAdapter.selectTDscPlan(tDscCustBeans.item(i).FormNo));
          }
          new Promise.all(promises).then((promiseResults) => {
            
              for (let i = 0; i < promiseResults.length; i++) {
               for (let j = 0; j < promiseResults[i].length; j++) {
                let tDscPlanBean = promiseResults[i].item(j);
                let beginDate = tDscPlanBean.BeginDate;
                let beginTime = tDscPlanBean.BeginTime;
                let endDate = tDscPlanBean.EndDate;
                let endTime = tDscPlanBean.EndTime;
                let vldWeek = tDscPlanBean.VldWeek.split("");
                let week = DateUtils.getWeek();
                let c;
                if (week != 0) {
                  c = vldWeek[week - 1];
                } else {
                  c = -1;
                }
                //console.log(!(DateUtils.compare2HMS(DateUtils.getHSM(),endTime)) && DateUtils.compare2HMS(DateUtils.getHSM(),beginTime));
                if (DateUtils.compareDate(endDate,DateUtils.getDate()) && (DateUtils.compareDate(DateUtils.getDate(),beginDate)) && c == 1) {
                  if (!(DateUtils.compare2HMS(DateUtils.getHSM(),endTime)) && DateUtils.compare2HMS(DateUtils.getHSM(),beginTime)) {
                    dbAdapter.selectTDscProd(prodCode).then((tDscProdBeans) => {
                      console.log("tDscProdBeans",tDscProdBeans.length);
                      if (tDscProdBeans != null && tDscProdBeans.length != 0) {
                        console.log("wtf");
                        resolve(true);
                       return;
                      } else if(tDscProdBeans.length == 0){
                        resolve(false);
                        return;
                      }else if(i==tDscCustBeans.length-1&&j== promiseResults[i].length-1){
                        resolve(false);
                        return;
                      }
                    });
                  }else{
                      resolve(false);
                      return;
                  }
                 
                }else{
                    resolve(false);
                    return;
                }
                
              }
            }
        
          });
        }else{
            resolve(false);
            return;
        }
      });
    })
  }
}