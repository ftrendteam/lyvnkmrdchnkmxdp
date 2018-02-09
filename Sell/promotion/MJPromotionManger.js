/**
 * Created by admin on 2016/9/24.
 */
import BigDecimalUtils from '../../utils/BigDecimalUtils';
import PromotionUtils from '../../utils/PromotionUtils';
let conditionType;
let dscType;
let str1;
let dscValue;
let formNo;
let shopTotal = 0;
let shopNum = 0;
let list = [];
let isReturnPrice = false;
let tDscDepBean;
let tDscSuppBean;
let tDscBrandBean;
let tDscProdBean;
let tdscheadBeans = [];
let currentDiscountPrice;
let planList = [];
export default class MJPromotionManger {
  
  static  MJPromotion(productBeans, custTypeCode, dbAdapter) {
    list = productBeans;
    //根据客户类型，获取所有的促销单号
    dbAdapter.selectTDscCust(custTypeCode).then((tdscCusts) => {
    
    });
    let tDscCustBeans = XDbUtils.getBasicDB(context).findAll(Selector.from(TDscCustBean.class).where("CustTypeCode", "=", custTypeCode));
    if (tDscCustBeans != null) {
      //判断所有的促销是否符合时间要求
      for (let j = 0; j < tDscCustBeans.length; j++) {
        List < TDscPlanBean > tDscPlanBeans = XDbUtils.getBasicDB(context).findAll(Selector.from(TDscPlanBean.class).where("FormNo", "=", tDscCustBeans.get(j).getFormNo()));
        if (tDscPlanBeans != null && tDscPlanBeans.length != 0) {
          for (let index = 0; index < tDscPlanBeans.size(); index++) {
            let tDscPlanBean = tDscPlanBeans[index];
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
                System.out.println("日期不符合");
              }
            }
          }
        }
      }
    }
    PromotionUtils.custAndDate(custTypeCode, dbAdapter).then(()=>{
    
    });
    
    for (let planIndex = 0; planIndex < planList.size(); planIndex++) {//遍历促销单，取出最大优惠
      tdscheadBeans = XDbUtils.getBasicDB(context).
        findAll(Selector.from(TdscheadBean.class).where("FormType", "=", "MJ").
          and("FormNo", "=", planList.get(planIndex).getFormNo()));
      for (let i = 0; i < productBeans.size(); i++) {//遍历所有商品
        let productBean = productBeans.get(i);
        let tDscExceptShop = PromotionUtils.isTDscExceptShop(context, productBean.getProdCode());
        if (!tDscExceptShop) {
          System.out.println("非促销商品！");
          return 0;
        }
        if (tdscheadBeans != null) {
          for (let indext = 0; indext < tdscheadBeans.size(); indext++) {
            //System.out.println(tdscheadBeans.get(indext).getFormNo());
            let dtAll = tdscheadBeans.get(indext).getDtAll();
            if ("1".equals(dtAll)) {
              //System.out.println("全场");
            } else if ("0".equals(dtAll)) {
              let dtDep = tdscheadBeans.get(indext).getDtDep();
              let dtSupp = tdscheadBeans.get(indext).getDtSupp();
              let dtBrand = tdscheadBeans.get(indext).getDtBrand();
              let dtProd = tdscheadBeans.get(indext).getDtProd();
              if ("1" == dtDep) {
                tDscDepBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscDepBean.class).where("DepCode ", "=", productBean.getDepCode()));
                if (tDscDepBean != null) {
                  //System.out.println("zhixing-1");
                  MJPromotionManger.initData(indext, productBean, tdscheadBeans, context);
                }
              } else if ("1" == dtSupp) {
                tDscSuppBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscSuppBean.class).where("CuppCode ", "=", productBean.getSuppCode()));
                if (tDscSuppBean != null) {
                  //System.out.println("zhixing-2");
                  MJPromotionManger.initData(indext, productBean, tdscheadBeans, context);
                }
              } else if ("1" == dtBrand) {
                tDscBrandBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscBrandBean.class).where("BrandCode ", "=", productBean.getBrandCode()));
                if (tDscBrandBean != null) {
                  //System.out.println("zhixing-3");
                  MJPromotionManger.initData(indext, productBean, tdscheadBeans, context);
                  
                }
              } else if ("1" == dtProd) {
                tDscProdBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscProdBean.class).where("ProdCode  ", "=", productBean.getProdCode()));
                if (tDscProdBean != null) {
                  //System.out.println("zhixing-4");
                  MJPromotionManger.initData(indext, productBean, tdscheadBeans, context);
                }
              }
            }
          }
        }
      }
      shopNum = 0;
      shopTotal = 0;
    }
  }
  
  static initData(i, productBean, tdscheadBeans) {
    shopNum += productBean.getList().size();
    shopTotal += productBean.getItemTotal();
    conditionType = tdscheadBeans.get(i).getConditionType();
    str1 = tdscheadBeans.get(i).getStr1();
    dscType = tdscheadBeans.get(i).getDscType();
    dscValue = tdscheadBeans.get(i).getDscValue();
    formNo = tdscheadBeans.get(i).getFormNo();
    let price =MJPromotionManger.countMJPrice(shopNum, context);
    //System.out.println("price=" + price);
    if (currentDiscountPrice < price) {
      currentDiscountPrice = price;
    }
  }
  
  static countMJPrice(shopNum) {
    let discountPrice = 0;
    System.out.println("conditionType=" + conditionType);
    List < TDscConditionBean > select = MJPromotionManger.select();
    if (select == null || select.size() == 0) {
      return 0;
    }
    if ("0".equals(conditionType)) {//金额
      if ("0".equals(dscType)) {//返款
        isReturnPrice = true;
        if ("0" == str1) {//不累加
          System.out.println("0-1");
          for (let i = select.size() - 1; i >= 0; i--) {
            let con1 = select.get(i).getCon1();
            //System.out.println("com1=" + con1 + ",shopTotal=" + shopTotal);
            if (con1 <= shopTotal) {
              discountPrice = select.get(select.size() - 1).getCon2();
//                            BigDecimalUtils.subtract(shopTotal)
//                            System.out.println("con2=" + select.get(select.size() - 1).getCon2());
              break;
            }
          }
        } else if ("1" == str1) {//累加
          let lastCon1 = 0;
          //System.out.println("0-2");
          for (let i = select.size() - 1; i >= 0; i--) {
            let con1 = select.get(i).getCon1();
            //System.out.println("con1=" + con1);
            //System.out.println("shopTotal" + shopTotal);
            if (con1 <= shopTotal - lastCon1) {
              discountPrice += select.get(i).getCon2();
              lastCon1 += con1;
            }
          }
        }
      } else if ("1" == dscType) {//折扣
        isReturnPrice = false;
        for (let i = select.size() - 1; i >= 0; i--) {
          let con1 = select.get(i).getCon1();
          if (con1 <= shopTotal) {
            let con2 = select.get(select.size() - 1).getCon2();
            discountPrice = BigDecimalUtils.multiply(shopTotal, BigDecimalUtils.divide(con2, 100));
            break;
          }
        }
        
      }
    } else if ("1" == conditionType) {//数量
      if ("0" == dscType) {//返款
        isReturnPrice = true;
        if ("0".equals(str1)) {//不累加
          for (let i = select.size() - 1; i >= 0; i--) {
            let con1 = select.get(i).getCon1();
            if (con1 <= shopNum) {
              discountPrice = select.get(select.size() - 1).getCon2();
              break;
            }
          }
          
          
        } else if ("1" == str1) {//累加
          let lastCon1 = 0;
          for (let i = select.size() - 1; i >= 0; i--) {
            let con1 = select.get(i).getCon1();
            if (con1 <= shopNum - lastCon1) {
              discountPrice += select.get(i).getCon2();
              lastCon1 += con1;
            }
          }
        }
      } else if ("1" == dscType) {//折扣
        isReturnPrice = false;
        for (let i = select.size() - 1; i >= 0; i++) {
          let con1 = select.get(i).getCon1();
          if (con1 <= shopNum) {
            let con2 = select.get(select.size() - 1).getCon2();
            discountPrice = BigDecimalUtils.multiply(shopTotal, BigDecimalUtils.divide(con2, 100));
          }
        }
        
      }
    } else if ("2" == conditionType) {//项数
      if ("0".equals(dscType)) {//返款
        isReturnPrice = true;
        if ("0" == str1) {//不累加
          let con1 = select.get(select.size() - 1).getCon1();
          if (con1 <= list.size()) {
            discountPrice = select.get(select.size() - 1).getCon2();
//                            BigDecimalUtils.subtract(shopTotal)
          }
        } else if ("1" == str1) {//累加
          let lastCon1 = 0;
          for (let i = select.size() - 1; i >= 0; i--) {
            let con1 = select.get(i).getCon1();
            if (con1 <= list.size() - lastCon1) {
              discountPrice += select.get(i).getCon2();
              lastCon1 += con1;
            }
          }
        }
      } else if ("1" == dscType) {//折扣
        isReturnPrice = false;
        let con1 = select.get(select.size() - 1).getCon1();
        if (con1 <= list.size()) {
          let con2 = select.get(select.size() - 1).getCon2();
          discountPrice = BigDecimalUtils.multiply(shopTotal, BigDecimalUtils.divide(con2, 100));
        }
      }
    }
    if (isReturnPrice) {
      if (dscValue == 0) {
        return discountPrice;
      }
      if (dscValue < discountPrice) {
        return dscValue;
      } else if (dscValue > discountPrice) {
        return discountPrice;
      } else {
        return discountPrice;
      }
    } else {
      return discountPrice;
    }
  }
  
  /**
   * 获取优惠梯度集合
   *
   * @param context
   * @return
   * @throws DbException
   */
  static select() {
    List < TDscConditionBean > all = XDbUtils.getBasicDB(context).findAll(Selector.from(TDscConditionBean.class).where("FormNo ", "=", formNo));
    return all;
  }
}
