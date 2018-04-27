package com.smartpos.utils;


/**
 * Created by Administrator on 2016-09-10.
 *
 */
public class Encrypt {
    private static String str2HexStr(String str) {
        char[] chars = "0123456789ABCDEF".toCharArray();
        StringBuilder sb = new StringBuilder("");
        byte[] bs = str.getBytes();
        int bit;
        for (int i = 0; i < bs.length; i++) {
            bit = (bs[i] & 0x0f0) >> 4;
            sb.append(chars[bit]);
            bit = bs[i] & 0x0f;
            sb.append(chars[bit]);
        }
        return sb.toString();
    }

    private static String MakeReadStr(char ACh1, char ACh2) {
        Integer a, b, c, d;
        String Result = "";
        a = (int) (ACh1) / 8;
        b = (int) (ACh1) % 8;
        c = (int) (ACh2) / 64;
        d = (int) (ACh2) % 64;
        Result = Result + (char) (a + 50);
        Result = Result + (char) (b * 4 + c + 45);
        Result = Result + (char) (d + 40);
        return Result;

    }

    private static String GetFromReadStr(String AStr) {
        char ch1, ch2, ch3;
        int a, b, c;
        int s1, s2, s3, s4;
        switch (AStr.length()) {
            case 0:
                AStr = AStr + String.valueOf((char) (50)) + String.valueOf((char) (45)) + String.valueOf((char) (40));
                break;
            case 1:
                AStr = AStr + String.valueOf((char) (45)) + String.valueOf((char) (40));
                break;
            case 2:
                AStr = AStr + String.valueOf((char) (40));
                break;
        }
        ch1 = AStr.charAt(0);
        ch2 = AStr.charAt(1);
        ch3 = AStr.charAt(2);
        int tmp;

        tmp = (int) (ch1) - 50;
        a = tmp;
        b = (int) (ch2) - 45;
        c = (int) (ch3) - 40;
        s1 = a;
        s2 = b / 4;
        s3 = b % 4;
        s4 = c;
        char dd1 = (char) (s1 * 8 + s2);
        char dd2 = (char) (s3 * 64 + s4);
        String Result = String.valueOf(dd1) + String.valueOf(dd2);
        return Result;
    }


    //加密,
    public static String NewStrEncrypt(String Str, Boolean AHex) {
        int len1, len2;
        String TempResult, mids;
        int midb, midc;
        char midc1, midc2;
        String Result;
        mids = "";
        midb = 28;
        int tmp;


        char c[] = Str.toCharArray();
        int aaa = 0;
        for (char a : c) {
            aaa = (int) a;
            midc = (aaa ^ midb);
            mids = mids + ((char) midc);
            aaa = (aaa + midb) % 256;
            midb = (aaa);
        }

        if ((mids.length() % 2) != 0) {
            mids = mids + ((char) (midb));
        }
        len1 = mids.length();
        len2 = len1 / 2;

        TempResult = "";
        for (int i = 0; i <= len2 - 1; i++) {
            midc1 = mids.charAt(i);
            midc2 = mids.charAt(len1 - i - 1);
            TempResult = TempResult + MakeReadStr(midc1, midc2);
        }

        if (AHex) {
            Result = str2HexStr(TempResult);
        } else {
            Result = TempResult;
        }

        return Result;
    }

    private static String CutRightZero(String AStr) {
        Integer len;
        String Result;
        len = AStr.length();
        while (true) {
            if ((len - 1) < 0) break;
            if (AStr.charAt(len - 1) == '0') {
                len = len - 1;
            } else {
                break;
            }
        }
        Result = AStr.substring(0, len);
        return Result;
    }

    private static String toStringHexTest(String s) {
        byte[] baKeyword = new byte[s.length() / 2];
        for (int i = 0; i < baKeyword.length; i++) {
            try {
                baKeyword[i] = (byte) (0xff & Integer.parseInt(s.substring(i * 2, i * 2 + 2), 16));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        try {
            s = new String(baKeyword, "utf-8");// UTF-16le:Not
        } catch (Exception e1) {
            e1.printStackTrace();
        }
        return s;
    }

    //解密
    public static String NewStrDecrypt(String Str, boolean AHex) {
        Integer i, len;
        String mids, temp, s1, s2, dStr;
        int midc, midb;
        String Result;
        if (AHex) {
            dStr = toStringHexTest(Str);
        } else {
            dStr = Str;
        }
        if (dStr.substring(0, 2) == "11") {
            Result = dStr.substring(2, 255);
            return Result;
        }
        mids = "";
        int lenthg1 = dStr.length() / 3;
        for (i = 0; i <= lenthg1 - 1; i++) {
            temp = dStr.substring(i * 3, i * 3 + 3);
            mids = mids + GetFromReadStr(temp);
        }
        len = mids.length();
        s1 = "";
        s2 = "";
        for (i = 0; i <= (len / 2) - 1; i++) {
            s1 = s1 + mids.charAt(i * 2);
            s2 = s2 + mids.charAt(i * 2 + 1);
        }
        len = s2.length();
        for (i = len - 1; i >= 0; i--) {
            s1 = s1 + s2.charAt(i);
        }
        midb = 28;
        mids = "";
        int tmp;
        for (i = 0; i <= s1.length() - 1; i++) {
            tmp = (int) (s1.charAt(i));
            midc = tmp ^ midb;
            mids = mids + (char) midc;
            midb = ((tmp ^ midb) + midb) % 256;

        }
        mids = CutRightZero(mids);
        Result = mids;
        return Result;

    }
}
