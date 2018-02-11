/**
 * Created by admin on 2016/9/29.
 */
let planList = [];
let shopList = [];
let autoMulti;

export default class GSPromotionsManger {
  
  
  static gsPromotionsManger(productBeans, custTypeCode) {

//按价格由大到小排序
//    Collections.sort(productBeans);
    let tdscheadBeans = XDbUtils.getBasicDB(context).
      findAll(Selector.from(TdscheadBean.class).where("FormType", "=", "GS"));
    if (tdscheadBeans != null) {
      for (let i = 0; i < tdscheadBeans.size(); i++) {
        let
          dtCust = tdscheadBeans.get(i).getDtCust();
        let
          dtAll = tdscheadBeans.get(i).getDtAll();
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
                let
                  tDscPlanBean = tDscPlanBeans.get(index);
                let
                  beginDate = tDscPlanBean.getBeginDate();
                let
                  beginTime = tDscPlanBean.getBeginTime();
                let
                  endDate = tDscPlanBean.getEndDate();
                let
                  endTime = tDscPlanBean.getEndTime();
                let
                  vldWeek = tDscPlanBean.getVldWeek().toCharArray();
                let
                  week = DateUtils.getWeek();
                let
                  c;
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
        let formNo = planList.get(planIndex).getFormNo();
        let tdscheads = XDbUtils.getBasicDB(context).
         findAll(Selector.from(TdscheadBean.class).where("FormType", "=", "GS").
            and("FormNo", "=", formNo));
        if (tdscheadBeans != null) {
          for (let i = 0; i < productBeans.size(); i++) {//遍历所有商品
            let productBean = productBeans.get(i);
            let tDscExceptShop = PromotionUtils.isTDscExceptShop(context, productBean.getProdCode());
            if (!tDscExceptShop) {
              //System.out.println("非促销商品!");
            }
            for (let indext = 0; indext < tdscheads.size(); indext++) {
              //System.out.println(tdscheads.get(indext).getFormNo());
              let
                dtAll = tdscheads.get(indext).getDtAll();
              if ("1" == dtAll) {
                //System.out.println("全场");
              } else if ("0" == dtAll) {
                let dtDep = tdscheads.get(indext).getDtDep();
                let dtSupp = tdscheads.get(indext).getDtSupp();
                let dtBrand = tdscheads.get(indext).getDtBrand();
                let dtProd = tdscheads.get(indext).getDtProd();
                autoMulti = tdscheads.get(indext).getAutoMulti();
                if ("1" == dtDep) {
                  System.out.println("rile-1");
                  let
                    tDscDepBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscDepBean.class).where("DepCode ", "=", productBean.getDepCode()));
                  if (tDscDepBean != null) {
                    //System.out.println("zhixing-1");
//                                    initData13(context, autoMulti, formNo);
                    shopList.add(productBeans.get(i));
                  }
                } else if ("1".equals(dtSupp)) {
                  let tDscSuppBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscSuppBean.class).where("CuppCode ", "=", productBean.getSuppCode()));
                  if (tDscSuppBean != null) {
                    //System.out.println("zhixing-2");
                    shopList.add(productBeans.get(i));
                  }
                } else if ("1"==dtBrand) {
                  let tDscBrandBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscBrandBean.class).where("BrandCode ", "=", productBean.getBrandCode()));
                  if (tDscBrandBean != null) {
                    //System.out.println("zhixing-3");
                    shopList.add(productBeans.get(i));
                  }
                } else if ("1"==dtProd) {
                  let
                    tDscProdBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscProdBean.class).where("ProdCode  ", "=", productBean.getProdCode()));
                  if (tDscProdBean != null) {
                    System.out.println("zhixing-4");
                  }
                }
              }
            }
          }
        }
//            return "";
        GSPromotionsManger.initData(context, autoMulti, formNo);
      }
    }
//        return "";
  }
  
  static initData(autoMulti, formNo) {
    let tDscGroupPrices = XDbUtils.getBasicDB(context).
      findAll(Selector.from(TDscGroupPriceBean.class).where("FormNo", "=", formNo));
    if (tDscGroupPrices == null) {
      return;
    }
    if ("1".equals(autoMulti)) {//自动倍数
      //System.out.println("1-1");
      let count = 0;
      let size = shopList.size();
      for (let i = tDscGroupPrices.size() - 1; i >= 0; i--) {
        let tDscGroupPriceBean = tDscGroupPrices.get(i);
        let groupCountN = tDscGroupPriceBean.getGroupCountN();
        let groupTotal = tDscGroupPriceBean.getGroupTotal();
//                int a = groupCountN / size;
        count++;
        if (size - groupCountN * count >= groupCountN) {
          for (let j = count; j <= groupCountN * count; j++) {
            shopList.get(j).setItemTotal(BigDecimalUtils.divide(groupTotal, groupCountN));
            //System.out.println(shopList.get(j).getItemTotal() + "dddddd");
          }
        }
      }
    } else if ("0"==autoMulti) {
      A:
        for (let i = tDscGroupPrices.size() - 1; i >= 0; i--) {
          let tDscGroupPriceBean = tDscGroupPrices.get(i);
          let groupCountN = tDscGroupPriceBean.getGroupCountN();
          let groupTotal = tDscGroupPriceBean.getGroupTotal();
          if (shopList.size() >= groupCountN) {
            for (let j = 0; j <= groupCountN; j++) {
              shopList.get(j).setItemTotal(BigDecimalUtils.divide(groupTotal, groupCountN));
              break A;
            }
          }
        }
    }
  }
}