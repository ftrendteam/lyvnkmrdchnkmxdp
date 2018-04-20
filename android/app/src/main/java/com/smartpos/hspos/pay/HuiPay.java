package com.smartpos.hspos.pay;

import com.newland.newpaysdk.NldPaySDK;
import com.newland.newpaysdk.OnResultListener;
import com.newland.newpaysdk.model.NldPhonePay;
import com.newland.newpaysdk.model.NldPhoneResult;
import com.newland.newpaysdk.model.NldRefundPay;
import com.newland.newpaysdk.model.NldRefundResult;
import com.smartpos.hspos.interfaces.NldPaySDKOnResultListener;
/**
 * Created by admin on 2018/4/18.
 */

public class HuiPay {

    /***
     *
     * @param orgNo  请配置机构号
     * @param mercId 请配置商户号
     * @param trmNo 请配置设备号
     * @param amount 支付金额
     * @param total_amount 订单总金额
     * @param authCode 支付条码
     * @param payChannel 条码标识
     * @param txnTime 当前时间
     * @param tradeNo 订单号
     */
    public static void requestPhonePay(String orgNo, String mercId, String trmNo, String amount, String total_amount, String authCode, String payChannel, String txnTime, String tradeNo, final NldPaySDKOnResultListener listener) {
        NldPhonePay nldPhonePay = new NldPhonePay(orgNo, mercId, trmNo, amount, total_amount, authCode, payChannel, txnTime, tradeNo);
        NldPaySDK.getInstance().requestPhonePay(nldPhonePay, new OnResultListener<NldPhoneResult>() {


            @Override
            public void onSuccess(NldPhoneResult nldPhoneResult) {
                listener.onSucess(nldPhoneResult);
            }

            @Override
            public void onFailure(int i, String s) {
                listener.onFail();
            }
        });
    }

    /***
     *
     * @param orgNo 请配置机构号
     * @param mercId 请配置商户号
     * @param trmNo 请配置设备号
     * @param orderNo 退货条码
     * @param txnAmt 退款金额
     * @param txnTime   当前时间
     * @param tradeNo 订单号
     */
    public static void requestRefundPay(String orgNo, String mercId, String trmNo, String orderNo, String txnAmt, String txnTime, String tradeNo,final NldPaySDKOnResultListener listener) {
        NldRefundPay nldRefundPay = new NldRefundPay("", "", orgNo, mercId, trmNo, "", "", orderNo, txnAmt, txnTime, tradeNo);
        NldPaySDK.getInstance().requestRefundPay(nldRefundPay, new OnResultListener<NldRefundResult>() {
            @Override
            public void onSuccess(NldRefundResult nldRefundResult) {
                 listener.onSucess(nldRefundResult);
            }

            @Override
            public void onFailure(int i, String s) {
                listener.onFail();
            }
        });
    }
}
