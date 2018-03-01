package com.gogoroya.reactnative.felica.felicalib.command

import java.io.ByteArrayOutputStream


class CmdPolling(
    private val systemCode:Int,
    private val requestCode: RequestCode,
    private val timeSlot: Int) : CmdBase(){
  companion object {
    const val COMMAND_CODE = 0x00
    enum class RequestCode(val value: Byte)  {
      NO_REQUEST(0x00),
      SYSTEM_CODE_REQUEST(0x01),
      COMMUNICATION_PERFORMANCE_REQUEST(0x02)
    }
  }

  override val data: ByteArray
    get() {
      val data = ByteArrayOutputStream()
      data.write(COMMAND_CODE)
      data.write((systemCode shr 8) and 0xFF)
      data.write(systemCode and 0xFF)
      data.write(requestCode.value.toInt())
      data.write(timeSlot)

      return makeData(data.toByteArray())
    }
}
