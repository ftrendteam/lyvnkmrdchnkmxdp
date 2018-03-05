/**
 * Created by admin on 2016/10/8.
 */
import BigDecimalUtils from '../../utils/BigDecimalUtils';
import PromotionUtils from '../../utils/PromotionUtils';
let planList = [];
let shopList = [];
export default class EOPromotionsManger {
  /***
   *
   * @param productBeans 商品数组
   * @param custTypeCode 用户类型
   * @param dbAdapter 数据库操作类
   * @return {Promise}
   */
  static eoPromotionsManger(productBeans, custTypeCode, dbAdapter) {
    return new Promise((resolve, reject) => {
      let promises = [];
      //按价格由大到小排序
      dbAdapter.selectTdscHead("EO").then((tdscheadBeans) => {
        if (tdscheadBeans == 0) {
          resolve(false);
          return;
        }
        for (let i = 0; i < tdscheadBeans.length; i++) {
          let tdschead = tdscheadBeans.item(i);
          let dtCust = tdschead.dtCust;
          let formNo = tdschead.FormNo;
          let dtAll = tdschead.dtAll;
          let autoMulti = tdschead.AutoMulti;
          PromotionUtils.custAndDate(custTypeCode, dbAdapter, formNo).then((plans) => {
            planList = plans;
            if ("1" == dtCust) {
              //System.out.println("所有顾客aaaaa");
            } else {
              if ("1" == dtAll) {
                //System.out.println("全场");
              } else if ("0" == dtAll) {
                let dtDep = tdschead.dtDep;
                let dtSupp = tdschead.dtSupp;
                let dtBrand = tdschead.dtBrand;
                let dtProd = tdschead.dtProd;
                let autoMulti = tdschead.AutoMulti;
                if ("1" == dtDep) {
                  promises.push(dbAdapter.selectTDscDepAll(formNo));
                } else if ("1" == dtSupp) {
                  promises.push(dbAdapter.selectTDscSuppAll(formNo));
                } else if ("1" == dtBrand) {
                  promises.push(dbAdapter.selectTDscBrandAll(formNo));
                } else if ("1" == dtProd) {
                  promises.push(dbAdapter.selectTDscProdAll(formNo))
                }
              }
            }
            new Promise.all(promises).then((results) => {
              for (let i = 0; i < results.length; i++) {
                for (let j = 0; j < results[i].length; j++) {
                  shopList.push(results[i].item(j));
                }
                EOPromotionsManger.initData(formNo, dbAdapter, productBeans, autoMulti).then((result) => {
                  resolve(true);
                });
              }
            });
          });
        }
      });
    });
    
  }
  
  static initData(formNo, dbAdapter, productBeans, autoMulti) {
    let price = 0;
    return new Promise((resolve, reject) => {
      dbAdapter.selectTDscCondition(formNo).then((tDscConditions) => {
        for (let j = 0; j < shopList.length; j++) {
          let count = 0;
          let loopCount = 0;
          if (shopList[j].countm % tDscConditions.length == 0) {
            count = shopList[j].countm / tDscConditions.length;
          } else {
            count = parseInt(shopList[j].countm / tDscConditions.length) +shopList[j].countm % tDscConditions.length;
          }
          //console.log("count=",count);
          for (let n = 0; n < count; n++) {
            for (let i = 0; i < tDscConditions.length; i++) {
                let tDscCondition = tDscConditions.item(i);
                let con1 = tDscCondition.Con1;
                let con2 = tDscCondition.Con2;
                let cxConType = tDscCondition.cxConType;
                if ("0" == cxConType) {//折扣
                for (let k = loopCount * tDscConditions.length + 1; k <= shopList[j].countm; k++) {
                  if ((k - loopCount * tDscConditions.length) == con1) {
                    //console.log(BigDecimalUtils.multiply(BigDecimalUtils.subtract(1, BigDecimalUtils.divide(con2, 100, 2), 2),
                    //  shopList[j].ShopPrice, 2))
                    price = BigDecimalUtils.add(BigDecimalUtils.multiply(BigDecimalUtils.subtract(1, BigDecimalUtils.divide(con2, 100, 2), 2),
                      shopList[j].ShopPrice, 2), price, 2);
                    //console.log("price===",price)
                  }
                }
                //if (tDscConditions.length < shopList[j].countm || i == tDscConditions.length - 1) {
                //  count++;
                //}
                
              }
              //else if ("1" == cxConType) {//固定价
              //  //System.out.println("eo-2");
              //  productBean.setItemTotal(BigDecimalUtils.multiply(con2, productBean.getList().size()));
              //} else if ("2" == cxConType) {//买减
              //  //System.out.println("eo-3");
              //  //if (productBean.getList().size() == 1) {
              //  //  //productBean.setItemTotal(BigDecimalUtils.scaleAdd(productBean.getItemTotal(),
              //  // BigDecimalUtils.subtract(productBean.getStdPrice(), con2))); } else {
              //  // productBean.setItemTotal(BigDecimalUtils.scaleAdd(productBean.getItemTotal(),
              //  // BigDecimalUtils.subtract(productBean.getStdPrice(), con2))); }
              //}
            }
            loopCount++;
          }
          
          shopList[j].prototal = price;
          //重新赋值商品价格
          for (let m = 0; m < productBeans.length; m++) {
            if (productBeans[m].Pid == shopList[j].pid) {
              productBeans[m].ShopAmount = Number(shopList[j].prototal);
            }
          }
        }
        
        resolve(true);
      });
    });
    
  }
}
