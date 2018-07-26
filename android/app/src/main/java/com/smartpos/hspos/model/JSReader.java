package com.smartpos.hspos.model;


import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.smartpos.utils.SystemUtils;
import com.facebook.react.bridge.Callback;


public class JSReader extends ReactContextBaseJavaModule{

    private ReaderCardModel readerModer;
    public JSReader(ReactApplicationContext  context) {
        super(context);
        readerModer =new ReaderCardModel(context);

    }

    @Override
    public String getName(){
        return "AndroidReadCardInterface";
    }

    @ReactMethod
    public void open(){
        readerModer.open();
    }

    @ReactMethod
    public void read(String key,Callback successCallback){
        //successCallback.invoke(readerModer.read(key,successCallback));
        readerModer.read(key,successCallback);
    }

    @ReactMethod
    public void close(){
        readerModer.close();
    }
}