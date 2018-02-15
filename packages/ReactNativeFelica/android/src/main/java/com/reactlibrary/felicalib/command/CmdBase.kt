package com.reactlibrary.felicalib.command

import java.io.ByteArrayOutputStream


abstract class CmdBase {
  abstract val data: ByteArray
  companion object {
    @JvmStatic fun makeData(cmdData: ByteArray): ByteArray {
      val data = ByteArrayOutputStream()
      data.write(0x00)
      data.write(cmdData)
      val returnData = data.toByteArray()
      returnData[0] = data.size().toByte()
      return returnData
    }
  }
}
