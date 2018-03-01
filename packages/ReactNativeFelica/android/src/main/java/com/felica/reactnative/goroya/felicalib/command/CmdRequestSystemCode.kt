package com.reactlibrary.felicalib.command

import java.io.ByteArrayOutputStream

class CmdRequestSystemCode(
    private val idm:ByteArray) : CmdBase() {
  companion object {
    const val COMMAND_CODE = 0x0C
  }
  override val data: ByteArray
    get() {
      val data = ByteArrayOutputStream()
      data.write(COMMAND_CODE)
      data.write(this.idm)
      val returnData = data.toByteArray()
      returnData[0] = data.size().toByte()

      return makeData(data.toByteArray())
    }
}
