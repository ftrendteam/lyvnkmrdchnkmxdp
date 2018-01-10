/**
 * Created by admin on 2018/1/2.
 * 根据当前参数进行价格处理
 */
import BigDecimalUtils from '../utils/BigDecimalUtils';
export default class FormatPrice {
  
  /***
   * 四舍五入
   * @param degree 抹零方式
   * @param price 需要格式化的金额
   */
  static round = (degree, price, products) => {
    let beforPrice = price;
    let formatPrice = 0;
    let rounding = 0;
    let disAllPrice = 0;//实际所有抹零金额
    let currentDisPrice = 0;//价格相比对比的优惠金额
    if (degree == "0") {//分
      formatPrice = FormatPrice.round2(price);
    } else if (degree == "1") {//角
      formatPrice = FormatPrice.round1(price);
    } else if (degree == "2") {//元
      formatPrice = FormatPrice.round0(price);
    }
    //四舍五入价格差距
    let subtract = formatPrice - price;
    if (subtract > 0) {//价格提高 为入
      for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let itemTotal = product.prototal;//商品总价
        let rate = BigDecimalUtils.divide(itemTotal,
          beforPrice, 3);//均摊比例
        let multiply = BigDecimalUtils.multiply(rate, subtract, 3);//每个商品均摊的优惠金额
        product.prototal = BigDecimalUtils.add(itemTotal,
          multiply, 2);//根据计算结果重新设置商品价格
        
        rounding = -subtract;
        disAllPrice = disAllPrice + multiply;//实际抹零
        
        if (currentDisPrice != disAllPrice && i == products.length - 1 && products.length != 1) {
          let v = BigDecimalUtils.subtract(disAllPrice,
            currentDisPrice, 3);//抹零之差
          if (v >= 0) {//实际添加价格过高 需要减去
            let beforeItemTotal = product.prototal;
            let disItemTotal = BigDecimalUtils.subtract
            (beforeItemTotal, v, 3);
            product.prototal = disItemTotal;
            //bean.setYDiscPrice(BigDecimalUtils.scaleAddScale2
            //(BigDecimalUtils.scaleSubtract(BigDecimalUtils
            //  .scaleSubtract
            //  (beforeItemTotal,
            //    multiply),
            //  disItemTotal), bean
            //.getYDiscPrice())); 将四舍五入设置为优惠价格
          } else {//实际添加价格过低 需要继续添加
            let beforeItemTotal = product.prototal;
            let disItemTotal = BigDecimalUtils.add
            (beforeItemTotal, v, 2);
            product.prototal = disItemTotal;
            //bean.setYDiscPrice(BigDecimalUtils.scaleAddScale2
            //(BigDecimalUtils.scaleSubtract(BigDecimalUtils
            //  .scaleSubtract
            //  (beforeItemTotal,
            //    multiply),
            //  disItemTotal), bean
            //.getYDiscPrice()));  将四舍五入设置为优惠价格
          }
          console.log("c=", product.prototal);
        } else {
          //bean.setYDiscPrice(BigDecimalUtils.scaleAddScale2
          //(multiply * -1, bean
          //.getYDiscPrice()));将四舍五入设置为优惠价格
        }
      }
    } else if (subtract < 0) {//价格降低 为舍去
      currentDisPrice = BigDecimalUtils.subtract(beforPrice,
        price, 3);//价格差距优惠
      subtract = Math.abs(subtract);
      rounding = subtract;
      for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let itemTotal = product.prototal;//商品总价
        let multiply = BigDecimalUtils.multiply
        (BigDecimalUtils.divide
        (itemTotal, beforPrice, 3), subtract, 3);//每个商品均摊金额
        product.prototal = BigDecimalUtils.subtract(itemTotal,
          multiply, 3);
        disAllPrice = BigDecimalUtils.add(disAllPrice , multiply,3);//实际抹零
        if (currentDisPrice != disAllPrice && i == products.length - 1 && products.length != 1) {
          let v = BigDecimalUtils.subtract(disAllPrice,
            currentDisPrice, 3);//抹零之差
          if (v >= 0) {//实际抹零过高 需要加上多抹去的金额
            let beforeItemTotal = product.prototal;
            let disItemTotal = BigDecimalUtils.add
            (beforeItemTotal, v, 2);
            product.prototal = disItemTotal;
            //bean.setYDiscPrice(BigDecimalUtils.scaleAddScale2
            //(BigDecimalUtils.scaleSubtract(BigDecimalUtils
            //  .scaleAdd(beforeItemTotal,
            //  multiply),
            //  disItemTotal), bean
            //.getYDiscPrice()));  将四舍五入设置为优惠价格
          } else if (v < 0) {//实际抹零过低 (少抹了 继续抹)
            let beforeItemTotal = product.prototal;
            let disItemTotal = BigDecimalUtils.subtract(beforeItemTotal, -v, 3);
            product.prototal = disItemTotal;
            //bean.setYDiscPrice(BigDecimalUtils.scaleAddScale2
            //(BigDecimalUtils.scaleSubtract(BigDecimalUtils
            //  .scaleAdd(beforeItemTotal,
            //  multiply),
            //  disItemTotal), bean
            //.getYDiscPrice()));将四舍五入设置为优惠价格
          }
        } else {
          //bean.setYDiscPrice(BigDecimalUtils.scaleAddScale2
          //(multiply * 1, bean
          //.getYDiscPrice()));  将四舍五入设置为优惠价格
        }
      }
    }
    //console.log("disAllPrice=" + disAllPrice);
    return disAllPrice;
  }
  
  /***
   * 四舍五入 保留到元
   */
  static round0 = (price) => {
    return Number(price).toFixed(0);
  }
  
  /***
   * 四舍五入 保留一位小数
   */
  static round1 = (price) => {
    return Number(price).toFixed(1);
  }
  
  /***
   * 四舍五入 保留2位小数
   */
  static round2 = (price) => {
    return Number(price).toFixed(2);
  }
  
  /***
   * 四舍五入 保留3位小数
   */
  static round3 = () => {
  
  }
}