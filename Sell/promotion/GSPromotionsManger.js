/**
 * Created by admin on 2016/9/29. 组合促销
 */

import BigDecimalUtils from '../../utils/BigDecimalUtils';
import PromotionUtils from '../../utils/PromotionUtils';

let planList = [];
let shopList = [];
let autoMulti;

export default class GSPromotionsManger {
  static number = 0;
  
  static gsPromotionsManger(productBeans, custTypeCode, dbAdapter) {
    //按价格由大到小排序
    let promises = [];
    return new Promise((resolve, reject) => {
      dbAdapter.selectTdscHead("GS").then((tdscheadBeans) => {//获取所有的组合促销单号
        if (tdscheadBeans.length != 0) {
          for (let i = 0; i < tdscheadBeans.length; i++) {
            let tdschead = tdscheadBeans.item(i);
            let dtCust = tdschead.dtCust;
            let dtAll = tdschead.dtAll;
            let FormNo = tdschead.FormNo;
            PromotionUtils.custAndDate(custTypeCode, dbAdapter, FormNo).then((plans) => {//判断是否符合条件
              planList = plans;
              if ("1" == dtCust) {
                
                if (!tDscExceptShop) {
                  //System.out.println("非促销商品!");
                  let tdschead = tdscheadBeans.item(i);
                  //console.log("tdschead=" + tdschead)
                  let dtAll = tdschead.dtAll;
                  if ("1" == dtAll) {
                    //System.out.println("全场");
                    GSPromotionsManger.initData(autoMulti, formNo, dbAdapter).then((result) => {
                      resolve(true);
                    });
                  } else if ("0" == dtAll) {
                    let dtDep = tdschead.dtDep;
                    let dtSupp = tdschead.dtSupp;
                    let dtBrand = tdschead.dtBrand;
                    let dtProd = tdschead.dtProd;
                    autoMulti = tdschead.AutoMulti;
                    if ("1" == dtDep) {
                      promises.push(dbAdapter.selectTDscDepAll(FormNo));
                    } else if ("1" == dtSupp) {
                      promises.push(dbAdapter.selectTDscSuppAll(FormNo));
                    } else if ("1" == dtBrand) {
                      promises.push(dbAdapter.selectTDscBrandAll(FormNo));
                    } else if ("1" == dtProd) {
                      promises.push(dbAdapter.selectTDscProdAll(FormNo))
                    }
                  }
                }
                new Promise.all(promises).then((results) => {
                  for (let i = 0; i < results.length; i++) {
                    if (results[i].length != 0) {
                      //shopList.add(productBeans.get(i));
                      GSPromotionsManger.initData(autoMulti, formNo, dbAdapter).then((result) => {
                        resolve(true);
                      });
                    }
                  }
                });
              } else {
                //获取符合当前客户的促销单号
                for (let planIndex = 0; planIndex < planList.length; planIndex++) {
                  let formNo = planList[i].FormNo;
                  let tdschead = tdscheadBeans.item(i);
                  //console.log("tdschead=" , tdschead)
                  let dtAll = tdschead.dtAll;
                  if ("1" == dtAll) {
                    //System.out.println("全场");
                    GSPromotionsManger.initData(autoMulti, formNo, dbAdapter).then((result) => {
                      resolve(true);
                    });
                  } else if ("0" == dtAll) {
                    let dtDep = tdschead.dtDep;
                    let dtSupp = tdschead.dtSupp;
                    let dtBrand = tdschead.dtBrand;
                    let dtProd = tdschead.dtProd;
                    autoMulti = tdschead.AutoMulti;
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
                  if (tdscheadBeans != null) {
                    new Promise.all(promises).then((results) => {//获取到所有符合条件的商品
                      for (let i = 0; i < results.length; i++) {
                        for (let j = 0; j < results[i].length; j++) {
                          shopList.push(results[i].item(j));
                          GSPromotionsManger.number = BigDecimalUtils.add(results[i].item(j).countm, GSPromotionsManger.number, 2);
                          //console.log("dsdfasdfas=",results[i].item(j));
                        }
                        if (results[i].length != 0) {
                          GSPromotionsManger.initData(autoMulti, formNo, dbAdapter, productBeans).then((result) => {
                            resolve(true);
                          });
                        }
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    })
    
    
  }
  
  static initData(autoMulti, formNo, dbAdapter, productBeans) {
    return new Promise((resolve, reject) => {
      dbAdapter.selectTDscGroupPrice(formNo).then((tDscGroupPrices) => {
        //console.log("b=", autoMulti, formNo)
        //console.log("b=", tDscGroupPrices)
        if (tDscGroupPrices.length == 0) {
          resolve(false);
        }
        
        if ("1" == autoMulti) {//自动倍数
          //System.out.println("1-1");
          let count = 0;
          //let size = shopList.length;
          //console.log(tDscGroupPriceBean)
          for (let i = tDscGroupPrices.length - 1; i >= 0; i--) {
            let tDscGroupPriceBean = tDscGroupPrices.item(i);
            let groupCountN = tDscGroupPriceBean.GroupCountN;
            let groupTotal = tDscGroupPriceBean.GroupTotal;
            count++;
            if (GSPromotionsManger.number - groupCountN * count >= groupCountN) {
              for (let j = 0; j < shopList.length; j++) {
                let shopListPro = shopList[j];
                let remainder = shopListPro.countm%groupCountN;//计算是否含有小数
                if(remainder==0){
                  shopListPro.prototal=BigDecimalUtils.multiply(BigDecimalUtils.divide(shopListPro.countm,groupCountN,2),groupTotal,2);
                }else{
                  shopListPro.prototal=BigDecimalUtils.add(BigDecimalUtils.multiply(BigDecimalUtils.divide(shopListPro.countm,groupCountN,0),groupTotal,2),
                    BigDecimalUtils.multiply(remainder,shopListPro.prototal,2),2);
                }
                
                //shopListPro.prototal = BigDecimalUtils.divide(groupTotal, groupCountN, 2)
                console.log("wnale=", shopListPro.prototal);
                for (let i = 0; i < productBeans.length; i++) {
                  console.log(productBeans[i].Pid,shopListPro.pid)
                  if (productBeans[i].Pid==shopListPro.pid) {
                    productBeans[i].ShopAmount = shopListPro.prototal;
                  }
                }
              }
              resolve(true);
            }
            
          }
        } else if ("0" == autoMulti) {
          
          for (let i = tDscGroupPrices.length - 1; i >= 0; i--) {
            let tDscGroupPriceBean = tDscGroupPrices.item(i);
            let groupCountN = tDscGroupPriceBean.GroupCountN;
            let groupTotal = tDscGroupPriceBean.GroupTotal;
            console.log("wtfuck2=", GSPromotionsManger.number, groupCountN, groupTotal)
            if (shopList.length >= groupCountN) {
              for (let j = 0; j <= groupCountN; j++) {
                shopList[j].prototal = BigDecimalUtils.divide(groupTotal, groupCountN, 2);
                resolve(true);
                break;
              }
            }
          }
        }
      });
    });
    
  }
}