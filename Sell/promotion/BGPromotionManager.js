/**
 * Created by admin on 2016/9/19.分组促销
 */
//import DateUtils from '../../utils/DateUtils';
import BigDecimalUtils from '../../utils/BigDecimalUtils';
import PromotionUtils from '../../utils/PromotionUtils';
export default class BGPromotionManager {
  static BGPromotion(productBean, custTypeCode) {
    let tDscExceptShop = PromotionUtils.isTDscExceptShop(context, productBean.getProdCode());
    if (!tDscExceptShop) {
      //System.out.println("非促销商品！");
      return;
    }
    try {
      let custAndDate = PromotionUtils.custAndDate(context, custTypeCode);
      
      if (!custAndDate) {
        return;
      }
      
      let tdscheadBeans = XDbUtils.getBasicDB(context).findAll(Selector.from(TdscheadBean.class).where("FormType", "=", "BG"));
      if (tdscheadBeans != null) {
        for (let i = 0; i < tdscheadBeans.length; i++) {
          let tdscheadBean = tdscheadBeans[i];
          if ("1" == tdscheadBean.DtAll) {
            //System.out.println("1");
          } else if ("0" == tdscheadBean.DtAll) {
            //System.out.println("0");
            let dtDep = tdscheadBean.DtDep;
            let dtSupp = tdscheadBean.DtSupp;
            let dtBrand = tdscheadBean.DtBrand;
            if ("1".equals(dtDep)) {
              //System.out.println("0-dtDep");
              let depCode = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscDepBean.class).where("DepCode", "=", productBean.DepCode));
              if (depCode == null) {
                return;
              }
              let dscValue = depCode.DscValue;
              let dscType = depCode.DscType;
              if (depCode != null) {
                let priceMode = depCode.PriceMode;
                b(productBean, dscValue, dscType, priceMode);
              }
            } else if ("1" == dtSupp) {
              //System.out.println("0-dtSupp");
              let suppCode = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscSuppBean.class).where("SuppCode", "=", productBean.SuppCode));
              if (suppCode != null) {
                let dscValue = suppCode.DscValue;
                let priceMode = suppCode.PriceMode;
                let dscType = suppCode.DscType;
                b(productBean, dscValue, dscType, priceMode);
              }
            } else if ("1" == dtBrand) {
              //System.out.println("0-dtBrand");
              let brandCode = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscBrandBean.class).where("BrandCode", "=", productBean.BrandCode));
              if (brandCode != null) {
                let dscValue = brandCode.DscValue;
                let priceMode = brandCode.PriceMode;
                let dscType = brandCode.DscType;
                b(productBean, dscValue, dscType, priceMode);
              }
            }
          }
        }
      }
    } catch (error) {
    
    }
  }
  
  static  b(productBean, dscValue, dscType, priceMode) {
    let stdOPrice = productBean.StdOPrice;
    let stdPrice = productBean.StdPrice;
    let vipPrice1 = productBean.VipPrice1;
    let vipPrice2 = productBean.VipPrice2;
    let vipPrice3 = productBean.VipPrice3;
    let wPrice = productBean.WPrice;
    if ("0" == priceMode) {
      setShopTotal(productBean, dscValue, stdOPrice, dscType);
    } else if ("1" == priceMode) {
      setShopTotal(productBean, dscValue, stdPrice, dscType);
    } else if ("2" == priceMode) {
      setShopTotal(productBean, dscValue, vipPrice1, dscType);
    } else if ("3" == priceMode) {
      setShopTotal(productBean, dscValue, vipPrice2, dscType);
    } else if ("4" == priceMode) {
      setShopTotal(productBean, dscValue, vipPrice3, dscType);
    } else if ("5" == priceMode) {
      setShopTotal(productBean, dscValue, wPrice, dscType);
    }
  }
  
  static setShopTotal(productBean, dscValue, basePrice, dscType) {
    if ("Z" == dscType) {
      let discountRate = BigDecimalUtils.multiply(basePrice,
        BigDecimalUtils.subtract(1, BigDecimalUtils.divide(dscValue, 100)));
      productBean.setItemTotal(BigDecimalUtils.multiply(productBean.ShopNumber,
        discountRate));
    } else if ("S" == dscType) {
      let multiply = BigDecimalUtils.multiply(productBean.ShopNumber,
        BigDecimalUtils.scaleAdd(basePrice, BigDecimalUtils.multiply(basePrice, BigDecimalUtils.divide(dscValue, 100))));
      
      if (multiply > productBean.StdPrice) {
        productBean.setItemTotal(productBean.StdPrice);
      } else {
        productBean.setItemTotal(multiply);
      }
    }
  }
}
