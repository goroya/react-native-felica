package com.reactlibrary.felicalib.util

import android.util.Log


class Util {
  companion object {
    @JvmField val TAG = Util::class.java.simpleName
    @JvmStatic fun bytes2stringHex(bytes: ByteArray): String{
      return bytes.joinToString(separator = "") { (it.toInt() and 0xFF).toString(16).padStart(2, '0') }
    }
    @JvmStatic fun stringHex2bytes(strhex: String): ByteArray{
      return ByteArray(strhex.length / 2, { strhex.substring(it * 2, it * 2 + 2).toInt(16).toByte() })
    }
  }

}
