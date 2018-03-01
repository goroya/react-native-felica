package com.reactlibrary.felicalib.command

import java.io.ByteArrayOutputStream


class CmdRequestService(
    private val idm:ByteArray,
    private val nodeCodeList: List<Int>) : CmdBase() {
  companion object {
    const val COMMAND_CODE = 0x02
  }
  override val data: ByteArray
    get() {
      val data = ByteArrayOutputStream()
      data.write(COMMAND_CODE)
      data.write(this.idm)
      data.write(nodeCodeList.size)
      for (nodeCode in this.nodeCodeList){
        data.write(nodeCode and 0xFF)
        data.write((nodeCode shr 8) and 0xFF)
      }

      return makeData(data.toByteArray())
    }
}
