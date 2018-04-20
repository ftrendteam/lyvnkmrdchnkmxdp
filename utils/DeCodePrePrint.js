import StringUtils from './StringUtils';
/**
 * Created by admin on 2018/4/19.
 */
let strLength;
export default class DeCodePrePrint {
  constructor() {
  }
  /***
   * 解码 返回ProdCode
   * @return {*}
   */
   deCodeProdCode = (deCode, dBAdapter) => {
    return new Promise((resolve, reject) => {
      dBAdapter.selectKgOpt("ScalePluLength").then((datas) => {
        let dataLen = datas.length;
        if (dataLen != 0) {
          strLength = datas.item(0).OptValue;
          if (strLength == "") {
            strLength = "5";
          }
        } else {
          strLength = "5";
        }
        resolve(StringUtils.subStr(2, (2 + Number(strLength)), deCode));
      });
    });
  }
  
  /***
   * 解析价格
   * @return {*}
   */
  deCodeTotile = (deCode,dBAdapter) => {
    return new Promise((resolve, reject) => {
      let strDegree;
      let s;
      let fixed = 2;
      dBAdapter.selectPosOpt("BARDEGREE").then((barDegrees) => {
        if (barDegrees.length != 0) {
          strDegree = barDegrees.item(0).OptValue;
          s = StringUtils.subStr(2 + Number(strLength), 13 - 1, deCode);
          if (strDegree == "") {
            strDegree = "0.01";fixed = 2;
          } else if ("分" == strDegree) {
            strDegree = "0.01";fixed = 2;
          } else if ("角" == strDegree) {
            strDegree = "0.1";fixed = 1;
          } else if ("元" == strDegree) {
            strDegree = "1";
            fixed = 0;
          }
        } else {
          strDegree = "0.01";
          s = StringUtils.subStr(2 + Number(strLength), 13 - 1, deCode);
        }
        //alert(2 + Number(strLength));
        let scaleMultiply  =parseFloat(Number(s) * Number(strDegree)).toFixed(fixed);
        //let scaleMultiply = BigDecimalUtils.multiply(strDegree, s, 2);
        resolve(scaleMultiply);
      });
    });
    
  }
}