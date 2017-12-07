/**
 * Created by admin on 2017/11/28.
 */
import { PermissionsAndroid } from 'react-native';
export default class PermissionUtils {
  static   requestCameraPermission() {
    return new Promise((resolve, reject) => {
      try {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            'title': '申请摄像头权限',
            'message': '没有权限无法使用扫码功能!'
          }
        ).then((result) => {
          if (result === PermissionsAndroid.RESULTS.GRANTED) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      } catch (err) {
        console.warn(err)
      }
    });
    
  }
  
  //核实
  static checkPermission() {
    try {
      //返回Promise类型
      const granted = PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      )
      granted.then((data) => {
        alert("是否获取读写权限" + data);
      }).catch((err) => {
        //alert(err.toString())
      })
    } catch (err) {
      //this.show(err.toString())
    }
  }
}