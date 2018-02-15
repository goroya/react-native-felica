package com.reactlibrary.felicalib

import android.nfc.Tag
import android.nfc.tech.NfcF
import com.reactlibrary.felicalib.command.BlockElement
import com.reactlibrary.felicalib.command.CmdPolling
import com.reactlibrary.felicalib.command.CmdReadWithoutEncryption
import com.reactlibrary.felicalib.util.Util
import java.io.IOException


class FelicaLib(private val tag: Tag) {
  companion object {
    @JvmField val TAG = FelicaLib::class.java.simpleName
  }
  var idm: ByteArray = tag.id
  val idmString: String
    get() {
      return Util.bytes2stringHex(this.idm)
    }
  val pmm: ByteArray
    get() {
      val nfcf = NfcF.get(tag)
      return nfcf.manufacturer
    }
  val pmmString: String
    get() {
      return Util.bytes2stringHex(this.pmm)
    }
  val systemCode: ByteArray
    get() {
      val nfcf = NfcF.get(tag)
      return nfcf.systemCode
    }
  val systemCodeString: String
    get() {
      return Util.bytes2stringHex(this.systemCode)
    }
  val isConnected: Boolean
    get() {
      val nfcf = NfcF.get(tag)
      return nfcf.isConnected
    }
  var timeout: Int
    set(value) {
      val nfcf = NfcF.get(tag)
      nfcf.timeout = value
    }
    get() {
      val nfcf = NfcF.get(tag)
      return nfcf.timeout
    }
  val maxTransceiveLength: Int
    get() {
      val nfcf = NfcF.get(tag)
      return nfcf.maxTransceiveLength
    }
  @Throws(IOException::class)
  fun connect() {
    val nfcf = NfcF.get(tag)
    try {
      nfcf.connect()
    }catch (e: IOException){
      throw e
    }
  }
  @Throws(IOException::class)
  fun close() {
    val nfcf = NfcF.get(tag)
    try {
      nfcf.close()
    }catch (e: IOException){
      throw e
    }
  }
  @Throws(IOException::class)
  fun transceive(data: ByteArray): ByteArray {
    val nfcf = NfcF.get(tag)
    try {
      return nfcf.transceive(data)
    }catch (e: IOException){
      throw e
    }
  }
  fun readWithoutEncryption(
      idm: ByteArray,
      serviceCodeList:  ArrayList<Int>,
      blockList: ArrayList<BlockElement>): ByteArray {
    val byteCmd = CmdReadWithoutEncryption(
        idm = idm,
        serviceCodeList = serviceCodeList,
        blockList = blockList)
    return this.transceive(byteCmd.data)
  }
  fun polling(
      systemCode: Int,
      requestCode: CmdPolling.Companion.RequestCode,
      timeSlot: Int): ByteArray{
    val byteCmd = CmdPolling(
        systemCode = systemCode,
        requestCode = requestCode,
        timeSlot = timeSlot)
    return this.transceive(byteCmd.data)
  }


  override fun toString(): String {
    var output = "IDM: ${this.idmString}\n"
    output += "PMM: ${this.pmmString}\n"
    output += "System Code: ${this.systemCodeString}\n"

    return output
  }
}
