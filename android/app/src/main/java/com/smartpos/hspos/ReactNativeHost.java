package com.smartpos.hspos;

import android.app.Application;

import com.beefe.picker.PickerViewPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.keyee.datetime.*;
import com.lwansbrough.RCTCamera.RCTCameraPackage;

import java.util.Arrays;
import java.util.List;
import org.pgsqlite.SQLitePluginPackage;

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
                new PickerViewPackage(),
                new SQLitePluginPackage(),
                new JsScannerReactPackage(),
                new JSAndroidIMEIReactPackage(),
                new MainReactPackage()
        );
    }
}
