/**
 * Created by admin on 2018/1/15.
 */
import FetchUtils from "../utils/FetchUtils";
export default class UpLoadData {
  upLoadData = (url,details,sums,shopCode,posCode) => {
      return new Promise((resolve,reject)=>{
        let requestBody =JSON.stringify({
            'TblName':'upsum',
            'shopcode':shopCode,
            'poscode':posCode,
            'detail':JSON.stringify(details),
            'sum':JSON.stringify(sums),
        });
          console.log(requestBody);
        FetchUtils.post(url,requestBody).then((success)=>{
          alert(JSON.stringify(details))
            for(let i = 0;i<details.length;i++){
              console.log(details[i]);
            }
            if ((requestBody.retcode == 1)) {//表示流水上传成功 修改数据库标识
                resolve(true);
            }else{
                reject(false);
            }
        },(error)=>{
            reject(false);
        });
    });

  }
}