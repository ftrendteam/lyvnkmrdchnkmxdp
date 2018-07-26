package com.smartpos.interfaces;
import com.facebook.react.bridge.Callback;
/**
 * Created by admin on 2018/4/8.
 */

public interface P1NServiceInterface {
    /***
     * 检卡
     */
    void checkCard(String optValue,Callback callBack);

    /***
     * 取消检卡
     */
    void cancelCheckCard();

    /***
     * 卡认证
     * @return
     */
    int mifareAuth(int keyType, int block,String optValue);

    /***
     * 读取卡数据
     * @return
     */
    String mifareReadBlock(int block, byte[] blockData);


    /***
     * 卡片下电
     */
    void cardOff (int cardType);

}
