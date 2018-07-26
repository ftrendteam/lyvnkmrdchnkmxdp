package com.smartpos.hspos.model;
import com.vanstone.trans.api.SystemApi;
import com.vanstone.utils.CommonConvert;
import com.vanstone.trans.api.constants.GlobalConstants;
import com.smartpos.utils.SystemUtils;
import com.smartpos.reader.A90ReadCard;
import com.smartpos.reader.P1NReadCardIml;
import android.content.Context;
import com.facebook.react.bridge.Callback;

public class ReaderCardModel{
    private Context context;
    private P1NReadCardIml p1nReadCard;
    public ReaderCardModel(Context context){
        this.context = context;

    }
    private String deviceModel=SystemUtils.getDeviceModel();

    public void init(){
        if("P1N".equals(deviceModel)){
           p1nReadCard= P1NReadCardIml.getInstance(context);
        }
    }

    public void open(){
        if("A90".equals(deviceModel)){
            A90ReadCard.open();
         }else if("P1N".equals(deviceModel)){
            p1nReadCard= P1NReadCardIml.getInstance(context);
         }
    }

    public void close(){
        if("A90".equals(deviceModel)){
                  A90ReadCard.close();
        }else if("P1N".equals(deviceModel)){

        }
    }

    public void read(String key,Callback callBack){
     if("A90".equals(deviceModel)){
         callBack.invoke(A90ReadCard.m1readblock(key));
     }else if("P1N".equals(deviceModel)){
        p1nReadCard.checkCard(key,callBack);
     }
   }

}