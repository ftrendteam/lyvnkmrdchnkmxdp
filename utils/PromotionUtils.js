/**
 * Created by admin on 2018/2/6.
 */

import DateUtils from '../utils/DateUtils';
export default class PromotionUtils {
  /**
   * 判断客户，时间
   * @param context
   * @param custTypeCode
   * @return
   * @throws DbException
   */
  static custAndDate(cardTypeCode, dbAdapter,FormNo) {
    return new Promise((resolve, reject) => {
      let promises = [];
      let plans = [];
      dbAdapter.selectTDscCust(cardTypeCode,FormNo).then((tDscCustBeans) => {
        if (tDscCustBeans != null && tDscCustBeans.length != 0) {
          for (let i = 0; i < tDscCustBeans.length; i++) {
            promises.push(dbAdapter.selectTDscPlan(tDscCustBeans.item(i).FormNo));
          }
          new Promise.all(promises).then((promiseResults) => {
            
            for (let i = 0; i < promiseResults.length; i++) {
              // console.log("wtf=",promiseResults[i])
              //console.log("wtf=",promiseResults[i].length)
              //console.log("wtf=",promiseResults[i].item(0))
              
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
                //console.log("a=",DateUtils.compareDate(endDate, DateUtils.getDate()));
                //console.log((DateUtils.compareDate(DateUtils.getDate(), beginDate)));
                //console.log(c)
                //console.log(!(DateUtils.compare2HMS(DateUtils.getHSM(), endTime)))
                //console.log(DateUtils.compare2HMS(DateUtils.getHSM(), beginTime))
                if (DateUtils.compareDate(endDate, DateUtils.getDate()) && (DateUtils.compareDate(DateUtils.getDate(), beginDate)) && c == 1) {
                  if (!(DateUtils.compare2HMS(DateUtils.getHSM(), endTime)) && DateUtils.compare2HMS(DateUtils.getHSM(), beginTime)) {
                    plans.push(tDscPlanBean)
                    resolve(plans);
                    // console.log('plans=',plans)
                    return;
                  }else{
                    resolve(plans);
                      // console.log('plans1=',plans)
                    return;
                  }
                }else{
                  resolve(plans);
                    // console.log('plans2=',plans)
                  return;
                }
              }
            }
            
          });
        }
      });
    })
    
  }
  
  /**
   * 是否是非促销商品
   * @param context
   * @param prodCode
   * @return
   */
  static isTDscExceptShop(prodCode, dbAdapter) {
    return new Promise((resolve, reject) => {
      dbAdapter.selectTDscExcept(prodCode).then((results) => {
        if (results.length != 0) {
          resolve(true);//非促销商品 不参与优惠
        } else {
          resolve(false);//可以参与优惠
        }
      });
    })
  }
  
}