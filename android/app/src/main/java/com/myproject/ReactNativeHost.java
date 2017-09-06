package com.myproject;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;

import com.keyee.datetime.*;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.beefe.picker.PickerViewPackage;
public class ReactNativeHost extends com.facebook.react.ReactNativeHost {
    protected ReactNativeHost(Application application) {
        super(application);
    }
    @Override
    public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new RCTDateTimePickerPackage(),
                new RCTCameraPackage(),
                new MainReactPackage(),
                new PickerViewPackage()
        );
    }
}
