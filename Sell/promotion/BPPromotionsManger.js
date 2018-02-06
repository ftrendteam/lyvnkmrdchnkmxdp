/**
 * Created by admin on 2016/9/28.
 */
let planList = [];
export default class BPPromotionsManger {
  
  static bpPromotons(productBeans, custTypeCode) {
    
    let tdscheadBeans = XDbUtils.getBasicDB(context).findAll(Selector.from(TdscheadBean.class).where("FormType", "=", "BP"));
    if (tdscheadBeans == null) {
      return "";
    }
    for (let i = 0; i < tdscheadBeans.size(); i++) {
      if ("1".equals(tdscheadBeans.get(i).getDtCust())) {
        let tDscProdBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscProdBean.class).where("ProdCode", "=", productBeans.getProdCode()));
        if (tDscProdBean == null) {
          return "";
        }
        let curr1 = tDscProdBean.getCurr1();//买商品的个数
        if (curr1 <= productBeans.getList().size()) {
          return tDscProdBean.getFormNo();
        } else {
          return "";
        }
      } else {
        List < TDscCustBean > tDscCustBeans = XDbUtils.getBasicDB(context).findAll(Selector.from(TDscCustBean.class).where("CustTypeCode", "=", custTypeCode).and("FormNo", "=", tdscheadBeans.get(i).getFormNo()));
        if (tDscCustBeans == null) {
          break;
        }
        for (let j = 0; j < tDscCustBeans.size(); j++) {
          let tDscPlanBeans = XDbUtils.getBasicDB(context).findAll(Selector.from(TDscPlanBean.class).where("FormNo", "=", tDscCustBeans.get(j).getFormNo()));
          if (tDscPlanBeans != null && tDscPlanBeans.size() != 0) {
            for (let index = 0; index < tDscPlanBeans.size(); index++) {
              let tDscPlanBean = tDscPlanBeans.get(index);
              let beginDate = tDscPlanBean.getBeginDate();
              let beginTime = tDscPlanBean.getBeginTime();
              let endDate = tDscPlanBean.getEndDate();
              let endTime = tDscPlanBean.getEndTime();
              let vldWeek = tDscPlanBean.getVldWeek().split("");
              let week = DateUtils.getWeek();
              let c;
              if (week != 0) {
                c = vldWeek[week - 1];
              } else {
                c = vldWeek[vldWeek.length - 1];
              }
              if (DateUtils.before(endDate) && DateUtils.after(beginDate) && c == '1') {
                if (DateUtils.compare2HMSBefore(endTime) && DateUtils.compare2HMSAfter(beginTime)) {
                  planList.add(tDscPlanBeans.get(index));
                }
              }
            }
          }
        }
      }
      
    }
    return isHasGiveShop(context, productBeans);
  }
  
  static isHasGiveShop(productBeans) {
    for (let i = 0; i < planList.size(); i++) {
      let tDscProdBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscProdBean.class).where("FormNo", "=", planList.get(i).getFormNo()).and("ProCode", "=", productBeans.getProdCode()));
      let curr1 = tDscProdBean.getCurr1();//买商品的个数
      if (curr1 <= productBeans.ShopNumber) {
        return tDscProdBean.FormNo;
      } else {
        return "";
      }
    }
    return "";
  }
}
