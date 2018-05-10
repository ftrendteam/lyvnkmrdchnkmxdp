package com.smartpos.reader;

import android.text.TextUtils;


import com.smartpos.utils.StringByteUtils;
import com.smartpos.utils.StringUtils;

import com.vanstone.trans.api.Itwell;
import com.vanstone.trans.api.MagCardApi;
import com.vanstone.trans.api.PiccApi;
import com.vanstone.utils.ByteUtils;
import com.smartpos.utils.Encrypt;
import com.vanstone.utils.CommonConvert;

/**
 * Created by admin on 2018/4/19.
 */

public class A90ReadCard {
    public static void open(){
        PiccApi.PiccOpen_Api();
        MagCardApi.MagOpen_Api();
    }

    public static void close(){
        PiccApi.PiccClose_Api();
         MagCardApi.MagClose_Api();
    }

    public static void m1auth(String s) {//读取加认证
        String key = Encrypt.NewStrDecrypt(s, true);
        while (key.length() < 12) {
            key = key + "F";
        }
        System.out.println("key="+key);
        byte[] bytes = new byte[0];
        try {
            bytes = StringUtils.bytesFromHex(key, 6);
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
        byte[] SerialNo = new byte[100];
        byte[] CardType = new byte[2];
        int m = PiccApi.PiccCheck_Api('M', CardType, SerialNo);
        System.out.println();
        if (m == 0) {//读卡
            int ret = 0;
            ret = PiccApi.M1Authority_Api('A', 4, bytes);//认证
            System.out.println("renzheng="+ret);
        }
    }

//1   0
    public static String m1readblock(String s) {
        String cardInfo = "";
        int blockNum =  1 * 4 + 0;
        m1auth(s);
        byte[] BlkValue = new byte[16];
        int ret = PiccApi.M1ReadBlock_Api(blockNum, BlkValue);
        System.out.println("du2="+ret);
        if (ret == 0) {
            cardInfo = StringByteUtils.bytesToAscii(BlkValue);
            System.out.println("card="+cardInfo);
            try {
                PiccApi.PiccHalt_Api();
                PiccApi.PiccRest_Api(1, new byte[200]);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            cardInfo = MagTrackCheck();//磁条卡
            try {
                PiccApi.PiccHalt_Api();
                PiccApi.PiccRest_Api(1, new byte[200]);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return cardInfo.trim();

    }

    /**
     * 磁卡磁道数据测试
     */
    private static String MagTrackCheck() {
    System.out.println("citiaokaasdfasdfs");

        byte[] TrackLen = new byte[256];
        byte[] DispTempBuf = new byte[500];
        byte[] TrackDate = new byte[200];
        ByteUtils.memset(TrackDate, 0, TrackDate.length);
        ByteUtils.memset(DispTempBuf, 0, DispTempBuf.length);
        if (0x31 == MagCardApi.MagRead_Api(TrackDate, TrackLen)) {
            MagDateAnalyticTo3Track(TrackDate, DispTempBuf);

            String handlerStr = CommonConvert.BytesToString
                    (DispTempBuf).trim();

                    System.out.println("citiaoka="+handlerStr);
            if (!TextUtils.isEmpty(handlerStr)) {
                return handlerStr;
            }
        }

        return "";
    }

    /**
     * 磁道数据的有效性检查
     */
    public static boolean CheckReadMagDate(byte[] TrackData) {
        int Track3Len, Track2Len;
        byte[] zero = new byte[5];

        Track2Len = TrackData[0];
        Track3Len = TrackData[Track2Len + 1];

        if ((TrackData[Track2Len + 1 + Track3Len] & 0x0f) == 0x0f)
            Track3Len = (Track3Len * 2) - 1;
        else
            Track3Len *= 2;

        if ((TrackData[Track2Len] & 0xf) == 0x0f)
            Track2Len = (Track2Len * 2) - 1;
        else
            Track2Len *= 2;

        // 二磁道数据长度为0
        if (Track2Len == 0)
            return false;

        // 二磁道数据长度超过37或小于10
        if ((Track2Len > 37) || (Track2Len < 10)) {
            return false;
        }

        // 三磁道数据长度超过104
        if (Track3Len > 104) {
            return false;
        }
        // 三磁道数据长度不为0，但小于10
        if ((Track3Len > 0) && (Track3Len < 10)) {
            return false;
        }

        // 二磁道前10个为0
        if (ByteUtils.memcmp(ByteUtils.subBytes(TrackData, 1), zero, 5) == 0) {
//			PublicSource.TipAndWait_Api("2Track 10个0(按确定！)");
            return false;
        }

        return true;
    }

    /**
     * 将三个磁道数据分开
     *
     * @param Inbuf
     * @param Outbuf
     */
    public static void MagDateAnalyticTo3Track(byte[] Inbuf, byte[] Outbuf) {
//        Track1 = new byte[200], Track3 = new byte[200],
        int i = 0, Track1Len = 0, Track2Len = 0, Track3Len = 0, len = 0;
        byte[] tempbuf = new byte[500], buf = new byte[500], Track2 = new
                byte[200],
                lenBuf = new byte[6];
        byte[] tempbufRepetition = new byte[500];
        ByteUtils.memset(buf, 0, buf.length);
        ByteUtils.memset(tempbuf, 0, tempbuf.length);
//        ByteUtils.memset(Track1, 0, Track1.length);
        ByteUtils.memset(Track2, 0, Track2.length);
//        ByteUtils.memset(Track3, 0, Track3.length);
        ByteUtils.memset(lenBuf, 0, lenBuf.length);

//        ByteUtils.memcpy(tempbuf, "\n\nTrack2");

        if (Inbuf[i] != 0) { // 有2磁道数据
            Track2Len = Inbuf[i];
            ByteUtils.memcpy(Track2, ByteUtils.subBytes(Inbuf, i + 1),
                    Track2Len);
            if ((Inbuf[Track2Len] & 0xf) == 0x0f)
                len = (Track2Len * 2) - 1;
            else
                len = Track2Len * 2;

//			MathsApi.BcdToAsc_Api(buf, Track2, len);
            // bcd2ascii(buf, Track2, Track2Len);
            Itwell.FormBcdToAsc(buf, Track2, len);
            i += Track2Len;
        } else {
            ByteUtils.memcpy(buf, "\n\n", 2);
        }
//        ByteUtils.strcat(lenBuf, ":");
        ByteUtils.strcat(tempbuf, lenBuf);
        ByteUtils.strcat(tempbuf, buf);

        i += 1; // 因为有一个字节为本磁道的长度

        ByteUtils.memset(buf, 0, buf.length);
        ByteUtils.memset(lenBuf, 0, lenBuf.length);
        len = 0;
//        ByteUtils.strcat(tempbuf, " \n\nTrack3");
//        if (Inbuf[i] != 0) { // 有3磁道数据
//            Track3Len = Inbuf[i];
//            ByteUtils.memcpy(Track3, ByteUtils.subBytes(Inbuf, i + 1),
//                    Track3Len);
//            if ((Inbuf[Track2Len + 1 + Track3Len] & 0x0f) == 0x0f)
//                len = (Track3Len * 2) - 1;
//            else
//                len = Track3Len * 2;
//            MathsApi.BcdToAsc_Api(buf, Track3, len);
//            // bcd2ascii(buf, Track3, Track3Len);
//
//            i += Track3Len;
//        } else {
//            ByteUtils.memcpy(buf, "'',\n\n", 2);
//        }
//        ByteUtils.strcat(lenBuf, ":");
        ByteUtils.strcat(tempbuf, lenBuf);
        ByteUtils.strcat(tempbuf, buf);

        i += 1;// 因为有一个字节为本磁道的长度

        ByteUtils.memset(buf, 0, buf.length);
        ByteUtils.memset(lenBuf, 0, lenBuf.length);
        len = 0;
        // ByteUtils.strcat(tempbuf, " Track1");
//        if (Inbuf[i] != 0) {
//            Track1Len = Inbuf[i];
//            ByteUtils.memcpy(Track1, ByteUtils.subBytes(Inbuf, i + 1),
//                    Track1Len);// 一磁道数据特殊
//            // 不需要转换
//            len = Track1Len;
//        } else {
//            ByteUtils.memcpy(Track1, "''\n\n", 2);
//        }
//        ByteUtils.strcat(lenBuf, ":");
        // ByteUtils.strcat(tempbuf, lenBuf);
        // ByteUtils.strcat(tempbuf, Track1);

//        ByteUtils.strcat(tempbufRepetition, " Track1");
        ByteUtils.strcat(tempbufRepetition, lenBuf);
//        ByteUtils.strcat(tempbufRepetition, Track1);
        ByteUtils.strcat(tempbufRepetition, tempbuf);
        ByteUtils.memcpy(Outbuf, tempbufRepetition, tempbuf.length);
    }
}
