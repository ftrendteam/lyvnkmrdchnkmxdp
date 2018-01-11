package com.smartpos.hspos;


import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.Context;
import com.smartpos.utils.SystemUtils;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.smartpos.scanner.ScannerMainActivity;

import android.device.ScanManager;
import android.device.scanner.configuration.PropertyID;
public class RNScannerActivity extends ReactContextBaseJavaModule{
        private static final int REQUEST_CAMERA = 0;
        public ReactApplicationContext reactContext;
        private String deviceModel;
         private final static String SCAN_ACTION = ScanManager.ACTION_DECODE;
        private ScanManager mScanManager;
        public static final String SCN_CUST_ACTION_SCODE = "com.android.server.scannerservice" +
                ".broadcast";
        public static final String SCN_CUST_EX_SCODE = "scannerdata";
        public static final String SCN_CUST_ACTION_START = "android.intent.action.SCANNER_BUTTON_DOWN";

        public RNScannerActivity(ReactApplicationContext reactContext) {
            super(reactContext);
            this.reactContext = reactContext;

            deviceModel = SystemUtils.getDeviceModel();
            IntentFilter intentFilter = new IntentFilter(SCN_CUST_ACTION_SCODE);
            getReactApplicationContext().registerReceiver(mSamDataReceiver, intentFilter);
        if ("sq39Q".equals(android.os.Build.MODEL)) {
               mScanManager = new ScanManager();
               IntentFilter filter2 = new IntentFilter();
               int[] idbuf = new int[]{PropertyID.WEDGE_INTENT_ACTION_NAME,
                       PropertyID.WEDGE_INTENT_DATA_STRING_TAG};
               String[] value_buf = mScanManager.getParameterString(idbuf);
               if (value_buf != null && value_buf[0] != null && !value_buf[0].equals
                       ("")) {
                   filter2.addAction(value_buf[0]);
               } else {
                   filter2.addAction(SCAN_ACTION);
               }
               reactContext.registerReceiver(mScanReceiver, filter2);
               getReactApplicationContext().registerReceiver(mScanReceiver, intentFilter);
               //Scanner.getInstance(reactContext).openScanner();
            }

        }
        // ReactContextBaseJavaModule要求派生类实现getName方法。这个函数用于返回一个字符串
        // 这个字符串用于在JavaScript端标记这个原生模块
        @Override
        public String getName() {
            return "RNScannerAndroid";
        }


        /*
         * 要导出的方法给JavaScript使用，Java方法需要使用注解@ReactMethod
         */
        @ReactMethod
        public void openScanner() {
            if("SHT".equals(deviceModel)||"SHT36".equals(deviceModel)){
                //System.out.println("sc-a");
                //Intent scannerIntent = new Intent(SCN_CUST_ACTION_START);
                //reactContext.sendBroadcast(scannerIntent);

            }else{
                Intent startIntent = new Intent(reactContext,ScannerMainActivity.class);
                startIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
                reactContext.startActivity(startIntent);
            }
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

        private BroadcastReceiver mScanReceiver = new BroadcastReceiver() {

                @Override
                public void onReceive(Context context, Intent intent) {
                    // TODO Auto-generated method stub
                    //isScaning = false;
                    //soundpool.play(soundid, 1, 1, 0, 0, 1);

                    //mVibrator.vibrate(100);

                    byte[] barcode = intent.getByteArrayExtra(ScanManager
                            .DECODE_DATA_TAG);
                    int barcodelen = intent.getIntExtra(ScanManager
                            .BARCODE_LENGTH_TAG, 0);
                    byte temp = intent.getByteExtra(ScanManager.BARCODE_TYPE_TAG,
                            (byte) 0);
                 String barcodeStr = new String(barcode, 0, barcodelen);
                 reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("code",barcodeStr);
                    System.out.println("条码=" + barcodeStr);
                    //showScanResult.setText(barcodeStr);

                }

            };

}