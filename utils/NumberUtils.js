/**
 * Created by admin on 2017/11/27.
 */
import MatchUtils from '../utils/MatchUtils'
export default class NumberUtils {
  /***
   * 格式化数字  保留小数点后两位
   */
  static numberFormat2 = (numberFormat) => {
    if (MatchUtils.isNumber(numberFormat)) {
      return parseFloat(numberFormat).toFixed(2);
    } else {
      if (numberFormat == "" || numberFormat == null || numberFormat == undefined) {
        numberFormat = "0";
      }
      return parseFloat(Number(numberFormat)).toFixed(2);
    }
  }
}