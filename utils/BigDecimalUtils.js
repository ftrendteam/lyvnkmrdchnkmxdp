/**
 * Created by admin on 2018/1/9.
 */
export default class BigDecimalUtils {
  /***
   * 除法运算 保留指定位数
   * @param a
   * @param b
   * @return {string}
   */
  static divide = (a, b, degree) => {
    if(a==""||a==undefined||a==NaN){
      a="0";
    }
    if(b==""||b==undefined||b==NaN){
      b="0";
    }
    //degree = BigDecimalUtils.isZero(degree);
    return  (Number(a) / Number(b)).toFixed(degree);
  }
  
  /**
   * 乘法运算 保留指定位数
   * @param a
   * @param b
   * @param degree
   * @return {string}
   */
  static multiply = (a, b, degree) => {
    if(a==""||a==undefined||a==NaN){
      a="0";
    }
    if(b==""||b==undefined||b==NaN){
      b="0";
    }
    degree = BigDecimalUtils.isZero(degree);
    return  (Number(a) * Number(b)).toFixed(degree);
  }
  
  /**
   * 加法运算 保留指定位数
   * @param a
   * @param b
   * @param degree
   * @return {string}
   */
  static add = (a, b, degree) => {
  
    if(a==""||a=='undefined'||a=='NaN'){
      a="0";
    }
    if(b==""||b=='undefined'||b=='NaN'){
      b="0";
    }
    console.log(a)
    console.log(b)
    degree = BigDecimalUtils.isZero(degree);
    return  (Number(a) + Number(b)).toFixed(degree);
  }
  
  /**
   * 减法运算 保留指定位数
   * @param a
   * @param b
   * @param degree
   * @return {string}
   */
  static subtract = (a, b, degree) => {
    if(a==""||a=='undefined'||a=='NaN'){
      a="0";
    }
    if(b==""||b=='undefined'||b=='NaN'){
      b="0";
    }
    degree = BigDecimalUtils.isZero(degree);
    return  (Number(a) - Number(b)).toFixed(degree);
  }
  
  static isZero = (degree) => {
    
    if (degree == "" || degree == null || degree == 0) {
      return degree = 2;
    } else {
      return degree;
    }
  }
}