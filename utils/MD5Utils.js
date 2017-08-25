/**
 * Created by admin on 2017/8/25.
 */
import MD5 from 'crypto-js/md5';

export default class MD5Utils {
  static encryptMD5 = (encryptMsg) => {
    return MD5(encryptMsg);
  }
  
}