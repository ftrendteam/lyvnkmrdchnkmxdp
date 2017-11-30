package com.smartpos.utils;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.content.Intent;
import com.smartpos.scanner.ScannerMainActivity;
/**
 * -------------------------------
 * Created by wrp on 2017/11/28.
 * 描述:
 */

public class PermissionUtils {

    private Activity context;
    public PermissionUtils(Activity context){
        this.context =context;
    }
    /***
     * 权限检查
     * @return true包含某个权限
     */
    public boolean checkPermission(String checkPermission) {// Manifest
        // .permission.READ_CONTACTS
        if (ContextCompat.checkSelfPermission(context, checkPermission)
                != PackageManager.PERMISSION_GRANTED) {
            return false;
        } else {
            return true;
        }
    }

    public void requestPermission(Activity activity,String[] permissions,int requestCode) {//new String[]{Manifest.permission.READ_CONTACTS}
        ActivityCompat.requestPermissions(activity, permissions, requestCode);
    }

    public void showCamera() {
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.CAMERA)
                         != PackageManager.PERMISSION_GRANTED) {
                     requestCameraPermission();//申请权限
                 } else {
                     //showCameraPreview();//打开摄像机
                      System.out.println("打开摄像头");
                 }
    }
    private   final int REQUEST_CONTACTS = 1;
    private   final int REQUEST_CAMERA = 0;
    private void requestCameraPermission() {
    System.out.println("申请权限");
        if (ActivityCompat.shouldShowRequestPermissionRationale(context,
                Manifest.permission.CAMERA)) {
            ActivityCompat.requestPermissions(context,
                    new String[]{Manifest.permission.CAMERA},
                    REQUEST_CAMERA);
        } else {
            ActivityCompat.requestPermissions(context, new String[]{Manifest.permission.CAMERA},
                    REQUEST_CAMERA);
        }
    }
}
