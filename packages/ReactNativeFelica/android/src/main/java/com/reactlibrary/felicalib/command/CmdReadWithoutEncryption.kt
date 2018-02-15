package com.reactlibrary.felicalib.command


import java.io.ByteArrayOutputStream


class CmdReadWithoutEncryption(
    private val idm:ByteArray,
    private val serviceCodeList: ArrayList<Int>,
    private val blockList: ArrayList<BlockElement>) : CmdBase() {
  companion object {
    const val COMMAND_CODE = 0x06
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
