package com.smartpos.utils;
import android.content.Context;
import android.content.pm.PackageManager;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import java.util.UUID;

public class SystemUtils{

     /**
     * 获取版本号
     */
    public static int getVerCode(Context context) {
        try {
            return context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionCode;
        } catch (PackageManager.NameNotFoundException e) {
            return 0;
        }
    }

    /**
     * 获取版本名称
     */
    public static String getVerName(Context context) {
        try {
            return context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionName;
        } catch (PackageManager.NameNotFoundException e) {
            return "";
        }
    }

    /**
     * 获取手机型号
     */
    public static String getDeviceModel() {
        return android.os.Build.MODEL.trim();
    }

     /**
     * 获取设备的IMEI
     */
    public static String getIMEI(Context context) {
        String imei = null;
        TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
        try {

            imei = tm.getDeviceId();
            if(TextUtils.isEmpty(imei)){
                String tmDevice, tmSerial, tmPhone, androidId;
                tmDevice = "" + tm.getDeviceId();
                tmSerial = "" + tm.getSimSerialNumber();
                androidId = "" + android.provider.Settings.Secure.getString(context
                        .getContentResolver(), android.provider.Settings.Secure
                        .ANDROID_ID);
                UUID deviceUuid = new UUID(androidId.hashCode(), ((long) tmDevice
                        .hashCode() << 32) | tmSerial.hashCode());
                imei = deviceUuid.toString();
            }
        } catch (Exception e) {
            e.printStackTrace();
            try{
                String tmDevice, tmSerial, tmPhone, androidId;
                tmDevice = "" + tm.getDeviceId();
                tmSerial = "" + tm.getSimSerialNumber();
                androidId = "" + android.provider.Settings.Secure.getString(context
                        .getContentResolver(), android.provider.Settings.Secure
                        .ANDROID_ID);
                UUID deviceUuid = new UUID(androidId.hashCode(), ((long) tmDevice
                        .hashCode() << 32) | tmSerial.hashCode());
                imei = deviceUuid.toString();
            }catch(Exception c){
                c.getMessage();
            }
        }
        return imei;
    }
}