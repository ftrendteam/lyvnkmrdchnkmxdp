package com.smartpos.printApi;

import com.vanstone.trans.api.PrinterApi;
public class A90Print{
    /**
     * 初始化打印
     */
    public static void initSet(){
        PrinterApi.SetLang_Api(PrinterApi.LANG_CH, PrinterApi.ENCODING_GBK);
        PrinterApi.PrnClrBuff_Api();
    }

    /**
     * 打印字符类型
     */
    public static void print(String strPrint){
        PrinterApi.PrnStr_Api(strPrint);
    }

    /**
    *设置字体大小
    */
    public static void setFontSize(int Ascii, int CFont, int Zoom){
        PrinterApi.PrnFontSet_Api(Ascii, CFont, Zoom);//设置字体
    }

    /**
    *开始打印
    */
    public static void startPrint(){
        PrinterApi.PrnStart_Api();//开始打印
    }

}