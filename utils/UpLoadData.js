/**
 * Created by admin on 2018/1/15.
 */
import FetchUtils from "../utils/FetchUtils";
export default class UpLoadData {
  upLoadData = (url,detail,sum) => {
    let requestBody =JSON.stringify({
      'TblName':'upsum',
      'shopcode':shopCode,
      'poscode':posCode,
      'detail':detail,
      'sum':sum,
    });
    FetchUtils.post(url,requestBody).then((success)=>{
    
    },(error)=>{
    
    });
  }
}