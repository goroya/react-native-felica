package com.reactlibrary.command

import com.reactlibrary.felicalib.command.BlockElement
import org.junit.After
import org.junit.Before
import org.junit.Test

import org.junit.Assert.*


class BlockListTest {
  @Before
  fun setUp() {
  }

  @After
  fun tearDown() {
  }

  @Test
  fun getDataTwoByte() {
    val blockList = BlockElement(
        BlockElement.BlockLength.TWO_BYTE,
        BlockElement.AccessMode.READ_WRITE,
        0xF,
        1)
    assertArrayEquals(byteArrayOf(0x8F.toByte(),1), blockList.data)
    val blockList2 = BlockElement(
        BlockElement.BlockLength.TWO_BYTE,
        BlockElement.AccessMode.PURSE_SERVICE_CASHBACK_ACCESS,
        0xF,
        1)
    assertArrayEquals(byteArrayOf(0x9F.toByte(),1), blockList2.data)
  }
  @Test
  fun getDataTreeByte() {
    val blockList = BlockElement(
        BlockElement.BlockLength.THREE_BYTE,
        BlockElement.AccessMode.READ_WRITE,
        0,
        0xFFEE)
    assertArrayEquals(byteArrayOf(0x00.toByte(), 0xFF.toByte(), 0xEE.toByte()), blockList.data)
    val blockList2 = BlockElement(
        BlockElement.BlockLength.THREE_BYTE,
        BlockElement.AccessMode.PURSE_SERVICE_CASHBACK_ACCESS,
        0xF,
        0xFFEE)
    assertArrayEquals(byteArrayOf(0x1F.toByte(), 0xFF.toByte(), 0xEE.toByte()), blockList2.data)
  }
}
