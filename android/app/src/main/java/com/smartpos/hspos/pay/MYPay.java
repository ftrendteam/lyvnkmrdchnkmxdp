package com.smartpos.hspos.pay;

import android.os.Environment;

import com.miya.TcpSend;
import java.util.HashMap;
import java.util.Map;
/**
 * Created by admin on 2018/4/13.
 */

public class MYPay {
    public static String doPayRequest(String NUMID,String USERID,String OPERATOR_ID,String SAASID,String OUT_TRADE_NO,String TOTAL_FEE,String F1,String F2,String HOST,String PORT){
        try {
            String path = Environment.getExternalStorageDirectory()
                    .getAbsolutePath() + "/miyajpos/";
            Map tlvmap = new HashMap();
            Map other = new HashMap();
            tlvmap.put("VERSION", "1.5");
            tlvmap.put("TRCODE", "1001");//
            tlvmap.put("SAASID", SAASID);//miya
            tlvmap.put("NUMID", NUMID);//
            tlvmap.put("USERID", USERID);
            tlvmap.put("OPERATOR_ID", OPERATOR_ID);
            tlvmap.put("PAYMENTPLATFORM", "A");
            tlvmap.put("SERVEICETYPE", "A");//支付-A,查询-B，退货-C,退货查询-D
            tlvmap.put("OUT_TRADE_NO", OUT_TRADE_NO);//商户订单号
            tlvmap.put("TOTAL_FEE", TOTAL_FEE);//支付金额 单位分
            tlvmap.put("F1", F1);//付款码 GOODSDETAIL =
            tlvmap.put("F2", F2);//商户key  用于加密  nbz9ww27sx4ou6dkr61mf63tth3s6e2d
            other.put("KEY", F2);

            tlvmap.put("path", path);
            other.put("HOST", HOST);
            other.put("PORT", PORT);
            other.put("TIMEOUT", "60");
            other.put("SUBJECT", "支付条码");
            other.put("SAASID", SAASID);
            Map requsetMap = TcpSend.sendMiya(tlvmap, other);
            String retcode = (String) requsetMap.get("RETCODE");
            String retmsg = (String) requsetMap.get("RETMSG");
            if("00PAYSUCCESS".equals(retcode+retmsg)){
                String paymentplatform = (String) requsetMap.get
                            ("PAYMENTPLATFORM");
                return paymentplatform+"-"+"支付成功";
            }else{
                return (String)requsetMap.get("F1");
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            return "支付异常";
        }
    }

    public static String doRetPayRequest(String NUMID,String USERID,String OPERATOR_ID,String SAASID,String OUT_TRADE_NO,String TOTAL_FEE,String OUT_REQUEST_NO,String F2,String HOST,String PORT){
        try {
            String path = Environment.getExternalStorageDirectory()
                    .getAbsolutePath() + "/miyajpos/";
            Map tlvmap = new HashMap();
            Map other = new HashMap();
            tlvmap.put("VERSION", "1.5");
            tlvmap.put("TRCODE", "1003");//
            tlvmap.put("SAASID",SAASID);//miya
            tlvmap.put("NUMID", NUMID);//
            tlvmap.put("USERID",USERID);
            tlvmap.put("OPERATOR_ID", OPERATOR_ID);
            tlvmap.put("PAYMENTPLATFORM", "A");
            tlvmap.put("SERVEICETYPE", "C");//支付-A,查询-B，退货-C,退货查询-D
            tlvmap.put("OUT_TRADE_NO", OUT_TRADE_NO);//商户退款单号
            tlvmap.put("TOTAL_FEE", TOTAL_FEE);//退货金额 单位分
//            tlvmap.put("PAYMENT_TYPE", "A");
//            tlvmap.put("GOODSDETAIL", "690000000,大鹏牌啤酒,0.01,1");
            tlvmap.put("OUT_REQUEST_NO", OUT_REQUEST_NO);//退款码 生成唯一退款吗
            tlvmap.put("F2", F2);//商户key  用于加密  nbz9ww27sx4ou6dkr61mf63tth3s6e2d
            other.put("KEY", F2);
            tlvmap.put("path", path);
            other.put("HOST", HOST);
            other.put("PORT", PORT);
            other.put("TIMEOUT", "60");
            other.put("SUBJECT", "退款条码");
            other.put("SAASID", SAASID);
            Map requsetMap = TcpSend.sendMiya(tlvmap, other);
            String retcode = (String) requsetMap.get("RETCODE");
            String retmsg = (String) requsetMap.get("RETMSG");
            if("00REFUNDSUCCESS".equals(retcode+retmsg)){
            String paymentplatform = (String) requsetMap.get
                                        ("PAYMENTPLATFORM");
                return paymentplatform+"-"+"退款成功!";
            }else{
                return (String)requsetMap.get("F1");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "退款异常!";
        }
    }
}
