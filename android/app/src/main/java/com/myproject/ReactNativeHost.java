package com.myproject;

import android.app.Application;

import com.beefe.picker.PickerViewPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.keyee.datetime.*;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import org.pgsqlite.SQLitePluginPackage;
import java.util.Arrays;
import java.util.List;
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
                new MainReactPackage()
        );
    }
}
