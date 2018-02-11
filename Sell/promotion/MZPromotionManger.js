/**
 * Created by admin on 2016/9/27.
 */
let formNo;
let currentDiscountPrice;
let conditionType;
let shopTotal;
let shopNum;
let list = [];
let planList = [];
export default class MZPromotionManger {
  
  
  static mzPromotion(custTypeCode, productBeans) {
    list = productBeans;
    
    let tDscCustBeans = XDbUtils.getBasicDB(context).findAll(Selector.from(TDscCustBean.class).where("CustTypeCode", "=", custTypeCode));
    if (tDscCustBeans != null) {
      //判断所有的促销是否符合时间要求
      for (let j = 0; j < tDscCustBeans.size(); j++) {
        let tDscPlanBeans = XDbUtils.getBasicDB(context).findAll(Selector.from(TDscPlanBean.class).where("FormNo", "=", tDscCustBeans.get(j).getFormNo()));
        if (tDscPlanBeans != null && tDscPlanBeans.size() != 0) {
          for (let index = 0; index < tDscPlanBeans.size(); index++) {
            let tDscPlanBean = tDscPlanBeans.get(index);
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
            if (DateUtils.before(endDate) && DateUtils.after(beginDate) && c == 1) {
              if (DateUtils.compare2HMSBefore(endTime) && DateUtils.compare2HMSAfter(beginTime)) {
                planList.add(tDscPlanBeans.get(index));
              } else {
                //System.out.println("日期不符合");
              }
            }
          }
        }
      }
    }
    
    for (let planIndex = 0; planIndex < planList.size(); planIndex++) {//遍历所有商品，取出最大优惠
      let tdscheadBeans = XDbUtils.getBasicDB(context).
        findAll(Selector.from(TdscheadBean.class).where("FormType", "=", "MZ").
          and("FormNo", "=", planList.get(planIndex).getFormNo()));
//            System.out.println("tdscheadBeans=-=-"+tdscheadBeans.size());
      if (tdscheadBeans != null) {
        for (let i = 0; i < productBeans.length; i++) {//遍历所有商品
          let productBean = productBeans[i];
          let tDscExceptShop = PromotionUtils.isTDscExceptShop(productBean.ProdCode);
          if (!tDscExceptShop) {
            //System.out.println("非促销商品!");
            continue;
          }
          for (let indext = 0; indext < tdscheadBeans.size(); indext++) {
            //System.out.println(tdscheadBeans.get(indext).getFormNo());
            let dtAll = tdscheadBeans.get(indext).getDtAll();
            if ("1" == dtAll) {
              //System.out.println("全场");
            } else if ("0".equals(dtAll)) {
              let dtDep = tdscheadBeans.get(indext).getDtDep();
              let dtSupp = tdscheadBeans.get(indext).getDtSupp();
              let dtBrand = tdscheadBeans.get(indext).getDtBrand();
              let dtProd = tdscheadBeans.get(indext).getDtProd();
              if ("1" == dtDep) {
                let tDscDepBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscDepBean.class).where("DepCode ", "=", productBean.getDepCode()));
                if (tDscDepBean != null) {
                  //System.out.println("zhixing-1");
                  MZPromotionManger.initData(indext, productBean, tdscheadBeans, context);
                }
              } else if ("1" == dtSupp) {
                let tDscSuppBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscSuppBean.class).where("CuppCode ", "=", productBean.getSuppCode()));
                if (tDscSuppBean != null) {
                  //System.out.println("zhixing-2");
                  MZPromotionManger.initData(indext, productBean, tdscheadBeans, context);
                }
              } else if ("1" == dtBrand) {
                let tDscBrandBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscBrandBean.class).where("BrandCode ", "=", productBean.getBrandCode()));
                if (tDscBrandBean != null) {
                  //System.out.println("zhixing-3");
                  MZPromotionManger.initData(indext, productBean, tdscheadBeans, context);
                }
              } else if ("1" == dtProd) {
                let tDscProdBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscProdBean.class).where("ProdCode  ", "=", productBean.getProdCode()));
                if (tDscProdBean != null) {
                  //System.out.println("zhixing-4");
                  MZPromotionManger.initData(indext, productBean, tdscheadBeans, context);
                }
              }
            }
          }
        }
        shopNum = 0;
        shopTotal = 0;
      }
    }
    return currentDiscountPrice;
  }
  
  static initData(indext, productBean, tdscheadBeans) {
    shopNum += productBean.getList().size();
    shopTotal += productBean.getItemTotal();
    formNo = tdscheadBeans.get(indext).getFormNo();
    conditionType = tdscheadBeans.get(indext).getConditionType();
    let price = countMZPrice(context, tdscheadBeans.get(indext));
    if (currentDiscountPrice < price) {
      currentDiscountPrice = price;
    }
  }
  
  static countMZPrice(tdscheadBean) {
    let con1 = tdscheadBean.getCon1();
    if ("0" == conditionType) {//满金额
      if (con1 < shopTotal) {
        return tdscheadBean.getCon2();
      }
    } else if ("1" == conditionType) {//数量
      if (con1 < shopNum) {
        return tdscheadBean.getCon2();
      }
    } else if ("2" == conditionType) {//项数
      if (con1 < list.size()) {
        return tdscheadBean.getCon2();
      }
    }
    return 0;
  }
  
}
