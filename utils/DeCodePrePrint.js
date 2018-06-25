import StringUtils from './StringUtils';
/**
 * Created by admin on 2018/4/19.
 */
let strLength;
let flagLength=2;
export default class DeCodePrePrint {
  constructor() {
  }
  init(dBAdapter){
    dBAdapter.selectKgOpt("ScalePluLength").then((datas) => {
      dBAdapter.selectKgOpt("ScalePreFlag").then((flags)=>{
        let dataLen = datas.length;
        if (dataLen != 0) {
          strLength = datas.item(0).OptValue;
          if (strLength == "") {
            strLength = "5";
          }
        } else {
          strLength = "5";
        }
        let flagLen = flags.length;
        if (flagLen != 0) {
          flagLength = flags.item(0).OptValue.length;
          if (flagLength == "") {
            flagLength = 2;
          }
        }
      });
    });
  }
  deCodePreFlag = (deCode) => {
    let flag = StringUtils.subStr(0, 2, deCode);
    if(deCode.length==13){
    
    
    if ("27"==flag) {
      return true;
    } else if ("13"==flag) {
      return true;
    } else {
      return true;
    }}else{
      return false;
    }
  }
  /***
   * 解码 返回ProdCode
   * @return {*}
   */
   deCodeProdCode = (deCode) => {
     return StringUtils.subStr(flagLength, (flagLength + Number(strLength)), deCode);
    
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
          s = StringUtils.subStr(flagLength + Number(strLength), 13 - 1, deCode);
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
          s = StringUtils.subStr(flagLength + Number(strLength), 13 - 1, deCode);
        }
        let scaleMultiply  =parseFloat(Number(s) * Number(strDegree)).toFixed(fixed);
        resolve(scaleMultiply);
      });
    });
    
  }
}