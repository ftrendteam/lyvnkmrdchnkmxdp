/**
 * Created by admin on 2016/10/8.
 */
import BigDecimalUtils from '../../utils/BigDecimalUtils';
import PromotionUtils from '../../utils/PromotionUtils';
let currentDis = 0;
let planList = [];
let shopList = [];
export default class EOPromotionsManger {
  
  
  static eoPromotionsManger(productBeans, custTypeCode, dbAdapter) {
    return new Promise(()=>{
      let promises = [];
      //按价格由大到小排序
      dbAdapter.selectTdscHead("EO").then((tdscheadBeans) => {
        for (let i = 0; i < tdscheadBeans.length; i++) {
          let tdschead = tdscheadBeans.item(i);
          let dtCust = tdschead.dtCust;
          let formNo = tdschead.FormNo;
          let dtAll = tdschead.dtAll;
          console.log("tdschead=", tdschead)
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
              //for (let i = 0; i < results.length; i++) {
              //  if (results[i].length != 0) {
              //    EOPromotionsManger.initData(formNo, dbAdapter);
              //  }
              //}
              for (let i = 0; i < results.length; i++) {
                for (let j = 0; j < results[i].length; j++) {
                  shopList.push(results[i].item(j));
                  //GSPromotionsManger.number = BigDecimalUtils.add(results[i].item(j).countm, GSPromotionsManger.number,
                  // 2); console.log("dsdfasdfas=",results[i].item(j));
                }
                EOPromotionsManger.initData(formNo, dbAdapter, productBeans).then((result) => {
                  resolve(true);
                });
              }
            });
          });
        }
      });
    });
   
  }
  
  static initData(formNo, dbAdapter) {
    return new Promise(()=>{
      dbAdapter.selectTDscCondition(formNo).then((tDscConditions) => {
        console.log("eo=", formNo, tDscConditions.item(0));
        if (currentDis > tDscConditions.length - 1) {
          currentDis = 0;
        }
        let tDscCondition = tDscConditions.item(currentDis);
        let con2 = tDscCondition.Con2;
        let cxConType = tDscCondition.CxConType;
        if ("0" == cxConType) {//折扣
          //System.out.println("eo-1");
          if (productBean.getList().size() == 1) {
            productBean.setItemTotal(BigDecimalUtils.multiply(productBean.getStdPrice(),
              BigDecimalUtils.subtract(1, BigDecimalUtils.divide(con2, 100))));
          } else {
            productBean.setItemTotal(BigDecimalUtils.scaleAdd(productBean.getItemTotal(), BigDecimalUtils.multiply(productBean.getStdPrice(),
              BigDecimalUtils.subtract(1, BigDecimalUtils.divide(con2, 100)))));
          }
        } else if ("1" == cxConType) {//固定价
          //System.out.println("eo-2");
          productBean.setItemTotal(BigDecimalUtils.multiply(con2, productBean.getList().size()));
        } else if ("2" == cxConType) {//买减
          //System.out.println("eo-3");
          if (productBean.getList().size() == 1) {
            productBean.setItemTotal(BigDecimalUtils.scaleAdd(productBean.getItemTotal(), BigDecimalUtils.subtract(productBean.getStdPrice(), con2)));
          } else {
            productBean.setItemTotal(BigDecimalUtils.scaleAdd(productBean.getItemTotal(),
              BigDecimalUtils.subtract(productBean.getStdPrice(), con2)));
          }
        }
        currentDis++;
      });
    });
    
  }
}
