package com.myproject;


import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.Context;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RNScannerActivity extends ReactContextBaseJavaModule{

        public ReactApplicationContext reactContext;
        public static final String SCN_CUST_ACTION_SCODE = "com.android.server.scannerservice" +
                ".broadcast";
        public static final String SCN_CUST_EX_SCODE = "scannerdata";
        public static final String SCN_CUST_ACTION_START = "android.intent.action.SCANNER_BUTTON_DOWN";
        public RNScannerActivity(ReactApplicationContext reactContext) {
            super(reactContext);
            this.reactContext = reactContext;
            IntentFilter intentFilter = new IntentFilter(SCN_CUST_ACTION_SCODE);
            getReactApplicationContext().registerReceiver(mSamDataReceiver, intentFilter);
        }
        // ReactContextBaseJavaModule要求派生类实现getName方法。这个函数用于返回一个字符串
        // 这个字符串用于在JavaScript端标记这个原生模块
        @Override
        public String getName() {
            return "RNScannerAndroid";
        }


        /*
         * 要导出一个方法给JavaScript使用，Java方法需要使用注解@ReactMethod
         *
         */
        @ReactMethod
        public void openScanner() {
           Intent scannerIntent = new Intent(SCN_CUST_ACTION_START);
           getReactApplicationContext().sendBroadcast(scannerIntent);
        }

        private BroadcastReceiver mSamDataReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (intent.getAction().equals(SCN_CUST_ACTION_SCODE)) {

                    String message = intent.getStringExtra(SCN_CUST_EX_SCODE);
                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("code",message);
                }
            }
        };
}