package com.reactlibrary.felicalib.util

import org.junit.Test

import org.junit.Assert.*

class UtilTest {
  @Test
  fun bytes2StringHex() {
    val num = Util.bytes2stringHex(byteArrayOf(0, 1, 127, 128.toByte(),255.toByte()))
    assertEquals(num, "00017f80ff")
  }

  @Test
  fun stringHex2bytes() {
    var num = Util.stringHex2bytes("00017f80ff")
    assertArrayEquals(num, byteArrayOf(0, 1, 127, 128.toByte(),255.toByte()))

    num = Util.stringHex2bytes("00017F80FF")
    assertArrayEquals(num, byteArrayOf(0, 1, 127, 128.toByte(),255.toByte()))
  }

}
