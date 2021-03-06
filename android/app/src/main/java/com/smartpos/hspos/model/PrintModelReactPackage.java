package com.smartpos.hspos.model;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
public class PrintModelReactPackage implements ReactPackage{

    public PrintModelReactPackage() {
    }

    @Override
    public List<NativeModule> createNativeModules(final ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new JSPrint(reactContext));
        return modules;
    }



    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
      return Collections.emptyList();
    }
}