/**
 * Created by mwqi on 2014/6/8.
 */
export default class StringUtils {
  
  
  /***
   * 截取指定长度的字符
   *
   * @param startIndex
   * @param endIndex
   * @param str
   * @return
   */
  static subStr(startIndex, endIndex, str) {
    if (endIndex > str.length) {
      return "-1";
    } else if (str == null || str.length <= 0) {
      return "-1";
    }
    return str.substring(startIndex, endIndex);
  }
}
