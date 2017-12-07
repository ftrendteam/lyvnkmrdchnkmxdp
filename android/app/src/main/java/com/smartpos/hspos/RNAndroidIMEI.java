package com.smartpos.hspos;
import android.telephony.TelephonyManager;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.Context;
import com.facebook.react.modules.core.DeviceEventManagerModule;
public class RNAndroidIMEI extends ReactContextBaseJavaModule{

    public ReactApplicationContext reactContext;

    public RNAndroidIMEI(ReactApplicationContext reactContext) {
       super(reactContext);
       this.reactContext = reactContext;

    }

    // ReactContextBaseJavaModule要求派生类实现getName方法。这个函数用于返回一个字符串
    // 这个字符串用于在JavaScript端标记这个原生模块
     @Override
     public String getName() {
         return "RNAndroidIMEI";
     }

     @ReactMethod
     public void getAndroidIMEI() {
         TelephonyManager telephonyManager = (TelephonyManager)getReactApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
         String IMEI = telephonyManager.getDeviceId();
         reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("AndroidIMEI",IMEI);
     }


}
