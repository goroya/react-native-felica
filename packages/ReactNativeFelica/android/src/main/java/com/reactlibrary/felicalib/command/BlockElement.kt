package com.reactlibrary.felicalib.command

import java.io.ByteArrayOutputStream

class BlockElement {
  companion object {
    enum class BlockLength(val value: Byte)  {
      TWO_BYTE(0b1),
      THREE_BYTE(0b0)
    }
    enum class AccessMode(val value: Byte)  {
      READ_WRITE(0b000),
      PURSE_SERVICE_CASHBACK_ACCESS(0b001)
    }
  }
  val data: ByteArray
  constructor(blockLength:BlockLength, accessMode:AccessMode, serviceListNo: Short, blockNumber:Int){
    val data = ByteArrayOutputStream()
    var one = (blockLength.value.toInt() shl 7).toByte()
    one = ( (accessMode.value.toInt() shl 4) or one.toInt() ).toByte()
    one = ( serviceListNo.toInt() or one.toInt() ).toByte()
    data.write(one.toInt())
    if (blockLength == BlockLength.THREE_BYTE){
      data.write(blockNumber and 0xFF)
      data.write((blockNumber ushr 8) and 0xFF)
    }else{
      data.write(blockNumber)
    }
    this.data = data.toByteArray()
  }
  constructor(rawBlock: ByteArray) {
    this.data = rawBlock
  }
}
