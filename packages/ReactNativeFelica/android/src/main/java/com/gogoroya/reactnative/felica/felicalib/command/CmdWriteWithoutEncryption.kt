package com.gogoroya.reactnative.felica.felicalib.command

import java.io.ByteArrayOutputStream


class CmdWriteWithoutEncryption(
    private val idm:ByteArray,
    private val serviceCodeList: List<Int>,
    private val blockList: List<BlockElement>) : CmdBase() {
  companion object {
    const val COMMAND_CODE = 0x08
  }
  override val data: ByteArray
    get() {
      val data = ByteArrayOutputStream()
      data.write(COMMAND_CODE)
      data.write(this.idm)
      data.write(serviceCodeList.size)
      for (serviceCode in this.serviceCodeList){
        data.write(serviceCode and 0xFF)
        data.write((serviceCode shr 8) and 0xFF)
      }
      data.write(blockList.size)
      for (blockElement in this.blockList){
        data.write(blockElement.data)
      }

      return makeData(data.toByteArray())
    }
}
