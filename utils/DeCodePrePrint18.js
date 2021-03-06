/**
 * Created by
 * 扫描条码 进行18位条码解析
 */
import StringUtils from './StringUtils';

let deCode;
let flagLength=2;
let dbAdapter;
let strWeightLen;
let strLength;
let flag;
export default class DeCodePrePrint18 {
  constructor() {
  }
  
  init = (code, DbAdapter) => {
    deCode = code;
    dbAdapter = DbAdapter;
  }
  initFlag(dbAdapter){
    dbAdapter.selectKgOpt("ScalePluLength").then((datas) => {
      dbAdapter.selectKgOpt("ScalePreFlag").then((flags)=>{
        let dataLen = datas.length;
        if (dataLen != 0) {
          strLength = datas.item(0).OptValue;
          if (strLength == "") {
            strLength = "5";
          }
        } else {
          strLength = "5";
        }
        let flagsLen = flags.length;
        if (flagsLen != 0) {
          flag = flags.item(0).OptValue;
          flagLength= flag.length;
          if (flagLength == "") {
            flagLength = 2;
          }
        } else {
          flagLength = 2;
        }
      });
    });
  }
  deCodePreFlag = () => {
    let curFlag = StringUtils.subStr(0, flagLength, deCode);
    if(deCode.length==18){
      if (flag==curFlag) {
        return true;
      }  else {
        return false;
      }
    }else{
      return false;
    }
  }
  
  /***
   * 获取商品ProdCode
   */
  async deCodeProdCode() {
    return StringUtils.subStr(flagLength, (flagLength + Number(strLength)), deCode);
  }
  
  /***
   * 获取商品价格
   */
  deCodeTotal = () => {
    return new Promise((resolve, reject) => {
      let fixed = 2;
      //价格精度
      let strDegree = "";
      dbAdapter.selectKgOpt("ScaleBARDEGREE").then((datas) => {
        let dataLen = datas.length;
        if (dataLen != 0) {
          strDegree = datas.item(0).OptValue;
          if (strDegree == "") {
            strDegree = "0.01";
            fixed = 2;
          } else if ("分" == strDegree) {
            strDegree = "0.01";
            fixed = 2;
          } else if ("角" == strDegree) {
            strDegree = "0.1";
            fixed = 1;
          } else if ("元" == strDegree) {
            strDegree = "1";
            fixed = 0;
          }
        } else {
          strDegree = "0.01";
          fixed = 2;
        }
        this.braMode().then((mode) => {
          let deTotil;
          if ("0" == mode) {
            deTotil = deCode.substring(flagLength + Number(strLength) + Number(strWeightLen), 18 - 1);
          } else {
            deTotil = deCode.substring(flagLength + Number(strLength), 18 - 1 - Number(strWeightLen));
          }
          //let v = bigDecimal.accMul(Number(deTotil), Number(strDegree));
          let v = parseFloat(Number(deTotil) * Number(strDegree)).toFixed(fixed);
          resolve(v);
        });
      });
    });
    
  }

    /***
     * 解析商品重量
     * @returns {Promise}
     */
  deCodeWeight = () => {
    return new Promise((resolve, reject) => {
      let fixed = 2;
      //重量长度
      strWeightLen = "5";
      //重量精度
      let strWeightQTR;
      dbAdapter.selectKgOpt("ScaleWEIGHTLEN").then((datas) => {
        let length = datas.length;
        if (length != 0) {
          strWeightLen = datas.item(0).OptValue;
        } else {
          strWeightLen = "5";
        }
        dbAdapter.selectPosOpt("WEIGHTQTY").then((datas) => {
          let length = datas.length;
          if (length != 0) {
            strWeightQTR = datas.item(0).OptValue;
            if (strWeightQTR == "") {
              strWeightQTR = "0.001";
              fixed = 3;
            } else if("0" == strWeightQTR){
              strWeightQTR = "1";
              fixed = 1;
            }else if ("1" == strWeightQTR) {
              strWeightQTR = "0.1";
              fixed = 1;
            } else if ("2" == strWeightQTR) {
              strWeightQTR = "0.01";
              fixed = 2;
            } else if ("3" == strWeightQTR) {
              strWeightQTR = "0.001";
              fixed = 3;
            } else if("4" == strWeightQTR){
              strWeightQTR = "0.0001";
              fixed = 4;
            }else if("5" == strWeightQTR){
              strWeightQTR = "0.00001";
              fixed = 5;
            }
          } else {
            strWeightQTR = "0.01";
          }
          this.braMode().then((mode) => {
            let strWeight;
            if (mode == "0") {
              // 标识位+prodCode    重量长度
              strWeight = StringUtils.subStr(flagLength + Number(strLength), flagLength + Number(strLength) + Number(strWeightLen), deCode);
            } else {
              // 标识位+prodCode+价格长度
              strWeight = StringUtils.subStr(flagLength + Number(strLength) + (18 - 1 - flagLength - Number(strLength) - Number(strWeightLen)), 18 - 1, deCode);
            }
            let douWeight = parseFloat(Number(strWeight) * Number(strWeightQTR)).toFixed(fixed);
            resolve(douWeight);
          });
        });
      });
    });
    
    
  }
  
  
  braMode() {
    let strScaleBraMode;
    return new Promise((resolve, reject) => {
      dbAdapter.selectKgOpt("ScaleBarMode").then((datas) => {
        let length = datas.length;
        if (length != 0) {
          strScaleBraMode = datas.item(0).OptValue;
        } else {
          strScaleBraMode = "0";
        }
        resolve(strScaleBraMode);
      });
    });
  }
}
