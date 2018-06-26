package com.smartpos.hspos;

        import android.app.Application;

        import com.facebook.react.ReactApplication;



        import com.facebook.react.ReactPackage;
        import com.facebook.react.shell.MainReactPackage;
        import com.facebook.soloader.SoLoader;

        import java.util.Arrays;
        import java.util.List;
import com.smartpos.hspos.ReactNativeHost;
import com.smartpos.utils.SystemUtils;
public class MainApplication extends Application implements ReactApplication {

  private  ReactNativeHost mReactNativeHost = new ReactNativeHost(this);

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
