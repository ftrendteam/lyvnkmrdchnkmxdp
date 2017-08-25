/**
 * Created by admin on 2017/8/25.
 */
import {AsyncStorage} from 'react-native';
export default class DataUtils {
  
  // 保存
  static async save(key, value) {
    console.log('Demo._save()');
    try {
      await AsyncStorage.setItem(key, value);
      console.log('_save success: ', value);
    } catch (error) {
      console.log('_save error: ', error.message);
    }
  }
  
  
  // 获取
  static async get(key) {
    console.log('Demo._get()');
    try {// try catch 捕获异步执行的异常
      var value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      } else {
        return '';
      }
    } catch (error) {
      return '';
      console.log('_get() error: ', error.message);
    }
  }
  
  // 删除
  static async _remove() {
    console.log('Demo._remove()');
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('_remove() success');
    } catch (error) {
      console.log('_remove() error: ', error.message);
    }
  }
  
}