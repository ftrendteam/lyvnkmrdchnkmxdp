
package com.smartpos.hspos;
import com.smartpos.utils.SystemUtils;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;


public class DeviceInfo extends ReactContextBaseJavaModule{
        private ReactApplicationContext reactContext;

        public DeviceInfo(ReactApplicationContext reactContext) {
            super(reactContext);
            this.reactContext = reactContext;
        }

        @Override
        public String getName(){
            return "AndroidDeviceInfo";
        }

        @ReactMethod
        public void getVerCode(Callback successCallback){
            successCallback.invoke(SystemUtils.getVerCode(reactContext));
        }

        @ReactMethod
        public void getVerName(Callback successCallback){
            successCallback.invoke(SystemUtils.getVerName(reactContext));
        }

        @ReactMethod
        public void getIMEI(Callback successCallback){
            successCallback.invoke(SystemUtils.getIMEI(reactContext));
        }

        @ReactMethod
        public void getDeviceModel(Callback successCallback){
            successCallback.invoke(SystemUtils.getDeviceModel());
        }
}