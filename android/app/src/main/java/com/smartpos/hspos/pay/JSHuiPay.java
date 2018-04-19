package com.smartpos.hspos.pay;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.newland.newpaysdk.NldPaySDK;
import com.newland.newpaysdk.model.NldPhoneResult;
import com.newland.newpaysdk.model.NldRefundResult;
import com.smartpos.hspos.interfaces.NldPaySDKOnResultListener;
public class JSHuiPay extends ReactContextBaseJavaModule{


    public JSHuiPay(ReactApplicationContext  context) {
     super(context);
    }

    @Override
    public String getName(){
        return "AndroidHuiPayRequest";
    }
    @ReactMethod
    public void init(String devKey){
        NldPaySDK.getInstance().init(devKey);
    }
    @ReactMethod
    public void requestPhonePay(String orgNo, String mercId, String trmNo, String amount, String total_amount, String authCode, String payChannel, String txnTime, String tradeNo,final Callback successCallback){

        HuiPay.requestPhonePay(orgNo,mercId,trmNo,amount,total_amount,authCode,payChannel,txnTime,tradeNo,new NldPaySDKOnResultListener(){
                @Override
                public void onSucess(Object o) {
                    try {
                        NldPhoneResult nldPhoneResult = (NldPhoneResult) o;
                        if (nldPhoneResult == null) {
                            successCallback.invoke("支付失败!");
                            return;
                        }
                        if ("S".equals(nldPhoneResult.getResult())) {//交易成功
                             successCallback.invoke("支付成功!");
                        } else {
                             successCallback.invoke(nldPhoneResult.getMessage());
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        successCallback.invoke("支付异常!");
                    }
                }

                @Override
                public void onFail() {
                     successCallback.invoke("支付请求!");
                }
        });
    }

    @ReactMethod
    public void requestRefundPay(String orgNo, String mercId, String trmNo, String orderNo, String txnAmt, String txnTime, String tradeNo,final Callback successCallback){

        HuiPay.requestRefundPay(orgNo,mercId,trmNo,orderNo,txnAmt,txnTime,tradeNo,new NldPaySDKOnResultListener(){
                 @Override
                 public void onSucess(Object o) {
                     try {
                         NldRefundResult nldRefundResult =
                                 (NldRefundResult) o;
                         if (nldRefundResult == null) {
                             successCallback.invoke("退款交易失败!");
                             return;
                         }
                         if ("S".equals(nldRefundResult.getResult())) {
                             successCallback.invoke("S");
                         } else {
                             successCallback.invoke(nldRefundResult
                                     .getMessage());
                         }
                     } catch (Exception e) {
                         e.printStackTrace();
                         successCallback.invoke("退款异常!");
                     }
                 }

                 @Override
                 public void onFail() {
                      successCallback.invoke("退款请求异常!");
                 }
         });
    }
}