package com.smartpos.hspos.model;
import com.vanstone.trans.api.SystemApi;
import com.vanstone.utils.CommonConvert;
import com.vanstone.trans.api.constants.GlobalConstants;
import com.smartpos.utils.SystemUtils;
import com.smartpos.reader.A90ReadCard;
import android.content.Context;
public class ReaderCardModel{

    public ReaderCardModel(){
    }
    private String deviceModel=SystemUtils.getDeviceModel();

    public void open(){
        if("A90".equals(deviceModel)){
            A90ReadCard.open();
         }
    }

    public void close(){
        if("A90".equals(deviceModel)){
                  A90ReadCard.close();
        }
    }

    public String read(String key){
     if("A90".equals(deviceModel)){
        return A90ReadCard.m1readblock(key);
     }else{
        return "";
     }
   }

}