package com.smartpos.hspos;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.smartpos.utils.DownloadUtil;
import android.os.Environment;
import android.content.Intent;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.app.AlertDialog;
import android.widget.Toast;
import java.io.File;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.app.Activity;
public class RNAndroidUpAPK extends ReactContextBaseJavaModule{
    private final int PD_DISMISS = 0X01;
    private final int PD_SHOW = 0X02;
    private final int PD_DISMISS_TOASTSHOW=0X03;
    private ProgressDialog pd;
    private ReactApplicationContext reactContext;
    public RNAndroidUpAPK(ReactApplicationContext reactContext) {
            super(reactContext);
            this.reactContext = reactContext;
    }


    @Override
    public String getName(){
        return "UpApk";
    }


    private void downloadApk(String url){
        String saveDir = Environment.getExternalStorageDirectory()
                        .getAbsolutePath();
                final String fileName = Environment.getExternalStorageDirectory() +
                        "/安卓yw.apk";
                DownloadUtil.get().download(url + "/Down/安卓yw.apk", saveDir, new DownloadUtil.OnDownloadListener() {
                    @Override
                    public void onDownloadSuccess() {
                        Intent intent = new Intent();
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        intent.setAction(android.content.Intent.ACTION_VIEW);
                        intent.setDataAndType(Uri.fromFile(new File(fileName)),
                                     "application/vnd.android.package-archive");
                        reactContext.startActivity(intent);
                    }

                    @Override
                    public void onDownloading(final int progress, long total) {


                    }

                    @Override
                    public void onDownloadFailed() {

                    }
                });
    }

    @ReactMethod
    public void isUpdata(final String url) {
        new Thread(new Runnable() {
                @Override
                public void run() {
                    if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
                        downloadApk(url);
                    }
                }
            }).start();
    }


}