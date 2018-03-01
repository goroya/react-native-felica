package com.felica.reactnative.goroya

import android.app.Activity
import android.content.Intent
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.WritableMap
import com.felica.reactnative.goroya.felicalib.FelicaLib
import com.felica.reactnative.goroya.felicalib.util.Util
import java.io.ByteArrayOutputStream
import java.io.IOException
import android.app.PendingIntent
import android.content.IntentFilter
import com.felica.reactnative.gogoroya.R

class RNFelicaModule(private val reactContext: ReactApplicationContext)
  : ReactContextBaseJavaModule(reactContext), LifecycleEventListener, ActivityEventListener {
  companion object {
    @JvmField val TAG:String = RNFelicaModule::class.java.simpleName
    const val EVENT_FELICA_DISCOVER:String = "EVENT_FELICA_DISCOVER"
  }
  private var felicaLib: FelicaLib? = null
  private var startupIntentProcessed = false

  init {
    reactContext.addActivityEventListener(this)
    reactContext.addLifecycleEventListener(this)
  }

  override fun getName(): String {
    return "RNFelica"
  }

  override fun getConstants(): MutableMap<String, Any> {
    val constants = HashMap<String, Any>()
    val map = Arguments.createMap()
    map.putString("FELICA_DISCOVER", EVENT_FELICA_DISCOVER)
    constants["EVENT"] = map
    return constants
  }

  private fun sendEvent(eventName: String, payload: WritableMap) {
    Log.d(TAG, "sendEvent $eventName")
    reactApplicationContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(eventName, payload)
  }
  private fun handleIntent(intent: Intent){
    val action = intent.action
    // Check Nfc event
    if (NfcAdapter.ACTION_NDEF_DISCOVERED == action
        || NfcAdapter.ACTION_TECH_DISCOVERED == action
        || NfcAdapter.ACTION_TAG_DISCOVERED == action) {
      val tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG) as Tag?
      if(tag != null){
        this.felicaLib = FelicaLib(tag)
        if(this.felicaLib != null){
          val eventData =  Arguments.createMap()
          val idm = Arguments.createArray()
          for (oneByte in this.felicaLib!!.idm){
            idm.pushInt((oneByte.toInt() and 0xFF))
          }
          eventData.putArray("idm", idm)
          eventData.putString("idmString", this.felicaLib!!.idmString)
          val systemCode = Arguments.createArray()
          for (oneByte in this.felicaLib!!.systemCode){
            systemCode.pushInt((oneByte.toInt() and 0xFF))
          }
          eventData.putArray("systemCode", systemCode)
          eventData.putString("systemCodeString", this.felicaLib!!.systemCodeString)
          val pmm = Arguments.createArray()
          for (oneByte in this.felicaLib!!.pmm){
            pmm.pushInt((oneByte.toInt() and 0xFF))
          }
          eventData.putArray("pmm", pmm)
          eventData.putString("pmmString", this.felicaLib!!.pmmString)
          this.sendEvent(EVENT_FELICA_DISCOVER, eventData)
        }
      }
    }

  }

  override fun onNewIntent(intent: Intent?) {
    Log.d(TAG, "onNewIntent")
    if (intent != null) {
      handleIntent(intent)
    }
  }

  override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
    Log.d(TAG, "onActivityResult")
  }

  override fun onHostResume() {
    Log.d(TAG, "onHostResume")
    if(!startupIntentProcessed){
      if(reactApplicationContext.currentActivity != null){
        handleIntent(reactApplicationContext.currentActivity!!.intent)
      }
      this.startupIntentProcessed = true
    }
  }

  override fun onHostPause() {
    Log.d(TAG, "onHostPause")
  }

  override fun onHostDestroy() {
    Log.d(TAG, "onHostDestroy")
  }

  @ReactMethod
  fun haveNfc(promise: Promise) {
    var result = false
    val nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext)
    if(nfcAdapter != null){
      result = true
    }
    if(result){
      promise.resolve(null)
    }else{
      promise.reject("haveNfc()", Throwable(Throwable(reactContext.getString(R.string.err_msg_nfc_not_implement))))
    }
  }
  @ReactMethod
  fun enableNfc(promise: Promise) {
    val nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext)
    if(nfcAdapter == null){
      promise.reject("enableNfc()", Throwable(Throwable(reactContext.getString(R.string.err_msg_nfc_not_implement))))
    }else{
      if(nfcAdapter.isEnabled){
        promise.resolve(null)
      }else{
        promise.reject("enableNfc()", Throwable(Throwable(reactContext.getString(R.string.err_msg_nfc_not_enable))))
      }
    }
  }
  @ReactMethod
  fun connect(promise: Promise) {
    try {
      if(this.felicaLib != null){
        this.felicaLib!!.connect()
        promise.resolve(null)
      }else{
        promise.reject("connect()", Throwable(reactContext.getString(R.string.err_msg_nfc_not_detect)))
      }
    }catch (e: IOException){
      promise.reject("connect()", e.message)
    }
  }
  @ReactMethod
  fun close(promise: Promise) {
    try {
      if(this.felicaLib != null){
        this.felicaLib!!.close()
        promise.resolve(null)
      }else{
        promise.reject("close()", Throwable(reactContext.getString(R.string.err_msg_nfc_not_detect)))

      }
    }catch (e: IOException){
      promise.reject("close()", e.message)
    }
  }
  @ReactMethod
  fun transceive(data: ReadableArray, promise: Promise){
    try {
      if(this.felicaLib != null){
        val sendData = ByteArrayOutputStream()
        for (index in 0 until data.size()){
          sendData.write(data.getInt(index))
        }
        Log.d(TAG, "send data ${Util.bytes2stringHex(sendData.toByteArray())}")
        val receiveData = this.felicaLib!!.transceive(sendData.toByteArray())
        Log.d(TAG, "send data ${Util.bytes2stringHex(receiveData)}")
        val resoleveData = Arguments.createArray()
        for (oneData in receiveData){
          resoleveData.pushInt(oneData.toInt() and 0xFF)
        }
        promise.resolve(resoleveData)
      }else{
        promise.reject("transceive()", Throwable(reactContext.getString(R.string.err_msg_nfc_not_detect)))
      }
    }catch (e: IOException){
      promise.reject("transceive()", Throwable(e.message))
    }
  }
  @ReactMethod
  fun transceiveString(data: String, promise: Promise){
    val sendData = Util.stringHex2bytes(data)
    try {
      if(this.felicaLib != null){
        val receiveData = this.felicaLib!!.transceive(sendData)
        promise.resolve(Util.bytes2stringHex(receiveData))
      }else{
        promise.reject("transceiveString()", Throwable(reactContext.getString(R.string.err_msg_nfc_not_implement)))
      }
    }catch (e: IOException){
      promise.reject("transceiveString()", Throwable(e.message))
    }
  }
  @ReactMethod
  fun enableForegroundDispatch(promise: Promise){
    try {
      val nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext)
      if(nfcAdapter == null){
        promise.reject("haveNfc()", Throwable(reactContext.getString(R.string.err_msg_nfc_not_implement)))
        return
      }
      val intent = Intent(reactApplicationContext, currentActivity?.javaClass)
      intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
      val nfcPendingIntent = PendingIntent.getActivity(reactApplicationContext, 0, intent, 0)

      val intentFilter = arrayOf(IntentFilter(NfcAdapter.ACTION_TAG_DISCOVERED))

      val techList = arrayOf(arrayOf(android.nfc.tech.NfcF::class.java.name))

      nfcAdapter.enableForegroundDispatch(currentActivity, nfcPendingIntent, intentFilter, techList)
      promise.resolve(null)
    }catch (e: Exception ){
      promise.reject("enableForegroundDispatch()", Throwable(e.message))
    }
  }
  @ReactMethod
  fun disableForegroundDispatch(promise: Promise){
    try {
      val nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext)
      if(nfcAdapter == null){
        promise.reject("haveNfc()", Throwable(reactContext.getString(R.string.err_msg_nfc_not_implement)))
        return
      }
      if(currentActivity != null && currentActivity!!.isFinishing){
        nfcAdapter.disableForegroundDispatch(currentActivity)
      }

      promise.resolve(null)
    }catch (e: Exception ){
      promise.reject("disableForegroundDispatch()", Throwable(e.message))
    }
  }
}

