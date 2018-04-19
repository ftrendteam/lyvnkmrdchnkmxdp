package com.smartpos.utils;

import android.text.Html;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.style.CharacterStyle;
import android.text.style.ForegroundColorSpan;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.text.DecimalFormat;
import java.util.Random;

/**
 * Created by mwqi on 2014/6/8.
 */
public class StringUtils {
    public final static String UTF_8 = "utf-8";
//	private Double aDouble = new Double();

    /**
     * 判断字符串是否有值，如果为null或者是空字符串或者只有空格或者为"null"字符串，则返回true，否则则返回false
     */
    public static boolean isEmpty(String value) {
        if (value != null && !"".equalsIgnoreCase(value.trim()) && !"null"
                .equalsIgnoreCase(value
                        .trim())) {
            return false;
        } else {
            return true;
        }
    }


    /**
     * 判断多个字符串是否相等，如果其中有一个为空字符串或者null，则返回false，只有全相等才返回true
     */
    public static boolean isEquals(String... agrs) {
        String last = null;
        for (int i = 0; i < agrs.length; i++) {
            String str = agrs[i];
            if (isEmpty(str)) {
                return false;
            }
            if (last != null && !str.equalsIgnoreCase(last)) {
                return false;
            }
            last = str;
        }
        return true;
    }

    /**
     * 返回一个高亮spannable
     *
     * @param content 文本内容
     * @param color   高亮颜色
     * @param start   起始位置
     * @param end     结束位置
     * @return 高亮spannable
     */
    public static CharSequence getHighLightText(String content, int color,
                                                int start, int end) {
        if (TextUtils.isEmpty(content)) {
            return "";
        }
        start = start >= 0 ? start : 0;
        end = end <= content.length() ? end : content.length();
        SpannableString spannable = new SpannableString(content);
        CharacterStyle span = new ForegroundColorSpan(color);
        spannable.setSpan(span, start, end, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        return spannable;
    }



    /**
     * 格式化文件大小，不保留末尾的0
     */
    public static String formatFileSize(long len) {
        return formatFileSize(len, false);
    }

    /**
     * 格式化文件大小，保留末尾的0，达到长度一致
     */
    public static String formatFileSize(long len, boolean keepZero) {
        String size;
        DecimalFormat formatKeepTwoZero = new DecimalFormat("#.00");
        DecimalFormat formatKeepOneZero = new DecimalFormat("#.0");
        if (len < 1024) {
            size = String.valueOf(len + "B");
        } else if (len < 10 * 1024) {
            // [0, 10KB)，保留两位小数
            size = String.valueOf(len * 100 / 1024 / (float) 100) + "KB";
        } else if (len < 100 * 1024) {
            // [10KB, 100KB)，保留一位小数
            size = String.valueOf(len * 10 / 1024 / (float) 10) + "KB";
        } else if (len < 1024 * 1024) {
            // [100KB, 1MB)，个位四舍五入
            size = String.valueOf(len / 1024) + "KB";
        } else if (len < 10 * 1024 * 1024) {
            // [1MB, 10MB)，保留两位小数
            if (keepZero) {
                size = String.valueOf(formatKeepTwoZero.format(len * 100 /
                        1024 / 1024 / (float)
                        100)) + "MB";
            } else {
                size = String.valueOf(len * 100 / 1024 / 1024 / (float) 100)
                        + "MB";
            }
        } else if (len < 100 * 1024 * 1024) {
            // [10MB, 100MB)，保留一位小数
            if (keepZero) {
                size = String.valueOf(formatKeepOneZero.format(len * 10 /
                        1024 / 1024 / (float)
                        10)) + "MB";
            } else {
                size = String.valueOf(len * 10 / 1024 / 1024 / (float) 10) +
                        "MB";
            }
        } else if (len < 1024 * 1024 * 1024) {
            // [100MB, 1GB)，个位四舍五入
            size = String.valueOf(len / 1024 / 1024) + "MB";
        } else {
            // [1GB, ...)，保留两位小数
            size = String.valueOf(len * 100 / 1024 / 1024 / 1024 / (float)
                    100) + "GB";
        }
        return size;
    }

    public static String getRandomNum() {
        String s = "";
        Random ran = new Random(System.currentTimeMillis());
        for (int i = 0; i < 5; i++) {
            s = s + ran.nextInt(100);
        }
        return s;
    }

    /***
     * 截取指定长度的字符
     *
     * @param startIndex
     * @param endIndex
     * @param str
     * @return
     */
    public static String subStr(int startIndex, int endIndex, String str) {
        if (endIndex > str.length()) {
            return "-1";
        } else if (str == null || str.length() <= 0) {
            return "-1";
        }
        return str.substring(startIndex, endIndex);
    }

    /***
     * 转String
     * @param value
     * @return
     */
    public static String toValueString(Object value) {
        try {
            return String.valueOf(value);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    public static byte[] bytesFromHex(String str, int maxSize) throws
            Throwable {
        ByteBuffer bb = ByteBuffer.allocate(maxSize);
        // fix : order bug
        bb.order(ByteOrder.LITTLE_ENDIAN);

        char[] src = str.toCharArray();

        //mLogger.addLog(Utils.bytesToHex(src));
        for (int i = 0; i < src.length; i++) {
            if (src[i] == 0x20)
                continue;
            if (i + 1 < src.length) {
                int hi = valueFromHex(src[i]);
                int lo = valueFromHex(src[i + 1]);
                bb.put((byte) (hi * 16 + lo));
                i++;
            } else {
                throw new Exception("failed to convert hex string.");
            }
        }

        if (bb.hasArray())
            return bb.array();
        return null;
    }

    public static int valueFromHex(char hex) throws Exception {
        if (hex >= '0' && hex <= '9')
            return (int) (hex - '0');
        if (hex >= 'a' && hex <= 'f')
            return (int) (hex - 'a' + 10);
        if (hex >= 'A' && hex <= 'F')
            return (int) (hex - 'A' + 10);
        throw new Exception("failed to convert hex.");
    }

    /**
     * 每3位截取一次
     * @param inpt
     * @return
     */
    public static String[] sub3(String inpt) {
        int strLength = 0;
        boolean b = true;
        if (inpt.length() % 3 == 0) {
            strLength = inpt.length() / 3;
        } else {
            b = false;
            strLength = inpt.length() / 3 + 1;
        }
        String[] str = new String[strLength];
        for (int i = 0; i < str.length; i++) {
            if (b || (i != str.length - 1))
                str[i] = inpt.substring(3 * i, 3 * i + 3);
            else
                str[i] = inpt.substring(3 * i);
        }
        return str;
    }


}
