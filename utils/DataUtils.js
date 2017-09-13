/**
 * Created by admin on 2017/8/25.
 */
import { AsyncStorage } from 'react-native';
export default class DataUtils {
  
  // 保存
  static async save(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      console.log('_save success: ', value);
    } catch (error) {
      console.log('_save error: ', error.message);
    }
  }
  
  
  // 获取
  static async get(key, defaultValue) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key, (err,result) => {
        if (result == null) {
          resolve(defaultValue);
        } else {
          resolve(result);
        }
      });
    });
    
  }
  
  // 删除
  static async remove(key) {
    console.log('Demo._remove()');
    try {
      await AsyncStorage.removeItem(key);
      console.log('_remove() success');
    } catch (error) {
      console.log('_remove() error: ', error.message);
    }
  }
  
}