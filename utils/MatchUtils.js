/**
 * Created by admin on 2017/11/27.
 */
export default class MatchUtils{
  
  static isNumber(number){
    var re = /^[0-9]+.?[0-9]*$/;   //判断字符串是否为数字     //判断正整数 /^[1-9]+[0-9]*]*$/
    return re.test(number);
  }
  
}