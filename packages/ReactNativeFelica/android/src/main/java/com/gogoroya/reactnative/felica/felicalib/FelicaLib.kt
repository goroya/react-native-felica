package com.gogoroya.reactnative.felica.felicalib

import android.nfc.Tag
import android.nfc.tech.NfcF
import com.gogoroya.reactnative.felica.felicalib.util.Util
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

  override fun toString(): String {
    var output = "IDM: ${this.idmString}\n"
    output += "PMM: ${this.pmmString}\n"
    output += "System Code: ${this.systemCodeString}\n"

    return output
  }
}
