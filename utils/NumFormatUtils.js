/**
 * Created by admin on 2017/12/22.
 */
export default class NumFormatUtils {
  
  
  /**
   * 账单流水号 用户名+数字(0000)
   */
  static  createLsNo = () => {
    let LsNo;
    let num = UIUtils.get2SP("num", 1);
    let name = UIUtils.get2SP("posCode", "");
    let strNum = this.PrefixInteger(num);
    if (num > 99999999) {
      num = 1;
    } else {
      num++;
      UIUtils.put2SP("num", num);
    }
    LsNo = name + strNum;
    UIUtils.put2SP("LsNo", LsNo);
    return LsNo;
  }
  
  /***
   * 数字前面补零
   * @param num 需要补零的数字
   * @return {string}
   * @constructor
   */
  static PrefixInteger = (num) => {
    return (Array(length).join('0') + num).slice(-8);
  }
  
  static inoNum = 1;
  
  static createInnerNo = () => {
    let trim = DateUtils.getSystemTimeHSM().replace(":", "").replace("-", "").replace(" ",
      "");
    let form = trim.substring(2, trim.length() - 1) + inoNum;
    this.inoNum++;
    if (inoNum == 9) {
      inoNum = 1;
    }
    return form;
  }
}