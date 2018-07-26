package com.smartpos.printApi;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;
import android.text.TextUtils;
import java.util.Date;
import java.util.List;

import woyou.aidlservice.jiuiv5.ICallback;
import woyou.aidlservice.jiuiv5.IWoyouService;


public class SumPrint{
    private Context context;
    private IWoyouService woyouService;
    private static SumPrint sumPrint;
    public static SumPrint getInstance(Context context) {
        if (sumPrint == null) {
            sumPrint = new SumPrint(context);
        }
        return sumPrint;
    }

    public SumPrint(Context context) {
        this.context = context;
        Intent intent = new Intent();
        intent.setPackage("woyou.aidlservice.jiuiv5");
        intent.setAction("woyou.aidlservice.jiuiv5.IWoyouService");
        context.startService(intent);//启动打印服务
        context.bindService(intent, connService, Context.BIND_AUTO_CREATE);
    }

    private ServiceConnection connService = new ServiceConnection() {

        @Override
        public void onServiceDisconnected(ComponentName name) {
            woyouService = null;
        }

        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            woyouService = IWoyouService.Stub.asInterface(service);
        }
    };
    ICallback callback = new ICallback.Stub() {
        @Override
        public void onRunResult(boolean success) throws RemoteException {
        }

        @Override
        public void onReturnString(final String value) throws RemoteException {
        }

        @Override
        public void onRaiseException(int code, final String msg)
                throws RemoteException {
        }
    };


    public void print(String strPrint){
        try{

         woyouService.printText(strPrint, callback);
        }catch(Exception e){
            e.getMessage();
        }
    }


    public void setFontSize(int size) {
        try {
            woyouService.setFontSize(size, callback);//字体大小 35

           // woyouService.printText(shopName + "\n", callback);
            //woyouService.setFontSize(28, callback);//28
            //woyouService.setAlignment(0, callback);//居左 0
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }


    /***
     * 注销 执行一次即可
     */

    public void closeService() {
        if (context != null) {
            context.unbindService(connService);
        }
    }
}
