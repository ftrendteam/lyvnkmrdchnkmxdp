package com.smartpos.hspos.model;


import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.smartpos.utils.SystemUtils;
public class JSPrint extends ReactContextBaseJavaModule{

    private PrintModel printModel;
    public JSPrint(ReactApplicationContext  context) {
        super(context);
        printModel = new PrintModel();
        printModel.init(context);//加载so文件
    }

    @Override
    public String getName(){
        return "AndroidPrintInterface";
    }
    @ReactMethod
    public void initPrint(){
        printModel.initPrint();
    }
    @ReactMethod
    public void print(String strPrint){
        printModel.print(strPrint);
    }

   @ReactMethod
   public void setFontSize(int Ascii, int CFont, int Zoom){
        printModel.setFontSize(Ascii,CFont,Zoom);
   }

   @ReactMethod
   public void startPrint(){
        printModel.startPrint();
   }
}