package com.smartpos.hspos.pay;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.io.File;
import android.os.Environment;
import com.smartpos.utils.AssetsUtils;
public class JSMYRequest extends ReactContextBaseJavaModule{


    public JSMYRequest(ReactApplicationContext  context) {
     super(context);
        File file = new File(Environment.getExternalStorageDirectory()
                        .getAbsolutePath() + "/miyajpos/");
                boolean exists = file.exists();
                if (!exists) {
                    AssetsUtils.getInstance(context).copyAssetsToSD("miyajpos", "miyajpos")
                            .setFileOperateCallback(new AssetsUtils.FileOperateCallback() {
                                @Override
                                public void onSuccess() {
                                    // TODO: 文件复制成功时，主线程回调

                                }

                                @Override
                                public void onFailed(String error) {
                                    // TODO: 文件复制失败时，主线程回调

                                }
                            });
                }
    }

    @Override
    public String getName(){
        return "AndroidMYRequest";
    }

    @ReactMethod
    public void doPay(String NUMID,String USERID,String OPERATOR_ID,String SAASID,String OUT_TRADE_NO,String TOTAL_FEE,String F1,String F2,String HOST,String PORT,Callback successCallback){
        successCallback.invoke(MYPay.doPayRequest(NUMID,USERID,OPERATOR_ID,SAASID,OUT_TRADE_NO,TOTAL_FEE,F1,F2,HOST,PORT));
    }

    @ReactMethod
    public void doRetPay(String NUMID,String USERID,String OPERATOR_ID,String SAASID,String OUT_TRADE_NO,String TOTAL_FEE,String OUT_REQUEST_NO,String F2,String HOST,String PORT,Callback successCallback){
        successCallback.invoke(MYPay.doPayRequest(NUMID,USERID,OPERATOR_ID,SAASID,OUT_TRADE_NO,TOTAL_FEE,OUT_REQUEST_NO,F2,HOST,PORT));
    }
}