package com.smartpos.hspos.model;

import android.content.Context;
import com.smartpos.utils.SystemUtils;
import com.smartpos.printApi.A90Print;
import com.vanstone.trans.api.SystemApi;
import com.vanstone.utils.CommonConvert;
import com.vanstone.trans.api.constants.GlobalConstants;
public class PrintModel{
    private A90Print a90Print;
    private String deviceModel;
    static{
        if("A90".equals(SystemUtils.getDeviceModel())){
            System.load("data/data/com.smartpos.hspos/lib-main/libA90JavahCore.so");
          // System.loadLibrary("A90JavahCore");
        }
    }
    public void init(Context context){
        deviceModel=SystemUtils.getDeviceModel();
        if("A90".equals(deviceModel)){
            //System.loadLibrary("A90JavahCore");
            //A90ReadCard a90ReadCard = A90ReadCard.getInstance();
            //a90Print = A90Print.getInstance();

            SystemApi.SystemInit_Api(// 初始化
                                0, CommonConvert
                                        .StringToBytes(GlobalConstants.CurAppDir
                                                + "/" + "\0"), context);
        }
    }
    public void initPrint(){
    if("A90".equals(deviceModel)){
                A90Print.initSet();
            }
    }
    public void print(String strPrint){
        if("A90".equals(deviceModel)){
            A90Print.print(strPrint);
        }
    }

    public void setFontSize(int Ascii, int CFont, int Zoom){
        if("A90".equals(deviceModel)){
            A90Print.setFontSize(Ascii, CFont, Zoom);//设置字体
        }
    }

    public void startPrint(){
        if("A90".equals(deviceModel)){
            A90Print.startPrint();
        }
    }
}