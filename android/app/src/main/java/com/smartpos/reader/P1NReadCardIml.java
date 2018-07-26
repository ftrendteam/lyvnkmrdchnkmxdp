package com.smartpos.reader;

import android.content.Context;
import android.os.RemoteException;
import android.text.TextUtils;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import com.smartpos.interfaces.P1NServiceInterface;
import com.smartpos.utils.P1NStringByteUtils;
import com.smartpos.utils.Encrypt;
import com.sunmi.payservice.hardware.aidl.HardwareOpt;
import com.sunmi.payservice.hardware.aidl.ReadCardCallback;
import com.sunmi.payservice.hardware.aidl.bean.PayCardInfo;
import com.facebook.react.bridge.Callback;
import sunmi.payservicelib.SunmiPayService;

/**
 * Created by admin on 2018/4/8.
 */

public class P1NReadCardIml implements P1NServiceInterface {
    private Callback callBack;
    private boolean isCheckFinish = false;
    private static P1NReadCardIml p1NReadCard;
    private static HardwareOpt hardwareOpt;
    private static SunmiPayService p1NService;
    private String optValue;
    public static P1NReadCardIml getInstance(Context context) {
        if (p1NReadCard == null) {
            p1NReadCard = new P1NReadCardIml();
        }

        p1NService = SunmiPayService.getInstance();
        p1NService.connectPayService(context, new SunmiPayService.ConnCallback() {
            @Override
            public void onServiceConnected() {
                hardwareOpt = p1NService.mHardwareOpt;
            }

            @Override
            public void onServiceDisconnected() {

            }
        });
        return p1NReadCard;
    }

    private P1NReadCardIml() {

    }


    public boolean isCheckFinish() {
        return isCheckFinish;
    }

    public void setCheckFinish(boolean checkFinish) {
        isCheckFinish = checkFinish;
    }

    @Override
    public void checkCard(String optValue,Callback callBack) {
        isCheckFinish = true;
        this.optValue=optValue;
        this.callBack=callBack;

        try {
            hardwareOpt.checkCard(9, mReadCardCallback, 60);
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

    ReadCardCallback mReadCardCallback = new ReadCardCallback.Stub() {
        @Override
        public void onCardDetected(final PayCardInfo cardInfo) throws RemoteException {
            String track2 = cardInfo.track2;
            if (!TextUtils.isEmpty(track2)) {
                //MagCardBean magCardBean = new MagCardBean();
                //magCardBean.setCardNo(track2);
                //EventBus.getDefault().post(magCardBean);
                if(callBack!=null){
                   track2= getNum(track2);
                    callBack.invoke(track2);
                }

            } else {
                int i = mifareAuth(0, 4, optValue);

                if (0 == i) {
                    byte[] bytes = new byte[260];
                    if(callBack!=null){
                        String a = mifareReadBlock(4, bytes);

                        callBack.invoke(a);
                    }
                }
            }
            isCheckFinish = false;
        }

        @Override
        public void onError(final int i, final String s) throws RemoteException {
            isCheckFinish = false;
        }

        @Override
        public void onStartCheckCard() throws RemoteException {
        }
    };

    @Override
    public void cancelCheckCard() {
        try {
            hardwareOpt.cancelCheckCard();
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

    @Override
    public int mifareAuth(int keyType, int block,String optValue) {
        try {
            String s = Encrypt.NewStrDecrypt(optValue, true);
            while (s.length() < 12) {
                s = s + "F";
            }
            byte[] key = P1NStringByteUtils.hexStringToBytes(s); //密码
            int i = hardwareOpt.mifareAuth(keyType, block, key);
            if (0 == i) {//认证成功
                return i;
            } else {
                return 0;
            }
        } catch (RemoteException e) {
            e.printStackTrace();
            return 0;
        }
    }

    @Override
    public String mifareReadBlock(int block, byte[] blockData) {
        try {
            int i = hardwareOpt.mifareReadBlock(block, blockData);

            if (0 == i) {//读取成功
                String s = new String(blockData);
                s = s.replace(" ","");
                s = s.trim();
                s=getNum(s);
                return s;
            } else {
                return "";
            }
        } catch (RemoteException e) {
            e.printStackTrace();
            return "";
        }
    }

    public String getNum(String str){
		Pattern p = Pattern.compile("\\d+");
		Matcher m = p.matcher(str);
		m.find();
		return m.group();
	}

    @Override
    public void cardOff(int cardType) {
        try {
            isCheckFinish = false;
            hardwareOpt.cardOff(cardType);
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }
}
