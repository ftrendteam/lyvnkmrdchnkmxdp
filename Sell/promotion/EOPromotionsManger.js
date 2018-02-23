/**
 * Created by admin on 2016/10/8.
 */

let currentDis = 0;
let planList = [];

export default class EOPromotionsManger {
  
  
  static   eoPromotionsManger(productBean, custTypeCode) {
    
    //按价格由大到小排序
    let tdscheadBeans = XDbUtils.getBasicDB(context).
      findAll(Selector.from(TdscheadBean.class).where("FormType", "=", "EO"));
    if (tdscheadBeans == null) {
      return "";
    }
    for (let i = 0; i < tdscheadBeans.size(); i++) {
      let dtCust = tdscheadBeans.get(i).getDtCust();
      if ("1" == dtCust) {
        //System.out.println("所有顾客aaaaa");
      } else {
        //System.out.println("按顾客表计算,判断时间和当前客户");
        //获取符合当前客户的促销单号
        let tDscCustBeans = XDbUtils.getBasicDB(context).findAll(Selector.from(TDscCustBean.class).where("CustTypeCode", "=", custTypeCode).and("FormNo", "=", tdscheadBeans.get(i).getFormNo()));
        if (tDscCustBeans == null && tDscCustBeans.size() != 0) {
          break;
        }
        for (let j = 0; j < tDscCustBeans.size(); j++) {
          //根据符合的促销单号获取，判断时间
          let tDscPlanBeans = XDbUtils.getBasicDB(context).findAll(Selector.from(TDscPlanBean.class).where("FormNo", "=", tDscCustBeans.get(j).getFormNo()));
          if (tDscPlanBeans != null && tDscPlanBeans.size() != 0) {
            for (let index = 0; index < tDscPlanBeans.size(); index++) {
              let tDscPlanBean = tDscPlanBeans.get(index);
              let beginDate = tDscPlanBean.getBeginDate();
              let beginTime = tDscPlanBean.getBeginTime();
              let endDate = tDscPlanBean.getEndDate();
              let endTime = tDscPlanBean.getEndTime();
              let vldWeek = tDscPlanBean.getVldWeek().toCharArray();
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
                } else {
                  System.out.println("日期不符合");
                }
              }
            }
          }
        }
      }
    }
    for (let planIndex = 0; planIndex < planList.size(); planIndex++) {
      let tdscheads = XDbUtils.getBasicDB(context).
        findAll(Selector.from(TdscheadBean.class).where("FormType", "=", "EO").
          and("FormNo", "=", planList.get(planIndex).getFormNo()));
      if (tdscheadBeans != null) {
//                for (int i = 0; i < productBeans.size(); i++) {//遍历所有商品
//                    ProductBean productBean = productBeans.get(i);
        let tDscExceptShop = PromotionUtils.isTDscExceptShop(context, productBean.getProdCode());
        if (!tDscExceptShop) {
          //System.out.println("非促销商品!");
        }
        for (let indext = 0; indext < tdscheads.size(); indext++) {
          let formNo = tdscheads.get(indext).getFormNo();
          let dtAll = tdscheads.get(indext).getDtAll();
          if ("1" == dtAll) {
            //System.out.println("全场");
          } else if ("0".equals(dtAll)) {
            let dtDep = tdscheads.get(indext).getDtDep();
            let dtSupp = tdscheads.get(indext).getDtSupp();
            let dtBrand = tdscheads.get(indext).getDtBrand();
            let dtProd = tdscheads.get(indext).getDtProd();
            let autoMulti = tdscheads.get(indext).getAutoMulti();
            if ("1" == dtDep) {
              let tDscDepBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscDepBean.class).where("DepCode ", "=", productBean.getDepCode()));
              if (tDscDepBean != null) {
                //System.out.println("eeeeezhixing-1");
                EOPromotionsManger.initData(context, formNo, productBean);
              }
            } else if ("1" == dtSupp) {
              let tDscSuppBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscSuppBean.class).where("CuppCode ", "=", productBean.getSuppCode()));
              if (tDscSuppBean != null) {
                //System.out.println("zhixing-2");
                EOPromotionsManger.initData(context, formNo, productBean);
              }
            } else if ("1" == dtBrand) {
              let tDscBrandBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscBrandBean.class).where("BrandCode ", "=", productBean.getBrandCode()));
              if (tDscBrandBean != null) {
                //System.out.println("zhixing-3");
                EOPromotionsManger.initData(context, formNo, productBean);
              }
            } else if ("1".equals(dtProd)) {
              let tDscProdBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscProdBean.class).where("ProdCode  ", "=", productBean.getProdCode()));
              if (tDscProdBean != null) {
                //System.out.println("zhixing-4");
                EOPromotionsManger.initData(context, formNo, productBean);
              }
            }
//                        }
          }
        }
      }
      return "";
    }
    return "";
  }
  
  static  initData(formNo, productBean) {
    lettDscConditions = XDbUtils.getBasicDB(context).findAll(Selector.from(TDscConditionBean.class).where("FormNo  ", "=", formNo));
    if (currentDis > tDscConditions.size() - 1) {
      currentDis = 0;
    }
    let con2 = tDscConditions.get(currentDis).getCon2();
    let cxConType = tDscConditions.get(currentDis).getCxConType();
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
      System.out.println("eo-3");
      if (productBean.getList().size() == 1) {
        productBean.setItemTotal(BigDecimalUtils.scaleAdd(productBean.getItemTotal(), BigDecimalUtils.subtract(productBean.getStdPrice(), con2)));
      } else {
        productBean.setItemTotal(BigDecimalUtils.scaleAdd(productBean.getItemTotal(),
          BigDecimalUtils.subtract(productBean.getStdPrice(), con2)));
      }
    }
    currentDis++;
  }
}
